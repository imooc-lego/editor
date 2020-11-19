<template>
  <a-button type="primary" v-if="!user.isLogin" class="user-profile-component">
    <router-link to="/login">登录</router-link>
  </a-button>
  <div class="user-operation" v-else>
    <a-button type="primary" @click="createDesign" v-if="!smMode">
      创建设计
    </a-button>
    <a-button type="primary" class="user-profile-component" v-if="!smMode">
      <router-link to="/mywork">我的作品</router-link>
    </a-button>
    <a-dropdown-button  class="user-profile-component">
      <router-link to="/setting">{{user.data.nickName}}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="1" @click="createDesign" v-if="smMode">创建设计</a-menu-item>
          <a-menu-item key="2" v-if="smMode"><router-link to="/mywork" >我的作品</router-link></a-menu-item>
          <a-menu-item key="3"><router-link to="/setting">个人设置</router-link></a-menu-item>
          <a-menu-item key="4" @click="logout">登出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserProps } from '../store/user'
import useCreateDesign from '../hooks/useCreateDesign'

export default defineComponent({
  name: 'user-profile',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    },
    smMode: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const createDesign = useCreateDesign()
    const logout = () => {
      store.commit('logout')
      message.success('退出登录成功，2秒后跳转到首页', 2)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
    return {
      logout,
      createDesign
    }
  }
})
</script>
<style>
.user-profile-dropdown {
  border-radius: 2px !important;
}
.user-operation > * {
  margin-right: 30px;
}
</style>
