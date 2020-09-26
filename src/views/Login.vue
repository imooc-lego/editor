<template>
<div class="login-page">
  <a-row>
    <a-col :span="8" class="aside">
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
        <p>使用用户名和密码登录到慕课乐高</p>
        <a-form-item label="用户名" required name="username">
          <a-input v-model:value="form.username" placeholder="用户名">
            <template v-slot:prefix><UserOutlined style="color:rgba(0,0,0,.25)"/></template>
          </a-input>
        </a-form-item>
        <a-form-item label="密码" required name="password">
          <a-input v-model:value="form.password" type="password" placeholder="密码">
            <template v-slot:prefix><LockOutlined style="color:rgba(0,0,0,.25)"/></template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="publish" size="large">
            登录
          </a-button>
          <a-button @click="publish" size="large" :style="{ marginLeft: '20px' }">
            获取验证码
          </a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, Ref } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'

interface RuleFormInstance {
  validate: () => Promise<any>;
}
export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined
  },
  setup () {
    const form = reactive({
      username: '',
      password: ''
    })
    const publishForm = ref() as Ref<RuleFormInstance>
    const rules = {
      username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '密码不能为空', trigger: 'blur' }
      ]
    }
    const publish = () => {
      publishForm.value.validate().then(() => { console.log('passed') })
    }

    return {
      form,
      rules,
      publishForm,
      publish
    }
  }
})
</script>
<style>
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
