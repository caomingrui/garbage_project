import { reactive } from "@vue/reactivity";

export type StatesData = typeof state.tabelData;

//测试 count ++
const changeCount = (): void => {
    state.count += 1;
}

// 保存setting 数据
function changeSetting<T>(states: T) {
    console.log(states)
    state.settingData = states;
}

// 添加表单数据
function addTabelData<T>(states: T) {
    console.log('------------------------------');
    let data = JSON.parse(JSON.stringify(states));
    state.tabelData.push(data);
    localStorage.setItem('tabelData', JSON.stringify(state.tabelData));
}

// 添加选中表单数据
function addCeckTabel<T>(states: T): void {
    console.log('++++++++++++++++++++++++++++++++++')
    console.log(states)
    state.checkTabelData = states;
}

// 删除表单数据
function deleteFormData(newStates: StatesData) {
    state.tabelData = newStates;
}

// vue3.0特性 + react 测试版 1.0.0
export interface State {
    count: number,
    settingData: any,
    tabelData: any,
    checkTabelData: any
}

// store 数据
const state: State = reactive({
    count: 0,
    settingData: JSON.parse(<string>localStorage.getItem('setData'))? JSON.parse(<string>localStorage.getItem('setData')): {},
    tabelData: JSON.parse(<string>localStorage.getItem('tabelData'))? JSON.parse(<string>localStorage.getItem('tabelData')): [],
    checkTabelData: []
});


// 方法集
export const mutations = {
    changeCount,
    changeSetting,
    addTabelData,
    addCeckTabel,
    deleteFormData
}


export const store = {
    state
}

export type Store = typeof store;
