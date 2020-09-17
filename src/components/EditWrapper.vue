<template>
<div class="edit-wrapper" @click="itemClick"
    :class="{active: active}" :style="styleProps"
    :draggable="true"
    @dragstart="handleDragStart"
>
  <slot></slot>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useStylePick from '../hooks/useStylePick'
export default defineComponent({
  name: 'ListWrapper',
  props: {
    key: {
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
  emits: ['edit'],
  setup (props, context) {
    // need to pick position absolute out, to go with the inner element
    const styleProps = useStylePick(props.props || {}, ['position', 'top', 'left'])
    const itemClick = () => {
      context.emit('edit', props.key)
    }
    const handleDragStart = (e: DragEvent) => {
      const currentElement = e.currentTarget as HTMLElement
      currentElement.style.backgroundColor = 'yellow'
      console.log(e.clientX)
      console.log(e.clientY)
    }
    return {
      itemClick,
      styleProps,
      handleDragStart
    }
  }
})
</script>

<style>
.edit-wrapper {
  padding: 5px;
  border: 1px dotted #efefef;
  cursor: pointer;
}
.edit-wrapper.active {
  border: 1px solid #1890ff;
}
.edit-wrapper h2 {
  position: static !important;
}
</style>
