import moment from "_moment@2.29.1@moment";
import {useChangeDoc, useGetTime} from "../../../utils/hooks";
import {useStore} from "../../../store/vueStore/store";
import {mutations, Store} from "../../../store/vueStore";
import {useState} from "react";
import {message} from "antd";

export type Data = {
    time: string,
    type: string,
    sampleName: string
    supplyMarket: string,
    manufacturer: string,
    key: string,
    keyName: string,
    useParts: string,
    orderNo: string,
    groupNum: string,
    [propName: string]: string
}

// use 套筒 模板
export function useSleeve() {
    const {state,  changeDoc} = useChangeDoc();
    const times = useGetTime(2);
    const data = useStore((store: Store) => {
        const { state } = store;
        const { settingData } = state;
        return {
            settingData
        }
    });

    const perform = (values: any) => {
        let da: Partial<Data> = {};
        da.time = moment(values.time).format('YYYY-MM-DD');
        da.type = `${values.level} + 
                    ${values.specification}`;
        da.sampleName = "直螺纹套筒连接";
        da.supplyMarket = "厂供";
        da.key = "sleeve";
        da.keyName = "sleeve";
        da.key = "sleeve" + times;
        da.useParts = values.usingScopeParts + values.useParts;
        da.orderNo = "ZH-TT";
        da.groupNum = String(Math.ceil(values.batch/500)) + '组';

        da.witnessPersonne = data.settingData.witnessPersonnel[values.witnessPersonne];
        da.witnessPersonNum = (data.settingData.inspectionQualifiedNum && data.settingData.inspectionQualifiedNum[values.witnessPersonne]) || "";
        let testDa = Object.assign(data.settingData, values, da);

        mutations.addTabelData(testDa);
        message.success('提交成功');

    }

    return {
        state,
        perform
    }
}
