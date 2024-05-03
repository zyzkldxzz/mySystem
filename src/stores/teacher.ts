import { defineStore } from "pinia";
import { reqAllTeachers, reqOneTeacher, reqUpdateTeacher } from "@/api/teachers";
import type { TeacherState,teachersResData,teacherResData, teacherInfo } from "@/api/teachers/type";

export const useTeacherStore = defineStore('teacher',{
    state:():TeacherState=>{
        return{
            teachers: [],
            teacher: {
                id: 0,
                username: "",
                realname: "",
                major: "",
                stu1: "",
                stu2: "",
                stu3: "",
                stu4: "",
                stu5: "",
                num: 0,
                want1: "",
                want2: "",
                want3: "",
                want4: "",
                want5: "",
                wnum: 0
            },
        }
    },
    actions: {
        // 获取教师列表
        async getAllTeachers(){
            let result:teachersResData = await reqAllTeachers()
            if(result.flag){
                this.teachers = result.data
                return 'ok'
            }else{
                return Promise.reject(new Error('获取教师列表出错啦！请重新尝试'))
            }
            
        },
        // 获取单个教师信息
        async getTeacherInfo(username:string){
            let result:teacherResData = await reqOneTeacher(username)
            if(result.flag){
                this.teacher = result.data!
                return 'ok'
            }else{
                return Promise.reject(new Error(result.msg))
            }
            
        },
        // 更新教师信息
        async updateTeacherInfo(teacher:teacherInfo){
            let result:teacherResData = await reqUpdateTeacher(teacher)
            if(result.flag){
                return 'ok'
            }else{
                return Promise.reject("更新教师信息失败！请重新尝试")
            }
        }
    }
})