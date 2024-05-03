import request from "@/utils/request";
import type { loginForm,loginResponseData } from "./type";

enum API{
    LOGIN_URL = '/users/login',
    GETUSERINFO_URL = '/users/getuser',
    UPDATEUSERINFO_URL = '/users',
    REGISTER_URL = '/users/register'
}

export const reqLogin = (data:loginForm)=>request.post<any,loginResponseData>(API.LOGIN_URL,data);

export const reqGetUserInfo = ()=>request.get<any,loginResponseData>(API.GETUSERINFO_URL)

export const reqChangeUserInfo = (data:loginForm)=>request.put<any,loginResponseData>(API.UPDATEUSERINFO_URL,data)

export const reqRegister = (data:loginForm)=>request.post<any,loginResponseData>(API.REGISTER_URL,data)
