import React, {useEffect, useReducer, useRef, useState} from "react";
import {Store} from "../store/vuex";
import {useGlobalData} from "./ContextState";
import {message} from 'antd';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import JSZipUtils from 'jszip-utils';
import XLSX from 'xlsx';
import { detailsDataKey } from "../page/demo/component/Descriptions";
// @ts-ignore
import ExportJsonExcel from 'js-export-excel';


type Callback<T> = (val: T | undefined, oldVal: T | undefined) => T;

// 模拟观察者
export function useWatch<T>(da: T, callback: Callback<T> ) {
    const data = useRef<T>();
    useEffect(() => {
        data.current = da;
    })
    return callback(da, data.current);
}


// 强制组件更新
export const useUpdate = () => {
    const [,setCount] = useReducer(s => s + 1, 0);
    return setCount;
}


const reducer = (state: Store, action: Store): Store => {
    state = action
    return state
}

// Hooks context 共享数据
export const useVuex = () => {
    const { store, useManage } = useGlobalData();
    const [ state, setState ] = useReducer(reducer, store);

    const changeDa = JSON.parse(JSON.stringify( state ));
    return {
        fun: useManage( changeDa, setState ),
        state
    }
}


// 生命周期 初始化
type Callbacks<T> = () => void;
export function useCreated<T>(callback: Callbacks<T>): void {
    const [boolValue, setBoolValue] = useState<boolean>(false);

    useEffect(() => {
        if(boolValue) {
            setBoolValue(false);
            callback && callback();
        }
        setBoolValue(true);
    })
}


// 生命周期 组件挂载 触发一次
export function useMount<T>(callback: Callbacks<T>): void {
    useEffect(() => {
        callback && callback();
    },[])
}


// 生命周期 组件卸载 触发
export function useMounted<T>(callback: Callbacks<T>) {
    useEffect(() => {
        return () => callback && callback();
    },[])
}


// 生命周期 组件依赖跟新
export function useUpdata<T>(depend: T, callback: Callbacks<T>): void {
    const [boolValue, setBoolValue] = useState<boolean>(false);
    const Depend = Array.isArray(depend) ? [...depend] : [depend];

    useEffect(() => {
        if(boolValue) {
            setBoolValue(false);
            callback && callback();
        }
        setBoolValue(true);
    }, Depend)
}


//模拟 ahooks useBoolean
type BooleanActions = {
    toggle: (boo: boolean | undefined) => void,
    setTrue: () => void,
    setFalse: () => void,
}

type BooleanBack = [
    state: boolean,
    BooleanActions: BooleanActions
]

export function useBooleans(boo: boolean = false): BooleanBack {
    const [state, setState] = useState<boolean>( boo );

    const toggle = (value: boolean = state) => {
        setState(value);
    }

    const setTrue = () => {
        setState(true);
    }

    const setFalse = () => {
        setState(false);
    }

    return [
        state,
        {
            toggle,
            setTrue,
            setFalse,
        }
    ];
}


// 模拟 Ahooks useClickAway 管理目标元素外点击事件的 Hook。
type TargetArray = [
    arr: string[],
    fn?: () => void,
] | any[]
export function useClickAways<T>(clickAway: MouseEvent | TouchEvent | any, target: string | string [], eventName?: string) {
    const event = eventName || 'click';

    useMount(() => {
        document.addEventListener(event, clickAway);
        let Targets: TargetArray = Array.isArray(target) ? target : [target];
        Targets[0].map((res: string) => {
            let dom: any = document.getElementById(res);
            dom.addEventListener(event, (e: any) => {
                e.stopPropagation();
            })
        });
    });

    useMounted(() => {
        document.removeEventListener<any>(event, clickAway);
    });
}


// 导出World
export function useChangeDoc<T>() {
    // 导出状态
    const [state, setState] = useState<boolean>(false);
    // name 目标文件名称
    // data 待替换字符串
    const changeDoc = (name: string, data: T) => {
        JSZipUtils.getBinaryContent(name, function(error: T, content: number[]) {
            if (error) {
                throw error;
            }
            const zip = new PizZip(content);
            const doc = new Docxtemplater();
            doc.loadZip(zip);
            doc.compile();
            setState(false);
            doc.resolveData(data).then(function () {
                doc.render();
                const out = doc.getZip().generate({
                    type: "blob",
                    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                });
                saveAs(out, name);
                setState(true);
            })
        });
    }
    return {
        state,
        changeDoc
    };
}



