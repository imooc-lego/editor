import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Index from '../views/Index.vue'
import Home from '../views/Home.vue'
import MyWork from '../views/MyWork.vue'
import axios from 'axios'
import store from '../store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [
      { path: '', component: Home, meta: { title: '欢迎来到慕课乐高' } },
      { path: 'mywork', component: MyWork, meta: { requiredLogin: true, title: '我的设计列表' } }
    ]
  },
  {
    path: '/editor/:id',
    name: 'Editor',
    component: () => import(/* webpackChunkName: "editor" */ '../views/Editor.vue'),
    meta: { requiredLogin: true, title: '编辑我的设计' }
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: { redirectAlreadyLogin: true, title: '登录到慕课乐高' }
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { user } = store.state
  const { token, isLogin } = user
  const { requiredLogin, redirectAlreadyLogin, title } = to.meta
  if (title) {
    document.title = title
  }
  if (!isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then((data: any) => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          if (data.errno !== 0) {
            store.commit('logout')
            next('login')
          } else {
            next()
          }
        }
      }).catch(e => {
        console.error(e)
        store.commit('logout')
        next('login')
      })
    } else {
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
