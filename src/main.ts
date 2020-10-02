import { createApp } from 'vue'
import axios from 'axios'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import 'cropperjs/dist/cropper.css'
import App from './App.vue'
import router from './router'
import store from './store'
axios.defaults.baseURL = 'http://182.92.168.192:8081/api/'
const app = createApp(App)

app.use(store).use(router).use(Antd)
app.mount('#app')
