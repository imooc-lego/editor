<template>
  <img
    :src="imageSrc" :style="styleProps"
    @click.prevent="handleClick" class="l-image-component"
    :draggable="false"
  />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useStylePick from '../hooks/useStylePick'
import useComponentClick from '../hooks/useComponentClick'
import { componentsDefaultProps, transformToComponentProps } from '../defaultProps'
const defaultProps = transformToComponentProps(componentsDefaultProps['l-image'].props)
defaultProps.isEditing = {
  type: Boolean,
  default: false
}
// array that contains style props
export default defineComponent({
  name: 'l-image',
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
