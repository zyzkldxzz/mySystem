<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="我的学生" name="my"><MyStudents v-if="activeName === 'my'"></MyStudents></el-tab-pane>
      <el-tab-pane label="第一志愿" name="1"><FirstChoice v-if="activeName === '1'"></FirstChoice></el-tab-pane>
      <el-tab-pane label="第二志愿" name="2"><SecondChoice v-if="activeName === '2'"></SecondChoice></el-tab-pane>
      <el-tab-pane label="第三志愿" name="3"><ThirdChoice v-if="activeName === '3'"></ThirdChoice></el-tab-pane>
    </el-tabs>
    <br>
    <div class="embed">
      <p>Tips: 请谨慎回选学生！ &nbsp;<span>①您最多可回选5名学生</span>  &nbsp;②会优先为学生匹配其第一志愿导师</p>
      <p>因此，如您回选将您作为第一志愿的学生，则自动匹配成功</p>
      <p>如回选将您作为第二、三志愿学生，则会将其列入您的选择名单，若学生最终未自动匹配成功，由管理员为其指定导师</p>
    </div>
  </div>
</template>
  
<script setup lang="ts">
  import MyStudents from "@/views/teachers/MyStudents.vue";
  import FirstChoice from "@/views/teachers/FirstChoice.vue";
  import SecondChoice from "@/views/teachers/SecondChoice.vue";
  import ThirdChoice from "@/views/teachers/ThirdChoice.vue";
  import {ref} from 'vue'
  let activeName = ref('my')
</script>

<style scoped>
  .el-tabs {
    margin-left: 50px; 
    margin-top: 20px;
    margin-right: 50px;
  }
  ::v-deep(.el-tabs__item){
    height: 60px;
    color: black !important;
    text-align: center;
    padding-top: 10px;
    font-size: 15px !important;
  }
  ::v-deep(.is-active){
    color: #229922 !important;
    font-weight: bolder;
  }
  ::v-deep(.el-tabs__active-bar){
    background-color: #229922 !important;
  }
  .embed{
    width: 70%;
    height: 68px;
    margin-top: 10px;
    margin-left: 50px;
    margin-right: 50px;
    padding-top: 5px;
    padding-left: 10px;
    border: 2px dashed lightslategrey;
    border-radius: 10px;
    font-size: 12px;
    overflow:auto;
  }
  .embed p {
    color: grey; 
    line-height: 18px;
  }
  .embed p span {
    font-weight: bold;
    color:lightcoral;
  }
</style>
<style>
  .tableBox{
    height: 60vh;
    width: 90%;
    margin-left: 5%;
    margin-top: 30px;
    padding-top: 20px;
    padding-left: 35px;
    padding-bottom: 20px;
    border: 2px solid darkgreen;
    border-radius: 10px;
    box-shadow: 0 10px 20px grey;
    overflow-y: auto;
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
  .el-dialog__headerbtn:focus .el-dialog__close, .el-dialog__headerbtn:hover .el-dialog__close {
    color: green;
  }
</style>