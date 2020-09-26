<template>
  <div class="final-page" :style="page.props">
    <div v-for="item in components" :key="item.id">
      <component :is="item.name" v-bind="item.props"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ComponentData, PageData } from '../store/index'
import LText from '../components/LText.vue'
import LImage from '../components/LImage.vue'
export default defineComponent({
  components: {
    LText,
    LImage
  },
  props: {
    page: {
      type: Object as PropType<PageData>,
      required: true
    },
    components: {
      type: Array as PropType<ComponentData[]>,
      required: true
    }
  }
})
</script>

<style>
.final-page {
  width: 100%;
  height: 100%;
  background-size: cover;
}
</style>
