<template>
<div>
  <a :style="styleProps" :href="href" @click="$event.preventDefault()">
    {{text}}
  </a>
</div>
</template>
<script lang="ts">

import { pick } from 'lodash'
import { defineComponent, computed } from 'vue'

// Props in component validation
export const LinkProps = {
  text: {
    type: String,
    default: '百度链接'
  },
  href: {
    type: String,
    default: 'http://abc.com'
  },
  fontSize: {
    type: String,
    default: '15px'
  }
}
// array that contains style props
export const stylePropsArr = ['fontSize']

export default defineComponent({
  props: LinkProps,
  setup (props) {
    const styleProps = computed(() => pick(props, stylePropsArr))
    return {
      styleProps
    }
  }
})
</script>
