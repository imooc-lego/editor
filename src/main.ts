import { createApp } from 'vue'
import axios from 'axios'
import Antd from 'ant-design-vue'
import Lego from 'lego-components'
import 'ant-design-vue/dist/antd.css'
import 'lego-components/dist/lego-components.css'
import 'cropperjs/dist/cropper.css'
import App from './App.vue'
import router from './router'
import store, { ICustomAxiosConfig } from './store'
// generating different urls based on env
let baseBackendURL = ''
let baseH5URL = ''
let baseStaticURL = ''

if (process.env.NODE_ENV === 'development' || process.env.VUE_APP_IS_STAGING) {
  // 这里是本地的请求 URL
  // staging 也就是测试环境 URL
  baseBackendURL = 'http://182.92.168.192:8081'
  baseH5URL = 'http://182.92.168.192:8082'
  baseStaticURL = 'http://182.92.168.192:8080'
} else {
  // 生产环境 URL
  baseBackendURL = 'https://www.imooc-lego.com'
  baseH5URL = 'https://h5.imooc-lego.com'
  baseStaticURL = 'https://statistic-res.imooc-lego.com'
}

export { baseBackendURL, baseH5URL, baseStaticURL }

axios.defaults.baseURL = `${baseBackendURL}/api/`
const app = createApp(App)
axios.interceptors.request.use(config => {
  const newConfig = config as ICustomAxiosConfig
  store.commit('setLoading', { status: true, opName: newConfig.mutationName })
  store.commit('setError', { status: false, message: '' })
  return config
})

axios.interceptors.response.use(resp => {
  store.commit('setLoading', { status: false })
  if (resp.data.errno !== 0) {
    store.commit('setError', { status: true, message: resp.data.message })
  }
  return resp
}, e => {
  const error = e.response ? e.response.data : e.message
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', { status: false })
  return Promise.reject(error)
})

app.use(store).use(router).use(Antd).use(Lego)
app.mount('#app')
