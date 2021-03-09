import React, { memo, useState } from "react";
import { message } from 'antd';
import 'antd/dist/antd.css';
import "./index.css";


const Login = (props: any) => {
    const [passworld, setPassWord] = useState<number | string>();

    function inputChange () {
        const e = window.event || arguments.callee.caller.arguments[1];
        console.log(e.target.value);
        setPassWord(e.target.value);
    }

    const TestRequest = () => {
        console.log(123)
        let url = "password.json"/*json文件url，本地的就写本地的位置，如果是服务器的就写服务器的路径*/
        let request = new XMLHttpRequest();
        console.log(window.history)
        request.open("get", 'password.json');/*设置请求方法与路径*/
        request.send(null);/*不发送数据到服务器*/
        request.onload = function () {/*XHR对象获取到返回信息后执行*/
            if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
                let json = JSON.parse(request.response);
                console.log(json);
                if (json.password == passworld) {
                    props.history.push('/Home/reinforc')
                }
                else {
                    console.log(123123123)
                    message.error('密码错了哦');
                }
            }
        }
    }

    return (
        <div className="login">
            <h1>登录</h1>
            <form>
                <input type="password" name="p" onInput={inputChange} placeholder="Password"  />
                <p></p>
                <button type="button" className="btn btn-primary btn-block btn-large" onClick={TestRequest}>登录</button>
            </form>
        </div>
    )
}

export default memo(Login);