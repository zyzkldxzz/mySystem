import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/stores'
import { useUserStore } from '@/stores/user'

let userStore: any = null
// let userStore = useUserStore(store)

const router = createRouter({
  // createWebHashHistory hash模式和history模式
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: ()=>import("@/components/Layout.vue"),   
      children: [
          {
              path: 'student',
              name: 'Students',
              component: () => import("@/views/students/Home.vue"),
          },
          {
              path: 'teacher',
              name: 'Teachers',
              component: () => import("@/views/teachers/Home.vue"),
          },
          {
              path: 'admin',
              name: 'Admin',
              component: () => import("@/views/admin/Admin.vue"),
              redirect: '/admin/manageT',
              children: [
                  {
                  path: 'manageT',
                  name: 'ManageT',
                  component: () =>import("@/views/admin/ManageT.vue")
                  },
                  {
                  path: 'manageS',
                  name: 'ManageS',
                  component: () =>import("@/views/admin/ManageS.vue")
              }]
          },
      ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import("@/views/Login.vue")
    },
    {
        path:'/404',
        name: '404',
        component: () => import("@/views/404/index.vue")
    },
    {
        path:'/:pathMatch(.*)*',
        name:'any',
        redirect:'/404'
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return {
        left:0,
        top:0
    }
  }
})
router.beforeEach(async(to,from,next)=>{
  if(userStore == null){
    userStore = useUserStore()
  }
  if(to.path == '/login'){
    next()
  }else{
    let token = userStore.token;
    if(token){
      let name = userStore.userInfos?.username
      if(!name){
        try {
          await userStore.userInfo()
        } catch (error) {
          ElMessage.error((error as Error).message)
        }
      }
      if((to.path.indexOf('student')!=-1 && userStore.userInfos?.role!='student') 
        || (to.path.indexOf('teacher')!=-1 && userStore.userInfos?.role!='teacher') 
        || (to.path.indexOf('admin')!=-1 && userStore.userInfos?.role!='admin'))
      {
        ElNotification.error(`${userStore.userInfos?.role}无此操作权限`)
        next(`/${userStore.userInfos?.role}`)
      }else{
        next()
      }
    }else{
      next('/login')
    }
  }
})


export default router
