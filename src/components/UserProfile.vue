<template>
  <a-button type="primary" v-if="!user.isLogin" class="user-profile-component">
    <router-link to="/login">登录</router-link>
  </a-button>
  <a-dropdown-button v-else class="user-profile-component">
    {{user.data.nickName}}
    <template v-slot:overlay>
      <a-menu class="user-profile-dropdown">
        <a-menu-item key="1"><router-link to="/mywork">我的作品</router-link></a-menu-item>
        <a-menu-item key="2"><router-link to="/setting">个人中心</router-link></a-menu-item>
        <a-menu-item key="3" @click="logout">登出</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown-button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserProps } from '../store/user'

export default defineComponent({
  name: 'user-profile',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const logout = () => {
      store.commit('logout')
      message.success('退出登录成功，2秒后跳转到首页', 2)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
    return {
      logout
    }
  }
})
</script>
<style>
.user-profile-dropdown {
  border-radius: 2px !important;
}
</style>
