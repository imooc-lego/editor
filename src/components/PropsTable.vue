<template>
  <div class="props-table">
    <li v-for="(value, key) in props" :key="key">
      {{key}}:
      <component
        v-if="maps[key].component === 'a-switch'"
        :is="maps[key].component"
        :checked="maps[key].valueTransform(value)" @change="(e) => { maps[key].eventHandler(e, key) }"
      />
      <component
        v-else
        :is="maps[key].component"
        :value="maps[key].valueTransform(value)" @change="(e) => { maps[key].eventHandler(e, key) }"
      />
    </li>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import maps from '../propsMap'
export default defineComponent({
  props: {
    props: {
      type: Object,
      required: true
    }
  },
  setup () {
    return {
      maps
    }
  }
})
</script>
