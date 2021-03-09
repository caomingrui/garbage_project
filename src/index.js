import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { GlobalRouter } from './router/router';
import routers from './router';
import { store } from './store/vueStore/index';  // vue3.0 双向数据
import { Provider, ProviderDa, ProviderHash } from './utils/ContextState'; // 公共context 集
import State from "../src/store/vuex/index";
import route from "./router/route";
// import Test from './page/text'; // 官方指定测试区域
import { HashRouter } from 'react-router-dom';

ReactDOM.render(
      <HashRouter> {/* hash 路由*/}
          <Suspense fallback={ <div>努力加载中 ......</div> }>
              <ProviderDa value={ State }>
                  <Provider value={ store }>
                      {/*<GlobalRouter routerDate={ routers }>// 假路由 exe不适用*/}
                      {/*    <Test/>*/}
                      {/*</GlobalRouter>*/}
                      <ProviderHash route={ route }></ProviderHash> {/* hash 路由*/}
                  </Provider>
              </ProviderDa>
          </Suspense>
      </HashRouter>,
  document.getElementById('root')
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// const