// 获取当前时间
export function useGetTime(format: number = 1): string {
    let now = new Date();
    let year: string | number = now.getFullYear(); //得到年份
    let month: string | number = now.getMonth();//得到月份
    let date: string | number = now.getDate();//得到日期
    let hour: string | number = now.getHours();//得到小时
    let minu: string | number = now.getMinutes();//得到分钟
    let sec: string | number = now.getSeconds();//得到秒
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    let time = "";
    //精确到天
    if(format == 1){
        time = year + "-" + month + "-" + date;
    }
    //精确到分
    else if(format == 2){
        time = year + "-" + month + "-" + date+ " " + hour + ":" + minu + ":" + sec;
    }
    //满足委托编号时间
    else if (format === 3) {
        time = String( month ) + date;
    }
    return time;
}



// 获取 唯一 随机数*时间戳，再转化为16进制
export function getTimeUnique (): string {
    let stamp = new Date().getTime();
    return (((1+Math.random())*stamp)|0).toString(16);
}



// 比较时间差
export function DateDiff(faultDate: string, completeTime: string): number{
    let stime =new Date(faultDate).getTime();
    let etime = new Date(completeTime).getTime();
    //两个时间戳相差的毫秒数
    let usedTime = etime - stime;
    //计算出小时数
    let days=Math.floor(usedTime/(24*3600*1000));
    //计算天数后剩余的毫秒数
    let leave1=usedTime%(24*3600*1000);
    //计算相差分钟数
    let hours=Math.floor(leave1/(3600*1000));
    //计算小时数后剩余的毫秒数
    let leave2=leave1%(3600*1000);
    let minutes=Math.floor(leave2/(60*1000));
    let time = days;
    return time;
}



/**
 * 时间延迟天数
 * @param dd 日期
 * @param dadd 推迟天数
 */
export function getthedate(dd: string, dadd: number): string {
    let a = new Date(dd)
    let num: number = a.valueOf();
    let addNum: number = num + dadd * 24 * 60 * 60 * 1000;
    a = new Date(addNum);
    let m: string | number = a.getMonth() + 1;
    if (m.toString().length === 1){
        m ='0'+ m;
    }
    let d: string | number = a.getDate();
    if (d.toString().length === 1) {
        d ='0'+ d;
    }
    return a.getFullYear() + "-" + m + "-" + d;
}



/**
 * 统计委托单数量
 * @param key
 * @param dataList
 */
export function NumberOrders (key: string, dataList: any, tabel: any): typeof dataList{
    let time = useGetTime();
    const data: string | null = localStorage.getItem('ordersNum');
    const [tabelData, setTabelData] = tabel;
    let obj: any;
    // 存在不递增
    if (dataList["orderNo"].length > 11) {
        dataList["orderNo"] = dataList["orderNo"];
    }
    else {
        if (data != null) {
            if (JSON.parse(data)['time'] == time ) {
                obj = JSON.parse(data);
            }
            else {
                obj = { time };
            }
        }
        else {
            obj = {time};
        }
        if (obj[key]) {
            obj[key] ++;
        }
        else {
            obj[key] = 1;
        }
        obj['time'] = time;

        // 拼接委托单编号
        dataList["orderNo"] = dataList["orderNo"] + '-' + String(obj[key] > 10? obj[key]: '0' + obj[key]);

        localStorage.setItem('ordersNum', JSON.stringify(obj));
        const da = localStorage.getItem('tabelData');
        let arr
        if (da != null) {
            arr = JSON.parse(da);
            arr.map((res: any) => {
                if (dataList.key === res.key) {
                    res.orderNo = dataList["orderNo"];
                }
            });
            setTabelData(arr);

            // 存在问题 动态替换不能全局替换 -- 已改
            localStorage.setItem("tabelData", JSON.stringify(arr));
        }
    }

    // 钢筋 | 混泥土原料样品唯一编号
    if (key === "reinforc" || key === "concrete" || key === "mortar") {
        dataList = generatedNumber<typeof dataList>(dataList);
    }
    return dataList;
}



// 导出前修改是否导出
export const isExportLocal = (dataList: any, tabel: any) => {
    const [tabelData, setTabelData] = tabel;
    let da: string | null = localStorage.getItem('tabelData');
    const arr = da && JSON.parse(da);
       arr && arr.map((res: any) => {
            if (dataList.key === res.key) {
                res.isExport = true;
            }
        });
        setTabelData(arr);
        localStorage.setItem("tabelData", JSON.stringify(arr));
    }



