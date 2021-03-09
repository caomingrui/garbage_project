import React, {memo, useRef} from "react";
import {Select, Button, Form, Input, DatePicker, message} from 'antd';
import { useCreated, useGetTime, getTimeUnique } from "../../utils/hooks";
import moment from 'moment'
import {useStore} from "../../store/vueStore/store";
import {mutations, Store} from "../../store/vueStore";

// 试样名称
const sampleName: string[] = ['钢筋混凝土用钢热轧带肋钢筋', '钢筋混凝土用钢热轧光圆钢筋'];
// 牌号
const brand: string[] = ['HPB235', 'HPB300', 'HRB335', 'HRB335E', 'HRB400', 'HRB400E', 'HRB500', 'HRB500E'];
// 规格
const specifications: string[] = [ '6', '8', '10', '12', '14', '16', '18', '20', '22', '25', '28', '32', '35'];

// 钢筋原料
const Reinforc = () => {
    const formTab: any = useRef(null);
    const time = useGetTime();
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
        const da: typeof values = {};
        da.time = moment(values.time).format('YYYY-MM-DD');
        da.type = `${values.brand} 
          ${values.specifications}`;
        da.keyName = "reinforc";
        da.key = "reinforc" + getTimeUnique();
        da.groupNum = Math.ceil(values.batch/60) + "组";
        da.accordingTo = values.sampleName == "钢筋混凝土用钢热轧带肋钢筋"?"GB/T 1499.2-2018": "GB/T 1499.1-2017";
        da.useParts = values.usingScopeParts + values.useParts;
        da.orderNo = "ZH-YC";
        da.batchs = values.batch + 't';
        da.witnessPersonne = data.settingData.witnessPersonnel[values.witnessPersonne];
        da.witnessPersonNum = (data.settingData.inspectionQualifiedNum && data.settingData.inspectionQualifiedNum[values.witnessPersonne]) || "";
        const testDa = Object.assign(data.settingData, values,  da);
        mutations.addTabelData(testDa);
        message.success('提交成功');
    };

    return (
        <div>
           我是钢筋原材

            <Form {...layout} ref={ formTab } name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>

                <Form.Item name={'sampleName'} label="试样名称" rules={[{ required: true }]}>
                    <Select>
                        {
                            sampleName.map(res => <Select.Option value={ res } key={ res }>{ res }</Select.Option>)
                        }
                    </Select>
                </Form.Item>

                <Form.Item name={'brand'} label="牌号" rules={[{ required: true }]}>
                    <Select>
                        {
                            brand.map(res => <Select.Option value={ res } key={ res }>{ res }</Select.Option>)
                        }
                    </Select>
                </Form.Item>

                <Form.Item name={'specifications'} label="规格" rules={[{ required: true }]}>
                    <Select>
                        {
                            specifications.map(res => <Select.Option value={ res } key={ res }>{ res }</Select.Option>)
                        }
                    </Select>
                </Form.Item>

                <Form.Item name={'productionBatchNum'} label="出厂批号" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name={'manufacturer'} label="生产厂家" rules={[{ required: true }]}>
                    <Select>
                        { data.settingData.reinforcMaterial && data.settingData.reinforcMaterial.constructor == Array && data.settingData.reinforcMaterial.map((res: number| string) => <Select.Option value={ res } key={ res }>{ res }</Select.Option>) }
                    </Select>
                </Form.Item>

                <Form.Item name={'supplyMarket'} label="供销单位" rules={[{ required: true }]}>
                    <Select>
                        { data.settingData.supplyMarketingUnitsList && data.settingData.supplyMarketingUnitsList.constructor == Array && data.settingData.supplyMarketingUnitsList.map((res: number | string) => <Select.Option value={ res } key={ res }>{ res }</Select.Option>) }
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
                    <Input/>
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

export default memo(Reinforc);