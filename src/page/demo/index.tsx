 import React, {memo, useState} from "react";
import { Layout, Menu, List, Input, Button, message } from 'antd';
import 'antd/dist/antd.css';
import {Link } from 'react-router-dom';
import { Routes } from '../../router/route';
import {DateDiff, useGetTime, useMount} from "../../utils/hooks";
import { MaturityModal } from "./component/Modal";
 import styled from "styled-components";
 import {useStore} from "../../store/vueStore/store";
 import {Store} from "../../store/vueStore";
const {renderRoutes} = require('react-router-config');
const { Header, Content, Footer } = Layout;

//修改温度
const ChangeTemperature = styled.div`
    position: fixed;
    top: 15px;
    right: 100px;
    
    &>div {
        display: flex;
        justify-content: space-between;
    }
`

const Home: React.FC = ({ route }: Routes | any) => {
    // 砂浆 弹框
    const { showModal, Modals } = MaturityModal();
    // 混泥土弹框
    const { showModal: concreteShowModal, Modals: ConcreteModal } = MaturityModal();
    // 砂浆到期时间列表
    const [dueTime, setDueTime] = useState<any>([]);
    //混泥土到期时间列表
    const [concreteDueTime, setConcreteDueTime] = useState<any>([]);
    const time = useGetTime();
    let tabelData: string | null = localStorage.getItem('tabelData');

    useMount(() => {
        if (tabelData != null) {
            const data = JSON.parse(tabelData);
            // 砂浆列表
            const dueTimes = [...dueTime];
            // 混泥土列表
            const concreteDueTimes = [...concreteDueTime];
            data.map((res: typeof data, ind: number) => {
                // 处理砂浆到期提示 小于3天
                if (res.keyName === "mortar") {
                    if (DateDiff(time, res.experimentalDate) <= 3) {
                        console.log("_________________________")
                        const obj = res;
                        obj.id = (ind + 1);
                        obj.dateDiff = DateDiff(time, res.experimentalDate);
                        dueTimes.push(obj);
                        setDueTime(dueTimes);
                        showModal();
                    }
                }
                // 处理 混泥土
                if (res.keyName === "concrete") {
                    if (res.maintenance === "标准养护" || res.maintenance === "拆模同条件养护") {
                        if (DateDiff(time, res.experimentalDate) <= 3) {
                            const obj = res;
                            obj.id = (ind + 1);
                            obj.dateDiff = DateDiff(time, res.experimentalDate);
                            concreteDueTimes.push(obj);
                            setConcreteDueTime(concreteDueTimes);
                            concreteShowModal();
                        }
                    }
                    else {
                        if (res.temp >= 550) {
                            console.log('++++++++++++++++++++++')
                            const obj = res;
                            obj.id = (ind + 1);
                            obj.dateDiff = res.temp;
                            concreteDueTimes.push(obj);
                            setConcreteDueTime(concreteDueTimes);
                        }
                    }
                }
            })
        }
    })

    return (
        <BackLayout route={ route.children }>
            {/*砂浆弹框*/}
            <Modals title="砂浆到期提示框" width={1000}>
                <List
                    itemLayout="horizontal"
                    dataSource={dueTime}
                    renderItem={(item: typeof dueTime) => (
                        <List.Item>
                            <List.Item.Meta
                                title={<a href="https://ant.design">{"序号：" + item.id + "类型：" + (item.keyName=="mortar"?"砂浆": "") + "还有" + item.dateDiff + "天到期"}</a>}
                                description={ JSON.stringify(item) }
                            />
                        </List.Item>
                    )}
                />
            </Modals>
            {/*混泥土弹框*/}
            <ConcreteModal title="混泥土到期提示框" width={1000}>
                <List
                    itemLayout="horizontal"
                    dataSource={concreteDueTime}
                    renderItem={(item: typeof concreteDueTime) => (
                        <List.Item>
                            <List.Item.Meta
                                title={<a href="https://ant.design">{"序号：" + item.id + "类型：" + (item.keyName=="concrete"?"混泥土": "") + (item.maintenance == "同条件养护"? item.temp + "度" :("还有" + item.dateDiff + "天到期"))}</a>}
                                description={ JSON.stringify(item) }
                            />
                        </List.Item>
                    )}
                />
            </ConcreteModal>
            {renderRoutes(route.children)}
        </BackLayout>
    );
}

const BackLayout = ({ children, route }: any) => {
    const [val, setVal] = useState<string>( '0' );

    const data = useStore((store: Store) => {
        const { tabelData, checkTabelData, settingData } = store.state;
        return {
            tabelData,
            checkTabelData,
            settingData
        }
    });
    const [tabelData, setTabelData] = useState(data.tabelData);

    let time = useGetTime();
    // 修改温度
    function changeTemp () {
        const e = window.event || arguments.callee.caller.arguments[1];
        setVal(e.target.value);
    }

    const addTemp = () => {
        const arr = [...tabelData];
        arr.map((res) => {
            if (res.maintenance == "同条件养护") {
                console.log("************************", res.temp)
                res.temp = Number(res.temp) +  Number(val);
            }
        });
        setTabelData(arr);
        message.success('修改成功, 刷新页面同步哦');
        localStorage.setItem("tabelData", JSON.stringify(arr));
    }

    // 提交温度
    const submitTemp = () => {
        if (val && val == '0') {
            message.warning('请输入修改值');
        }
        else {
            const temp = localStorage.getItem('changeTemp');
            if (!temp) {
                localStorage.setItem('changeTemp', time);
                addTemp()
            }
            else {
                if (temp == time) {
                    message.warning('今日已修改');
                }
                else {
                    localStorage.setItem('changeTemp', time);
                    addTemp()
                }
            }
        }
        const input = document.getElementById('tempInput');
        // @ts-ignore
        input.value = "";
    }


    return (
        <Layout style={{ height: '100%' }}>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['0']}>
                    {
                        route.map((res: Routes, ind: number) => {
                            return (
                                <Menu.Item key={ind}>
                                    <Link to={`${ res.path }`}>{ res.name }</Link>
                                </Menu.Item>
                            )
                        })
                    }
                </Menu>
                <ChangeTemperature>
                    <div>
                        <Input placeholder="输入今日温度值" id="tempInput"  onChange={changeTemp}/>
                        <Button onClick={submitTemp}>温度录入</Button>
                    </div>
                </ChangeTemperature>
            </Header>
            <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64, height: '100%' }}>
                <div className="site-layout-background" style={{ padding: 24, minHeight: '80%'}}>
                    { children }
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    );
}

export default memo(Home);
