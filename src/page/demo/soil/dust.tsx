import React, {memo, useRef} from "react";
import {Select, Button, Form, Input, DatePicker, message} from 'antd';
import { useCreated, useGetTime } from "../../../utils/hooks";
import moment from 'moment'
import {mutations, Store} from "../../../store/vueStore";
import {useStore} from "../../../store/vueStore/store";

// 试样名称
const sampleName = ['素土', '2:8灰土', '3:7灰土'];

// 灰土
const Dust = () => {
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
        da.factory = '土：' + values.factorySoil + '\n白灰：' + values.factoryWhite;
        da.supplyMarketingUnits = '土：' + values.supplyMarketingUnitsSoil + '\n白灰：' + values.supplyMarketingUnitsWhite;
        da.batch = '素土：50kg\n白灰：30kg'
        da.keyName = "dust";
        da.key = "dust" + times;
        da.useParts = values.usingScopeParts + values.useParts;
        da.groupNum = "一组";
        da.orderNo = "ZH-JS";
        da.witnessPersonne = data.settingData.witnessPersonnel[values.witnessPersonne];
        da.witnessPersonNum = (data.settingData.inspectionQualifiedNum && data.settingData.inspectionQualifiedNum[values.witnessPersonne]) || "";
        const testDa = Object.assign(data.settingData, values,  da);
        mutations.addTabelData(testDa);
        message.success('提交成功');
    };

    return (
        <div>
            灰土

            <Form {...layout} ref={ formTab } name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                <Form.Item name={'sampleName'} label="试样名称" rules={[{ required: true }]}>
                    <Select>
                        {
                            sampleName.map(res => <Select.Option value={ res } key={ res }>{ res }</Select.Option>)
                        }
                    </Select>
                </Form.Item>

                <Form.Item name={'factorySoil'} label="生产厂家 - 土">
                    <Input />
                </Form.Item>

                <Form.Item name={'factoryWhite'} label="生产厂家 - 白灰">
                    <Input />
                </Form.Item>

                <Form.Item name={'supplyMarketingUnitsSoil'} label="供销单位 - 土">
                    <Input />
                </Form.Item>

                <Form.Item name={'supplyMarketingUnitsWhite'} label="供销单位 - 白灰">
                    <Input />
                </Form.Item>

                <Form.Item name={'time'} label="进厂日期" rules={[{ required: true }]}>
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
        </div>
    );
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const validateMessages = {
    required: '${label} is required!'
};

export default memo(Dust);
