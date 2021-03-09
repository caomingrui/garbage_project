import { Descriptions } from 'antd';
import { memo } from "react";

type Props = {
    title: string,
    dataList: any
};

const DescriptionsList = ({ title, dataList }: Props) => {

    return (
        <Descriptions title={ title }>
            {
                Object.keys(dataList).map(res =>
                        <Descriptions.Item label={ detailsDataKey[res] } key={ res }>{ detailsDataKey[res]?dataList[res]: null }</Descriptions.Item>
                   )
            }
        </Descriptions>
    );
}

export default memo(DescriptionsList);

type DetailsDataKey =  {
    [proppName:string]: string;
}

export const detailsDataKey: DetailsDataKey = {
    sampleName: "试样名称",
    type: "型号、规格、等级、牌号",
    keyName: "类型",
    key: "id",
    temp: "温度",
    reinforcMaterial: "生产厂家",
    experimentalDate: "试验日期",
    engineeringAreas: "工程所属区域",
    projectClass: "所属项目",
    orderNo: "编号",
    witnessPersonnel: "见证人员列表",
    witnessPersonNum: "见证人员考核证号",
    compactingFactor: "系数",
    concreteMaterial: "生产厂家",
    engineeringArea: "工程所属区域",
    factory: "取样数",
    factorySoil: "生产厂家 - 土",
    factoryWhite: "生产厂家 - 白灰",
    inspectionQualifiedNum: "见证人考核证号列表",
    isExport: "是否导出",
    mortarMaterial: "生产厂家列表",
    mountGuardNumber: "上岗证号",
    projectClasss: "项目分类列表",
    sleeveMaterial: "生产厂家列表",
    specialPerName: "特种操作人员姓名",
    supplyMarketingUnits: "供销单位",
    supplyMarketingUnitsList: "供销单位列表",
    supplyMarketingUnitsSoil: "供销单位 - 土",
    supplyMarketingUnitsWhite: "供销单位 - 白灰",
    usingScopeParts: "部位范围",
    usingScopePartsList: "使用部位范围列表",
    buildUnit: "建设单位",
    projectName: "工程名称",
    entrustUnit: "委托单位",
    monitorUnit: "监测单位",
    constructionUnit: "施工单位",
    supervisionUnit: "监理单位",
    peopleDirect: "送样人",
    operator: "试验员",
    qualifiedNum: "考核合格证号",
    manufacturer: "生产厂家",
    // contentIs: "内容和对情况",
    witnessPerson: "见证人员",
    category: "类别",
    strength: "强度",
    spec: "规格",
    supplyMarket: "供销",
    time: "当前时间|进厂日期",
    useParts: "使用部位",
    batch: "代表批量",
    groupNum: "取（制）样数量",
    samplingDate: "取样日期",
    monitor: "监测单位",
    reportNumber: "报告编号",
    accordingTo: "检验依据"
}
