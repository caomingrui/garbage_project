import React, {memo, useRef} from "react";
import {Select, Button, Form, Input, DatePicker, message} from 'antd';
import {useCreated, useGetTime} from "../../utils/hooks";
import moment from "_moment@2.29.1@moment";
import {useStore} from "../../store/vueStore/store";
import {Store, mutations} from "../../store/vueStore";

const rankList: string[] = [
    `SBS Ⅰ PY PE PE
    3 
    10`, `SBS Ⅱ PY PE PE 
    3 
    10`, `SBS Ⅱ PY PE PE 
    4 
    10`, `SBS Ⅱ PY PE PE 
    4 
    10 耐根穿刺防水卷材`];

// waterproof 防水卷材
const Waterproof = () => {
    const formTab = useRef<any>(null);
    const time = useGetTime();
    const times = useGetTime(2);
    const data = useStore((store: Store) => {
        const { state } = store;
        const { settingData, tabelData } = state;
        return {
            settingData,
            tabelData
        }
    });

    useCreated(() => {
        if (formTab != null) {
            formTab.current && formTab.current.setFieldsValue({time: moment(time), samplingDate: moment(time)})
        }}
    );

    const onFinish = (values: any) => {
        const da: typeof values = {};
        da.time = moment(values.time).format('YYYY-MM-DD');
        da.samplingDate = moment(values.samplingDate).format('YYYY-MM-DD');
        da.sampleName = "弹性体改性沥青防水卷材";
        da.keyName = "waterproof";
        da.key = "waterproof" + times;
        da.useParts = values.usingScopeParts + values.useParts;
        da.orderNo = "ZH-JC";
        da.supplyMarket = "厂供";
        da.groupNum = Math.ceil(values.batch/10000) + "组";
        da.batchs = values.batch + "㎡";
        da.witnessPersonne = data.settingData.witnessPersonnel[values.witnessPersonne];
        da.witnessPersonNum = (data.settingData.inspectionQualifiedNum && data.settingData.inspectionQualifiedNum[values.witnessPersonne]) || "";
        const testDa = Object.assign(data.settingData, values, da);
        mutations.addTabelData(testDa);
        message.success('提交成功');
    };

    return (
        <>
             我是防水卷材
            { data.tabelData.length }
            <Form {...layout} ref={ formTab } name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}
                  initialValues={{'supplyMarket': '厂供', "groupNum": "1.5㎡"}}>
                <Form.Item name={'type'} label="规格型号等级" rules={[{ required: true }]}>
                    <Select>
                        {
                            rankList.map((res, index) =>
                                <Select.Option value={res} key={index}>{ res }</Select.Option>
                            )
                        }
                    </Select>
                </Form.Item>

                <Form.Item name={'factoryNum'} label="出厂编号" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name={'manufacturer'} label="生产厂家" rules={[{ required: true }]}>
                    <Select>
                        { data.settingData.waterproofMaterial && data.settingData.waterproofMaterial.constructor == Array && data.settingData.waterproofMaterial.map((res: number| string) => <Select.Option value={ res } key={ res }>{ res }</Select.Option>) }
                    </Select>
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

export default memo(Waterproof);
