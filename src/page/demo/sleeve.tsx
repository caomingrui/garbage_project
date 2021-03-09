import React, {memo, useRef} from "react";
import {Select, Button, Form, Input, DatePicker} from 'antd';
import { useCreated, useGetTime} from "../../utils/hooks";
import { useSleeve } from "./hooks/index";
import moment from "_moment@2.29.1@moment";
import {useStore} from "../../store/vueStore/store";
import {Store} from "../../store/vueStore";

// 等级
const Level: string[] = ['HPB235', 'HPB300', 'HRB335', 'HRB335E', 'HRB400', 'HRB400E', 'HRB500', 'HRB500E'];

// sleeve  直螺纹套筒
const Sleeve = () => {
    const formTab: any = useRef(null);
    const time = useGetTime();
    const {state, perform} = useSleeve();

    const data = useStore((store: Store) => {
        const { state } = store;
        const { settingData } = state;
        return {
            settingData
        }
    });

    useCreated(() => {
        if (formTab != null) {
            formTab.current.setFieldsValue({time: moment(time)})
        }}
    );

    const onFinish = (values: any) => {
        perform(values);
    };

    const creatGroupNum = (e: any) => {
        const num = e.target.value/500;
        formTab.current.setFieldsValue({groupNum: num});
    }

    return (
        <>
            我是直螺纹套筒
            <Form {...layout} ref={ formTab } name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} >
                <Form.Item name={'level'} label="等级" rules={[{ required: true }]}>
                    <Select>
                        {
                            Level.map(res =>
                                <Select.Option value={res} key={res}>{ res }</Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>

                <Form.Item name={'manufacturer'} label="生产厂家" rules={[{ required: true }]}>
                    <Select>
                        { data.settingData.sleeveMaterial && data.settingData.sleeveMaterial.constructor == Array && data.settingData.sleeveMaterial.map((res: number| string) => <Select.Option value={ res } key={ res }>{ res }</Select.Option>) }
                    </Select>
                </Form.Item>

                <Form.Item name={'specification'} label="规格" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value="14">14</Select.Option>
                        <Select.Option value="16">16</Select.Option>
                        <Select.Option value="18">18</Select.Option>
                        <Select.Option value="20">20</Select.Option>
                        <Select.Option value="22">22</Select.Option>
                        <Select.Option value="25">25</Select.Option>
                        <Select.Option value="28">28</Select.Option>
                        <Select.Option value="32">32</Select.Option>
                        <Select.Option value="35">35</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name={'usingScopeParts'} label="部位范围" rules={[{ required: true }]}>
                    <Select>
                        { data.settingData.usingScopePartsList && data.settingData.usingScopePartsList.constructor == Array && data.settingData.usingScopePartsList.map((res: number | string) => <Select.Option value={ res } key={ res }>{ res }</Select.Option>) }
                    </Select>
                </Form.Item>

                <Form.Item name={'useParts'} label="具体部位" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name={'batch'} label="批量" rules={[{ required: true }]}>
                    <Input onClick={creatGroupNum} onInput={creatGroupNum}/>
                </Form.Item>

                <Form.Item name={'time'} label="日期" rules={[{ required: true }]}>
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>

                {/*<Form.Item name={'projectClass'} label="项目分类">*/}
                {/*    <Select>*/}
                {/*        { data.settingData.projectClasss && data.settingData.projectClasss.constructor == Array && data.settingData.projectClasss.map((res: number| string) => <Select.Option value={ res } key={ res }>{ res }</Select.Option>) }*/}
                {/*    </Select>*/}
                {/*</Form.Item>*/}

                <Form.Item name={'witnessPersonne'} label="见证人员" rules={[{ required: true }]}>
                    <Select>
                        { data.settingData.witnessPersonnel && data.settingData.witnessPersonnel.constructor == Array && data.settingData.witnessPersonnel.map((res: number| string, ind: number) => <Select.Option value={ ind } key={ res }>{ res }</Select.Option>) }
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const validateMessages = { required: '${label} is required!' };

export default memo(Sleeve);
