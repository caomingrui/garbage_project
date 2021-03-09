import React, {memo, useRef} from "react";
import {Select, Button, Form, Input, DatePicker, message} from 'antd';
import {useCreated, useGetTime} from "../../../utils/hooks";
import moment from "_moment@2.29.1@moment";
import {mutations, Store} from "../../../store/vueStore";
import {useStore} from "../../../store/vueStore/store";
import styled from "styled-components";

const FormStyle = styled.div`
    
    form {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        
        >div {
            width: 45%;
        }
    }
`

// 试样名称
const sampleName = ['素土回填', '2：8灰土回填', '3：7灰土回填',' 4: 6砂石回填'];
// 使用机械
const useMechanical = ['蛙式打夯机', '立式打夯机', '小型压路机'];

// ringKnife 环刀
const RingKnife = () => {

    const formTab: any = useRef(null);
    const time = useGetTime();
    const times = useGetTime(2);
    const data = useStore((store: Store) => {
        const { tabelData, checkTabelData, settingData } = store.state;
        return {
            tabelData,
            checkTabelData,
            settingData
        }
    });

    useCreated(() => {
        if (formTab != null) {
            formTab.current.setFieldsValue({time: moment(time)});
            formTab.current.setFieldsValue({samplingDate: moment(time)});
        }}
    );

    const onFinish = (values: any) => {
        console.log(values);
        const da: typeof values = {};
        da.time = moment(values.time).format('YYYY-MM-DD');
        da.samplingDate = moment(values.samplingDate).format('YYYY-MM-DD');
        da.type = values.layerNumber + values.thickness + values.elevation;
        da.keyName = "ringKnife";
        da.key = "ringKnife" + times;
        da.useParts = values.usingScopeParts + values.useParts;
        da.orderNo = "ZH-HD";
        da.witnessPersonne = data.settingData.witnessPersonnel[values.witnessPersonne];
        da.witnessPersonNum = data.settingData.inspectionQualifiedNum[values.witnessPersonne];
        const testDa = Object.assign(data.settingData, values,  da);

        mutations.addTabelData(testDa);
        message.success('提交成功');
    };

    return (
        <>
            环刀
            <FormStyle>
            <Form {...layout} ref={ formTab } name="nest-messages" id="formStyle" onFinish={onFinish} validateMessages={validateMessages}>
                <Form.Item name={'sampleName'} label="试样名称" rules={[{ required: true }]}>
                    <Select>
                        {
                            sampleName.map(res => <Select.Option value={ res } key={ res }>{ res }</Select.Option>)
                        }
                    </Select>
                </Form.Item>

                <Form.Item name={'dryDensity'} label="干密度" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name={'waterContent'} label="含水率" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name={'volume'} label="体积" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value="100">100</Select.Option>
                        <Select.Option value="200">200</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item name={'useMechanical'} label="使用机械" rules={[{ required: true }]}>
                    <Select>
                        {
                            useMechanical.map(res => <Select.Option value={ res } key={ res }>{ res }</Select.Option>)
                        }
                    </Select>
                </Form.Item>

                <Form.Item name={'layerNumber'} label="层数" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name={'thickness'} label="厚度" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name={'elevation'} label="标高" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name={'compactingFactor'} label="系数" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name={'time'} label="日期" rules={[{ required: true }]}>
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item name={'usingScopeParts'} label="部位范围" rules={[{ required: true }]}>
                    <Select>
                        { data.settingData.usingScopePartsList && data.settingData.usingScopePartsList.constructor == Array && data.settingData.usingScopePartsList.map((res: number | string) => <Select.Option value={ res } key={ res }>{ res }</Select.Option>) }
                    </Select>
                </Form.Item>

                <Form.Item name={'useParts'} label="具体部位" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name={'batch'} label="数量" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name={'samplingDate'} label="取样日期" rules={[{ required: true }]}>
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
            </FormStyle>
        </>
    );
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const validateMessages = {
    required: '${label} is required!'
};

export default memo(RingKnife);
