import React, {memo} from "react";
import {mutations, StatesData} from "../../../store/vueStore";
import {Space, Table, message } from "antd";
import ModalView from "./Modal";
import DescriptionsList from "./Descriptions";
import { BlockSort, ChangeBut, DataTransfer } from "../hooks/componentHooks"

type TableDaType = {
    tabel: any
}

const TableDa: React.FC<TableDaType> = ({ tabel }) => {
    const [tabelData, setTabelData] = tabel;
    const [checkStrictly, setCheckStrictly] = React.useState<boolean>(false);

    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: StatesData) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            if (selectedRows.length > 0) {

                const arrDataList = selectedRows.reduce((total: any, val: StatesData) => {
                    if (val.keyName === "waterproof") {
                        BlockSort(total, val, 10000, "㎡");
                    }
                    else if (val.keyName === "switch") {
                        BlockSort(total, val, 300);
                    }
                    else if (val.keyName === "sleeve") {
                        BlockSort(total, val, 500);
                    }
                    else if (val.keyName === "mortar") {
                        if (val.sampleName == "干混砌筑砂浆") {
                            BlockSort(total, val, 100, 't');
                        }
                        else {
                            BlockSort(total, val, 50, 'm³');
                        }
                    }
                    else if (val.keyName === "reinforc") {
                        BlockSort(total, val, 60, 't');
                    }
                    else if (val.keyName === "plainSoil") {
                        BlockSort(total, val, 3);
                    }
                    else if (val.keyName === "concrete") {
                        if (val.permeabilityBar) {
                            BlockSort(total, val, 500, "m³");
                        }
                        else {
                            if (val.maintenance == "标准养护") {
                                BlockSort(total, val, 100, 'm³');
                            }
                            else if (val.maintenance == "同条件养护") {
                                BlockSort(total, val, 2000, 'm³');
                            }
                            else {
                                BlockSort(total, val, 20000000000, 'm³');
                            }
                        }
                    }
                    else if (val.keyName === "brick") {
                        if (["烧结砖空心砖", "烧结多孔砖", "烧结普通砖"].includes(val.category)) {
                            BlockSort(total, val, 150000);
                        }
                        else if (["承重混凝土多孔砖", "混凝土普通砖", "混凝土实心砖", "蒸汽加压混凝土砌块"].includes(val.category)) {
                            BlockSort(total, val, 100000);
                        }
                        else {
                            BlockSort(total, val, 15000);
                        }
                    }
                    else if (val.keyName === "permeability") {
                        BlockSort(total, val, 500, 'm³');
                    }
                    else {
                        total[val.keyName].push(val);
                    }
                    return total;
                }, {
                    concrete: [],
                    brick: [],
                    waterproof: [],
                    switch: [],
                    sleeve: [],
                    mortar: [],
                    ringKnife: [],
                    plainSoil: [],
                    dust: [],
                    reinforc: [],
                    permeability: []
                })

                const objData: any = {};
                Object.keys(arrDataList).map(res => {
                    if (arrDataList[res].length > 0) {
                        objData[res] = arrDataList[res];
                    }
                });
                console.log(objData)
                mutations.addCeckTabel(objData);
            }
            else {
                mutations.addCeckTabel("");
            }
        }
    };

    const deleteRows = (key: string) => {
        let arr = localStorage.getItem("tabelData");
        let newArr: typeof tabelData = [];
        arr && JSON.parse(arr).map((res: typeof tabelData) => {
            if (res.key !== key) {
                newArr.push(res);
            }
        });
        setTabelData(newArr);
        mutations.deleteFormData(newArr);
        message.success('删除成功');
        localStorage.setItem('tabelData', JSON.stringify(newArr));
    }

     const columns: StatesData = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            width: 50,
            render: (text: string, record: any, index: number) => `${index+1}`,
        },
        {
            title: '试样名称',
            dataIndex: 'sampleName',
            key: 'sampleName',
        },
        {
            title: '使用部位·具体部位范围',
            dataIndex: 'useParts',
            key: 'useParts',
        },
        {
            title: '进场时间',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: '型号规格',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '生产厂家',
            dataIndex: 'manufacturer',
            key: 'manufacturer',
        },
        {
            title: '供销单位',
            dataIndex: 'supplyMarket',
            key: 'supplyMarket',
        },
        {
            title: '取（制）样数量',
            dataIndex: 'groupNum',
            key: 'groupNum',
        },
        {
            title: '代表批量',
            dataIndex: 'batch',
            key: 'batch',
        },
        {
            title: '养护条件',
            dataIndex: 'maintenance',
            key: 'maintenance',
            render: (text: string) => <span>{ text }</span>
        },
         {
             title: '委托单编号',
             dataIndex: 'orderNo',
             key: 'orderNo'
         },
         {
             title: '报告编号',
             dataIndex: 'reportNumber',
             key: 'reportNumber',
         },
        {
            title: '资料交接情况',
            dataIndex: 'dataTransfer',
            key: 'dataTransfer',
            render: (text: number | undefined, record: StatesData) => (
                <>
                    <DataTransfer daKey={record.key} tabel={tabel} val={text || 1}></DataTransfer>
                </>
            )
        },
        {
            title: '是否导出',
            dataIndex: 'isExport',
            key: 'isExport',
            render: (text: boolean | undefined) => (
                <>
                    {text?"已导出": "未导出"}
                </>
            )
        },
         {
             title: '温度',
             dataIndex: 'temp',
             key: 'temp'
         },
        {
            title: '操作',
            key: 'action',
            render: (text: string, record: StatesData) => (
                <>
                    <ModalView>
                        <DescriptionsList title={ record.name } dataList={ record }></DescriptionsList>
                    </ModalView>
                    <Space size="middle">
                            <ChangeBut dataList={record} tabel={tabel} keys="reportNumber" title="报告编号"/>
                            <ChangeBut dataList={record} tabel={tabel} keys="orderNo" title="委托单号"/>
                        <a onClick={() => deleteRows(record.key)}>删除</a>
                    </Space>
                </>
            ),
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                rowSelection={{ ...rowSelection, checkStrictly }}
                pagination={{'pageSize': 6}}
                dataSource={tabelData}
            />
        </>
    );
}

export default memo(TableDa);