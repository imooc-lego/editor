import hotkeys, { KeyHandler } from 'hotkeys-js'
import { onMounted, onUnmounted } from 'vue'
export type Options = {
  filter?: typeof hotkeys.filter;
  element?: HTMLElement;
  splitKey?: string;
  scope?: string;
  keyup?: boolean;
  keydown?: boolean;
};
const useHotKey = (keys: string, callback: KeyHandler, options: Options = {}) => {
  onMounted(() => {
    hotkeys(keys, options, callback)
  })
  onUnmounted(() => {
    hotkeys.unbind(keys, callback)
  })
}

export default useHotKey
