<template>
<div>
  <a :style="styleProps" :href="href" @click="$event.preventDefault()">
    {{text}}
  </a>
</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { componentsDefaultProps, transformToComponentProps } from '../defaultProps'
import useStylePick from '../hooks/useStylePick'

export default defineComponent({
  props: transformToComponentProps(componentsDefaultProps['l-link'].props),
  setup (props) {
    const styleProps = useStylePick(props)
    return {
      styleProps
    }
  }
})
</script>
