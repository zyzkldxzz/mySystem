<template>
  <div class="tableBox">
    <el-table :data="tableData" height="380px">
      <el-table-column prop="username" label="学号" sortable width="150" align="center"/>
      <el-table-column prop="realname" label="姓名" width="150" align="center"/>
      <el-table-column prop="sex" label="性别" sortable width="120" align="center"/>
      <el-table-column prop="nowmajor" label="研究生专业" width="160" align="center"/>
      <el-table-column prop="school" label="本科学校" width="150" align="center"/>
      <el-table-column prop="undermajor" label="本科专业" width="160" align="center"/>
      <el-table-column prop="ifsuper" label="是否推免" sortable width="120" align="center"/>
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template #default="scope">
          <el-button @click="look(scope.row)" type="success" text >详情</el-button>
          <el-popconfirm title="确定选择该学生吗?" @confirm="want(scope.row)" hide-icon confirm-button-type="success">
            <template #reference>
              <el-button type="success" :disabled="scope.row.tutor != null && scope.row.tutor != ''">回选</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialog" :title="data.username + ' ' + data.realname" width="70%" :close-on-click-modal="false">
      <div class="myList">
        <el-divider content-position="left"><el-tag type="success">基础信息</el-tag></el-divider>
        <ul>
          <li>出生年月：{{data.birthyear}}</li>
          <li>性别：{{data.sex}}</li>
          <li>手机号：{{data.phone}}</li>
          <li>邮箱：{{data.postbox}}</li>
        </ul><br>
        <ul>
          <li>家庭住址：{{data.jtaddress}}</li>
          <li>通讯地址：{{data.txaddress}}</li>
        </ul>
        <el-divider content-position="left"><el-tag type="success">有关信息</el-tag></el-divider>
        <ul>
          <li>研究生专业：{{data.nowmajor}}</li>
          <li>本科专业：{{data.undermajor}}</li>
          <li>本科学校：{{data.school}}</li>
        </ul><br>
        <ul>
          <li>工作单位：{{data.workplace}}</li>
          <li>职务：{{data.job}}</li>
          <li>是否推免或高质量调剂：{{data.ifsuper}}</li>
          <li v-show="data.ifsuper == '否'">考研排名：{{data.ranklevel}}</li>
          <li v-show="data.ifsuper == '否'">考研综合成绩：{{data.score}}</li>
        </ul>
        <el-divider content-position="left"><el-tag type="success">其他信息</el-tag></el-divider>
        <ul><li>感兴趣研究方向：{{data.finterest}}</li></ul><br>
        <ul><li>本科阶段研究兴趣：{{data.others1}}</li></ul><br>
        <ul><li>毕业论文题目：{{data.others2}}</li></ul><br>
        <ul><li>公开发表的学术文章：{{data.others3}}</li></ul><br>
      </div>
    </el-dialog>
  </div> 
</template>

<script setup lang="ts">
  import {onMounted, onUnmounted, reactive, ref} from 'vue'
  import { useStudentStore } from '@/stores/student';
  import { useTeacherStore } from '@/stores/teacher';
  import type {RuleForm} from '@/api/students/type'
  let studentStore = useStudentStore()
  let teacherStore = useTeacherStore()
  let tableData = reactive<Array<RuleForm>>([])
  let data = reactive<RuleForm>({
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
    tutor: ''
  })
  let dialog = ref(false)
  onMounted(()=>{
    loadFirst()
  })
  const loadFirst = ()=>{
    studentStore.students.forEach((value,index,array)=>{
      if(value.first === teacherStore.teacher.realname){
        tableData.push(value)
      }
    })
  }
  const look = (row:any)=>{
    data = row
    dialog.value = true
  }
  const want = async(row:RuleForm)=>{
    let teacher = teacherStore.teacher
    if(teacher.num === 5 || teacher.wnum === 5){
      ElMessage.error("回选失败！您回选学生数量已达5人")
    }else{
      if(teacher.num === 0){teacher.stu1 = row.realname}
      else if(teacher.num === 1){teacher.stu2 = row.realname}
      else if(teacher.num === 2){teacher.stu3 = row.realname}
      else if(teacher.num === 3){teacher.stu4 = row.realname}
      else if(teacher.num === 4){teacher.stu5 = row.realname}
      teacher.num++
      if(teacher.wnum === 0){teacher.want1 = row.realname}
      else if(teacher.wnum === 1){teacher.want2 = row.realname}
      else if(teacher.wnum === 2){teacher.want3 = row.realname}
      else if(teacher.wnum === 3){teacher.want4 = row.realname}
      else if(teacher.wnum === 4){teacher.want5 = row.realname}
      teacher.wnum++
      try {
        await teacherStore.updateTeacherInfo(teacher)
        row.tutor = teacher.realname
        await studentStore.updateStudntInfo(row)
        ElMessage.success("回选成功！")
      } catch (error) {
        ElMessage.error((error as Error).message)
      }
    }
  }

</script>

<style scoped>

</style>