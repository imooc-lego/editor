import { createApp } from 'vue'
import axios from 'axios'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import 'cropperjs/dist/cropper.css'
import App from './App.vue'
import router from './router'
import store, { ICustomAxiosConfig } from './store'
axios.defaults.baseURL = 'http://182.92.168.192:8081/api/'
const app = createApp(App)
axios.interceptors.request.use(config => {
  const newConfig = config as ICustomAxiosConfig
  store.commit('setLoading', { status: true, opName: newConfig.mutationName })
  store.commit('setError', { status: false, message: '' })
  return config
})

axios.interceptors.response.use(resp => {
  store.commit('setLoading', { status: false })
  return resp
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', { status: false })
  return Promise.reject(e.response.data)
})

app.use(store).use(router).use(Antd)
app.mount('#app')
