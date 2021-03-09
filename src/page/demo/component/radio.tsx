import { Radio } from 'antd';
import React, { useState } from 'react';

type Data = {
    key: number | string,
    val: number | string
}

export const useRadio = () => {
    const [value, setValue] = useState<any>(1);

    const Radios = ({ data, callBack }: any) => {
        const onChange = (e: any) => {
            callBack && callBack(e.target.value);
            setValue(e.target.value);
        };

        return (
            <Radio.Group onChange={onChange} value={value}>
                {
                    data.map((res: Data) => <Radio key={res.key} value={res.val}>{ res.val }</Radio>)
                }
            </Radio.Group>
        );
    }

    return {
        value,
        setValue,
        Radios
    }
};