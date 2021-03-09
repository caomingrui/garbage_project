import React, {memo} from "react";
import {StatesData} from "../../../store/vueStore";
import {Space, Radio, Table, Input, message } from "antd";
import { MaturityModal } from "../component/Modal";


// 根据批量生成下一组
export const BlockSort = (total: any, val: StatesData, num: number, unit: string = "") => {
    let ind = total[val.keyName].length;
    const batch = val.batch;
    if (batch > num) {
        for (let i = 0; i <= Math.floor(batch/num); i++) {
            if ((batch - (num * i) > num? num : batch - (num * i)) == 0) return;
            let obj: any = {};
            Object.keys(val).map(res => {
                obj[res] = val[res];
                obj['index'] = ind + i;
                obj['batch'] = (batch - (num * i) > num? num : batch - (num * i));
                obj['limit'] = num;
                obj['unit'] = unit;
            });
            total[val.keyName].push(obj);
        }
    }
    else {
        val.index = Math.abs( ind );
        total[val.keyName].push(JSON.parse(JSON.stringify(val)));
    }
}


// 修改温度BUT 改为修改报告编号
export const ChangeBut = ({ dataList, tabel, keys, title }: any) => {
    const [tabelData, setTabelData] = tabel;
    // 温度值
    let num = 0;

    const { showModal,  Modals } = MaturityModal(() => {
        console.log(num, dataList);
        const arr = [...tabelData];
        arr.map((res: typeof tabelData) => {
            if (res.key === dataList.key) {
                res[keys] = num;
            }
        });
        setTabelData(arr);
        message.success('修改成功');
        localStorage.setItem('tabelData', JSON.stringify(tabelData));
    });

    function changeInput () {
        const e = window.event || arguments.callee.caller.arguments[1];
        num = e.target.value;
    }

    return (
        <>
            <Modals title={title  + "修改"} width={300}>
                { title }： <Input placeholder={"请输入您要修改的" + title } onInput={ changeInput } defaultValue={ dataList[keys] }/>
            </Modals>
            <a style={{marginLeft: "10px"}} onClick={ showModal }>修改{ title }</a>
        </>
    );
}


// 资料交接情况
export const DataTransfer = ({ daKey, tabel, val }: any) => {
    const [value, setValue] = React.useState<number>(val);
    const [tabelData, setTabelData] = tabel;

    function onChange (e: any) {
        setValue(e.target.value);
        const arr = [...tabelData];
        arr.map((res: typeof tabelData) => {
            if (res.key === daKey) {
                res.dataTransfer = e.target.value;
            }
        });
        setTabelData(arr);
        message.success('修改成功');
        localStorage.setItem('tabelData', JSON.stringify(tabelData));
    };

    return (
        <Radio.Group onChange={onChange} value={value}>
            <Radio value={1}>监理</Radio>
            <Radio value={2}>资料员</Radio>
        </Radio.Group>
    );
}