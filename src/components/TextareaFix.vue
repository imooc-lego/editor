<template>
  <textarea
    class="ant-input" rows="3" v-bind="$attrs"
    :value="value"
    @input="onInput"
    @compositionstart="onStart"
    @compositionend="onEnd"
    ref="areaRef"
  >
  </textarea>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from 'vue'
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true
    }
  },
  name: 'TextAreaFix',
  emits: ['change'],
  setup (props, context) {
    const areaRef = ref<HTMLTextAreaElement | null>(null)
    let triggerFlag = false
    const onInput = (e: KeyboardEvent) => {
      console.log('triggered')
      if (triggerFlag) return
      context.emit('change', e)
    }
    const onStart = () => {
      triggerFlag = true
    }
    const onEnd = () => {
      triggerFlag = false
      if (areaRef.value) {
        areaRef.value.dispatchEvent(new Event('input'))
      }
    }
    return {
      areaRef,
      onInput,
      onStart,
      onEnd
    }
  }
})
</script>

<style>

</style>
