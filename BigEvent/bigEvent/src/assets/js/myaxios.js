import axios from 'axios'
var myaxios = {}
myaxios.install = function (Vue) {
    // 1. 添加全局方法或属性
    //设置统一的基地址
    axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"
    // axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('token')
    axios.interceptors.request.use(function (config) {
        // Do something before request is sent
        console.log(config.headers.Authorization)
        console.log(config.url)
        if (!config.url.includes('login')) {
            config.headers.Authorization = window.localStorage.getItem('token')
        }
        return config;
    })
    Vue.prototype.$http = axios
}
export default myaxios