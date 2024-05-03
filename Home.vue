<template>
  <div class="head">
    <el-steps :active="active" align-center finish-status="success">
      <el-step title="Step 1" description="基本信息" />
      <el-step title="Step 2" description="有关信息" />
      <el-step title="Step 3" description="选择导师" />
      <el-step title="Step 4" description="其他个人资料" />
    </el-steps>
  </div>
  <div class="content">
    <keep-alive>
      <component :is="component" ref="form1" @giveFather="getChild" @giveFather2="getChild2" :disAble="disAble" :datas="datas" :flag="flag"/>
    </keep-alive>
  </div>
  <div class="dane">
    <div class="embed">
      您的导师是：{{tutor}}
    </div>
    <div style="margin-left: 470px;margin-top: 10px;">
      <el-button @click="back" type="success" v-bind:disabled="button1">上一步</el-button>
      <el-button @click="next" type="success" v-bind:disabled="button2">下一步</el-button>
      <el-button @click="editable" type="success" style="margin-left:320px; margin-top: -500px;" :icon="Edit" :class="{active: isActive}"></el-button>
    </div>
  </div>
</template>

<script>


import Step1 from "@/views/students/Step1.vue";
import Step2 from "@/views/students/Step2.vue";
import Step3 from "@/views/students/Step3.vue";
import Step4 from "@/views/students/Step4.vue";
import request from "@/utils/request";
import {Avatar, Edit, Lock} from "@element-plus/icons-vue";

export default {
  name: "Home",
  data(){
    return{
      active: 0,
      path:"",
      button1: true,
      button2: false,
      component: "",
      form1: [],
      boo: "",   //规则校验是否成功，决定点击下一步步骤条是否变化
      disAble: false,   //页面输入框是否可用
      datas: {},
      isActive: true,   //编辑按钮是否可见
      flag: false,   //数据库是否已有该学生信息
      tutor: "",
    }
  },
  components: {
    Step1,
    Step2,
    Step3,
    Step4
  },
  created() {
    this.load()
  },
  setup(){
    return {
      Edit,
    }
  },
  methods:{
    async load(){
      const userOne = JSON.parse(sessionStorage.getItem("user"))['username']
      await request.get("students").then(res =>{
        const userList = res.map(user => user.username)
        if(userList.indexOf(userOne) !== -1){
          this.disAble = true
          for (let i = 0; i < res.length; i++) {
            if (res[i].username === userOne) {
              this.datas = res[i]
              break
            }
          }
          this.tutor = this.datas.tutor
          this.flag = true
          if(this.tutor){
            this.isActive = true
          }else{
            this.isActive = false
            this.$message.info("您已提交信息，如要修改可点击页面右侧按钮编辑")
          }
        }
      })
      this.button1 = true
      this.button2 = false
      this.component = 'Step1'
    },
    getChild(temp){
      this.boo = temp
    },
    getChild2(temp){  //已点击提交信息
      this.load()
      this.active = 0;
      // this.disAble = temp
      // this.isActive = false
    },
    next(){
      this.$refs.form1.validateForm()
      // console.log(this.boo)
      this.boo = 'false'
    },
    back(){
      this.active--;
    },
    editable(){
      this.disAble = false
    }
  },
  watch: {
    boo(){
      if(this.boo === 'true'){
        this.active++;
      }
    },
    active(){
      if(this.active === 0){
        this.button1 = true
        this.button2 = false
        this.component = 'Step1'
      }else if(this.active === 1){
        this.button1 = false
        this.button2 = false
        this.component = 'Step2'
      }else if(this.active === 2){
        this.button1 = false
        this.button2 = false
        this.component = 'Step3'
      }else if(this.active === 3){
        this.button1 = false
        this.button2 = true
        this.component = 'Step4'
      }
    }
  }
}
</script>

<style scoped>
.head{
  flex: 0 0 auto;
  margin-top: 35px;
  margin-bottom: 10px;
}
.content{
  flex: 1 0 auto;
  height: 62vh;
}
.dane{
  display: flex;
  flex: 0 0 auto;
}
.embed{
  width: 200px;
  height: 45px;
  margin-left: 20px;
  padding-top: 10px;
  padding-left: 10px;
  border: 2px solid darkgreen;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 2px darkseagreen;
}
.active{
  display: none;
}

</style>