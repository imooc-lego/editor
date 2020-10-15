<template>
  <div class="homepage-container">
    <a-spin tip="读取中" class="editor-spinner" v-if="loading">
    </a-spin>
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">
            <img alt="Vue logo" src="../assets/logo.png" class="logo-img">
          </router-link>
        </div>
        <div class="right-col">
          <a-input-search
            v-model:value="searchText"
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
          <a-layout-content :style="{ padding: '0 24px', minHeight: '280px', maxWidth: '1480px', margin: '0 auto' }">
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
import { useRoute } from 'vue-router'
import { defineComponent, computed, ref, watch } from 'vue'
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
    const currentMutation = ref('fetchTemplates')
    watch(() => route.name, (newValue) => {
      if (newValue === 'Home') {
        currentMutation.value = 'fetchTemplates'
      } else if (newValue === 'MyWork') {
        currentMutation.value = 'fetchWorks'
      }
    })
    const userInfo = computed(() => store.state.user)
    const loading = computed(() => store.state.status.loading)
    const searchText = ref('')
    const createDesign = useCreateDesign()
    const onSearch = () => {
      const title = searchText.value.trim()
      if (title !== '') {
        store.dispatch(currentMutation.value, { title, pageIndex: 0, pageSize: 8 })
      }
    }
    return {
      items: [0, 1, 2, 3, 4, 5],
      userInfo,
      createDesign,
      loading,
      searchText,
      onSearch
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
.editor-spinner {
  position: fixed;
  right: 50%;
  top: 10px;
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
