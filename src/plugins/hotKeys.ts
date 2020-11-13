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
  useHotKey('up', (e) => {
    e.preventDefault()
    operations.move('Up', 1)
  })
  useHotKey('down', (e) => {
    e.preventDefault()
    operations.move('Down', 1)
  })
  useHotKey('left', () => {
    operations.move('Left', 1)
  })
  useHotKey('right', () => {
    operations.move('Right', 1)
  })
  useHotKey('shift+up', (e) => {
    e.preventDefault()
    operations.move('Up', 10)
  })
  useHotKey('shift+down', (e) => {
    e.preventDefault()
    operations.move('Down', 10)
  })
  useHotKey('shift+left', () => {
    operations.move('Left', 10)
  })
  useHotKey('shift+right', () => {
    operations.move('Right', 10)
  })
}
