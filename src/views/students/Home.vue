<template>
  <div class="head">
    <el-steps :active="active" align-center finish-status="success">
      <el-step title="Step 1" description="基本信息" />
      <el-step title="Step 2" description="有关信息" />
      <el-step title="Step 3" description="选择导师" />
      <el-step title="Step 4" description="其他个人资料" />
    </el-steps>
  </div>
  <div class="content">
    <keep-alive>
      <component :is="component" ref="myForm" :disAble="disable" :datas="fullForm"/>
    </keep-alive>
  </div>
  <div class="dane">
    <div class="embed" v-show="tutor!=''">
      您的导师是：{{tutor}}
    </div>
    <el-button @click="back" type="success" :disabled="button1">上一步</el-button>
    <el-button @click="next" type="success" :disabled="button2">{{ btnText }}</el-button>
  </div>
  <el-button type="success" :icon="Edit" class="editBtn" @click="editForm" v-show="disable" :disabled="isEditable"></el-button>
</template>
<script setup lang="ts">
  import Step1 from "@/views/students/Step1.vue"
  import Step2 from "@/views/students/Step2.vue"
  import Step3 from "@/views/students/Step3.vue"
  import Step4 from "@/views/students/Step4.vue"
  import {onMounted, reactive, ref, watchEffect, shallowRef, inject} from 'vue'
  import type { RuleForm } from "@/api/students/type"
  import { reqPostStudent, reqGetStudents, reqPutStudent } from "@/api/students"
  import { useUserStore } from "@/stores/user"
  import { Edit } from '@element-plus/icons-vue'
  let userStore = useUserStore()
  let myForm = ref()
  let active = ref(0)
  let button1 = ref(true)  // 上一步按钮是否可用
  let button2 = ref(false)  // 下一步按钮是否可用
  let component = shallowRef(Step1)  // 动态子组件切换
  let btnText = ref('下一步')  // 下一步按钮显示文本
  let disable = ref(false)  // props参数，控制表单可否编辑
  let flag = ref(0)   //数据库是否已有该学生信息
  let tutor = ref("")
  let isEditable = ref(false)
  let fullForm = reactive<RuleForm>({
    username: '',
    realname: '',
    sex: '',
    birthyear: '',
    phone: '',
    postbox: '',
    jtaddress: '',
    txaddress: '',
    school: '',
    undermajor: '',
    nowmajor: '',
    workplace: '',
    job: '',
    ifsuper: '',
    ranklevel: 0,
    score: '',
    first: '',
    finterest: '',
    second: '',
    sinterest: '',
    third: '',
    tinterest: '',
    others1: '',
    others2: '',
    others3: '',
    tutor: ""
  })
  const next = async()=>{
    await myForm.value.formRef.validate(async(valid:Boolean) =>{      
      if(valid){
        active.value++;
        // 数据库中没有提交记录，post请求
        if(flag.value==0){
          fullForm = {...fullForm,...myForm.value.form}
          if(active.value === 4){
            button2.value = true
            fullForm.username = userStore.userInfos!.username
            let result = await reqPostStudent(fullForm)
            if(result.flag == true){
              ElMessage.success('提交成功')
              load()
            }
          }
          // 数据库中有提交记录，put请求
        }else if(flag.value==1){
          fullForm = {...fullForm,...myForm.value.form}
          if(active.value === 4){
            button2.value = true
            let result = await reqPutStudent(fullForm)
            console.log(result);
            if(result.flag == true){
              ElMessage.success('修改成功')
              load()
            }
          }
        }
        return 'ok'
      }
    })
  }
  const back = ()=>{
    active.value--;
  }
  const load = async() => {
    let username = userStore.userInfos!.username
    try{
      let result = await reqGetStudents()
      let userList = result.data.map((user: { username: string }) => user.username)   
      if(userList.indexOf(username) !== -1){
        for (let i = 0; i < userList.length; i++) {
          if (result.data[i].username === username) {
            fullForm = result.data![i]
            tutor.value = result.data![i].tutor
            break
          }
        }
        disable.value = true
        flag.value = 1
      }else{
        return
      }
    }catch(e){
      ElMessage.error('获取用户信息出错了！请重新尝试')
    }
  }
  const editForm = ()=>{
    disable.value = false
  }
  onMounted(()=>{
    load()
  })
  watchEffect(()=>{
    if(active.value === 0){
      button1.value = true
      button2.value = false
      component.value = Step1
      btnText.value = '下一步'
    }else if(active.value === 1){
      button1.value = false
      button2.value = false
      component.value = Step2
      btnText.value = '下一步'
    }else if(active.value === 2){
      button1.value = false
      button2.value = false
      component.value = Step3
      btnText.value = '下一步'
    }else if(active.value === 3){
      button1.value = false
      component.value = Step4
      btnText.value = '提交'
      // 如果处于不可编辑状态，提交按钮则不可用
      if(disable.value == true){
        button2.value = true
      }else{
        button2.value = false
      }
    }
    if(tutor.value != ''){
      isEditable.value = true
    }
  })

</script>

<style scoped>
  .stepContainer{
    height: 60vh;
    width: 50%;
    margin-left: 25%;
    margin-top: 40px;
    padding-top: 40px;
    padding-left: 90px;
    border: 2px solid darkgreen;
    border-radius: 10px;
    box-shadow: 0 10px 20px grey;
    overflow-y: auto;
  }
  .head{
    flex: 0 0 auto;
    margin-top: 35px;
    margin-bottom: 10px;
  }
  .content{
    flex: 1 0 auto;
    height: 62vh;
  }
  .dane{
    display: flex;
    justify-content: center;
  }
  .embed{
    width: 200px;
    height: 45px;
    margin-left: 20px;
    padding-top: 10px;
    padding-left: 10px;
    border: 2px solid darkgreen;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 2px darkseagreen;
    position:absolute;
    left: 0px;
  }
  .active{
    display: none;
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
  ::v-deep(.el-textarea) {
    --el-input-focus-border-color: rgb(1, 197, 1);
  }
  .editBtn {
    position: absolute;
    top:55%;
    left:77%;
  }
</style>
