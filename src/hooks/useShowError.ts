import { useStore } from 'vuex'
import { computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { GlobalDataProps } from '../store/index'

function useShowError () {
  const store = useStore<GlobalDataProps>()
  const error = computed(() => store.state.status.error)
  watch(() => error.value.status, (errorValue) => {
    if (errorValue) {
      message.error(error.value.message, 2)
    }
  })
}

export default useShowError
