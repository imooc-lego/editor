<template>
  <div class="context-menu-component menu-container" ref="menuRef">
    <a-menu mode="vertical" style="width: 220px; border: 1px solid #ccc;" :selectable="false">
      <a-menu-item v-for="action in actions" :key="action.key" @click="action.action()">
        <span class="item-text">{{operationText[action.key].text}}</span>
        <span class="item-shortcut">{{operationText[action.key].shortcut}}</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { map } from 'lodash'
import { clickInsideElement } from '../helper'
import dataOperation, { operationText } from '../plugins/dataOperations'
export default defineComponent({
  emits: ['on-select'],
  setup (props, context) {
    const menuRef = ref<null | HTMLElement>(null)
    const componentId = ref('')
    const operations = dataOperation(componentId)
    const actions = map(operations, (val, key) => {
      return {
        key,
        action: val
      }
    })
    onMounted(() => {
      const domElement = menuRef.value as HTMLElement
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        const wrapperElement = clickInsideElement(e, 'edit-wrapper')
        if (wrapperElement) {
          domElement.style.display = 'block'
          domElement.style.top = e.pageY + 'px'
          domElement.style.left = e.pageX + 'px'
          const cid = wrapperElement.dataset.componentId
          if (cid) {
            componentId.value = cid
            context.emit('on-select', wrapperElement.dataset.componentId)
          }
        }
      })
      document.addEventListener('click', () => {
        domElement.style.display = 'none'
      })
    })
    return {
      menuRef,
      actions,
      operationText
    }
  }
})
</script>

<style>
.menu-container {
  display: none;
  position: absolute;
  background: #fff;
  z-index: 2000;
}
.menu-container .ant-menu-item {
  display: flex;
  justify-content: space-between;
}
.menu-container .ant-menu-item:hover {
  background: #efefef;
}
.ant-menu-item .item-shortcut {
  color: #ccc;
}
</style>
