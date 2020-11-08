<template>
  <div class="stub-foo" v-bind="$attrs">
    <slot name="title"></slot>
    <slot name="icon"></slot>
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'stub-foo'
})
</script>
