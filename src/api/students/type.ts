import { reactive, ref } from "vue"

export interface RuleForm {
    username: string
    realname: string
    sex: string
    birthyear: string
    phone: string
    postbox:string
    jtaddress:string
    txaddress:string
    school: string
    undermajor: string
    nowmajor: string
    workplace: string
    job:string
    ifsuper:string
    ranklevel:number
    score: string
    first: string
    finterest: string
    second: string
    sinterest: string
    third:string
    tinterest:string
    others1: string
    others2: string
    others3: string
    tutor: string
}

export interface studentsResData {
    flag: boolean
    data: Array<RuleForm>
    msg: string
}

export interface studentResData {
    flag: boolean
    data: string | null
    msg: string
}

export interface StudentState {
    students: Array<RuleForm>
}

export const form = ref<RuleForm>({
    username: '',
    realname: '',
    sex: '',
    birthyear: '',
    phone: '',
    postbox:'',
    jtaddress:'',
    txaddress:'',
    school: '',
    undermajor: '',
    nowmajor: '',
    workplace: '',
    job:'',
    ifsuper:'',
    ranklevel: 0,
    score:'',
    first: '',
    finterest: '',
    second: '',
    sinterest: '',
    third:'',
    tinterest:'',
    others1: '',
    others2: '',
    others3: '',
    tutor: ''
})