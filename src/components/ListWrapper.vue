<template>
<div class="list-wrapper" @click="itemClick">
  <slot></slot>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ListWrapper',
  emits: ['item-click'],
  setup (props, context) {
    const itemClick = () => {
      context.emit('item-click')
    }
    return {
      itemClick
    }
  }
})
</script>
