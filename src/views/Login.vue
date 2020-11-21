<template>
<div class="login-page">
  <a-row>
    <a-col :span="12" class="aside">
      <div class="aside-inner">
        <router-link to="/">
          <img alt="Vue logo" src="../assets/logo2.png" class="logo-img">
        </router-link>
        <h2>这是我用过的最好的建站工具</h2>
        <span class="text-white-70">王铁锤, Google</span>
      </div>
    </a-col>
    <a-col :span="12" class="login-area">
      <a-form
        :model="form" :rules="rules"
        ref="publishForm" layout="vertical"
      >
        <h2>欢迎回来</h2>
        <p class="subTitle">使用手机号码和验证码登录到慕课乐高</p>
        <a-form-item label="手机号码" required name="username">
          <a-input v-model:value="form.username" placeholder="手机号码">
            <template v-slot:prefix><UserOutlined style="color:rgba(0,0,0,.25)"/></template>
          </a-input>
        </a-form-item>
        <a-form-item label="验证码" required name="password">
          <a-input v-model:value="form.password" placeholder="四位验证码">
            <template v-slot:prefix><LockOutlined style="color:rgba(0,0,0,.25)"/></template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="login" size="large"
            :loading="status.loading && status.opName === 'login'"
          >
            {{ status.loading ? '加载中' : '登录'}}
          </a-button>
          <a-button @click="getCode" size="large"
            :style="{ marginLeft: '20px' }" :disabled="codeButtonDisable"
            :loading="status.loading && status.opName === 'getCode'"
          >
            {{ counter === 60 ? '获取验证码' : `${counter}秒后重发` }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, Ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import axios, { AxiosRequestConfig } from 'axios'
import { message } from 'ant-design-vue'
import { GlobalDataProps } from '../store/index'
import { isMobile } from '../helper'
import showError from '../hooks/useShowError'

interface RuleFormInstance {
  validate: () => Promise<any>;
}
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    showError()
    const counter = ref(60)
    let timer: any
    const form = reactive({
      username: '',
      password: ''
    })
    const publishForm = ref() as Ref<RuleFormInstance>
    const status = computed(() => store.state.status)
    const cellnumberValidator = (rule: any, value: string) => {
      const passed = isMobile(value.trim())
      // eslint-disable-next-line prefer-promise-reject-errors
      return passed ? Promise.resolve() : Promise.reject('手机号码格式不正确')
    }
    const startCounter = () => {
      counter.value--
      timer = setInterval(() => {
        counter.value--
      }, 1000)
    }
    watch(counter, (newValue) => {
      if (newValue === 0) {
        clearInterval(timer)
        counter.value = 60
      }
    })
    const codeButtonDisable = computed(() => {
      return !isMobile(form.username.trim()) || (counter.value < 60)
    })
    const rules = {
      username: [
        { required: true, message: '手机号码不能为空', trigger: 'blur' },
        { validator: cellnumberValidator, trigger: 'blur' }
      ],
      password: [
        { required: true, message: '验证码不能为空', trigger: 'blur' }
      ]
    }
    const login = () => {
      publishForm.value.validate().then(() => {
        const payload = {
          phoneNumber: form.username,
          veriCode: form.password
        }
        store.dispatch('loginAndFetch', payload).then(rawData => {
          message.success('登录成功 2秒后跳转首页')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        })
      })
    }
    const getCode = () => {
      axios.post('/users/genVeriCode', { phoneNumber: form.username }, { mutationName: 'getCode' } as AxiosRequestConfig).then(() => {
        message.success('验证码已发送，请注意查收', 5)
        startCounter()
      })
    }
    return {
      form,
      rules,
      publishForm,
      login,
      getCode,
      status,
      isMobile,
      counter,
      codeButtonDisable
    }
  }
})
</script>
<style>
.logo-area {
  position: absolute;
  top: 30px;
  width: 150px;
}
.aside {
  height: 100vh;
  background-color: #1a1919;
  background-image: url('~@/assets/login.png');
  background-size: cover;
  background-repeat: no-repeat;
}
.aside .logo-img {
  width: 200px;
  margin-bottom: 20px;
}
.aside h2 {
  color: #CCCCCC;
  font-size: 29px;
}
.aside-inner {
  width: 60%;
  text-align: center;
}
.login-area {
  height: 100vh;
}
.login-area .ant-form {
  width: 350px;
}
.text-white-70 {
  color: #999;
  display: block;
  font-size: 19px;
}
.aside, .login-area {
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-area h2 {
  color: #333333;
  font-size: 29px;
}
.login-area .subTitle {
  color: #666666;
  font-size: 19px;
}
.login-area .ant-form-item-label {
  display: none;
}
.login-area .ant-input-prefix {
  left: auto;
  right: 30px;
  font-size: 19px;
}
.login-area .ant-input {
  font-size: 17px;
  padding: 20px 45px 20px 30px;
  background-color: #ebf2ff;
  border-color: #ebf2ff;
}
</style>
