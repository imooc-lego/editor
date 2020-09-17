<template>
  <div class="create-component-list">
    <div
      v-for="(item, index) in list" :key="index"
      @click.prevent="onItemClick(item)" class="component-item"
    >
      <component :is="item.name" v-bind="item.props"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LText from './LText.vue'
import LImage from './LImage.vue'
import { componentsDefaultProps } from '../defaultProps'
const textDefaultProps = componentsDefaultProps['l-text'].props
const imageDefaultProps = componentsDefaultProps['l-image'].props

// the component name list
const componentsList = [
  {
    name: 'l-text',
    props: {
      ...textDefaultProps,
      text: '大标题',
      fontSize: '30px',
      fontWeight: 'bold',
      tag: 'h2'
    }
  },
  {
    name: 'l-text',
    props: {
      ...textDefaultProps,
      text: '正文内容',
      tag: 'p'
    }
  },
  {
    name: 'l-text',
    props: {
      ...textDefaultProps,
      text: '链接内容',
      color: '#1890ff',
      textDecoration: 'underline',
      tag: 'p'
    }
  },
  {
    name: 'l-text',
    props: {
      ...textDefaultProps,
      text: '按钮内容',
      color: '#ffffff',
      backgroundColor: '#1890ff',
      borderWidth: '1px',
      borderColor: '#1890ff',
      borderRadius: '2px',
      tag: 'button'
    }
  },
  {
    name: 'l-image',
    props: {
      ...imageDefaultProps,
      height: '60px'
    }
  }
]
export default defineComponent({
  components: {
    LText,
    LImage
  },
  name: 'components-list',
  emits: ['on-item-click'],
  setup (props, context) {
    const onItemClick = (type: any) => {
      context.emit('on-item-click', type)
    }
    return {
      list: componentsList,
      onItemClick
    }
  }
})
</script>

<style scoped>
.component-item {
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
