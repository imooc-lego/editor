<template>
  <div class="homepage-container">
    <h2>我的作品</h2>
    <a-empty v-if="works.length === 0 && !loading">
      <template v-slot:description>
        <span> 还没有任何作品 </span>
      </template>
      <a-button type="primary" size="large" @click="createDesign">
        创建你的第一个设计 🎉
      </a-button>
    </a-empty>

    <works-list :list="works" @on-delete="onDelete" @on-copy="onCopy" :loadding="loading"></works-list>
    <a-row type="flex" justify="center">
      <a-button type="primary" size="large" @click="loadMorePage" v-if="!isLastPage" :loading="loading">
        加载更多
      </a-button>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { GlobalDataProps } from '../store/index'
import WorksList from '../components/WorksList.vue'
import useLoadMore from '../hooks/useLoadMore'
import useCreateDesign from '../hooks/useCreateDesign'
export default defineComponent({
  components: {
    WorksList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const works = computed(() => store.state.works.works)
    const total = computed(() => store.state.works.totalWorks)
    const loading = computed(() => store.state.status.loading)
    const { loadMorePage, isLastPage } = useLoadMore('fetchWorks', total, { pageIndex: 0, pageSize: 8 }, 8)
    const createDesign = useCreateDesign()
    onMounted(() => {
      store.dispatch('fetchWorks')
    })
    const onDelete = (id: number) => {
      store.dispatch('deleteWork', id)
    }
    const onCopy = (id: number) => {
      store.dispatch('copyWork', id).then(({ data }) => {
        router.push(`/editor/${data.id}`)
      })
    }
    return {
      works,
      onDelete,
      onCopy,
      loadMorePage,
      isLastPage,
      createDesign,
      loading
    }
  }
})
</script>
