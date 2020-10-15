<template>
  <div class="homepage-container">
    <div class="banner">
      <img class="banner-img" src="https://inproductmarketing-static.canva.cn/featureBanners/20201008-Double11-desktop_x2.jpg" style="background-color: rgb(0, 0, 0);">
      <div class="banner-text">
        <h2 class="text-headline" style="color: rgb(255, 255, 255);">创建精彩设计</h2>
        <a class="text-link" href="https://www.canva.cn/search/templates?q=%E5%8F%8C%E5%8D%81%E4%B8%80%E6%B5%B7%E6%8A%A5" >
          <p>购物狂欢节，双十一海报合辑</p>
        </a>
      </div>
    </div>
    <a-row class="poster-title" justify="space-between" align="middle">
      <h2 v-if="searchText">{{searchText}}的结果</h2>
      <h2 v-else>热门海报</h2>
    </a-row>
    <a-row :gutter="16">
      <template-list :list="templates"></template-list>
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
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store/index'
import TemplateList from '../components/TemplateList.vue'
import useLoadMore from '../hooks/useLoadMore'
export default defineComponent({
  components: {
    TemplateList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const isLogin = computed(() => store.state.user.isLogin)
    const works = computed(() => store.state.works.works)
    const templates = computed(() => store.state.works.templates)
    const total = computed(() => store.state.works.totalTemplates)
    const loading = computed(() => store.state.status.loading)
    const searchText = computed(() => store.state.works.searchText)
    const { loadMorePage, isLastPage } = useLoadMore('fetchWorks', total, { pageIndex: 0, pageSize: 8, title: searchText.value }, 8)
    onMounted(() => {
      if (isLogin.value) {
        store.dispatch('fetchWorks', { pageIndex: 0, pageSize: 4 })
        store.dispatch('fetchTemplates', { pageIndex: 0, pageSize: 8 })
      }
    })
    return {
      isLogin,
      works,
      templates,
      loadMorePage,
      loading,
      isLastPage,
      searchText
    }
  }
})
</script>

<style scoped>
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
.poster-title {
  height: 70px;
  line-height: 70px;
}
.poster-title h2 {
  margin-bottom: 0px;
}
</style>
