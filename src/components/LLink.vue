<template>
<div>
  <a :style="styleProps" :href="href" @click="$event.preventDefault()">
    {{text}}
  </a>
</div>
</template>
<script lang="ts">
import useStylePick from '../hooks/useStylePick'
import { defineComponent } from 'vue'

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

export default defineComponent({
  props: LinkProps,
  setup (props) {
    const styleProps = useStylePick(props)
    return {
      styleProps
    }
  }
})
</script>
