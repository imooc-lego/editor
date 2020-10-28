<template>
  <div class="homepage-container">
    <a-spin tip="读取中" class="editor-spinner" v-if="loading">
    </a-spin>
    <a-layout>
      <a-layout-header class="header" :class="{'transparent-header': isHomePage}">
        <div class="page-title">
          <router-link to="/">
            <img alt="Vue logo" src="../assets/logo.png" class="logo-img" v-if="isHomePage">
            <img alt="Vue logo" src="../assets/new-logo.png" class="logo-img" v-else>
          </router-link>
        </div>
        <div class="right-col">
          <a-button type="primary" @click="createDesign">
            创建设计
          </a-button>
          <user-profile :user="userInfo"></user-profile>
        </div>
      </a-layout-header>
      <a-layout-content v-if="isHomePage" class="home-layout">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-content style="padding: 0 50px" v-else>
        <a-layout style="padding: 24px 0; background: #fff">
          <a-layout-content :style="{ padding: '0 24px', minHeight: '85vh', maxWidth: '1480px', margin: '0 auto', width: '100%' }">
            <router-view></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout-content>
      <a-layout-footer :style="{ paddingTop: '0' }">
        <ul class="list-inline mb-0" :class="{'extra-margin': !isHomePage}">
          <li class="list-inline-item">© 慕课网（imooc.com）版权所有 | 津ICP备20000929号-2</li>
          <li class="list-inline-item"><a href="#" target="_blank">购买课程</a></li>
          <li class="list-inline-item"><a href="#" target="_blank">文档</a></li>
          <li class="list-inline-item"><a href="#" target="_blank">开源仓库</a></li>
          <li class="list-inline-item"><a href="#" target="_blank">帮助</a></li>
        </ul>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import UserProfile from '../components/UserProfile.vue'
import { GlobalDataProps } from '../store/index'
import useCreateDesign from '../hooks/useCreateDesign'
export default defineComponent({
  components: {
    UserProfile
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const isHomePage = computed(() => route.name === 'Home')
    const userInfo = computed(() => store.state.user)
    const loading = computed(() => store.state.status.loading)
    const createDesign = useCreateDesign()
    return {
      userInfo,
      createDesign,
      loading,
      isHomePage
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
.ant-layout-header {
  z-index: 50;
  background: #fff;
  box-shadow: 0 10px 15px rgba(0, 0, 0, .1);
}
.transparent-header {
  background: transparent;
}
.home-layout {
  position: relative;
  top: -70px;
}
.editor-spinner {
  position: fixed;
  right: 50%;
  top: 10px;
  z-index: 100;
}
.header .logo-img {
  height: 45px;
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
.list-inline {
  list-style: none;
  display: flex;
  justify-content: center;
}
.list-inline li {
  margin-right: 20px;
}
.extra-margin {
  margin-top: 70px;
}
</style>
