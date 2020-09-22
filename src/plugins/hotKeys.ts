import { computed } from 'vue'
import { message } from 'ant-design-vue'
import useHotKey from '../hooks/useHotKey'
import { ComponentData, GlobalDataProps } from '../store/index'
import { useStore } from 'vuex'

export function initHotKeys () {
  const store = useStore<GlobalDataProps>()
  const currentId = computed(() => store.state.currentElement)
  const currentElement = computed<ComponentData>(() => store.getters.getCurrentElement)
  useHotKey('ctrl+c, command+c', () => {
    if (currentId.value) {
      store.commit('copyComponent', currentId.value)
      message.success('已拷贝当前图层', 1)
    }
  })
  useHotKey('backspace, delete, del', () => {
    if (currentId.value) {
      store.commit('deleteComponent', currentId.value)
      message.error('删除当前图层成功', 1)
    }
  })
  useHotKey('ctrl+v, command+v', () => {
    if (currentElement.value && store.state.copiedComponent) {
      store.commit('pasteCopiedComponent')
      message.success('已黏贴当前图层', 1)
    }
  })
}
