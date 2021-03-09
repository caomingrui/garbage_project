import React, {memo, useRef, useState} from "react";
import {Select, Button, Form, Input, DatePicker, message} from 'antd';
import { useCreated, useGetTime} from "../../utils/hooks";
import moment from "_moment@2.29.1@moment";
import {useStore} from "../../store/vueStore/store";
import {mutations, Store} from "../../store/vueStore";

// 名称类别
const category: string[] = ["烧结砖空心砖", "烧结多孔砖", "烧结普通砖",
    "承重混凝土多孔砖", "混凝土普通砖", "混凝土实心砖", "蒸汽加压混凝土砌块", "普通混凝土小型空心砌块"];

type ConcreteData = {
    time: string,
    samplingDate: string,
    monitor: string,
    accordingTo: string,
    sampleName: string,
    type: string,
    keyName: string,
    key: string,
    orderNo: string,
    [propName: string]: string
}

// brick 砖
const Concrete = () => {
    const [ levelIntensity, setLevelIntensity ] = useState<string[]>([]);// 等级

    const formTab: any = useRef(null);
    const time = useGetTime();
    const times = useGetTime(2);
    const data = useStore((store: Store) => {
        const { state } = store;
        const { settingData } = state;
        return {
            settingData
        }
    });

    useCreated(() => {
        if (formTab != null) {
            formTab.current.setFieldsValue({time: moment(time), samplingDate: moment(time)});
        }}
    );

    const onFinish = (values: any) => {
        console.log(values);
        const da: Partial<ConcreteData> = {};
        da.time = moment(values.time).format('YYYY-MM-DD');
        da.samplingDate = moment(values.samplingDate).format('YYYY-MM-DD');
        da.monitor = values.category == "蒸汽加压混凝土砌块"?"抗压强度、干密度": "抗压强度";
        da.accordingTo = getAccordingTo(values.category);
        da.sampleName = values.category;
        da.type = `${values.strength}
                ${values.spec}`;
        da.keyName = "brick";
        da.key = "brick" + times;
        da.orderNo = 'ZH-BZ';
        da.groupNum = String((["烧结砖空心砖", "烧结多孔砖", "烧结普通砖"].includes(values.category))?Math.ceil(values.batch/150000):
            (values.category == (["承重混凝土多孔砖", "混凝土普通砖", "混凝土实心砖", "蒸汽加压混凝土砌块"].includes(values.category)))?Math.ceil(values.batch/100000): Math.ceil(values.batch/15000)) + "组";
        da.batchs = (values.batch + "块");
        da.witnessPersonne = data.settingData.witnessPersonnel[values.witnessPersonne];
        da.witnessPersonNum = (data.settingData.inspectionQualifiedNum && data.settingData.inspectionQualifiedNum[values.witnessPersonne]) || "";
        const testDa = Object.assign(data.settingData, values,  da);
        console.log(testDa)
        mutations.addTabelData(testDa);
        message.success('提交成功');
    };

    // 获取检验依据
    const getAccordingTo = (values: string): string | undefined => {
        let accordingTo;
        if (values == '烧结空心砖') {
            accordingTo = "GB 13545-2014";
        }
        else if (values == '称重混凝土多孔砖') {
            accordingTo = "GB 25779-2010";
        }
        else if (values == '混凝土普通砖') {
            accordingTo = "NY/T 671-2003";
        }
        else if (values == '混凝土实心砖') {
            accordingTo = "GB/T 21144-2007";
        }
        else if (values == '烧结多孔砖') {
            accordingTo = "GB 13544-2011";
        }
        else if (values == '烧结普通砖') {
            accordingTo = "GB/T 5101-2017";
        }
        else if (values == '蒸汽加压混凝土砌块') {
            accordingTo = "GB 11968-2006";
        }
        else if (values == '普通混凝土小型空心砌块') {
            accordingTo = "GB/T 8239-2014";
        }
        return accordingTo;
    }

    const categoryCheck = () => {
        const value: string = formTab.current.getFieldValue("category");
        formTab.current.setFieldsValue({spec: ''});
        if (value != undefined) {
            setLevelIntensity([]);
            if (value == "烧结砖空心砖") {
                setLevelIntensity(['MU3.5', 'MU5.0', 'MU7.5', 'MU10']);
            }
            else if (value == "烧结多孔砖" || value == "烧结普通砖") {
                setLevelIntensity(['MU10', 'MU15', 'MU20', 'MU25', 'MU30']);
            }
            else if (value == "承重混凝土多孔砖" || value == "混凝土普通砖" || value == "混凝土实心砖") {
                setLevelIntensity(['MU15', 'MU20', 'MU25']);
            }
            else if (value == "蒸汽加压混凝土砌块") {
                setLevelIntensity(['A1.0', 'A2.0', 'A2.5', 'A3.5', 'A5.0', 'A7.5', 'A10.0','等级为B03', 'B04', 'B05', 'B06', 'B07','B08']);
            }
            else {
                setLevelIntensity(['MU3.5', 'MU5.0', 'MU7.5', 'MU10.0', 'MU15.0', 'MU20.0']);
            }
        }
    }

    return (
        <>
            我是砖块

            <Form {...layout} ref={ formTab } name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}
                  initialValues={{'supplyMarket': '厂供', 'groupNum': '10块'}}>
                <Form.Item name={'category'} label="类别" rules={[{ required: true }]}>
                    <Select onClick={ categoryCheck }>
                        {
                            category.map(res =>
                                <Select.Option value={ res } key={ res }>{ res }</Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>

                <Form.Item name={'strength'} label="强度" rules={[{ required: true }]}>
                    <Select>
                        {
                            levelIntensity.map(res =>
                                <Select.Option value={ res } key={ res }>{ res }</Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>

                <Form.Item name={'spec'} label="规格" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name={'manufacturer'} label="生产厂家" rules={[{ required: true }]}>
                    <Select>
                        { data.settingData.brickMaterial && data.settingData.brickMaterial.constructor == Array && data.settingData.brickMaterial.map((res: number| string) => <Select.Option value={ res } key={ res }>{ res }</Select.Option>) }
                    </Select>
                </Form.Item>

                <Form.Item name={'supplyMarket'} label="供销" rules={[{ required: true }]}>
                    <Input disabled />
                </Form.Item>

                <Form.Item name={'time'} label="进场日期" rules={[{ required: true }]}>
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

                <Form.Item name={'batch'} label="批量" rules={[{ required: true }]}>
                    <Input/>
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

export default memo(Concrete);
