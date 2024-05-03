export interface teacherInfo{
    id: number
    username: string
    realname: string
    major: string
    stu1: string
    stu2: string
    stu3: string
    stu4: string
    stu5: string
    num: number
    want1: string
    want2: string
    want3: string
    want4: string
    want5: string
    wnum: number
}
export interface teachersResData{
    flag: boolean
    msg: string
    data: Array<teacherInfo>
}
export interface teacherResData{
    flag: boolean
    msg: string
    data: teacherInfo | null
}
export interface TeacherState {
    teachers: Array<teacherInfo>,
    teacher: teacherInfo,
}