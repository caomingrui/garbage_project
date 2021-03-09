import React, { memo, useRef } from 'react';
import {Button, Form, Input, message} from "antd";
import {useCreated} from "../../../utils/hooks";
import {mutations, Store} from "../../../store/vueStore";
import {useStore} from "../../../store/vueStore/store";
import {Modals} from "../component/Modal";
import {ManufacturerStyle, ModalsContext} from "./resources/style";
import { unitsConfig, TabelType } from "./resources/data";
import { useSetTing } from "./resources/hooks"

const Units = () => {
	const formTab: any = useRef(null);
	const data = useStore((store: Store) => {
	    const { state } = store;
	    const { settingData } = state;
	    return {
	        settingData
	    }
	});

	const { manufacturerInput, deleteManufacturer, addManufacturer, manufacturerTotalDa, renderTem } = useSetTing(formTab);
	
	useCreated(() => {
	    formTab.current.setFieldsValue(data.settingData);
	});

	// 表单提交
	const onFinish = (values: TabelType) => {
	    let dataValue = Object.assign(data.settingData, values);
	    mutations.changeSetting(dataValue);
	    localStorage.setItem('setData', JSON.stringify(dataValue));
	    message.success('修改成功');
	}
	
	return (
		<>
			<Form {...layout} ref={ formTab } name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
			     {
			        unitsConfig.map(res => {
			            return (
			                <ManufacturerStyle key={res.key}>
								<div>
									<Form.Item name={res.key} label={res.val} >
										{ res.type?<Input />: <Input readOnly /> }
									</Form.Item>
								</div>
								{ res.type?"": (
									<Modals>
										<ModalsContext>
											{ renderTem(res) }
										</ModalsContext>
									</Modals>
								) }
			                </ManufacturerStyle>
			            )
			        })
			    }
			    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
			        <Button type="primary" htmlType="submit">
						确认提交
			        </Button>
			    </Form.Item>
			</Form>
		</>
	);
}

export default memo(Units);

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
};

const validateMessages = {
    required: '${label} is required!'
};