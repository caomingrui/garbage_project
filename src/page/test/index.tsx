import React, {memo, ReactComponentElement, ReactDOM, useState,} from "react";

const Test = () => {

    return (
        <>
            { useTestHocChild(useTestHoc(Test2))() }
            { useTestHocChild(Test2)() }
            <div>我是测试</div>
        </>
    );
}

const Test2 = ({state, setState, testInput, val}: any) => {
    return (
        <>
            <p>{ state===false?'false': 'true' }</p>
            <button onClick={()=>{
                setState(false);}}>点我false</button>
            <button onClick={()=>{
                setState(true)}}>点我true</button>
            { val }
            <input type="text" onInput={testInput} value={val}/>
        </>
    );
};


// Hoc 模式
function useTestHoc(WrappedComponent: any) {
    const useA = (props: any) => {
        console.log(props)
        const [state, setState] = useState<boolean>(false);
        const newProps = {
            state,
            setState,
            ...props
        }

        return  <WrappedComponent {...newProps}/>

    }
    return useA;
}

function useTestHocChild(Component: any) {
    console.log(Component)
    const useB = () => {
        const [val, setValue] = useState<number | string>();
        // console.log(props)
        function testInput(e: any) {
            setValue(e.target.value);
        }

        const newState ={
            val,
            testInput
        }

        return <Component {...newState} />
    }

    return useB;
}

export default memo(Test);
