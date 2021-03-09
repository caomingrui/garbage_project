import React, {memo, useRef} from "react";
import {Select, Button, Form, Input, DatePicker, message, Checkbox, Col, Row} from 'antd';
import {getTimeUnique, useCreated, useGetTime} from "../../utils/hooks";
import moment from "_moment@2.29.1@moment";
import {mutations, Store} from "../../store/vueStore";
import {useStore} from "../../store/vueStore/store";

// 等级列表
const level: string[] = ['HPB235', 'HPB300', 'HRB335', 'HRB335E', 'HRB400', 'HRB400E', 'HRB500', 'HRB500E'];

// 规格
const size: number[] = [10, 12, 14, 16, 18, 20, 22, 25];

// switch 电渣压力焊
const Switch = () => {
    const formTab: any = useRef(null);
    const time = useGetTime();
    const data = useStore((store: Store) => {
        const { settingData } = store.state;
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
        values.size.map((res: string) => {
            let da: typeof values = {};
            da.time = moment(values.time).format('YYYY-MM-DD');
            da.sampleName = "电渣压力焊";
            da.keyName = "switch";
            da.key = "switch" + getTimeUnique();
            da.type = `${values.level}
                        ${res}`;
            da.orderNo = "ZH-DZ";
            da.useParts = values.usingScopeParts + values.useParts;
            da.groupNum = Math.ceil(values.batch/300) + '组';
            da.witnessPersonne = data.settingData.witnessPersonnel[values.witnessPersonne];
            da.witnessPersonNum = (data.settingData.inspectionQualifiedNum && data.settingData.inspectionQualifiedNum[values.witnessPersonne]) || "";
            let testDa = Object.assign(data.settingData, values, da);
            mutations.addTabelData(testDa);
            message.success('提交成功');
        })
    };


    function autoPhaseDate (e: any): void  {
        console.log(e);
    }

    return (
        <>
            我是电渣压力焊

            <Form {...layout} ref={ formTab } name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}
                  initialValues={{'groupNum': '1组'}}>
                <Form.Item name={'level'} label="等级" rules={[{ required: true }]}>
                    <Select>
                        {
                            level.map(res =>
                                <Select.Option value={ res } key={ res }>{ res }</Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>

                <Form.Item name={'size'} label="规格" rules={[{ required: true }]}>
                    <Checkbox.Group onChange={autoPhaseDate}>
                        <Row>
                            {
                                size.map(res => (
                                        <Col span={6} key={res}>
                                            <Checkbox value={res} style={{ lineHeight: '32px' }} >
                                                { res }
                                            </Checkbox>
                                        </Col>
                                    )
                                )
                            }
                        </Row>
                    </Checkbox.Group>
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
                    <Input />
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
    )
};

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const validateMessages = {
    required: '${label} is required!'
};

export default memo(Switch);
