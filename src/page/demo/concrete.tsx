import React, {memo, useRef} from "react";
import {Select, Button, Form, Input, DatePicker, message, Checkbox, Col, Row} from 'antd';
import {useCreated, useGetTime, DateDiff, getthedate, getTimeUnique} from "../../utils/hooks";
import moment from "_moment@2.29.1@moment";
import {useStore} from "../../store/vueStore/store";
import {Store, mutations} from "../../store/vueStore";

// concrete 混泥土
const Concrete = () => {
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

    const countGroupNum = (num: string, checkMaintenance: string) => {
        const maintenance = checkMaintenance;
        let group;
        if (maintenance == '0') {
            group = parseInt(num)/100;
        }
        else if (maintenance == '1') {
            group = parseInt(num)/2000;
        }
        else {
            group = '/';
        }
        return group;
    }

    const onFinish = (values: any) => {
        let sampleName: string;
        if (values.permeabilityBar) {
            sampleName = "混凝土抗渗试块";

            values.maintenance.map((res: string) => {
                const da: typeof values = {};
                da.experimentalDate = moment(values.experimentalDate).format('YYYY-MM-DD');
                da.time = moment(values.time).format('YYYY-MM-DD');
                da.period = res == '1'?600: DateDiff(da.time, da.experimentalDate);
                da.batch = values.batch;
                da.groupNum = countGroupNum(values.batch, '0' ) + '组';
                da.keyName = "permeability";
                da.key = "permeability" + getTimeUnique();
                da.useParts = values.usingScopeParts + values.useParts;
                da.maintenance = res == '0'?'标准养护': res == '1'? '同条件养护': '拆模同条件养护';
                da.temp = res == '1'? '0': null;
                da.strength = `${values.strength}
                        175*185*150`;
                da.groupNum =  Math.ceil(values.datch/500);
                da.orderNo = "ZH-" +  "KS";
                da.batchs = values.batch + "m³";
                da.witnessPersonne = data.settingData.witnessPersonnel[values.witnessPersonne];
                da.witnessPersonNum = data.settingData.inspectionQualifiedNum[values.witnessPersonne];
                const testDa = Object.assign(data.settingData, values, {sampleName: sampleName}, da);
                mutations.addTabelData(testDa);
                message.success('提交成功');
            })

        }
        else {
            values.maintenance.map((res: string) => {
                if (res == '0' || res == '1') {
                    sampleName = "混凝土抗压试块";
                }
                else {
                    sampleName = "拆模混凝土抗压试块";
                }
                const da: typeof values = {};
                da.experimentalDate = res == '0'?getthedate(time, 28): res == '1'?getthedate(time, 1): getthedate(time, 14);
                da.time = moment(values.time).format('YYYY-MM-DD');
                da.period = res == '1'?600: DateDiff(da.time, da.experimentalDate);
                da.batch = values.batch;
                da.groupNum = countGroupNum(values.batch, res) + '组';
                da.keyName = "concrete";
                da.key = "concrete" + getTimeUnique();
                da.useParts = values.usingScopeParts + values.useParts;
                da.maintenance = res == '0'?'标准养护': res == '1'? '同条件养护': '拆模同条件养护';
                da.temp = res == '1'? '0': null;
                da.strength = `${values.strength} 
                                100*100*100`;
                da.batchs = values.batch + "m³";
                da.groupNum = (res == '0'?Math.ceil(values.batch/100): res == '1'?Math.ceil(values.batch/2000): "1") + "组";
                da.orderNo = "ZH-" + (res === '0'? "BY": res === '1'? "TY": "CM");
                da.witnessPersonne = data.settingData.witnessPersonnel[values.witnessPersonne];
                da.witnessPersonNum = (data.settingData.inspectionQualifiedNum && data.settingData.inspectionQualifiedNum[values.witnessPersonne]) || "";
                let testDa = Object.assign(data.settingData, values, {sampleName: sampleName}, da);
                mutations.addTabelData(testDa);
                message.success('提交成功');
            })
        }
    };

    //根据养护条件生成临期日期
    function autoPhaseDate (e: any): void  {
        console.log(e);
    }

    return (
        <>
            我是混凝土 --- 实验日期提醒
            <Form {...layout} ref={ formTab } name="nest-messages" initialValues={{'supplyMarket': '厂供'}}
                  onFinish={onFinish} validateMessages={validateMessages}>
                <Form.Item name={'strength'} label="强度" rules={[{ required: true }]}>
                    <Select>
                        {
                            strengthList.map(res => {
                                return (
                                    <Select.Option value={ res.val } key={ res.key }>{ res.val }</Select.Option>
                                );
                            })
                        }
                    </Select>
                </Form.Item>

                <Form.Item name={'permeabilityBar'} label="抗渗栏">
                    <Select>
                        {
                            permeabilityBar.map(res => {
                                return (
                                    <Select.Option value={ res.val } key={ res.key }>{ res.val }</Select.Option>
                                );
                            })
                        }
                    </Select>
                </Form.Item>

                <Form.Item name={'maintenance'} label="养护" rules={[{ required: true }]}>
                    <Checkbox.Group onChange={autoPhaseDate}>
                        <Row>
                            <Col span={10}>
                                <Checkbox value="0" style={{ lineHeight: '32px' }} >
                                    标准养护
                                </Checkbox>
                            </Col>
                            <Col span={10}>
                                <Checkbox value="1" style={{ lineHeight: '32px' }}>
                                    同条件养护
                                </Checkbox>
                            </Col>
                            <Col span={10}>
                                <Checkbox value="2" style={{ lineHeight: '32px' }}>
                                    拆模同条件养护
                                </Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>


                <Form.Item name={'manufacturer'} label="厂家" rules={[{ required: true }]}>
                    <Select>
                        { data.settingData.concreteMaterial && data.settingData.concreteMaterial.constructor == Array && data.settingData.concreteMaterial.map((res: number| string) => <Select.Option value={ res } key={ res }>{ res }</Select.Option>) }
                    </Select>
                </Form.Item>

                <Form.Item name={'supplyMarket'} label="供销" rules={[{ required: true }]}>
                    <Input disabled/>
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

                {/*<Form.Item name={'experimentalDate'} label="试验日期" rules={[{ required: true }]}>*/}
                {/*    <DatePicker format="YYYY-MM-DD" />*/}
                {/*</Form.Item>*/}

                <Form.Item name={'batch'} label="批量" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name={'witnessPersonne'} label="见证人员" rules={[{ required: true }]}>
                    <Select>
                        { data.settingData.witnessPersonnel && data.settingData.witnessPersonnel.constructor == Array && data.settingData.witnessPersonnel.map((res: number| string, ind: number) => <Select.Option value={ ind } key={ res }>{ res }</Select.Option>) }
                    </Select>
                </Form.Item>

                {/*<Form.Item name={'groupNum'} label="组数" rules={[{ required: true }]}>*/}
                {/*    <Input disabled />*/}
                {/*</Form.Item>*/}

                {/*<Form.Item name={'projectClass'} label="项目分类">*/}
                {/*    <Select>*/}
                {/*        { data.settingData.projectClasss && data.settingData.projectClasss.constructor == Array && data.settingData.projectClasss.map((res: number| string) => <Select.Option value={ res } key={ res }>{ res }</Select.Option>) }*/}
                {/*    </Select>*/}
                {/*</Form.Item>*/}



                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>

        </>
    );
}

// 强度

type StrengthList = {
    key: string,
    val: string
}
const strengthList: StrengthList[] = [
    {key: 'C15细石', val: 'C15细石'},
    {key: 'C15', val: 'C15'},
    {key: 'C20', val: 'C20'},
    {key: 'C20细石', val: 'C20细石'},
    {key: 'C25', val: 'C25'},
    {key: 'C30', val: 'C30'},
    {key: 'C35', val: 'C35'},
    {key: 'C40', val: 'C40'},
    {key: 'C50', val: 'C50'},
    {key: 'C55', val: 'C55'},
    {key: 'C60', val: 'C60'},
    {key: 'C65', val: 'C65'},
    {key: 'C70', val: 'C70'},
    {key: 'C75', val: 'C75'},
    {key: 'C80', val: 'C80'},
];

const permeabilityBar: StrengthList[] = [
    {key: 'P4', val: 'P4'},
    {key: 'P6', val: 'P6'},
    {key: 'P8', val: 'P8'},
    {key: 'P10', val: 'P10'},
    {key: 'P12', val: 'P12'},
]

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const validateMessages = {
    required: '${label} is required!'
};

export default memo(Concrete);
