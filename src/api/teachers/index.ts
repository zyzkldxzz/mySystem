import request from '@/utils/request'
import type { teacherResData, teachersResData, teacherInfo } from './type'

enum API{
    GETALLTEACHERS_URL = '/teachers',
    GETONETEACHER_URL = '/teachers/u',
    POSTTEACHRT_URL = '/teachers/register',
    TEACHRTSPAGE_URL = '/teachers/page'
}

export const reqAllTeachers = ()=>request.get<any,teachersResData>(API.GETALLTEACHERS_URL)

export const reqOneTeacher = (username:string)=>request.get<any, teacherResData>(`${API.GETONETEACHER_URL}/${username}`)

export const reqUpdateTeacher = (data:teacherInfo) => request.put<any,teacherResData>(API.GETALLTEACHERS_URL, data)

export const reqRegisterTeacher = (data:teacherInfo)=>request.post<any,teacherResData>(API.POSTTEACHRT_URL,data)

export const reqGetTeachersByPage = (pageNum:number,pageSize:number,realname:string) => request({url:`${API.TEACHRTSPAGE_URL}`,method:'get',params:{pageNum,pageSize,realname}})
