import React, { useState, memo } from 'react';
import {Modal, Button, Space} from 'antd';

const ModalView = ({ children }: any) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Space size="middle">
                <a onClick={showModal}>查看</a>
            </Space>
            <Modal title="详细" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={ '80%' }>
                { children }
            </Modal>
        </>
    );
};

export default memo(ModalView);

// 设置弹框
export const Modals = ( { children}: any ) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                录入
            </Button>
            <Modal title="录入" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                { children }
            </Modal>
        </>
    );
};

type Callback<T> = () => T;

// 日期到期弹框 | 共用
export function MaturityModal<T> (callBack?: Callback<T> | any)  {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    function handleOk() {
        setIsModalVisible(false);
        callBack && callBack();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const Modals = ({children, title, width}: any) => {
        return (
            <>
                <Modal width={width} title={ title } visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    { children }
                </Modal>
            </>
        );
    }

    return {
        showModal,
        handleOk,
        Modals
    }
}