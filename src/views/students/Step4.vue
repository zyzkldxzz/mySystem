<template>
  <div class="stepContainer">
    <el-form ref="formRef" :model="form" :rules="rules" :disabled="disAble">
      <el-form-item prop="others1" label="本科阶段的研究兴趣：">
        <el-input v-model="form.others1" style="width: 550px" type="textarea" autosize placeholder="请输入"/>
      </el-form-item><br>
      <el-form-item prop="others2" label="本科毕业论文题目：">
        <el-input v-model="form.others2" style="width: 550px" type="textarea" autosize placeholder="请输入"/>
      </el-form-item><br>
      <el-form-item prop="others3" label="公开发表的学术文章（两篇以内）：">
        <el-input v-model="form.others3" style="width: 550px" type="textarea" autosize placeholder="请输入"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import {reactive, ref, watchEffect} from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import type { RuleForm } from "@/api/students/type";
  import { form } from '@/api/students/type';

  let props = defineProps(['disAble','datas'])
  let formRef = ref<FormInstance>()
  let rules = reactive<FormRules<RuleForm>>({
    others1: [
      {required: true, message: '请填入本科阶段研究方向', trigger: 'blur'}
    ],
    others2: [
      {required: true, message: '请填入本科毕业论文题目', trigger: 'blur'}
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

<style scoped>
  .el-form-item {
    display: block;
  }
</style>