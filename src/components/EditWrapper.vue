<template>
<div class="edit-wrapper" @click="itemClick"
    @dblclick="itemEdit"
    ref="editWrapper"
    :class="{active: active}" :style="styleProps"
    :data-component-id="id"
>
  <div class="move-wrapper" ref="moveWrapper" @mousedown="startMove">
    <slot></slot>
  </div>
  <div class='resizers'>
    <div class='resizer top-left' @mousedown="startResize($event, 'top-left')"></div>
    <div class='resizer top-right'  @mousedown="startResize($event, 'top-right')"></div>
    <div class='resizer bottom-left' @mousedown="startResize($event, 'bottom-left')"></div>
    <div class='resizer bottom-right' @mousedown="startResize($event, 'bottom-right')"></div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, nextTick, reactive, ref, computed, watch } from 'vue'
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
    editing: {
      type: String
    },
    props: {
      type: Object
    }
  },
  emits: ['active', 'update-position', 'editing'],
  setup (props, context) {
    const gap = reactive({
      x: 0,
      y: 0
    })
    let size: any
    const editWrapper = ref<null | HTMLElement>(null)
    const moveWrapper = ref<null | HTMLElement>(null)
    let isMoving = false
    // need to pick position absolute out, to go with the inner element
    const styleProps = useStylePick(props.props || {}, ['position', 'top', 'left', 'width', 'height'])
    const isEditable = computed(() => props.editing === props.id)
    watch(isEditable, (newValue) => {
      if (newValue && editWrapper.value) {
        editWrapper.value.focus()
      }
    })
    const itemClick = () => {
      context.emit('active', props.id)
    }
    const itemEdit = () => {
      context.emit('editing', props.id)
    }
    const caculateMovePosition = (e: MouseEvent) => {
      const container = document.getElementById('canvas-area') as HTMLElement
      const left = e.clientX - container.offsetLeft - gap.x
      const top = e.clientY - container.offsetTop - gap.y + container.scrollTop
      return {
        left,
        top
      }
    }
    const startMove = (e: MouseEvent) => {
      const currentElement = editWrapper.value as HTMLElement
      gap.x = e.clientX - currentElement.getBoundingClientRect().left
      gap.y = e.clientY - currentElement.getBoundingClientRect().top
      const handleMove = (e: MouseEvent) => {
        isMoving = true
        const { left, top } = caculateMovePosition(e)
        currentElement.style.top = top + 'px'
        currentElement.style.left = left + 'px'
      }
      const handleMouseUp = (e: MouseEvent) => {
        const { left, top } = caculateMovePosition(e)
        document.removeEventListener('mousemove', handleMove)
        if (isMoving) {
          context.emit('update-position', { left, top, id: props.id })
          isMoving = false
        }
        nextTick(() => {
          document.removeEventListener('mouseup', handleMouseUp)
        })
      }
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    const caculateSize = (direction: ResizeDirection, e: MouseEvent, positions: OriginalPositions) => {
      const { left, right, top, bottom } = positions
      const { pageX, pageY } = e
      const container = document.getElementById('canvas-area') as HTMLElement
      const rightWidth = pageX - left
      const bottomHeight = pageY - top
      const leftWidth = right - pageX
      const topHeight = bottom - pageY
      const leftOffset = pageX - container.offsetLeft
      const topOffset = pageY - container.offsetTop + container.scrollTop
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
      const moveElement = moveWrapper.value as HTMLElement
      // get the component element
      const currentComponent = moveElement.firstElementChild as HTMLElement
      const resizeElements = [currentElement, currentComponent]
      const { left, right, top, bottom } = currentElement.getBoundingClientRect()
      const handleMove = (e: MouseEvent) => {
        if (currentElement) {
          size = caculateSize(direction, e, { left, right, top, bottom })
          resizeElements.forEach(element => {
            const { style } = element
            if (size) {
              if (size.left) {
                style.left = size.left + 'px'
              }
              if (size.top) {
                style.top = size.top + 'px'
              }
              style.width = size.width + 'px'
              style.height = size.height + 'px'
              // context.emit('update-position', { ...size, id: props.id })
            }
          })
        }
      }
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMove)
        context.emit('update-position', { ...size, id: props.id })
        nextTick(() => {
          document.removeEventListener('mouseup', handleMouseUp)
        })
      }
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return {
      itemClick,
      styleProps,
      startResize,
      editWrapper,
      moveWrapper,
      itemEdit,
      isEditable,
      startMove
    }
  }
})
</script>

<style>
.edit-wrapper {
  padding: 0px;
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
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
