<template>
  <div class="create-component-list">
    <div
      v-for="(item, index) in list" :key="index"
      @click.prevent="onItemClick(item)" class="component-item"
    >
      <component :is="item"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LTitle from './LTitle.vue'
import LLink from './LLink.vue'
// the component name list
const componentsList = ['l-title', 'l-link']
export default defineComponent({
  components: {
    LTitle,
    LLink
  },
  name: 'components-list',
  emits: ['on-item-click'],
  setup (props, context) {
    const onItemClick = (type: string) => {
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
