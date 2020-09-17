<template>
  <div class="l-image-component">
    <img :src="imageSrc" :style="styleProps" @click.prevent="handleClick" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useStylePick from '../hooks/useStylePick'
import { componentsDefaultProps, transformToComponentProps } from '../defaultProps'

// array that contains style props
export default defineComponent({
  name: 'l-image',
  props: transformToComponentProps(componentsDefaultProps['l-image'].props),
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
