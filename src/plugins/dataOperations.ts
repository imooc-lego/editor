import { ComputedRef, Ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { GlobalDataProps } from '../store/index'
import { useStore } from 'vuex'
export type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right'
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
        message.success('删除当前图层成功', 1)
      }
    },
    cancel: () => {
      if (componentId.value) {
        store.commit('setActive', '')
      }
    },
    undo: () => {
      const undoIsDisabled = computed<boolean>(() => store.getters.checkUndoDisable)
      if (!undoIsDisabled.value) {
        store.commit('undo')
      }
    },
    redo: () => {
      const redoIsDisabled = computed<boolean>(() => store.getters.checkRedoDisable)
      if (!redoIsDisabled.value) {
        store.commit('redo')
      }
    },
    move: (direction: MoveDirection, amount: number) => {
      if (componentId.value) {
        store.commit('moveComponent', { direction, amount })
      }
    }
  }
}

export const operationText: { [key: string]: {text: string; shortcut: string} } = {
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
    shortcut: 'Backspace / Delete'
  },
  cancel: {
    text: '取消选中',
    shortcut: 'ESC'
  },
  undo: {
    text: '撤销',
    shortcut: '⌘Z / Ctrl+Z'
  },
  redo: {
    text: '重做',
    shortcut: '⌘⇧Z / Ctrl+Shift+Z'
  },
  move: {
    text: '上下左右移动一像素',
    shortcut: '↑ ↓ → ←'
  },
  moveTen: {
    text: '上下左右移动十像素',
    shortcut: 'Shift + ↑ ↓ → ←'
  }
}
