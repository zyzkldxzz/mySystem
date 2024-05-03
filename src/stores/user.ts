import { defineStore } from 'pinia'
import { reqGetUserInfo, reqLogin, reqChangeUserInfo, reqRegister } from '@/api/users'
import type { loginForm,loginResponseData, UserState,dataType } from '@/api/users/type'
import { SET_TOKEN,GET_TOKEN,REMOVE_TOKEN } from '@/utils/token'

export const useUserStore = defineStore('user', {
  state:():UserState=>{
    return {
      token: GET_TOKEN(),
      userInfos: {
        token: '',
        id: 0,
        avatar: '',
        username: '',
        password: '',
        role: ''
      },
    }
  },
  actions:{
    // 用户登录
    async userLogin(data:loginForm){
      let result:loginResponseData = await reqLogin(data)
      // console.log(result)
      if(result.flag){
        this.token = result.data!.token
        // 持久化存储token
        SET_TOKEN(result.data!.token)
        return 'ok'
      }else{
        return Promise.reject(new Error(result.msg))
      }
    },
    // 获取用户信息
    async userInfo(){
      let result:loginResponseData = await reqGetUserInfo();
      // console.log(result.data);
      if(result.flag){
        this.userInfos= result.data!;
        return 'ok'
      }else{
        return Promise.reject(new Error(result.msg))
      }
    },
    // 修改用户信息
    async userUpdateAvatar(data:dataType){
      let result:loginResponseData = await reqChangeUserInfo(data);
      if(result.flag){
        return 'ok'
      }else{
        return Promise.reject(new Error(result.msg))
      }
    },
    // 退出登录
    userLogout(){
      this.token = ""
      this.userInfos = {
        token: '',
        id: 0,
        avatar: '',
        username: '',
        password: '',
        role: ''
      }
      REMOVE_TOKEN()
    },
    // 用户注册
    async userRegister(data:loginForm){
      let result:loginResponseData = await reqRegister(data)
      console.log(result);
      if(result.flag){
        return 'ok'
      }else{
        return Promise.reject(new Error(result.msg))
      }
      
    } 
  },
  getters:{

  }
})
