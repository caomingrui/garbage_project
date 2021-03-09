import React, {memo, useState} from "react";
import {Button, DatePicker, Input, Select} from 'antd';
import {useStore} from "../../../store/vueStore/store";
import {Store} from "../../../store/vueStore";
import TableDa from "../component/tabel";
import {detailsDataKey} from "../component/Descriptions";
import {useQueryEvent} from "../hooks/queryEvent";
import { useRadio } from "../component/radio";
import {
    useChangeDoc,
    NumberOrders,
    isExportLocal,
    useNewExportExcel,
    useInportExcel,
    separateWprldArray
} from "../../../utils/hooks";
import moment from "_moment@2.29.1@moment";
import styled from "styled-components";

const FileDefaultDel = styled.div`
    width: 90px;
    height: 30px;
    position: relative;
    display: inline-block;
    
    &>input {
        width: 90px;
        height: 30px;
        opacity: 0;
        position: absolute;
        top: 0;
        z-index: 10;
    }
    
    Button {
        width: 90px;
        height: 30px;
    }
`;

const type = [
    {key: 'reinforc', val: '钢筋原料'}, {key: 'concrete', val: '混泥土'},
    {key: 'mortar', val: '砂浆'}, {key: 'switch', val: '电渣压力焊'}, {key: 'sleeve', val: '直螺纹套筒'},
    {key: 'brick', val: '砖'}, {key: 'waterproof', val: '防水卷材'}, {key: 'soil', val: '土'}];

