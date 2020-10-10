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
      { path: '', component: Home },
      { path: 'mywork', component: MyWork, meta: { requiredLogin: true } }
    ]
  },
  {
    path: '/editor/:id',
    name: 'Editor',
    component: () => import(/* webpackChunkName: "about" */ '../views/Editor.vue'),
    meta: { requiredLogin: true }
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    meta: { redirectAlreadyLogin: true }
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { user } = store.state
  const { token, isLogin } = user
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  if (!isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          next()
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
