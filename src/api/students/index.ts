import request from "@/utils/request";
import type { RuleForm, studentResData, studentsResData } from "./type";

enum API {
    STUDENTINFO_URL = '/students',
    STUDENTSPAGE_URL = '/students/page'
}

export const reqPostStudent = (data:RuleForm)=>request.post<any,studentResData>(API.STUDENTINFO_URL,data)

export const reqGetStudents = ()=>request.get<any, studentsResData>(API.STUDENTINFO_URL)

export const reqPutStudent = (data:RuleForm)=>request.put<any,studentResData>(API.STUDENTINFO_URL,data)

export const reqGetStudentsByPage = (pageNum:number,pageSize:number,realname:string) => request({url:`${API.STUDENTSPAGE_URL}`,method:'get',params:{pageNum,pageSize,realname}})