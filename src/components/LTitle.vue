<template>
  <h2 :style="styleProps">
    {{text}}
  </h2>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useStylePick from '../hooks/useStylePick'
import { componentsDefaultProps, transformToComponentProps } from '../defaultProps'

// array that contains style props
export default defineComponent({
  name: 'l-title',
  props: transformToComponentProps(componentsDefaultProps['l-title'].props),
  setup (props) {
    const styleProps = useStylePick(props)
    return {
      styleProps
    }
  }
})
</script>

<style scoped>
h2 {
  margin-bottom: 0;
}
</style>
