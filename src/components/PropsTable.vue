<template>
  <div class="props-table">
    <li v-for="(value, key) in finalProps" :key="key">
      {{value.text}}:

      <component
        :is="value.component"
        v-bind="value.extraProps"
        :value="value.value"
        v-on="value.events"
      />
    </li>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { map } from 'lodash'
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
    const finalProps = computed(() => {
      return map(props.props, (value, key) => {
        const { component, intialTransform, afterTransform, eventName, text } = maps[key]
        return {
          component,
          text,
          value: intialTransform(value),
          extraProps: extraProps[key],
          events: {
            [eventName]: (e: any) => { handleCommit({ value: afterTransform(e), key }) }
          }
        }
      })
    })
    return {
      maps,
      extraProps,
      handleCommit,
      finalProps
    }
  }
})
</script>
