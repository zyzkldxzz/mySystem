<template>
  <div class="background">
    <div class="container">
      <p>欢迎登录</p>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input v-model="form.username" :prefix-icon="Avatar" placeholder="用户名"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" :prefix-icon="Lock" show-password placeholder="密码"/>
        </el-form-item>
        <el-form-item prop="role">
          <el-radio-group v-model="form.role">
            <el-radio value="student">学生</el-radio>
            <el-radio value="teacher">教师</el-radio>
            <el-radio value="admin">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button class="mybtn" type="success" plain @click="login(formRef)" :loading="loading">登录</el-button>
        </el-form-item>
      </el-form>
      <el-button link type="success" @click="openDrawer">注册</el-button><br>
      <el-drawer v-model="drawer" title="注册" :close-on-click-modal="false">
        <el-form ref="formRef2" :model="form2" :rules="rules" :inline="true" label-width="auto" >
          <el-form-item prop="username" label="用户名：">
            <el-input v-model="form2.username" :prefix-icon="Avatar" placeholder="请输入"/>
          </el-form-item>
          <el-form-item prop="password" label="密码：">
            <el-input v-model="form2.password" :prefix-icon="Lock" placeholder="请输入"/>
          </el-form-item>
          <el-form-item prop="role" label="角色：">
            <el-radio-group v-model="form2.role">
              <el-radio value="student">学生</el-radio>
              <el-radio value="teacher">教师</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-form ref="formRef3" :model="form3" :rules="rules3" :inline="true" label-width="auto" v-if="form2.role=='teacher'">
          <el-form-item prop="realname" label="真实姓名：" >
            <el-input v-model="form3.realname" placeholder="请输入"/>
          </el-form-item>
          <el-form-item prop="major" label="所属专业：" >
            <el-input v-model="form3.major" placeholder="请输入"/>
          </el-form-item>
        </el-form>
        <el-button type="success" plain style="margin-left: 10px; width:68%" @click="register">注册</el-button>
        <span class="tips">管理员角色 账号和密码均为admin
          <br>教师角色 常用测试账号001 密码1234
        </span>
      </el-drawer>
    </div>
  </div>
</template>

<script lang="ts" setup name='Login'>
  import { Avatar,Lock} from '@element-plus/icons-vue'
  import {reactive,ref, watch} from 'vue'
  import { useUserStore } from '@/stores/user';
  import { useRouter } from 'vue-router';
  import { getTime } from '@/utils/time';
  import type { FormInstance, FormRules } from 'element-plus'
  import type { teacherInfo, teacherResData } from '@/api/teachers/type';
  import { reqRegisterTeacher } from '@/api/teachers';
  let userStore = useUserStore()
  let $router = useRouter()
  let loading = ref(false)
  let drawer = ref(false)
  interface RuleForm {
    username: string
    password: string
    role: string
  }
  let formRef = ref<FormInstance>()
  let formRef2 = ref<FormInstance>()
  let formRef3 = ref<FormInstance>()
  let form = reactive<RuleForm>({
    username:'',
    password:'',
    role:'',
  })
  let form2 = reactive<RuleForm>({
    username:'',
    password:'',
    role:'',
  })
  let form3 = reactive<teacherInfo>({
    id: 0,
    username: '',
    realname: '',
    major: '',
    stu1: '',
    stu2: '',
    stu3: '',
    stu4: '',
    stu5: '',
    num: 0,
    want1: '',
    want2: '',
    want3: '',
    want4: '',
    want5: '',
    wnum: 0
  })
  const rules = reactive<FormRules<RuleForm>>({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    role: [
      { required: true, message: '请选择用户角色', trigger: 'blur' }
    ]
  })
  const rules3 = reactive<FormRules<teacherInfo>>({
    realname: [
      { required: true, message: '请输入真实姓名', trigger: 'blur' }
    ],
    major: [
      { required: true, message: '请输入所属专业', trigger: 'blur' }
    ],
  })
  const login = async(formE1: FormInstance | undefined)=>{
    if (!formE1) return
    // 表单校验
    await formE1.validate(async(valid, fields) => {
      if (valid) {
        // 登录按钮上的加载效果
        loading.value = true
        try {
          await userStore.userLogin(form)
          $router.push('/')
          ElMessage.success(`Hi, ${getTime()}好！欢迎登录`)
          loading.value = false
        } catch (error) {
          ElMessage.error((error as Error).message)
          loading.value = false
        }
      }
    })
  }
  const openDrawer = ()=>{
    drawer.value = true
  }
  const register = async()=>{
    await formRef2.value!.validate(async(valid, fields)=>{
      if(valid){
        if(form2.role == 'student'){
          try {
            await userStore.userRegister(form2)
            ElNotification.success("注册成功")
            drawer.value = false
          } catch (error) {
            ElNotification.error((error as Error).message)
          }
          formRef2.value!.resetFields()
        }else if(form2.role == 'teacher'){
          await formRef3.value?.validate(async(valid,fields)=>{
            if(valid){
              try {
                await userStore.userRegister(form2)
                form3.username = form2.username
                let result:teacherResData = await reqRegisterTeacher(form3)
                if(result.flag){
                  ElNotification.success("注册成功")
                  drawer.value = false
                }else{
                  throw new Error("注册失败！请重新尝试")
                }
              } catch (error) {
                ElNotification.error((error as Error).message)
              }
              formRef2.value!.resetFields()
              formRef3.value!.resetFields()
            }
          })
        }     
      }
    })
  }
</script>

<style scoped>
  .background {
    background: url("../assets/background.jpg");
    width:100%;
    height:100%;
    position: fixed;
    background-size: cover;
  }
  .container {
    width: 400px;
    margin: 0 auto;
    margin-top: 10%;
    padding: 20px 40px 30px 40px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.405);
    box-shadow: 0px 0px 5px rgba(0, 128, 0, 0.436);
  }
  .container p {
    color: darkgreen; 
    font-size: 32px; 
    font-family: 华文新魏, 楷体, 宋体;
    text-align: center; 
    padding-bottom: 20px
  }
  .container>.el-button {
    float: right;
    font-size: 16px;
  }
  .container>.el-button:hover {
    font-weight: bold;
    color:#67C23A;
  }
  .mybtn {
    width: 100%; 
    font-weight: bold; 
    letter-spacing: 10px;
  }
  .tips {
    color:red;
    font-size: 14px;
    position: absolute;
    bottom: 20px;
    left:20px;
  }
  ::v-deep(.el-radio__input.is-checked + .el-radio__label) {
    color: darkgreen !important;
  }
  ::v-deep(.el-radio__input.is-checked .el-radio__inner) {
    background: limegreen !important;
    border-color: rgb(1, 197, 1) !important;
  }
  ::v-deep(.el-input) {
    --el-input-focus-border-color: rgb(1, 197, 1);
  }
  ::v-deep(.el-drawer__header) {
    width: 100%;
    font-weight: bold;
    color: #67C23A;
  }
  ::v-deep(.el-drawer){
    background-color: #d9ecff;
  }
  ::v-deep(.el-radio__inner:hover){
    border-color: #67C23A;
  }
</style>