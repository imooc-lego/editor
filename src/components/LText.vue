<template>
  <div class="l-text-component">
    <component :is="tag" :style="styleProps" @click.prevent="handleClick">
      {{text}}
    </component>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useStylePick from '../hooks/useStylePick'
import { componentsDefaultProps, transformToComponentProps } from '../defaultProps'
const defaultProps = transformToComponentProps(componentsDefaultProps['l-text'].props)
defaultProps.tag = {
  type: String,
  default: 'p'
}
// array that contains style props
export default defineComponent({
  name: 'l-text',
  props: {
    ...defaultProps
  },
  setup (props) {
    const styleProps = useStylePick(props)
    const handleClick = () => {
      if (props.actionType && props.url) {
        window.location.href = props.url
      }
    }

    return {
      styleProps,
      handleClick
    }
  }
})
</script>

<style scoped>
.l-text-component h2, .l-text-component p {
  margin-bottom: 0;
}
.l-text-component button {
  padding: 5px 10px;
  cursor: pointer;
}
</style>
