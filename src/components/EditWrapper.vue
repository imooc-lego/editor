<template>
<div class="edit-wrapper" @click="itemClick"
    ref="editWrapper"
    :draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    :class="{active: active}" :style="styleProps"
>
  <slot></slot>
  <div class='resizers'>
    <div class='resizer top-left' @mousedown="startResize($event, 'top-left')"></div>
    <div class='resizer top-right'  @mousedown="startResize($event, 'top-right')"></div>
    <div class='resizer bottom-left' @mousedown="startResize($event, 'bottom-left')"></div>
    <div class='resizer bottom-right' @mousedown="startResize($event, 'bottom-right')"></div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, reactive, ref } from 'vue'
import useStylePick from '../hooks/useStylePick'
type ResizeDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
interface OriginalPositions {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
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
    const editWrapper = ref<null | HTMLElement>(null)
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
      const finalXCord = e.clientX - container.offsetLeft - gap.x + 'px'
      const finalYCord = e.clientY - container.offsetTop - gap.y + 'px'
      currentElement.style.opacity = ''
      currentElement.style.top = finalYCord
      currentElement.style.left = finalXCord
      context.emit('update-position', { x: finalXCord, y: finalYCord, id: props.id })
    }
    const caculateSize = (direction: ResizeDirection, e: MouseEvent, positions: OriginalPositions) => {
      const { left, right, top, bottom } = positions
      console.log(left)
      const { pageX, pageY } = e
      const container = document.getElementById('canvas-area') as HTMLElement
      const rightWidth = pageX - left
      const bottomHeight = pageY - top
      const leftWidth = right - pageX
      const topHeight = bottom - pageY
      const leftOffset = pageX - container.offsetLeft
      const topOffset = pageY - container.offsetTop
      switch (direction) {
        case 'top-left':
          return {
            width: leftWidth,
            height: topHeight,
            top: topOffset,
            left: leftOffset
          }
        case 'top-right':
          return {
            width: rightWidth,
            height: topHeight,
            top: topOffset
          }
        case 'bottom-left':
          return {
            width: leftWidth,
            height: bottomHeight,
            left: leftOffset
          }
        case 'bottom-right':
          return {
            width: rightWidth,
            height: bottomHeight
          }
        default:
          break
      }
    }
    const startResize = (event: MouseEvent, direction: ResizeDirection) => {
      const currentElement = editWrapper.value as HTMLElement
      currentElement.draggable = false
      const { left, right, top, bottom } = currentElement.getBoundingClientRect()
      const handleMove = (e: MouseEvent) => {
        if (currentElement) {
          const size = caculateSize(direction, e, { left, right, top, bottom })
          if (size) {
            if (size.left) {
              currentElement.style.left = size.left + 'px'
            }
            if (size.top) {
              currentElement.style.top = size.top + 'px'
            }
            currentElement.style.width = size.width + 'px'
            currentElement.style.height = size.height + 'px'
          }
        }
      }
      const handleMouseUp = () => {
        console.log(123)
        document.removeEventListener('mousemove', handleMove)
        currentElement.draggable = true
        nextTick(() => {
          document.removeEventListener('mouseup', this as any)
        })
      }
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return {
      itemClick,
      styleProps,
      handleDragStart,
      handleDragEnd,
      startResize,
      editWrapper
    }
  }
})
</script>

<style>
.edit-wrapper {
  padding: 0px;
  cursor: pointer;
  border: 1px solid transparent;
}
.edit-wrapper:hover {
  border: 1px dashed #ccc;
}
.edit-wrapper.active {
  border: 1px solid #1890ff;
  user-select: none;
  z-index: 1500;
}
.edit-wrapper .l-text-component, .edit-wrapper .l-image-component, .edit-wrapper .l-shape-component {
  position: static !important;
}
.edit-wrapper.active .resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%; /*magic to turn square into circle*/
  background: white;
  border: 3px solid #1890ff;
  position: absolute;
  display: block;
}
.edit-wrapper .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize; /*resizer cursor*/
}
.edit-wrapper .resizers .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}

</style>
