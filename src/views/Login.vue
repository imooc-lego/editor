<template>
<div class="login-page">
  <a-row>
    <a-col :span="8" class="aside">
      <div class="logo-area">
        <router-link to="/">
          <img alt="Vue logo" src="../assets/logo.png" class="logo-img">
        </router-link>
      </div>
      <div class="aside-inner">
        <img src="~@/assets/user-interface.svg" />
        <figure class="text-center mb-5 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 8 8" style="enable-background:new 0 0 8 8;" xml:space="preserve">
              <path fill="#fff" d="M3,1.3C2,1.7,1.2,2.7,1.2,3.6c0,0.2,0,0.4,0.1,0.5c0.2-0.2,0.5-0.3,0.9-0.3c0.8,0,1.5,0.6,1.5,1.5c0,0.9-0.7,1.5-1.5,1.5
                C1.4,6.9,1,6.6,0.7,6.1C0.4,5.6,0.3,4.9,0.3,4.5c0-1.6,0.8-2.9,2.5-3.7L3,1.3z M7.1,1.3c-1,0.4-1.8,1.4-1.8,2.3
                c0,0.2,0,0.4,0.1,0.5c0.2-0.2,0.5-0.3,0.9-0.3c0.8,0,1.5,0.6,1.5,1.5c0,0.9-0.7,1.5-1.5,1.5c-0.7,0-1.1-0.3-1.4-0.8
                C4.4,5.6,4.4,4.9,4.4,4.5c0-1.6,0.8-2.9,2.5-3.7L7.1,1.3z"></path>
            </svg>
        </figure>
        <h2>这是我用过的最好的建站工具</h2>
        <span class="text-white-70">王铁锤, Google</span>
      </div>
    </a-col>
    <a-col :span="16" class="login-area">
      <a-form
        :model="form" :rules="rules"
        ref="publishForm" layout="vertical"
      >
        <h2>欢迎回来👋</h2>
        <p>使用手机号码和验证码登录到慕课乐高</p>
        <a-form-item label="手机号码" required name="username">
          <a-input v-model:value="form.username" placeholder="手机号码">
            <template v-slot:prefix><UserOutlined style="color:rgba(0,0,0,.25)"/></template>
          </a-input>
        </a-form-item>
        <a-form-item label="验证码" required name="password">
          <a-input v-model:value="form.password" type="password" placeholder="四位验证码">
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
        { required: true, message: '密码不能为空', trigger: 'blur' }
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
        }).catch(e => {
          console.log(e)
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
<style scoped>
.logo-area {
  position: absolute;
  top: 30px;
  width: 150px;
}
.aside {
  height: 100vh;
  background-color: #21325b;
  background-image: url('~@/assets/background.svg');
}
.aside img {
  width: 100%;
}
.aside h2 {
  color: #fff;
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
  color: rgba(255, 255, 255, 0.7);
  display: block;
}
.aside, .login-area {
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-area .ant-input {
  font-size: 16px ;
  padding: 20px 30px ;
}
</style>
