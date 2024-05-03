import axios from 'axios'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/stores/user';
import router from '@/router'


const request = axios.create({
    baseURL: '/api',
    timeout: 5000
})

// request 拦截器，可以自请求发送前对请求做一些处理，比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    let userStore = useUserStore()
    if(userStore.token){
        config.headers['token'] = userStore.token
    }
    nProgress.start()
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器，可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {  
        let res = response.data
        if(response.config.responseType === 'blob'){
            return res
        }
        if(typeof res === 'string'){
            res = res ? JSON.parse(res) : res
        }
        if(!res.flag && res.msg.indexOf("请重新登录")!==-1){
            // ElMessage({
            //     type:'error',
            //     message: res.msg
            // })
            // token过期
            router.push('/login')
        }
        nProgress.done()
        return res;
    },
    error => {
        console.log('err' + error)
        // ElMessage.error('err'+ error)
        return Promise.reject(error)
    }
)


export default request

