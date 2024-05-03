import { defineStore } from "pinia";
import { reqGetStudents,reqGetStudentsByPage,reqPutStudent } from "@/api/students";
import type { studentsResData, StudentState,RuleForm,studentResData} from "@/api/students/type";

export const useStudentStore = defineStore('student', {
    state:():StudentState => {
        return {
            students:[],
        }
    },
    actions: {
        async getStudents(){
            let result:studentsResData = await reqGetStudents()
            if(result.flag){
                this.students = result.data
                return 'ok'
            }else{
                return Promise.reject("获取学生列表失败！请重新尝试")
            }
        },
        async updateStudntInfo(student:RuleForm){
            let result:studentResData = await reqPutStudent(student)
            if(result.flag){
                return 'ok'
            }else{
                return Promise.reject("更新学生信息失败！请重新尝试")
            }
        }
    }
})
