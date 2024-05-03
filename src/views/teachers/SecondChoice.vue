<template>
  <div class="tableBox">
    <el-table :data="tableData" height="380px">
      <el-table-column prop="username" label="学号" sortable width="120" align="center"/>
      <el-table-column prop="realname" label="姓名" width="120" align="center"/>
      <el-table-column prop="sex" label="性别" sortable width="100" align="center"/>
      <el-table-column prop="nowmajor" label="研究生专业" width="160" align="center"/>
      <el-table-column prop="school" label="本科学校" width="150" align="center"/>
      <el-table-column prop="undermajor" label="本科专业" width="160" align="center"/>
      <el-table-column prop="ifsuper" label="是否推免" sortable width="120" align="center"/>
      <el-table-column label="操作" width="280" fixed="right" align="center">
        <template #default="scope">
          <el-button @click="look(scope.row)" type="success" text >详情</el-button>
          <el-popconfirm title="确定选择该学生吗?" @confirm="want(scope.row)" hide-icon confirm-button-type="success">
            <template #reference>
              <el-button type="success" :disabled="btnDisable(scope.row)">回选</el-button>
            </template>
          </el-popconfirm>
          <el-tag type="info" round label="tag3" style="margin-left:10px" v-show="scope.row.tip">{{scope.row.tip}}</el-tag>
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
        <ul><li>感兴趣研究方向：{{data.sinterest}}</li></ul><br>
        <ul><li>本科阶段研究兴趣：{{data.others1}}</li></ul><br>
        <ul><li>毕业论文题目：{{data.others2}}</li></ul><br>
        <ul><li>公开发表的学术文章：{{data.others3}}</li></ul><br>
      </div>
    </el-dialog>
  </div> 
</template>

<script lang="ts" setup>
  import {computed, onMounted, onUnmounted, reactive, ref} from 'vue'
  import { useStudentStore } from '@/stores/student';
  import { useTeacherStore } from '@/stores/teacher';
  import type {RuleForm} from '@/api/students/type'
  let studentStore = useStudentStore()
  let teacherStore = useTeacherStore()
  interface RuleForm2 extends RuleForm {
    tip?:string
  }
  let tableData = reactive<Array<RuleForm2>>([])
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
  let btnDisable = computed(()=>(row:RuleForm2)=>{
    let teacher = teacherStore.teacher
    if(row.tutor != null && row.tutor != ''){
      row.tip = "已有导师"
      return true
    }else if(teacher['want1']===row['realname'] || teacher['want2']===row['realname'] ||
      teacher['want3']===row['realname'] || teacher['want4']===row['realname'] ||
      teacher['want5']===row['realname'])
    {
      row.tip = "已回选"
      return true
    }else{
      return false
    }
  })
  let dialog = ref(false)
  onMounted(()=>{
    loadSecond()
  })
  const loadSecond = ()=>{
    studentStore.students.forEach((value,index,array)=>{
      if(value.second === teacherStore.teacher.realname){
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
      if(teacher.wnum === 0){teacher.want1 = row.realname}
      else if(teacher.wnum === 1){teacher.want2 = row.realname}
      else if(teacher.wnum === 2){teacher.want3 = row.realname}
      else if(teacher.wnum === 3){teacher.want4 = row.realname}
      else if(teacher.wnum === 4){teacher.want5 = row.realname}
      teacher.wnum++
      try {
        await teacherStore.updateTeacherInfo(teacher)
        ElMessage.success("回选成功！")
      } catch (error) {
        ElMessage.error((error as Error).message)
      }
    }
  }

//   methods: {
//     loadSecond(){
//       let teacherUser = JSON.parse(sessionStorage.getItem("user")).username
//       request.get("/teachers/u/"+teacherUser).then(res =>{
//         this.teacher = res.data.data
//       })
//       request.get("/students").then(res =>{
//         let studentSecond = res.map(item => item.second)
//         for (let i in studentSecond) {
//           if(studentSecond[i] === this.teacher['realname']){
//             this.tableData.push(res[i])
//           }
//         }
//         this.tableData.map(row => {
//           if(this.teacher['want1']===row['realname'] || this.teacher['want2']===row['realname'] ||
//               this.teacher['want3']===row['realname'] || this.teacher['want4']===row['realname'] ||
//               this.teacher['want5']===row['realname']){
//             row.buttonDisable = true
//           }
//           if(row['tutor']){row.buttonDisable = true}
//         })
//       })

//     },

//     want(row){
//       if(this.teacher.wnum === 5){
//         this.$message.error("操作失败！您回选学生数量已达5人")
//       }else{
//         if(this.teacher.wnum === 0){this.teacher.want1 = row.realname}
//         else if(this.teacher.wnum === 1){this.teacher.want2 = row.realname}
//         else if(this.teacher.wnum === 2){this.teacher.want3 = row.realname}
//         else if(this.teacher.wnum === 3){this.teacher.want4 = row.realname}
//         else if(this.teacher.wnum === 4){this.teacher.want5 = row.realname}
//         this.teacher.wnum++
//         request.put("/teachers",this.teacher).then(res =>{
//           if(res.flag){
//             this.$message.success("操作成功！已将该学生列入您的选择名单")
//             row.buttonDisable = true
//           }else{
//             this.$message.error("操作失败！请重新操作")
//           }
//         })
//       }
//     }
//   },

// }
</script>
