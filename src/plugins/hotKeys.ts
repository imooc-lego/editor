import { computed } from 'vue'
import useHotKey from '../hooks/useHotKey'
import { GlobalDataProps } from '../store/index'
import { useStore } from 'vuex'
import DataOperation from './dataOperations'

export function initHotKeys () {
  const store = useStore<GlobalDataProps>()
  const currentId = computed(() => store.state.editor.currentElement)
  const operations = DataOperation(currentId)
  useHotKey('ctrl+c, command+c', () => {
    operations.copy()
  })
  useHotKey('backspace, delete', (event) => {
    const tagName = (event.target as HTMLElement).tagName
    const isInput = tagName === 'TEXTAREA' || tagName === 'INPUT'
    if (!isInput) {
      operations.delete()
    }
  })
  useHotKey('ctrl+v, command+v', () => {
    operations.paste()
  })
  useHotKey('esc', () => {
    operations.cancel()
  })
  useHotKey('ctrl+z, command+z', () => {
    operations.undo()
  })
  useHotKey('ctrl+shift+z, command+shift+z', () => {
    operations.redo()
  })
}
