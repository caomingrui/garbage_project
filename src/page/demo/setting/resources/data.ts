export type TabelType = { manufacturer: string, material: string }

type Material = { val: string, key: string, type?: boolean}[];

export type UnitsConfig = {val: string, key: string, type?: boolean}

// 生产及供销单位
export const material: Material = [
    {val: "供销单位", key: "supplyMarketingUnitsList", type: true},
    {val: '钢筋原料', key: 'reinforc'}, {val: '混泥土 ', key: 'concrete'},
    {val: '砂浆  ', key: 'mortar'}, {val: '直螺纹套筒', key: 'sleeve'},
    {val: '砖   ', key: 'brick'}, {val: '防水卷材', key: 'waterproof'}, {val: '土', key: 'soil'},
    ];

// 主体数据
export const setupData: UnitsConfig[] = [
    {val: "工程名称", key: "projectName", type: true},
    {val: "建设单位", key: "buildUnit", type: true},
    {val: "委托单位", key: "entrustUnit", type: true},
    {val: "检测单位", key: "monitorUnit", type: true},
    {val: "施工单位", key: "constructionUnit", type: true},
    {val: "监理单位", key: "supervisionUnit", type: true},
    {val: "工程所属区域", key: "engineeringArea", type: true}
    ]

// 单位配置
export const unitsConfig: UnitsConfig[] = [
    {val: "送样人", key: "peopleDirect", type: true},
    {val: "试验员", key: "operator", type: true},
    {val: "试验员考核证号", key: "qualifiedNum", type: true},
    {val: "见证人员", key: "witnessPersonnel"},
    {val: "见证人考核证号", key: "inspectionQualifiedNum"},
    {val: "见证范围", key: "usingScopePartsList"},
    {val: "特种操作人员姓名", key: "specialPerName", type: true},
    {val: "上岗证号", key: "mountGuardNumber", type: true}
];