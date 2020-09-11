<template>
<div class="edit-wrapper" @click="itemClick" :class="{active: active}">
  <slot></slot>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
    }
  },
  emits: ['edit'],
  setup (props, context) {
    const itemClick = () => {
      context.emit('edit', props.key)
    }
    return {
      itemClick
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
</style>
