<template>
  <div class="stepContainer">
    <el-form ref="formRef" :model="form" :rules="rules" :inline="true" :disabled="disAble">
      <el-form-item prop="realname" label="姓名：">
        <el-input v-model="form.realname" style="width: 200px" clearable placeholder="请输入"/>
      </el-form-item>
      <el-form-item prop="sex" label="性别：">
        <el-radio v-model="form.sex" value="男">男</el-radio>
        <el-radio v-model="form.sex" value="女">女</el-radio>
      </el-form-item><br><br>
      <el-form-item prop="birthyear" label="出生年月：">
        <el-date-picker v-model="form.birthyear" type="month" value-format="YYYY-MM" placeholder="请选择"/>
      </el-form-item><br><br>
      <el-form-item prop="phone" label="手机号：">
        <el-input v-model="form.phone" style="width: 200px" clearable placeholder="请输入"/>
      </el-form-item>
      <el-form-item prop="postbox" label="邮箱：">
        <el-input v-model="form.postbox" style="width: 250px" clearable placeholder="请输入"/>
      </el-form-item><br><br>
      <el-form-item prop="jtaddress" label="家庭住址：">
        <el-input v-model="form.jtaddress" style="width: 510px" type="textarea" autosize placeholder="请输入"/>
      </el-form-item><br><br>
      <el-form-item prop="txaddress" label="通讯地址：">
        <el-input v-model="form.txaddress" style="width: 510px" type="textarea" autosize placeholder="请输入"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, watchEffect } from 'vue';
  import type { FormInstance, FormRules } from 'element-plus'
  import type { RuleForm } from '@/api/students/type';
  import { form } from '@/api/students/type';
  let props = defineProps(['disAble','datas'])
  let formRef = ref<FormInstance>()
  
  const rules = reactive<FormRules<RuleForm>>({
    realname: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
    birthyear: [
      { required: true, message: '请选择出生年月', trigger: 'blur' }
    ],
    sex:[
      { required: true, message: '请选择性别', trigger: 'blur' }
    ],
    phone:[
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1\d{10}$/, message: '请输入正确的号码格式', trigger: 'blur' }
    ],
    postbox:[
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确格式的邮箱地址', trigger: ['blur'],}
    ],
    jtaddress:[
      { required: true, message: '请输入家庭住址', trigger: 'blur' }
    ],
    txaddress:[
      { required: true, message: '请输入通讯地址', trigger: 'blur' }
    ],
  })
  watchEffect(()=>{
    if(props.disAble){
      form.value = {...props.datas}
    }
  })
  defineExpose({
    formRef,
    form
  })

</script>

<style>
  .el-form-item__label{
    color: black;
  }
</style>