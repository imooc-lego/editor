import { ref, computed, ComputedRef } from 'vue'
import { useStore } from 'vuex'
interface LoadPrams {
  pageIndex?: number;
  pageSize?: number;
  [key: string]: any;
}
const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadPrams = {}, pageSize = 8) => {
  const store = useStore()
  // current page should equals 1, start from the second page
  const pageIndex = ref((params && params.pageIndex) || 0)
  const requestParams = computed(() => {
    return {
      ...params,
      pageIndex: pageIndex.value + 1
    }
  })
  // function to trigger load more
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      pageIndex.value++
    })
  }
  const isLastPage = computed(() => {
    console.log(Math.ceil((total.value || 1) / pageSize))
    console.log(pageIndex.value)
    return Math.ceil((total.value || 1) / pageSize) === pageIndex.value + 1
  })
  return {
    pageIndex,
    loadMorePage,
    isLastPage
  }
}

export default useLoadMore
