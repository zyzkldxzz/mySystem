<template>
  <el-config-provider :locale="(zhCn as any)">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
  import zhCn from 'element-plus/es/locale/lang/zh-cn'


</script>

<style>
  #nprogress .bar {
    background: rgba(0, 128, 0, 0.53) !important;
  }
</style>