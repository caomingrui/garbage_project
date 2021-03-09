import React, {memo, useRef, useState} from "react";
import {Button, Descriptions, Form, Input, message} from "antd";
import {useCreated, useUpdata} from "../../../utils/hooks";
import {useStore} from "../../../store/vueStore/store";
import {Store, mutations} from "../../../store/vueStore";
import CustomSetting from "./customSetting";
import Units from "./units";
import ProjectCost from "./projectCost";
import {Modals} from "../component/Modal";
import {ManufacturerStyle, ModalsContext, DetailsSetup} from "./resources/style";
import { setupData } from "./resources/data";
import { useSetTing } from "./resources/hooks"

const Setting = () => {
        const formTabel: any = useRef(null);
        const [localData, localSetData] = useState<string | null>(null);
        const [state, setState] = useState<number>(0);
        const data = useStore((store: Store) => {
            const { state } = store;
            const { settingData } = state;
            return {
                settingData
            }
        });

        useCreated(() => {
            if (formTabel && formTabel.current != null) {
                const localStorageData: string | null = localStorage.getItem('setData');
                console.log(formTabel)
                formTabel.current.setFieldsValue(data.settingData);

                localSetData(localStorageData);
            }
        });

        useUpdata(localData, () => {
            if (formTabel != null) {
                if (localData !== null) {
                    if (typeof localData === "string") {
                        mutations.changeSetting(JSON.parse(localData));
                    }
                }
            }
        })

        const Context = () => {
        const formTab: any = useRef(null);
        const [state, setState] = useState<boolean>(false);
        const { manufacturerInput, deleteManufacturer, addManufacturer, manufacturerTotalDa, renderTem } = useSetTing(formTab);

        // 提交表单
        const onFinish = (values: any) => {
            let dataValue = Object.assign(data.settingData, values)
            mutations.changeSetting(dataValue);
            localStorage.setItem('setData', JSON.stringify(dataValue));
            message.success('修改成功');
            setState(true)
        };

        const renderDescribe = () => {
            return (
                <>
                    <DetailsSetup>
                        <div >
                            <Descriptions>
                                {
                                    setupData.map(res => (
                                        <Descriptions.Item label={ res.val } key={res.key}>{ data.settingData[res.key] }</Descriptions.Item>
                                    ))
                                }
                            </Descriptions>
                        </div>
                        <Form {...layout} ref={ formTabel } name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                            {
                                setupData.map(res => {
                                    return (
                                        <ManufacturerStyle key={res.key}>
                                            <div>
                                                <Form.Item name={res.key} label={res.val} >
                                                    { res.type?<Input />: <Input readOnly /> }
                                                </Form.Item>
                                            </div>
                                            { res.type?"": (
                                                <Modals>
                                                    <ModalsContext>
                                                        { renderTem(res) }
                                                    </ModalsContext>
                                                </Modals>
                                            ) }

                                        </ManufacturerStyle>
                                    )
                                })
                            }
                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                <Button type="primary" htmlType="submit">
                                    确认提交
                                </Button>
                            </Form.Item>
                        </Form>
                    </DetailsSetup>
                </>
            );
        }

        return (
            <>
                { renderDescribe() }
            </>
        );
    }

        const renderList = () => {
            if (state === 0) {
                return <CustomSetting/>
            }
            else if (state === 1) {
                return <Units/>
            }
            else if (state == 2) {
                return <ProjectCost/>
            }
            else {
                return <Context></Context>
            }
        }

        return (
            <>
                设置公共区域
                <p>
                    <Button type={state===0?'primary': 'default'} onClick={()=>setState(0)}>生产及供销单位</Button>
                    <Button type={state===1?'primary': 'default'} onClick={()=>setState(1)}>单位相关配置</Button>
                    {/*<Button type={state===2?'primary': 'default'} onClick={()=>setState(2)}>工程配置</Button>*/}
                    <Button type={state===3?'primary': 'default'} onClick={()=>setState(3)}>主体</Button>
                </p>

                { renderList() }
            </>
        );
}

export default memo(Setting);

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
};

const validateMessages = {
    required: '${label} is required!'
};