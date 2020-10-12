import { ComputedRef, Ref } from 'vue'
import { message } from 'ant-design-vue'
import { GlobalDataProps } from '../store/index'
import { useStore } from 'vuex'

export default function dataOperations (componentId: ComputedRef<string> | Ref<string>) {
  const store = useStore<GlobalDataProps>()
  return {
    copy: () => {
      if (componentId.value) {
        store.commit('copyComponent', componentId.value)
        message.success('已拷贝当前图层', 1)
      }
    },
    paste: () => {
      if (componentId.value && store.state.editor.copiedComponent) {
        store.commit('pasteCopiedComponent')
        message.success('已黏贴当前图层', 1)
      }
    },
    delete: () => {
      if (componentId.value) {
        store.commit('deleteComponent', componentId.value)
        message.error('删除当前图层成功', 1)
      }
    },
    cancel: () => {
      if (componentId.value) {
        store.commit('setActive', '')
      }
    }
  }
}

export const operationText: { [key: string]: any} = {
  copy: {
    text: '拷贝图层',
    shortcut: '⌘C / Ctrl+C'
  },
  paste: {
    text: '粘贴图层',
    shortcut: '⌘V / Ctrl+V'
  },
  delete: {
    text: '删除图层',
    shortcut: 'DEL / Backspace'
  },
  cancel: {
    text: '取消选中',
    shortcut: 'ESC'
  }
}