// 判断委托单列数， 生成对应编号
function generatedNumber<T> (dataList: any): T  {
    if (dataList['ind2']) {
        dataList["sampleNumber"] = dataList["orderNo"].slice(3, dataList["orderNo"].length);
        dataList["sampleNumber1"] = dataList["orderNo"].slice(3, dataList["orderNo"].length);
        dataList["sampleNumber2"] = dataList["orderNo"].slice(3, dataList["orderNo"].length);
    }
    else if (dataList['ind1']) {
        dataList["sampleNumber"] = dataList["orderNo"].slice(3, dataList["orderNo"].length);
        dataList["sampleNumber1"] = dataList["orderNo"].slice(3, dataList["orderNo"].length);
        dataList["sampleNumber2"] = "";
    }
    else {
        dataList["sampleNumber"] = dataList["orderNo"].slice(3, dataList["orderNo"].length);
        dataList["sampleNumber1"] = "";
        dataList["sampleNumber2"] = "";
    }
    return dataList;
}



// 导出execel  待改善
export function useNewExportExcel() {
    const [state, setState] = useState<boolean>(false);
    function exportExcel (data: any, title: any) {
            let option: any = {};  //option代表的就是excel文件
            let dataTable: any = [];  //excel文件中的数据内容
           const list = Object.keys(title).reduce((arr: any, item: string) => {
               let obj = {
                   title: title[item],
                   dataIndex: item,
                   key: item
               }
               console.log(obj)
               arr.push(obj);
                return arr
           }, []);

            data.map( (res: any) => {
                let obj: any = {};
                list.map((item: any) => {
                    obj[item.title] = res[item.key]
                })
                dataTable.push(obj)
            });

            option.fileName = '测试';  //excel文件名称
            option.datas = [
                {
                    sheetData: dataTable,  //excel文件中的数据源
                    sheetName: '测试',  //excel文件中sheet页名称
                    sheetFilter: Object.values(title),  //excel文件中需显示的列数据
                    sheetHeader: Object.values(title),  //excel文件中每列的表头名称
                }
            ]

            let toExcel = new ExportJsonExcel(option);  //生成excel文件
            toExcel.saveExcel();  //下载excel文件
            setState(true);
    }

    return {
        exportExcel
    }
}



// 导入Excel 待改善
export const useInportExcel = (tabel: any) => {
    const [tabelData, setTabelData] = tabel;

    const uploadExcel = (file: any, fileList?: any[]) => {
            const { files } = file.target;
            // 通过FileReader对象读取文件
            const fileReader = new FileReader();
            fileReader.onload = event => {
                try {
                    const { result }: any = event.target;
                    // 以二进制流方式读取得到整份excel表格对象
                    const workbook = XLSX.read(result, { type: 'binary' });
                    // 存储获取到的数据
                    let data: any = [];
                    // 遍历每张工作表进行读取（这里默认只读取第一张表）
                    for (const sheet in workbook.Sheets) {
                        // esline-disable-next-line
                        if (workbook.Sheets.hasOwnProperty(sheet)) {
                            // 利用 sheet_to_json 方法将 excel 转成 json 数据
                            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                            // break; // 如果只取第一张表，就取消注释这行
                        }
                    }
                    // 最终获取到并且格式化后的 json 数据
                    const arr: any = [];
                    data.map((res: any) => {
                        let obj: any = {};
                        for (let i in res) {
                            for (const j in detailsDataKey) {
                                if (i === detailsDataKey[j]) {
                                    obj[j] = res[i]
                                }
                            }
                        }
                        arr.push(obj)
                    })
                    message.success('上传成功！');
                    let tabelDataList: string | null = localStorage.getItem('tabelData');
                    let arrTabel = tabelDataList? JSON.parse(tabelDataList): [];
                    const len = arrTabel.length;
                    const obj: any = {};
                    arrTabel.map((item: any) => {
                        obj[item.key] = item.key;
                    });
                    arr.map((res: any) => {
                        if (len != 0) {
                            if (!obj[res.key]) {
                                arrTabel.push(res);
                            }
                        }
                        else {
                            arrTabel.push(res);
                        }
                    });
                    setTabelData(arr);
                    localStorage.setItem('tabelData', JSON.stringify(arrTabel));
                    setTimeout(() => {
                        window.history.go(0)
                    }, 200)
                } catch (e) {
                    // 这里可以抛出文件类型错误不正确的相关提示
                    message.error('文件类型不正确！');
                }
            };

            // 以二进制方式打开文件
            fileReader.readAsBinaryString(files[0]);
    };

    return {
        uploadExcel
    }
}



// 拼凑world 每页字符串
export function separateWprldArray (listCmr: any, num: number = 3)  {
    let h = num;
    const arr = [listCmr[h]];
    const ffg = JSON.parse(JSON.stringify(listCmr));
    for (let y = 2; h < ffg.length; y++) {
        h += y * num;
        if (ffg[h] != undefined) {
            arr.push(listCmr[h]);
        }
    }
    arr.push(ffg[listCmr.length - 1]);
    return arr;
}