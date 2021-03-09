import React, {Attributes, ComponentClass, FunctionComponent, memo, ReactElement, ReactNode} from "react";
import {useCreated, useMount} from "../../utils/hooks";
import { Renderer } from 'react-dom';

const RenderPrinciple = () => {
    // console.log(React.createElement('a', null, 'asdasd'))

    useMount(() => {
        renderElement(A(), document.getElementById("test"));
    })

    return (
        <>
            <div>father</div>
            <p>childern</p>
            <div id="test">

            </div>
        </>
    );
}

const A = () => {

    const clickTest = () => {
        console.log('我被点击了')
    }

    const blurTest = () => {
        console.log('我失去焦点了')
    }

    return (
        <div>
            <p>我是p</p>
            <span>我是span</span>
            <button onClick={clickTest} onBlur={blurTest}>莫挨老子</button>
            {/*{*/}
            {/*    React.createElement()*/}
            {/*}*/}
        </div>
    );
}


function renderElement<T>(vnode: any, root: any) {
    console.log(vnode)
    console.log(vnode.constructor)
    console.log(vnode.type)
    let element: any;
    if (vnode.constructor !== Object) { // 非标签处理
        element = document.createTextNode(vnode);
    }
    else { // 标签处理
        element = document.createElement(vnode.type);

        Object.keys(vnode.props).map(res => { // 遍历节点props
            if (res === 'children') {
                if (vnode.props.children.constructor !== Array) { // 不存在子节点
                    element.innerHTML = vnode.props.children;
                }
                else { // 存在递归
                    vnode.props.children.map((res: Renderer )=> {
                        renderElement(res, root);
                    });
                }
            }
            else {
                const eventType = res.slice(2, res.length).toLowerCase(); // 分割事件
                element.addEventListener(eventType, vnode.props[res]); // 绑定事件
            }
        });
    }
    root.appendChild(element);
}

export default memo(RenderPrinciple);
