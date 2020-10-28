<template>
  <div class="homepage-container">
    <div class="banner">
      <img class="banner-img" src="https://marketplace.canva.cn/MADLFFTeBmM/1/thumbnail_large/canva-%E6%A1%8C%E9%9D%A2%E5%B7%A5%E5%85%B7-desk-tools-MADLFFTeBmM.jpg" style="background-color: rgb(0, 0, 0);">
      <div class="banner-text">
        <h2 class="text-headline" style="color: rgb(255, 255, 255);">海量精彩设计 一键生成</h2>
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索一下，快速找模版"
          @search="onSearch"
        />
      </div>
    </div>
    <!-- <a-row>
      <a-col :span="8" class="feature-item">
        <Html5TwoTone :size=""/>
        <h2>专注H5 始终如一</h2>
      </a-col>
      <a-col :span="8" class="feature-item">
        <h2>专注H5 始终如一</h2>
      </a-col>
      <a-col :span="8" class="feature-item">
        <h2>专注H5 始终如一</h2>
      </a-col>
    </a-row> -->
    <div class="content-container">
      <a-row class="poster-title" type="flex" align="middle">
        <h2 v-if="currentSearchText">{{currentSearchText}}的结果</h2>
        <a-button
          shape="circle" size="small"
          v-if="currentSearchText" :style="{marginLeft: '10px'}"
          @click="clearSearch"
        >
          ×
        </a-button>
        <h2 v-else>热门海报</h2>
      </a-row>
      <a-row :gutter="16">
        <a-empty v-if="templates.length === 0 && !loading">
          <template v-slot:description>
            <span> 没找到任何海报 换个关键词试试 </span>
          </template>
        </a-empty>
        <template-list :list="templates" type="template"></template-list>
      </a-row>
      <a-row type="flex" justify="center">
        <a-button type="primary" size="large" @click="loadMorePage" v-if="!isLastPage" :loading="loading">
          加载更多
        </a-button>
      </a-row>
      <div class="my-works" v-if="isLogin && works.length > 0">
        <a-row type="flex" justify="space-between" align="middle" class="poster-title" >
          <h2>我的作品</h2>
          <router-link to="/mywork">查看我的所有作品</router-link>
        </a-row>
        <a-row :gutter="16">
          <template-list :list="works"></template-list>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store/index'
import TemplateList from '../components/TemplateList.vue'
import useLoadMore from '../hooks/useLoadMore'
import { Html5TwoTone } from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    TemplateList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const searchText = ref('')
    const isLogin = computed(() => store.state.user.isLogin)
    const works = computed(() => store.state.works.works)
    const templates = computed(() => store.state.works.templates)
    const total = computed(() => store.state.works.totalTemplates)
    const loading = computed(() => store.state.status.loading)
    const currentSearchText = computed(() => store.state.works.searchText)
    const { loadMorePage, isLastPage } = useLoadMore('fetchTemplates', total, { pageIndex: 0, pageSize: 8, title: searchText.value }, 8)
    const onSearch = () => {
      const title = searchText.value.trim()
      if (title !== '') {
        store.dispatch('fetchTemplates', { title, pageIndex: 0, pageSize: 8 })
      }
    }
    const clearSearch = () => {
      store.dispatch('fetchTemplates', { title: '', pageIndex: 0, pageSize: 8 })
    }
    onMounted(() => {
      if (isLogin.value) {
        store.dispatch('fetchWorks', { pageIndex: 0, pageSize: 4 })
      }
      store.dispatch('fetchTemplates', { pageIndex: 0, pageSize: 8 })
    })
    return {
      isLogin,
      works,
      templates,
      loadMorePage,
      loading,
      isLastPage,
      searchText,
      onSearch,
      currentSearchText,
      clearSearch
    }
  }
})
</script>

<style>
.banner {
  display: flex;
  position: relative;
  height: 300px;
  width: 100%;
  overflow: hidden;
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
.banner-text .ant-input-search {
  width: 40%;
}
.banner-text .ant-input {
  height: 40px;
  font-size: 17px;
  padding: 7px 15px;
  padding-right: 30px;
}
.text-headline {
  text-shadow: 0 0 1px rgba(68,92,116,.02), 0 2px 8px rgba(57,76,96,.15);
  font-size: 2rem;
}
.text-link {
  color: #ffffff;
}
.text-link:hover {
  color: #ffffff;
  text-decoration: underline;
}
.feature-item {
  text-align: center;
}
.content-container {
  background: #fff;
  padding: 30px 24px;
  min-height: 85vh;
  max-width: 1480px;
  margin: 0 auto;
  width: 100%;
}
.poster-item {
  position: relative;
  margin-bottom: 20px;
}
.poster-title {
  height: 70px;
  line-height: 70px;
}
.poster-title h2 {
  margin-bottom: 0px;
}
</style>
