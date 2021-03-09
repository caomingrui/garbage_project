import React, { memo, useRef, useState } from 'react';
import {Button, Form, Input, message} from "antd";
import {useCreated, useUpdate} from "../../../utils/hooks";
import {mutations, Store} from "../../../store/vueStore";
import {useStore} from "../../../store/vueStore/store";
import {Modals} from "../component/Modal"
import {ManufacturerStyle, ModalsContext} from "./resources/style";
import { unitsConfig, TabelType, UnitsConfig } from "./resources/data"

// 弃用。。。。。
const Units = () => {
    const formTab: any = useRef(null);
    const updateTem = useUpdate();
    const data = useStore((store: Store) => {
        const { state } = store;
        const { settingData } = state;
        return {
            settingData
        }
    });

    const [manufacturerDa, setManufacturerDa] = useState({});// 追加数据
    const [manufacturerTotalDa, setManufacturerTotalDa] = useState<any>(data.settingData || []);// 总数据

    useCreated(() => {
        formTab.current.setFieldsValue(data.settingData);
    });

    // 输入框事件
    function manufacturerInput (key: string) {
        const e = window.event || arguments.callee.caller.arguments[1];
        let manufacturerDaCopy: any = manufacturerDa;
        console.log(manufacturerDa, key)
        manufacturerDaCopy[key] = e.target.value;
        setManufacturerDa(manufacturerDaCopy);
    }

    // 表单提交
    const onFinish = (values: TabelType) => {
        let dataValue = Object.assign(data.settingData, values);
        mutations.changeSetting(dataValue);
        console.log(dataValue)
        localStorage.setItem('setData', JSON.stringify(dataValue));
        message.success('修改成功');
    }

    // 添加数据 -- 录入数据
    const addManufacturer = (key?: string | undefined) => {
        // debugger
        console.log(manufacturerDa, key)
        // @ts-ignore
        if (!manufacturerTotalDa[key]) {
            // @ts-ignore
            manufacturerTotalDa[key] = [];
        }
        // @ts-ignore
        if (manufacturerTotalDa[key].includes(manufacturerDa[key])) {
            message.success('重复添加了哦');
        }
        else {
            console.log(manufacturerTotalDa);
            // @ts-ignore
            let arr: any = manufacturerTotalDa;
            console.log(arr);
            console.log(data.settingData)
            // @ts-ignore
            arr[key].push(manufacturerDa[key]);
            setManufacturerTotalDa(arr);
            console.log(arr)
            updateTem();
            formTab.current.setFieldsValue(arr)
        }
    }

    // 删除每项
    const deleteManufacturer = (da: any, key: string) => {
        const arr = manufacturerTotalDa;
        console.log(da, arr, arr[key], key)
        const index = manufacturerTotalDa[key].indexOf(da);
        arr[key].splice(index, 1);
        console.log(arr[key], index, da)
        setManufacturerTotalDa(arr);
        updateTem();
        formTab.current.setFieldsValue({manufacturer: arr})
    }

    // 是否渲染动态录入模块
    const renderTem = (res: UnitsConfig) => {
        if (res.type) {
            return "";
        }
        else {
            return (
                <ModalsContext>
                    <div>
                        <p>输入：</p>
                        <Input onInput={() => manufacturerInput(res.key)}></Input>
                        <p></p>
                        <Button onClick={ () => {addManufacturer(res.key)} }>添加</Button>
                    </div>
                    <div>
                        {
                            manufacturerTotalDa[res.key] && manufacturerTotalDa[res.key].constructor == Array && manufacturerTotalDa[res.key].map((item: any) => {
                                return (
                                    <p key={item}>
										 <span>"{ item }" </span>
                                        <Button onClick={() => deleteManufacturer(item, res.key)}>删除</Button>
									</p>
                                )
                            })
                        }
                    </div>
                </ModalsContext>
            )
        }
    }

    return (
        <>
            <Form {...layout} ref={ formTab } name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                {
                    unitsConfig.map(res => {
                        return (
                            <ManufacturerStyle key={res.key}>
                                <div>
                                    <Form.Item name={res.key} label={res.val} >
                                        { res.type?<Input />: <Input readOnly /> }
                                    </Form.Item>
                                </div>
                                <Modals>
                                    <ModalsContext>
                                        { renderTem(res) }
                                    </ModalsContext>
                                </Modals>
                            </ManufacturerStyle>
                        )
                    })
                }
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        确认提交1
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default memo(Units);

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
};

const validateMessages = {
    required: '${label} is required!'
};