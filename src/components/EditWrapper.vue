<template>
<div class="edit-wrapper" @click="itemClick"
    :draggable="true"
    @dragstart.stop="handleDragStart"
    @dragend.stop="handleDragEnd"
    :class="{active: active}" :style="styleProps"
>
  <slot></slot>
</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import useStylePick from '../hooks/useStylePick'
export default defineComponent({
  name: 'ListWrapper',
  props: {
    id: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object
    }
  },
  emits: ['edit', 'update-position'],
  setup (props, context) {
    const gap = reactive({
      x: 0,
      y: 0
    })
    // need to pick position absolute out, to go with the inner element
    const styleProps = useStylePick(props.props || {}, ['position', 'top', 'left'])
    const itemClick = () => {
      context.emit('edit', props.id)
    }
    const handleDragStart = (e: DragEvent) => {
      const currentElement = e.currentTarget as HTMLElement
      gap.x = e.clientX - currentElement.getBoundingClientRect().left
      gap.y = e.clientY - currentElement.getBoundingClientRect().top
      currentElement.style.opacity = '.5'
    }
    const handleDragEnd = (e: DragEvent) => {
      const container = document.getElementById('canvas-area') as HTMLElement
      const currentElement = e.currentTarget as HTMLElement
      console.log(currentElement)
      const finalXCord = e.clientX - container.offsetLeft - gap.x + 'px'
      const finalYCord = e.clientY - container.offsetTop - gap.y + 'px'
      currentElement.style.opacity = ''
      currentElement.style.top = finalYCord
      currentElement.style.left = finalXCord
      context.emit('update-position', { x: finalXCord, y: finalYCord, id: props.id })
    }
    return {
      itemClick,
      styleProps,
      handleDragStart,
      handleDragEnd
    }
  }
})
</script>

<style>
.edit-wrapper {
  padding: 0px;
  cursor: pointer;
  border: 1px solid #fff;
}
.edit-wrapper:hover {
  border: 1px dashed #ccc;
}
.edit-wrapper.active {
  border: 1px solid #1890ff;
}
.edit-wrapper .l-text-component, .edit-wrapper .l-image-component {
  position: static !important;
}
</style>
