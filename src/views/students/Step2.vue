<template>
  <div class="stepContainer">
    <el-form ref="formRef" :model="form" :rules="rules" :inline="true" :disabled="disAble">
      <el-form-item prop="school" label="本科学校：">
        <el-input v-model="form.school" style="width: 200px" clearable placeholder="请输入"/>
      </el-form-item><br><br>
      <el-form-item prop="undermajor" label="本科专业：">
        <el-input v-model="form.undermajor" style="width: 200px" clearable placeholder="请输入"/>
      </el-form-item>
      <el-form-item prop="nowmajor" label="研究生专业：">
        <el-input v-model="form.nowmajor" style="width: 200px" clearable placeholder="请输入"/>
      </el-form-item><br><br>
      <el-form-item prop="workplace" label="现工作单位：">
        <el-input v-model="form.workplace" style="width: 200px" clearable placeholder="请输入"/>
      </el-form-item>
      <el-form-item prop="job" label="职务：">
        <el-input v-model="form.job" style="width: 200px" clearable placeholder="请输入"/>
      </el-form-item><br><br>
      <el-form-item prop="ifsuper" label="是否推免或高质量调剂：">
        <el-radio v-model="form.ifsuper" value="是">是</el-radio>
        <el-radio v-model="form.ifsuper" value="否">否</el-radio>
      </el-form-item><br><br>
      <el-form-item prop="ranklevel" label="考研专业排名：">
        <el-input-number v-model="form.ranklevel" :min="0" :max="50" :disabled="btnDisable"/>
      </el-form-item>
      <el-form-item prop="score" label="考研综合成绩：">
        <el-input v-model="form.score" style="width: 200px" clearable :disabled="btnDisable"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref, watchEffect } from 'vue';
  import type { FormInstance, FormRules } from 'element-plus'
  import type { RuleForm } from '@/api/students/type';
  import { form } from '@/api/students/type';
  let btnDisable = ref(true)
  let props = defineProps(['disAble','datas'])
  let formRef = ref<FormInstance>()
  const validateRank = (rule:any, value:any, callback:any)=>{
    if(form.value.ifsuper == '否'){
      if(value == '' || value == 0){
        callback(new Error('请输入考研专业排名'))
      }else{
        callback()
      }
    }else{
      callback()
    }
  }
  const validateScore = (rule:any, value:any, callback:any)=>{
    if(form.value.ifsuper == '否'){
      if(value == '' || value == '0'){
        callback(new Error('请输入考研综合成绩'))
      }else{
        callback()
      }
    }else{
      callback()
    }
  }
  let rules = reactive<FormRules<RuleForm>>({
    school: [
      { required: true, message: '请输入本科学校', trigger: 'blur' }
    ],
    undermajor: [
      { required: true, message: '请输入本科专业', trigger: 'blur' }
    ],
    nowmajor: [
      { required: true, message: '请输入研究生专业', trigger: 'blur' }
    ],
    ifsuper: [
      { required: true, message: '请选择是否推免或高质量调剂', trigger: 'blur' }
    ],
    ranklevel: [
      {validator:validateRank, trigger:'blur'}
    ],
    score: [
      {validator:validateScore, trigger:'blur'}
    ]
  })
  watchEffect(()=>{
    if(props.disAble){
      form.value = {...props.datas}
    }
    if(form.value.ifsuper == '否'){
      btnDisable.value = false
    }else{
      btnDisable.value = true
      form.value.ranklevel = 0
      form.value.score = '0'
    }
  })
  defineExpose({
    formRef,
    form
  })

</script>

<style scoped>

</style>