export default memo((message?: any) => {
    const data = useStore((store: Store) => {
        const {tabelData, checkTabelData, settingData} = store.state;
        return {
            tabelData,
            checkTabelData,
            settingData
        }
    });
    const [tabelData, setTabelData] = useState(data.tabelData);
    //world 输出
    const {state, changeDoc} = useChangeDoc();
    // 对应模板数据
    const {multipleCol, dealWithWater, switchWorld, concreteWorld, mortarWorld, permeabilityWorld} = useQueryEvent();
    // 筛选时间
    const [timeVal, setTimeVal] = useState<any>();
    // 筛选部位
    const [partsVal, setPartsVal] = useState<string>();
    //项目
    // const [project, setProject] = useState(null);
    // 见证人员
    const [witnessVal, setWitnessVal] = useState<string>();

    const {exportExcel} = useNewExportExcel();

    const {  value: radiosVal, setValue: setRadiosVal,  Radios } = useRadio();

    const {uploadExcel} = useInportExcel([tabelData, setTabelData]);

    // 过滤
    function filter<T extends []>(data: T, key: string) {
        // 清空筛选条件
        setTimeVal(null);
        setPartsVal('');
        // timeRef.current.props.onChange();
        let arr: any = [];
        data.map((res: any) => {
            if (res.keyName === key) {
                arr.push(res);
            } else if ((res.keyName === "dust" || res.keyName === "plainSoil" || res.keyName === "ringKnife") && key === "soil") {
                arr.push(res);
            }
        });
        setTabelData([]);
        setTimeout(() => {
            setTabelData(arr);
        }, 200);
    }

    // 养护条件
    function curingConditions (val: any) {
        let arr: typeof tabelData = [];
        data.tabelData.map((res: any) => {
            // if (!partsVal && !timeVal && !project && !witnessVal) {
            if (!partsVal && !timeVal && !witnessVal) {
                if (res.maintenance == val) {
                    arr.push(res);
                }
            } else {
                // if (res.maintenance == val && (res.time == timeVal || res.useParts.includes(partsVal) || res.projectClass === (project)|| res.witnessPersonne == witnessVal)) {
                if (res.maintenance == val && (res.time == timeVal || res.useParts.includes(partsVal) || res.witnessPersonne == witnessVal)) {
                    arr.push(res);
                }
            }
        });

        setTabelData([]);
        setTimeout(() => {
            setTabelData(arr);
        }, 200)
    }

    // 单导出
    const exportData = (): void => {
        const key = data.checkTabelData;
        Object.keys(key).map((res, ind) => {

            let da: typeof data.tabelData = {};  // 导出数据存储
            if (key && key[res].constructor == Array) {
                // 获取名称
                let documentName = res;
                let listCmr: any = [];
                console.log(key[res])
                key[res].map((resInd: any, index: number) => {

                    // 傻逼抗渗
                    if (documentName === "permeability") {

                        if (key[res].length < 3) {
                            let data = permeabilityWorld(resInd, resInd.index, da, 0, 2);

                            // 当外层循环执行完时触发 --- 防止多次触发
                            if (index == key[res].length - 1) {
                                // 导出
                                isExportLocal(data, [tabelData, setTabelData]);
                                const dataList = NumberOrders(documentName, data, [tabelData, setTabelData]);
                                changeDoc(documentName + '.docx', dataList);
                            }
                        }
                        else {
                            console.log(index)
                            for (let i = 0; i < Math.floor((index) / 2) + 1; i++) {
                                console.log(i)
                                // 获取每次循环拿到的数据
                                listCmr.push(permeabilityWorld(resInd, resInd.index, da, i, 2));
                            }
                            console.log(listCmr)
                            console.log(separateWprldArray(listCmr))
                            // 当外层循环执行完时触发 --- 防止多次触发
                            if (index == key[res].length - 1) {
                                separateWprldArray(listCmr).map((res: any) => {
                                    isExportLocal(res, [tabelData, setTabelData]);
                                    const dataList = NumberOrders(documentName, res, [tabelData, setTabelData]);
                                    // changeDoc(documentName + '.docx', dataList);
                                });
                            }
                        }
                    }
                    // 抗渗 end
                    // 环刀开始
                    else if (documentName === "ringKnife") {
                        changeDoc(documentName + '.docx', resInd);
                    } else {
                        // 数据小于 3的时候 一份维拓
                        if (key[res].length < 4) {
                            let data;
                            if (documentName === "reinforc" || documentName === "sleeve" || documentName === "switch" || documentName === "waterproof" || documentName === "sleeve" || documentName === "brick") {
                                data = switchWorld(resInd, index, da, 0);
                            } else if (documentName === "concrete") {
                                data = concreteWorld(resInd, index, da, 0);
                            } else if (documentName === "mortar") {
                                data = mortarWorld(resInd, index, da, 0);
                            } else  {
                                data = multipleCol(resInd, index, da);
                            }
                            // 当外层循环执行完时触发 --- 防止多次触发
                            if (index == key[res].length - 1) {
                                // 导出
                                isExportLocal(data, [tabelData, setTabelData]);
                                const dataList = NumberOrders(documentName, data, [tabelData, setTabelData]);
                                documentName != "permeability" && changeDoc(documentName + '.docx', dataList);
                            }
                        }
                        // 反之多张数据
                        else {
                            // 判断导出几次
                            for (let i = 0; i < Math.floor((index) / 3) + 1; i++) {
                                // 获取每次循环拿到的数据
                                let dacmr;
                                if (documentName === "ringKnife" || documentName === "plainSoil") {
                                    listCmr.push(dealWithWater(resInd, resInd.index, da, i));
                                } else if (documentName == "switch" || documentName === "reinforc" || documentName === "sleeve" || documentName === "waterproof"  || documentName === "brick") {
                                    listCmr.push(switchWorld(resInd, index, da, i))
                                } else if (documentName === "concrete") {
                                    listCmr.push(concreteWorld(resInd, index, da, i));
                                } else if (documentName === "mortar") {
                                    listCmr.push(mortarWorld(resInd, index, da, i));
                                } else  {
                                    dacmr = multipleCol(resInd, index, da, i);
                                }
                            }

                            // 当外层循环执行完时触发 --- 防止多次触发
                            if (index == key[res].length - 1) {
                                separateWprldArray(listCmr).map((res: any) => {
                                    isExportLocal(res, [tabelData, setTabelData]);
                                    const dataList = NumberOrders(documentName, res, [tabelData, setTabelData]);
                                    documentName != "permeability" && changeDoc(documentName + '.docx', dataList);
                                });
                            }
                        }
                    }
                });
            }
        });
    }

    // 筛选时间
    function screenTime<T>(date: T, dateString: string) {
        let tim = moment(dateString);
        setTimeVal(tim);

        let arr: typeof tabelData = [];
        const checkTime = dateString;
        data.tabelData.map((res: any) => {
            // if (partsVal && res.useParts.includes(partsVal)) {
            // if (!partsVal && !project && !witnessVal && !radiosVal) {
            if (!partsVal && !witnessVal && !radiosVal) {
                if (res.time == checkTime) {
                    console.log(res)
                    arr.push(res);
                }
            } else {
                // if (res.time == checkTime && (res.useParts.includes(partsVal) || res.projectClass === (project) || res.witnessPersonne == witnessVal || res.maintenance == radiosVal)) {
                if (res.time == checkTime && (res.useParts.includes(partsVal) || res.witnessPersonne == witnessVal || res.maintenance == radiosVal)) {
                    console.log(res)
                    arr.push(res);
                }
            }
        });
        setTabelData([]);
        setTimeout(() => {
            setTabelData(arr);
        }, 200)
    }

    // 筛选部位
    function screeningParts<T>({target}: any) {
        const val: string = target.value;
        setPartsVal(val);

        let arr: typeof tabelData = [];
        console.log(val, arr, tabelData, radiosVal)
        data.tabelData.map((res: any) => {
            // if (!project && !timeVal && !witnessVal && !radiosVal) {
            if (!timeVal && !witnessVal && !radiosVal) {
                if (res.useParts.includes(val)) {
                    console.log(res);
                    arr.push(res);
                }
            } else {
                // if (res.useParts.includes(val) && (res.time == timeVal || res.projectClass === (project) || res.witnessPersonne == witnessVal || res.maintenance == radiosVal)) {
                if (res.useParts.includes(val) && (res.time == timeVal || res.witnessPersonne == witnessVal || res.maintenance == radiosVal)) {
                    console.log(res)
                    arr.push(res);
                }
            }
        });

        setTabelData([]);
        setTimeout(() => {
            setTabelData(arr);
        }, 200)
    }

    // 见证人员
    const changeSelectWitness = (ind: number, option: any) => {
        const val: string = option.value;
        setWitnessVal(val);

        let arr: typeof tabelData = [];
        data.tabelData.map((res: any) => {
            console.log(res, val)
            // if (!partsVal && !timeVal && !project && !radiosVal) {
            if (!partsVal && !timeVal && !radiosVal) {
                if (res.witnessPersonne == val) {
                    console.log(res.witnessPersonne);
                    arr.push(res);
                }
            } else {
                if (res.witnessPersonne == witnessVal && (res.time == timeVal || res.useParts.includes(partsVal) || res.maintenance == radiosVal)) {
                // if (res.witnessPersonne == witnessVal && (res.time == timeVal || res.useParts.includes(partsVal) || res.projectClass === (project) || res.maintenance == radiosVal)) {
                    console.log(res)
                    arr.push(res);
                }
            }
        });

        setTabelData([]);
        setTimeout(() => {
            setTabelData(arr);
        }, 200)
    }

    // 筛选项目
    // const changeSelectProject = (ind: number, option: any) => {
    //     console.log(option, ind)
    //     setProject(option.value);
    //
    //     let arr: typeof tabelData = [];
    //     data.tabelData.map((res: any) => {
    //         if (!partsVal && !timeVal && !witnessVal && !radiosVal) {
    //             if (res.projectClass === (option.value)) {
    //                 console.log(res);
    //                 arr.push(res);
    //             }
    //         } else {
    //             if (res.projectClass === (option.value) && (res.time == timeVal || res.useParts.includes(partsVal) || res.witnessPersonne == witnessVal || res.maintenance == radiosVal)) {
    //                 console.log(res)
    //                 arr.push(res);
    //             }
    //         }
    //     });
    //
    //     setTabelData([]);
    //     setTimeout(() => {
    //         setTabelData(arr);
    //     }, 200)
    // }

    return (
        <>
            我是查询界面
            <label htmlFor="">查询条件</label>
            <p>类型:
                {
                    type.map(res => <Button key={res.key} onClick={() => filter(data.tabelData, res.key)}>{res.val}</Button>)
                }
                <Button onClick={() => {
                    setTabelData(data.tabelData);
                    // setProject(undefined);
                    setPartsVal(undefined);
                    setTimeVal(undefined);
                    setRadiosVal(undefined);
                }}>全部</Button>
            </p>
            <p>时间: <DatePicker format="YYYY-MM-DD" onChange={screenTime} value={timeVal}/>
                <span>养护条件：
                   <Radios data={[{"val": "标准养护", "key": "0"}, {"val": "同条件养护", "key": "1"}, {"val": "拆模同条件养护", "key": "2"}]}
                   callBack={curingConditions}></Radios>
                </span>
            </p>
            <p>部位: <Input onChange={screeningParts} value={partsVal}/></p>
            <p>
                {/*项目：*/}
                {/*<Select onChange={changeSelectProject}>*/}
                {/*    {data.settingData.projectClasss && data.settingData.projectClasss.constructor == Array && data.settingData.projectClasss.map((res: number | string) =>*/}
                {/*        <Select.Option value={res} key={res}>{res}</Select.Option>)}*/}
                {/*</Select>*/}
                见证人员：
                <Select onChange={changeSelectWitness}>
                    {data.settingData.witnessPersonnel && data.settingData.witnessPersonnel.constructor == Array && data.settingData.witnessPersonnel.map((res: number | string) =>
                        <Select.Option value={res} key={res}>{res}</Select.Option>)}
                </Select>
            </p>
            <button onClick={exportData}>导出world</button>
            <FileDefaultDel>
                <input className={styles['file-uploader']} type='file' accept='.xlsx, .xls' onChange={uploadExcel}/>
                <Button className={styles['upload-text']}>上传Execl</Button>
            </FileDefaultDel>
            <Button onClick={() => exportExcel(tabelData, detailsDataKey)}>导出Execl</Button>
            <TableDa tabel={[tabelData, setTabelData]}/>
        </>
    );
});

let styles = {
    'file-uploader': 'height:30px',
    'upload-text': 'height:30px',
    'upload-tip': 'display:block'
}