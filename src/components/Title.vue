<template>
  <h2 :style="styleProps">
    {{text}}
  </h2>
</template>
<script lang="ts">
import { pick } from 'lodash'
import { defineComponent, computed } from 'vue'

// Props in component validation
export const TitleProps = {
  text: {
    type: String,
    default: 'Hello World'
  },
  fontSize: {
    type: String,
    default: '30px'
  }
}
export const defaultProps = {
  text: 'Hello World',
  fontSize: '30px'
}
// array that contains style props
export const stylePropsArr = ['fontSize']

export default defineComponent({
  props: TitleProps,
  setup (props) {
    const styleProps = computed(() => pick(props, stylePropsArr))
    return {
      styleProps
    }
  }
})
</script>
