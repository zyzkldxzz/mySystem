<template>
  <div class="manageT">
    <div class="search">
      <el-icon color="green" size="20px"><Search/></el-icon>
      <el-input v-model="search" placeholder="请输入教师姓名关键字检索" clearable/>
    </div>
    <el-table :data="tableData.filter(data => !search || data.realname.toLowerCase().includes(search.toLowerCase()))" 
      border class="mytable">
      <el-table-column prop="major" label="专业" width="150" sortable align="center"/>
      <el-table-column prop="username" label="教师编号" width="120" sortable align="center"/>
      <el-table-column prop="realname" label="姓名" width="100" align="center"/>
      <el-table-column prop="num" label="名下学生数量" width="140" sortable align="center"/>
      <el-table-column prop="stu1" label="名下学生" width="100" align="center"/>
      <el-table-column prop="stu2" label="名下学生" width="100" align="center"/>
      <el-table-column prop="wnum" label="回选学生数量" width="140" sortable align="center"/>
      <el-table-column prop="want1" label="回选学生" width="100" align="center"/>
      <el-table-column prop="want2" label="回选学生" width="100" align="center"/>
      <el-table-column label="操作"  fixed="right" align="center">
        <template #default="scope">
          <el-button @click="handLook(scope.row)" type="success" text >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="example-pagination-block page">
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
    <div class="mydialog">
      <el-dialog v-model="dialogVisible" :title=lookTitle width="30%" :close-on-click-modal="false">
        <el-divider content-position="center"><el-tag type="success">名下学生</el-tag></el-divider>
        <p>{{stus}}</p>
        <el-divider content-position="center"><el-tag type="success">回选学生</el-tag></el-divider>
        <p>{{wants}}</p>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Search } from "@element-plus/icons-vue";
  import { onMounted, reactive, ref, watch } from "vue";
  import type { teacherInfo } from "@/api/teachers/type";
  import { reqGetTeachersByPage } from "@/api/teachers";
  let tableData = ref<Array<teacherInfo>>([])
  let lookTitle = ref('')
  let dialogVisible = ref(false)
  let stus = ref('')
  let wants = ref('')
  let search = ref('')
  let total = ref(0)
  let pageSize = ref(10)
  let currentPage = ref(1)
  onMounted(()=>{
    loadTeachersByPage(currentPage.value,pageSize.value,search.value)
  })
  const loadTeachersByPage = async(pageNum: number, pageSize: number, realname: string)=>{
    let result:any = await reqGetTeachersByPage(pageNum,pageSize,realname)
    if(result.flag){
      total.value = result.data.total
      tableData.value = result.data.records
    }else{
      ElMessage.error("获取教师信息失败！请刷新重试")
    }
  }
  const handleSizeChange = (size:number)=>{
    pageSize.value=size
    currentPage.value = 1
    loadTeachersByPage(currentPage.value,pageSize.value,search.value)
  }
  const handleCurrentChange = (pageNumber:number)=>{
    currentPage.value=pageNumber
    loadTeachersByPage(currentPage.value,pageSize.value,search.value)
  }
  watch(search,()=>{
    loadTeachersByPage(currentPage.value,pageSize.value,search.value)
  })
  const handLook = (row:teacherInfo)=>{
    lookTitle.value = row.realname
    if(row.num === 0){stus.value = ""}
    else if(row.num === 1){stus.value = row.stu1}
    else if(row.num === 2){stus.value = row.stu1 +  '、' + row.stu2}
    else if(row.num === 3){stus.value = row.stu1 +  '、' + row.stu2 +  '、' + row.stu3}
    else if(row.num === 4){stus.value = row.stu1 +  '、' + row.stu2 +  '、' + row.stu3 +  '、' + row.stu4}
    else if(row.num === 5){stus.value = row.stu1 +  '、' + row.stu2 +  '、' + row.stu3 +  '、' + row.stu4 +  '、' + row.stu5}
    if(row.wnum === 0){wants.value = ""}
    else if(row.wnum === 1){wants.value = row.want1}
    else if(row.wnum === 2){wants.value = row.want1 +  '、' + row.want2}
    else if(row.wnum === 3){wants.value = row.want1 +  '、' + row.want2 +  '、' + row.want3}
    else if(row.wnum === 4){wants.value = row.want1 +  '、' + row.want2 +  '、' + row.want3 +  '、' + row.want4}
    else if(row.wnum === 5){wants.value = row.want1 +  '、' + row.want2 +  '、' + row.want3 +  '、' + row.want4 +  '、' + row.want5}
    dialogVisible.value = true
  }

</script>

<style scoped>
  .manageT {
    display: flex;
    flex-direction: column;
    width: 80%;
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
    margin-left: 5px;
  }
  .mytable {
    width: 100%;
    margin-left: 20px;
    height: 528px;
  }
  .mydialog p{
    font-size: 16px; 
    margin-left: 25px;
    height: 40px;
    line-height: 40px;
  }
  .page {
    align-self: flex-start;
    margin-left:10px;
    margin-top: 10px;
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
</style>