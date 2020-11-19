import { computed } from 'vue'
import useHotKey from '../hooks/useHotKey'
import { GlobalDataProps } from '../store/index'
import { useStore } from 'vuex'
import { KeyHandler } from 'hotkeys-js'
import DataOperation from './dataOperations'
function useHotKeyExtra (command: string, callback: KeyHandler) {
  useHotKey(command, (event, keyEvent) => {
    const tagName = (event.target as HTMLElement).tagName
    const isInput = tagName === 'TEXTAREA' || tagName === 'INPUT'
    if (!isInput) {
      event.preventDefault()
      callback(event, keyEvent)
    }
  })
}
export function initHotKeys () {
  const store = useStore<GlobalDataProps>()
  const currentId = computed(() => store.state.editor.currentElement)
  const operations = DataOperation(currentId)
  useHotKeyExtra('ctrl+c, command+c', () => {
    operations.copy()
  })
  useHotKeyExtra('backspace, delete', () => {
    operations.delete()
  })
  useHotKeyExtra('ctrl+v, command+v', (event) => {
    operations.paste()
  })
  useHotKeyExtra('esc', () => {
    operations.cancel()
  })
  useHotKeyExtra('ctrl+z, command+z', () => {
    operations.undo()
  })
  useHotKeyExtra('ctrl+shift+z, command+shift+z', () => {
    operations.redo()
  })
  useHotKeyExtra('up', () => {
    operations.move('Up', 1)
  })
  useHotKeyExtra('down', () => {
    operations.move('Down', 1)
  })
  useHotKeyExtra('left', () => {
    operations.move('Left', 1)
  })
  useHotKeyExtra('right', () => {
    operations.move('Right', 1)
  })
  useHotKeyExtra('shift+up', () => {
    operations.move('Up', 10)
  })
  useHotKeyExtra('shift+down', () => {
    operations.move('Down', 10)
  })
  useHotKeyExtra('shift+left', () => {
    operations.move('Left', 10)
  })
  useHotKeyExtra('shift+right', () => {
    operations.move('Right', 10)
  })
}
