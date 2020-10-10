<template>
  <div class="homepage-container">
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">
            <img alt="Vue logo" src="../assets/logo.png" class="logo-img">
          </router-link>
        </div>
        <div class="right-col">
          <a-input-search
            v-model:value="value"
            placeholder="输入搜索的内容"
            @search="onSearch"
          />
          <a-button type="primary" @click="createDesign">
            创建设计
          </a-button>
          <user-profile :user="userInfo"></user-profile>
        </div>
      </a-layout-header>
      <a-layout-content style="padding: 0 50px">
        <a-layout style="padding: 24px 0; background: #fff">
          <a-layout-sider width="250" style="background: #fff">
            <a-menu
              mode="inline"
              style="height: 100%"
            >
              <a-menu-item key="1">
                <UserOutlined />
                <span>我的设计</span>
              </a-menu-item>
              <a-menu-item key="2">
                <UserOutlined />
                <span>我的设计</span>
              </a-menu-item>
              <a-menu-item key="3">
                <UserOutlined />
                <span>我的设计</span>
              </a-menu-item>
              <a-menu-item key="4">
                <UserOutlined />
                <span>我的设计</span>
              </a-menu-item>
            </a-menu>
          </a-layout-sider>
          <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
            <router-view></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { defineComponent, computed } from 'vue'
import UserProfile from '../components/UserProfile.vue'
import { GlobalDataProps } from '../store/index'
export default defineComponent({
  components: {
    UserOutlined,
    UserProfile
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const userInfo = computed(() => store.state.user)
    const createDesign = () => {
      if (userInfo.value.isLogin) {
        const payload = {
          title: '未命名作品',
          desc: '未命名作品',
          coverImg: 'http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png'
        }
        store.dispatch('createWork', payload).then(({ data }) => {
          router.push(`/editor/${data.id}`)
        })
      } else {
        router.push('/login')
      }
    }
    return {
      items: [0, 1, 2, 3, 4, 5],
      userInfo,
      createDesign
    }
  }
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header .logo-img {
  height: 60px;
}
.header .ant-input-search {
  width: 250px;
}
.right-col > * {
  margin-left: 30px !important;
}
.banner {
  display: flex;
  position: relative;
  height: 192px;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
}
.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.banner-text {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.text-headline {
  text-shadow: 0 0 1px rgba(68,92,116,.02), 0 2px 8px rgba(57,76,96,.15);
  font-size: 3rem;
}
.text-link {
  color: #ffffff;
}
.text-link:hover {
  color: #ffffff;
  text-decoration: underline;
}
.poster-item {
  position: relative;
  margin-bottom: 20px;
}
.tag-list {
  position: absolute;
  top: -4px;
  left: 6px;
}
.ant-card-cover img {
  height: 300px;
  object-fit: cover;
}
.description-detail {
  display: flex;
  justify-content: space-between;
}
</style>
