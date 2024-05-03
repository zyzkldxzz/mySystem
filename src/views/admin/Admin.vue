<template>
  <div class="admin">
    <div class="menu">
      <el-menu router default-active="/admin/manageT" class="el-menu-vertical-demo">
        <el-menu-item index="/admin/manageT" ><span>教师信息</span></el-menu-item>
        <el-menu-item index="/admin/manageS"><span>学生管理</span></el-menu-item>
      </el-menu>
    </div>
    <router-view/>
  </div>
</template>
  
<script setup lang="ts" name="Admin">

</script>
  
<style scoped>
  ::v-deep(.el-menu-item.is-active) {
    background-color: rgba(0,205,0,0.1) !important;
    color: green;
  }
  ::v-deep(.el-input) {
    --el-input-focus-border-color: rgb(1, 197, 1);
  }
  .admin {
    display: flex;
  }
  .admin .menu {
    width: 200px; 
    padding-bottom: 150px; 
    padding-top: 150px
  }
  .admin .menu span {
    padding-left: 48px; 
    font-size: 16px
  }
</style>
<style>
  .el-dialog__headerbtn:focus .el-dialog__close, .el-dialog__headerbtn:hover .el-dialog__close {
    color: green;
  }
</style>
