<template>
  <div class="homepage-container">
    <h2>我的作品</h2>
    <works-list :list="works" @on-delete="onDelete" @on-copy="onCopy"></works-list>
    <a-row type="flex" justify="center">
      <a-button type="primary" size="large">
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
export default defineComponent({
  components: {
    WorksList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const works = computed(() => store.state.works.works)
    onMounted(() => {
      store.dispatch('fetchWorks')
    })
    const onDelete = (id: number) => {
      console.log(id)
      store.dispatch('deleteWork', id)
    }
    const onCopy = (id: number) => {
      store.dispatch('getWork', id).then(({ data }) => {
        console.log(data)
        data.title = data.title + '复制'
        delete data.id
        return store.dispatch('createWork', data).then(({ data }) => {
          console.log(data.id)
          router.push(`/editor/${data.id}`)
        })
      })
    }
    return {
      works,
      onDelete,
      onCopy
    }
  }
})
</script>
