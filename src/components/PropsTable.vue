<template>
  <div class="props-table">
    <li v-for="(value, key) in props" :key="key">
      {{key}}:
      <component
        v-if="maps[key].component === 'a-switch'"
        v-bind="extraProps[key]"
        :is="maps[key].component"
        :checked="maps[key].intialTransform(value)"
        @change="(e) => { handleCommit({ value: maps[key].afterTransform(e), key} ) }"
      />
      <component
        v-else
        :is="maps[key].component"
        v-bind="extraProps[key]"
        :value="maps[key].intialTransform(value)"
        @change="(e) => { handleCommit({ value: maps[key].afterTransform(e), key} ) }"
      />
    </li>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import maps from '../propsMap'
import defaults from '../defaultProps'
export default defineComponent({
  props: {
    type: {
      type: String,
      required: true
    },
    props: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const { commit } = useStore()
    const handleCommit = (data: any) => {
      commit('updateValue', data)
    }
    const extraProps = defaults[props.type].extraProps || {}
    return {
      maps,
      extraProps,
      handleCommit
    }
  }
})
</script>
