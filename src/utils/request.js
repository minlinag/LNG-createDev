/**
 * 请求封装
 */
import axios from 'axios';
import configUrl from './url.js';
import vue from '../main'
import store from '@/store'
// import ant from 'ant-design-vue';
// console.log(ant)

// import { If } from 'stylus/lib/nodes/index.js';



//  import store from '../store';
//  import cookies from "vue-cookies";
//  import router from "../router/index"



const service = axios.create({
  baseURL: configUrl.baseURL,
  // withCredentials: true, // 当跨域请求时发送cookie
  //timeout: 50000 // 请求超时
});

// //添加请求拦截器   请求接口统一添加token
service.interceptors.request.use(
  config => {
    store.dispatch('spin/spinningState', true)
    //         config.headers['PC-LOGIN-SESSION-ID'] = cookies.get('supplier_token')||'' //后期转换vuex里边进行存储
    //         //  config.headers.PC-LOGIN-SESSION-ID = cookies.get('gys_token');  //请求添加token
    return config;
  },
  error => {
    return Promise.reject(error);
  });

// 响应拦截器
service.interceptors.response.use(
  response => {
    store.dispatch('spin/spinningState', false)
    //如果接口返回token，替换本地旧token
    if (response.headers.token) {
      sessionStorage.setItem("token", response.headers.token);
    }
    let fileName = decodeURIComponent(response.headers["filename"])
    if (fileName != undefined && fileName !== 'undefined') {
      return response
    }
    //自定义设置后台返回code对应的响应方式
    if (response.data.code == 0) { // 请求成功
      this.$message.success(response.msg);
      return response.data;
    } else if (response.data.code == 100) { //token过期
      return response.data;
    } else if (response.data.code == 500) {
      if (response.data.body == "false") {
        vue.$message.error(response.data.msg ? response.data.msg : '服务器错误')
      } else {
        vue.$message.error(response.data.body ? response.data.body : response.data.msg ? response.data.msg : '服务器错误');
      }
      return
    } else {
      return response.data;
    }
  },
  error => {
    store.dispatch('spin/spinningState', false)
    if (error.message) {
      // this.$massage.error('服务器开小差了，请稍后再试!')
      //错误响应
      // alert('服务器开小差了，请稍后再试!')
    }
    return Promise.reject(error);
  }
);
//暴露出封装过的服务
export default service;
