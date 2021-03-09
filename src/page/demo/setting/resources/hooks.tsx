import {useStore} from "../../../../store/vueStore/store";
import {Store} from "../../../../store/vueStore";
import React, {useState} from "react";
import {UnitsConfig} from "./data";
import {ModalsContext} from "./style";
import {Button, Input, message} from "antd";
import {useUpdate} from "../../../../utils/hooks";

export function useSetTing (formTab: any) {
    const data = useStore((store: Store) => {
        const { state } = store;
        const { settingData } = state;
        return {
            settingData
        }
    });
    const updateTem = useUpdate();

    // 追加数据
    const [manufacturerDa, setManufacturerDa] = useState({});

    // 总数据
    const [manufacturerTotalDa, setManufacturerTotalDa] = useState<any>(data.settingData || []);

    // 输入框事件
    function manufacturerInput (key: string) {
        const e = window.event || arguments.callee.caller.arguments[1];
        let manufacturerDaCopy: any = manufacturerDa;
        manufacturerDaCopy[key] = e.target.value;
        setManufacturerDa(manufacturerDaCopy);
    }

    // 添加数据 -- 录入数据
    const addManufacturer = (key?: string | undefined) => {
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
                        <Input allowClear={true} onInput={() => manufacturerInput(res.key)}></Input>
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

    return {
        manufacturerInput,
        deleteManufacturer,
        addManufacturer,
        manufacturerTotalDa,
        renderTem
    }
}