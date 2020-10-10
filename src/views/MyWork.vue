<template>
  <div class="homepage-container">
    <h2>我的作品</h2>
    <works-list :list="works" @on-delete="onDelete" @on-copy="onCopy"></works-list>
    <a-row type="flex" justify="center">
      <a-button type="primary" size="large" @click="loadMorePage" v-if="!isLastPage">
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
export default defineComponent({
  components: {
    WorksList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const works = computed(() => store.state.works.works)
    const total = computed(() => store.state.works.totalWorks)
    const { loadMorePage, isLastPage } = useLoadMore('fetchWorks', total, { pageIndex: 0, pageSize: 8 }, 8)
    onMounted(() => {
      store.dispatch('fetchWorks')
    })
    const onDelete = (id: number) => {
      store.dispatch('deleteWork', id)
    }
    const onCopy = (id: number) => {
      store.dispatch('getWork', id).then(({ data }) => {
        const { title, desc, coverImg, content } = data
        const payload = {
          title: title + '复制',
          desc,
          coverImg,
          content
        }
        // delete some of the data
        return store.dispatch('createWork', payload).then(({ data }) => {
          router.push(`/editor/${data.id}`)
        })
      })
    }
    return {
      works,
      onDelete,
      onCopy,
      loadMorePage,
      isLastPage
    }
  }
})
</script>
