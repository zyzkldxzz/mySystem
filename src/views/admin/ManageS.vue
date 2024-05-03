<template>
  <div class="manageS">
    <div class="search">
      <el-icon color="green" size="20px"><Search/></el-icon>&nbsp;
      <el-input v-model="search" placeholder="请输入学生姓名关键字检索" clearable/>
    </div>
    <el-table :data="tableData.filter(data => !search || data.realname.toLowerCase().includes(search.toLowerCase()))"
              border class="mytable" ref="multipleTableRef" :row-key="rowKey">
      <el-table-column type="selection" width="45" :reserve-selection="true"/>
      <el-table-column prop="nowmajor" label="专业" width="150" sortable align="center"/>
      <el-table-column prop="username" label="学号" width="120" sortable align="center"/>
      <el-table-column prop="realname" label="姓名" width="100" align="center"/>
      <el-table-column prop="sex" label="性别" sortable width="100" align="center"/>
      <el-table-column prop="ifsuper" label="是否推免" sortable width="120" align="center"/>
      <el-table-column prop="first" label="第一志愿" width="100" align="center"/>
      <el-table-column prop="second" label="第二志愿" width="100" align="center"/>
      <el-table-column prop="third" label="第三志愿" width="100" align="center"/>
      <el-table-column prop="tutor" label="导师" width="100" sortable align="center"/>
      <el-table-column label="操作" fixed="right" align="center">
        <template #default="scope">
          <el-button @click="handLook(scope.row)" type="success" text >详情</el-button>
          <el-button @click="allocate(scope.row)" :disabled="scope.row.tutor != null && scope.row.tutor != ''" type="success" plain>指定导师</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="export">
      <div class="example-pagination-block">
        <el-pagination 
          v-model:pagesize = "pageSize"
          v-model:current-page="currentPage"
          layout="sizes, prev, pager, next, total" 
          :total="total" 
          :page-sizes="[5, 10, 20, 30]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          popper-class='mypagination'
        />
      </div>
      <el-button type="success" @click="exportData">批量导出</el-button>
    </div>
    <el-dialog v-model="dialog" :title="data.username + ' ' + data.realname" width="70%" align-center :close-on-click-modal="false">
      <div class="myList">
        <el-divider content-position="left"><el-tag type="success">基础信息</el-tag></el-divider>
        <ul>
          <li>出生年月：{{data.birthyear}}</li>
          <li>性别：{{data.sex}}</li>
          <li>手机号：{{data.phone}}</li>
          <li>邮箱：{{data.postbox}}</li>
        </ul><br><ul>
          <li>家庭住址：{{data.jtaddress}}</li>
          <li>通讯地址：{{data.txaddress}}</li>
        </ul>
        <el-divider content-position="left"><el-tag type="success">有关信息</el-tag></el-divider>
        <ul>
          <li>研究生专业：{{data.nowmajor}}</li>
          <li>本科专业：{{data.undermajor}}</li>
          <li>本科学校：{{data.school}}</li>
        </ul><br><ul>
          <li>工作单位：{{data.workplace}}</li>
          <li>职务：{{data.job}}</li>
          <li>是否推免或高质量调剂：{{data.ifsuper}}</li>
          <li v-show="data.ifsuper == '否'">考研排名：{{data.ranklevel}}</li>
          <li v-show="data.ifsuper == '否'">考研综合成绩：{{data.score}}</li>
        </ul>
        <el-divider content-position="left"><el-tag type="success">志愿导师</el-tag></el-divider>
        <ul>
          <li>第一志愿导师：{{data.first}}</li>
          <li>感兴趣研究方向：{{data.finterest}}</li></ul><br><ul>
          <li>第二志愿导师：{{data.second}}</li>
          <li>感兴趣研究方向：{{data.sinterest}}</li></ul><br><ul>
          <li>第三志愿导师：{{data.third}}</li>
          <li>感兴趣研究方向：{{data.tinterest}}</li>
        </ul>
        <el-divider content-position="left"><el-tag type="success">其他信息</el-tag></el-divider>
        <ul><li>本科阶段研究兴趣：{{data.others1}}</li></ul><br>
        <ul><li>毕业论文题目：{{data.others2}}</li></ul><br>
        <ul><li>公开发表的学术文章：{{data.others3}}</li></ul><br>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogVisible" :title="data.realname + '  指定导师'" width="25%" :close-on-click-modal="false">
      <el-form ref="dialogRef" :rules="rules" :model="tutorForm">
        <el-form-item prop="tutor">
          <el-autocomplete
            v-model="tutorForm.tutor"
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
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="success" @click="save">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { Search } from "@element-plus/icons-vue";
  import { onMounted, reactive, ref, nextTick, watchEffect, watch } from "vue";
  import { useStudentStore } from "@/stores/student";
  import { useTeacherStore } from "@/stores/teacher";
  import type { RuleForm } from '@/api/students/type'
  import type { teacherInfo } from "@/api/teachers/type";
  import type { ElTable, FormInstance, FormRules } from "element-plus";
  import {export_excel, convert_excel_data} from '@/utils/export'
  import { reqGetStudentsByPage } from "@/api/students";
  let studentStore = useStudentStore()
  let teacherStore = useTeacherStore()
  let tableData = ref<Array<RuleForm>>([])
  let dialogVisible = ref(false)
  let search = ref('')
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
  let total = ref(0)
  let pageSize = ref(10)
  let currentPage = ref(1)
  interface tutorRule {
    tutor: string
  }
  let tutorForm = reactive<tutorRule>({
    tutor: ""
  })
  let dialogRef = ref<FormInstance>()
  let teacher = reactive<teacherInfo>({
    id: 0,
    username: "",
    realname: "",
    major: "",
    stu1: "",
    stu2: "",
    stu3: "",
    stu4: "",
    stu5: "",
    num: 0,
    want1: "",
    want2: "",
    want3: "",
    want4: "",
    want5: "",
    wnum: 0
  })
  const validateTutor = (rule:any, value:any, callback:any)=>{
    let teacherList = teacherStore.teachers.map((teacher:{realname:string}) => teacher.realname)
    if(teacherList.indexOf(value) == -1){
      callback(new Error('请填入有效的导师姓名'))
    }else{
      teacher = teacherStore.teachers[teacherList.indexOf(value)]
      if(teacher.num >= 5){
        callback(new Error('该导师名下学生数量已达5'))
      }else{
        callback()
      }
    }
  }
  let rules = reactive<FormRules<tutorRule>>({
    tutor: [
      {validator: validateTutor, trigger:'change'}
    ],
  })
  let multipleTableRef = ref<InstanceType<typeof ElTable>>()
  onMounted(()=>{
    loadStudentsByPage(currentPage.value,pageSize.value,search.value)
  })
  const loadStudentsByPage = async(pageNum: number, pageSize: number, realname: string)=>{
    let result:any = await reqGetStudentsByPage(pageNum,pageSize,realname)
    if(result.flag){
      total.value = result.data.total
      tableData.value = result.data.records
    }else{
      ElMessage.error("获取学生信息失败！请刷新重试")
    }
  }
  const handleSizeChange = (size:number)=>{
    pageSize.value=size
    currentPage.value = 1
    loadStudentsByPage(currentPage.value,pageSize.value,search.value)
  }
  const handleCurrentChange = (pageNumber:number)=>{
    currentPage.value=pageNumber
    loadStudentsByPage(currentPage.value,pageSize.value,search.value)
  }
  watch(search,()=>{
    loadStudentsByPage(currentPage.value,pageSize.value,search.value)
  })
  const handLook = (row:RuleForm)=>{
    data = row
    dialog.value = true
  }
  const allocate = async(row:RuleForm)=> {
    try {
      await teacherStore.getAllTeachers()
      dialogVisible.value = true
      data = row
    } catch (error) {
      ElMessage.error((error as Error).message)
    }
  }
  const querySearch = (queryString:string, cb:any)=>{
      const results = queryString ? teacherStore.teachers.filter(createFilter(queryString)) : teacherStore.teachers;
      cb(results);
  }
  const createFilter = (queryString:string) => {
    return (teachers:teacherInfo) => {
      return (teachers.realname.indexOf(queryString) === 0);
    }
  }
  const save = async()=>{
    if(!dialogRef.value) return
    await dialogRef.value.validate(async(valid:boolean)=>{
      if(valid){
        try {
          if(teacher.num === 0){teacher.stu1 = data.realname}
          else if(teacher.num === 1){teacher.stu2 = data.realname}
          else if(teacher.num === 2){teacher.stu3 = data.realname}
          else if(teacher.num === 3){teacher.stu4 = data.realname}
          else if(teacher.num === 4){teacher.stu5 = data.realname}
          teacher.num++
          await teacherStore.updateTeacherInfo(teacher)
          data.tutor = tutorForm.tutor
          await studentStore.updateStudntInfo(data)
          ElMessage.success("操作成功！")
          dialogVisible.value = false
        } catch (error) {
          ElMessage.error((error as Error).message)
        }
      }
    })
  }
  const exportData = ()=>{  
    let tHeader = {
      nowmajor: "专业",
      username: "学号",
      realname: "姓名",
      sex: "性别",
      ifsuper: "是否推免或高质量调剂",
      tutor: "导师",
      phone:"联系方式",
    };
    let excelData = []
    if(multipleTableRef.value!.getSelectionRows().length == 0){
      excelData = convert_excel_data(tableData.value, tHeader);
    }else{
      excelData = convert_excel_data(multipleTableRef.value!.getSelectionRows(), tHeader);
    }
    export_excel(excelData, "学生-导师");
  }
  const rowKey = (row:any)=>{
    return row.username
  }
