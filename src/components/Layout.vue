<template>
  <header>
    <p>师生双选系统</p>
    <el-dropdown>
      <span class="el-dropdown-link usertext">
        <span>{{userStore.userInfos!.username}}</span>
        <img :src="userStore.userInfos!.avatar"/>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="dialog1 = true">修改头像</el-dropdown-item>
          <el-dropdown-item @click="dialog2 = true">修改密码</el-dropdown-item>
          <el-dropdown-item divided @click="exitSystem">退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </header>
  <el-dialog v-model="dialog1" title="修改头像" width="30%" :close-on-click-modal="false" :show-close="false">
    <el-upload
      class="avatar-uploader"
      action="/api/file/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeUpload"
    >
      <img v-if="userStore.userInfos!.avatar" :src="userStore.userInfos!.avatar" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <br>
    <span>Tips：图片大小须小于1MB</span><br>
    <span>Tips：图片格式仅限jpg、jpeg、png、gif</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit" type="success" plain>取消</el-button>
        <el-button type="success" @click="submitAvatar">提交</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialog2" title="修改密码" width="30%" :close-on-click-modal="false">
    <br>
    <el-input v-model="codeInput" type="password" placeholder="请输入新密码" show-password style="width: 250px"/>
    <br><br>
    <el-input v-model="codeConfirm" type="password" placeholder="请再次输入新密码" show-password style="width: 250px"/>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="success" @click="submitPwd">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <router-view/>
</template>

<script setup lang='ts'>
  import { useUserStore } from '@/stores/user';
  import { onMounted,ref } from 'vue';
  import { Plus } from '@element-plus/icons-vue'
  import type { UploadProps } from 'element-plus'
  import { useRouter } from 'vue-router';
  let userStore = useUserStore()
  let $router = useRouter()
  let dialog1 = ref(false)
  let dialog2 = ref(false)
  let codeInput = ref('')
  let codeConfirm = ref('')

  onMounted(()=>{
    getData()    
  })
  const getData = async() => {
    try {
      await userStore.userInfo()
      if(userStore.userInfos!.role == 'student'){
        $router.push('/student')
      }else if(userStore.userInfos!.role == 'teacher'){
        $router.push('/teacher')
      }else{
        $router.push('/admin')
      }
    } catch (error) {
      ElMessage.error((error as Error).message)
    }
  }
  const handleAvatarSuccess: UploadProps['onSuccess'] = (response,uploadFile) => {
    userStore.userInfos!.avatar = response
  }
  const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if(!(rawFile.type == 'image/jpeg' || rawFile.type == 'image/png' || rawFile.type == 'image/gif')) {
      ElMessage.error('图片格式须是jpg、jpeg、png、gif中的一种！')
      return false
    } else if (rawFile.size / 1024 / 1024 > 1) {
      ElMessage.error('图片大小须小于1MB！')
      return false
    }
    return true
  }
  const submitAvatar = async() => {
    try {
      await userStore.userUpdateAvatar(userStore.userInfos!)
      dialog1.value = false
      // getData()
      ElMessage.success("提交成功！")
    } catch (error) {
      ElMessage.error("网络连接超时！请重新尝试")
    }
  }
  const cancelSubmit = () => {
    dialog1.value = false
    getData()
  }
  const submitPwd = async() => {
    if(codeInput.value !== "" && codeInput.value === codeConfirm.value){
      try {
        userStore.userInfos!.password = codeConfirm.value
        await userStore.userUpdateAvatar(userStore.userInfos!)
        ElMessage.success("修改成功")
      } catch (error) {
        ElMessage.error("修改密码出错了！请重新尝试")
      }
    }else if(codeInput.value !== "" && codeInput.value !== codeConfirm.value){
      ElMessage.error("修改失败！两次密码输入不一致，请重新设置")
      codeInput.value = ""
      codeConfirm.value = ""
    }
    dialog2.value = false
  }
  const exitSystem = () =>{
    userStore.userLogout()
    $router.push('/login')
    location.reload()
  }

</script>

<style scoped>
  header {
    height: 50px; 
    line-height: 50px; 
    border-bottom: 1px solid #ccc; 
    display:flex;
    justify-content: space-between;
    background-color: #049D39;
    width: 100%;
  }
  header p {
    width: 200px; 
    padding-left: 25px; 
    /* font-weight: bold;  */
    text-shadow: -3px 3px 5px #ffffffab;
    color: rgb(255, 255, 255);
    font-size: 22px;
    font-family:'华文楷体','楷体','宋体';
  }
  .usertext {
    margin-right: 20px;
    color: white;
    cursor: pointer;
    display: flex;
  }
  .usertext img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0px 0px 5px #ccc;
    margin-left: 10px;
  }
  .example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar-uploader {
    display: flex;
    justify-content: center;
  }
</style>

<style>
.avatar-uploader .el-upload {
  border: 2px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-success);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.el-dropdown-menu__item:not(.is-disabled):focus {
  background-color: #67C23A !important;
  color: white !important;
}
</style>