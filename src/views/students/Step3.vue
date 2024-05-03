<template>
  <div class="stepContainer">
    <el-form ref="formRef" :model="form" :rules="rules" :inline="true" :disabled="disAble">
      <el-form-item prop="first" label="第一志愿导师姓名：">
        <el-autocomplete
            v-model="form.first"
            value-key="realname"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="true"
            clearable
            placeholder="请输入">
          <template #default="{ item }">
            <div>{{ item.realname }}-----{{ item.major }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item prop="finterest" label="其研究方向：">
        <el-input v-model="form.finterest" style="width: 510px" type="textarea" autosize placeholder="请输入"/>
      </el-form-item><br><br>
      <el-form-item prop="second" label="第二志愿导师姓名：">
        <el-autocomplete
            v-model="form.second"
            value-key="realname"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="true"
            clearable
            placeholder="请输入">
          <template #default="{ item }">
            <div>{{ item.realname }}-----{{ item.major }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item prop="sinterest" label="其研究方向：">
        <el-input v-model="form.sinterest" style="width: 510px" type="textarea" autosize placeholder="请输入"/>
      </el-form-item><br><br>
      <el-form-item prop="third" label="第三志愿导师姓名：">
        <el-autocomplete
            v-model="form.third"
            value-key="realname"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="true"
            clearable
            placeholder="请输入">
          <template #default="{ item }">
            <div>{{ item.realname }}-----{{ item.major }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item prop="tinterest" label="其研究方向：">
        <el-input v-model="form.tinterest" style="width: 510px" type="textarea" autosize placeholder="请输入"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { onActivated, onDeactivated, onMounted, reactive, ref, watchEffect, defineAsyncComponent } from "vue";
  import type { FormInstance, FormRules } from 'element-plus'
  import { useTeacherStore } from "@/stores/teacher";
  import type {teacherInfo} from '@/api/teachers/type'
  import type { RuleForm } from "@/api/students/type";
  import { form } from '@/api/students/type';
  let props = defineProps(['disAble','datas'])
  let teacherStore = useTeacherStore()
  let formRef = ref<FormInstance>()
  let teachers = reactive<Array<teacherInfo>>([])
  const validateTutor = (rule:any, value:any, callback:any)=>{
    let teacherList = teacherStore.teachers.map((teacher:{realname:string}) => teacher.realname)
    if(teacherList.indexOf(value) == -1){
      callback(new Error('请填入有效的导师姓名'))
    }else{
      callback()
    } 
  }
  let rules = reactive<FormRules<RuleForm>>({
    first: [
      {required: true, message: '请选择第一志愿导师姓名', trigger: 'change'},
      {validator:validateTutor, trigger:'blur'}
    ],
    finterest: [
      {required: true, message: '请填入感兴趣的该导师研究方向', trigger: 'blur'}
    ],
    second: [
      {required: true, message: '请选择第二志愿导师姓名', trigger: 'change'},
      {validator:validateTutor, trigger:'blur'}
    ],
    sinterest: [
      {required: true, message: '请填入感兴趣的该导师研究方向', trigger: 'blur'}
    ],
    third: [
      {required: true, message: '请选择第三志愿导师姓名', trigger: 'change'},
      {validator:validateTutor, trigger:'blur'}
    ],
    tinterest: [
      {required: true, message: '请填入感兴趣的该导师研究方向', trigger: 'blur'}
    ],
  })
  watchEffect(()=>{
    if(props.disAble){
      form.value = {...props.datas}
    }
  })
  onActivated(()=>{
    getNames()
  })
  const getNames = async()=>{
    try {
      await teacherStore.getAllTeachers()
      teachers = teacherStore.teachers
    } catch (error) {
      ElMessage.error((error as Error).message)
    }
  }
  const querySearch = (queryString:string, cb:any)=>{
      const results = queryString ? teachers.filter(createFilter(queryString)) : teachers;
      cb(results);
  }
  const createFilter = (queryString:string) => {
    return (teachers:teacherInfo) => {
      return (teachers.realname.indexOf(queryString) === 0);
    };
  }
  defineExpose({
    formRef,
    form
  })

</script>

<style scoped>

</style>