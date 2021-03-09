import React, {memo, useRef, useState} from 'react';
import {Button, Form, Input, message} from "antd";
import {LayoutStyle, ManufacturerStyle, ModalsContext} from "./resources/style";
import {useCreated, useUpdate} from "../../../utils/hooks";
import {mutations, Store} from "../../../store/vueStore";
import {useStore} from "../../../store/vueStore/store";
import {Modals} from "../component/Modal"
import { material, TabelType } from "./resources/data";

const CustomSetting = () => {
    const formTab: any = useRef(null);
    // 生产厂家追加数据
    const [manufacturerDa, setManufacturerDa] = useState({});

    const updateTem = useUpdate();
    const data = useStore((store: Store) => {
        const {state} = store;
        const {settingData} = state;
        return {
            settingData
        }
    });
    // 生产厂家总数据
    const [manufacturerTotalDa, setManufacturerTotalDa] = useState<any>(data.settingData || []);

    useCreated(() => {
        formTab.current.setFieldsValue(data.settingData)
        formTab.current.setFieldsValue({manufacturer: manufacturerTotalDa})
    });

    // 输入框事件
    function manufacturerInput(key: string) {
        const e = window.event || arguments.callee.caller.arguments[1];
        let manufacturerDaCopy: any = manufacturerDa;
        manufacturerDaCopy[key] = e.target.value;
        setManufacturerDa(manufacturerDaCopy);
    }

    // 表单提交
    const onFinish = (values: TabelType) => {
        // 生产厂家绑定材料
        const manufacturerMaterial = data.settingData.manufacturerMaterial || {};

        if (manufacturerMaterial[values.material + 'Material']) {
            manufacturerMaterial[values.material + 'Material'].push(values.manufacturer);
        } else {
            manufacturerMaterial[values.material + 'Material'] = values.manufacturer;
        }

        let dataValue = Object.assign(data.settingData, values, manufacturerMaterial);
        mutations.changeSetting(dataValue);
        localStorage.setItem('setData', JSON.stringify(dataValue));
        message.success('修改成功');
    }

    const addManufacturer = (key?: string | undefined) => {
        // @ts-ignore
        if (!manufacturerTotalDa[key]) {
            // @ts-ignore
            manufacturerTotalDa[key] = [];
        }
        // @ts-ignore
        if (manufacturerTotalDa[key].includes(manufacturerDa[key])) {
            message.success('重复添加了哦');
        } else {
            console.log(manufacturerTotalDa);
            // @ts-ignore
            let arr: any = manufacturerTotalDa;
            // @ts-ignore
            arr[key].push(manufacturerDa[key]);
            setManufacturerTotalDa(arr);
            updateTem();
            formTab.current.setFieldsValue(arr)
        }
    }

    // 删除每项
    const deleteManufacturer = (da: any, key: string) => {
        const arr = manufacturerTotalDa;
        const index = manufacturerTotalDa[key].indexOf(da);
        arr[key].splice(index, 1);
        setManufacturerTotalDa(arr);
        updateTem();
        formTab.current.setFieldsValue({manufacturer: arr})
    }

    return (
        <LayoutStyle>
            <div>
                <Form ref={formTab} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>

                    {
                        material.map(res => {
                            return (
                                <ManufacturerStyle key={res.key}>

                                        <div className="inputView">
                                            <Form.Item name={!res.type?res.key + "Material": res.key} label={res.val}>
                                                <Input readOnly/>
                                            </Form.Item>
                                        </div>
                                        <Modals test={addManufacturer} da={!res.type?res.key + "Material": res.key}>
                                            <ModalsContext>
                                                <div>
                                                    <p>输入：</p>
                                                    <Input allowClear={true} onInput={() => manufacturerInput(!res.type?res.key + "Material": res.key)}></Input>
                                                    <p></p>
                                                    <Button onClick={() => {
                                                        addManufacturer(!res.type?res.key + "Material": res.key)
                                                    }}>添加</Button>
                                                </div>
                                                <div>
                                                    {
                                                        manufacturerTotalDa[!res.type?res.key + "Material": res.key] && manufacturerTotalDa[!res.type?res.key + "Material": res.key].map((item: any) => {
                                                            return (
                                                                <p key={item}>
                                                                    <span>"{item}"</span>
                                                                    <Button onClick={() => deleteManufacturer(item, !res.type?res.key + "Material": res.key)}>删除</Button>
                                                                </p>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </ModalsContext>
                                        </Modals>
                                </ManufacturerStyle>
                            )
                        })
                    }
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            确认提交
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div>

            </div>
        </LayoutStyle>
    );
}

export default memo(CustomSetting);

const validateMessages = {
    required: '${label} is required!'
};