import React, {memo, useState} from 'react';
import Dust from "./dust";
import PlainSoil from "./plainSoil";
import RingKnife from "./ringKnife";
import { Button } from 'antd';

export default memo(() => {
    const [state, setState] = useState<number>(0);

    const Render = () => {
        if (state === 0) {
            return <Dust/>
        }
        else if (state === 1) {
            return <PlainSoil/>
        }
        else if (state === 2) {
            return <RingKnife/>
        }
    }

    return (
        <>
         我是土爸爸
            <p>
                <Button type={state===0?'primary': 'default'} onClick={()=>setState(0)}>灰土</Button>
                <Button type={state===2?'primary': 'default'} onClick={()=>setState(2)}>环刀</Button>
            </p>
            {
                Render()
            }
        </>
    );
})
