<template>
  <component :is="tag" @click.prevent="handleClick" :style="styleProps" class="l-text-component">
    {{text}}
  </component>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useStylePick from '../hooks/useStylePick'
import useComponentClick from '../hooks/useComponentClick'
import { componentsDefaultProps, transformToComponentProps } from '../defaultProps'
const defaultProps = transformToComponentProps(componentsDefaultProps['l-text'].props)
defaultProps.tag = {
  type: String,
  default: 'p'
}
defaultProps.isEditing = {
  type: Boolean,
  default: false
}
// array that contains style props
export default defineComponent({
  name: 'l-text',
  props: {
    ...defaultProps
  },
  setup (props) {
    const styleProps = useStylePick(props)
    const handleClick = useComponentClick(props)
    return {
      styleProps,
      handleClick
    }
  }
})
</script>

<style scoped>
h2.l-text-component, p.l-text-component {
  margin-bottom: 0;
}
button.l-text-component {
  padding: 5px 10px;
  cursor: pointer;
}
.l-text-component {
  box-sizing: border-box;
  white-space: pre-wrap;
}
</style>