</script>

<style scoped>
  .manageS {
    display: flex;
    flex-direction: column;
    width: 82%;
  }
  .search {
    margin: 25px 0px 15px 10px;
    align-self: flex-start;
  }
  .search .el-icon {
    margin-left: 5px
  }
  .search .el-input {
    width: 240px; 
    margin-top: -10px;
    margin-left: -4px;
  }
  .mytable {
    width: 100%;
    margin-left: 20px;
    height: 528px;
  }
  .myList ul {
    display: flex;
  }
  .myList li {
    list-style-type: disc;
    margin-left: 40px;
  }
  .myList ul li::after {
    content: "\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0";
  }
  .export {
    width:100%;
    margin-top: 10px;
    display:flex;
    justify-content:space-between;
  }
  .export .example-pagination-block {
    margin-left:10px;
  }
  .export .el-button {
    margin-right: -10px;
  }
  ::v-deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
    background-color:#67C23A;
    border-color:forestgreen;
  }
  ::v-deep(.el-checkbox__input.is-checked .el-checkbox__inner){
    background-color:#67C23A;
    border-color:forestgreen;
  }
  ::v-deep(.el-checkbox__inner:hover){
    border-color:forestgreen;
  }
  ::v-deep(.el-pager li.is-active){
    color: #67C23A;
  }
  ::v-deep(.el-pager li:hover){
    color: #67C23A;
  }
  ::v-deep(.el-select__wrapper.is-focused){
    box-shadow: 0 0 0 1px #67C23A inset;
  }
</style>
<style>
  .mypagination .el-select-dropdown__item.is-selected{
    color: #67C23A !important;
  }
  .mypagination .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
    background:#67c23a9a;
    color:#fff;
  }
  .manageS .el-table {
    border-radius: 5px;
  }
</style>