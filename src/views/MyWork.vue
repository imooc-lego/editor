<template>
  <div class="homepage-container">
    <h2>我的作品</h2>
    <works-list :list="works"></works-list>
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
import { GlobalDataProps } from '../store/index'
import WorksList from '../components/WorksList.vue'
export default defineComponent({
  components: {
    WorksList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const works = computed(() => store.state.works.works)
    onMounted(() => {
      store.dispatch('fetchWorks')
    })
    return {
      works
    }
  }
})
</script>
