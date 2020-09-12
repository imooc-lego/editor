<template>
  <h2 :style="styleProps">
    {{text}}
  </h2>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useStylePick from '../hooks/useStylePick'

export const TitleProps = {
  text: {
    type: String,
    default: '大标题'
  },
  fontSize: {
    type: String,
    default: '30px'
  },
  fontWeight: {
    type: String,
    default: 'normal'
  },
  lineHeight: {
    type: String,
    default: '1'
  },
  textAlign: {
    type: String,
    default: 'left'
  }
}

// array that contains style props
export default defineComponent({
  props: TitleProps,
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
