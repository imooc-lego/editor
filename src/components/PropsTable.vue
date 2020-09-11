<template>
  <div class="props-table">
    <li v-for="(value, key) in finalProps" :key="key" class="prop-item">
      <span class="label">{{value.text}}:</span>
      <div :class="`prop-component component-${value.component}`">
        <component
          :is="value.component"
          v-bind="value.extraProps"
          :[value.valueProp]="value.value"
          v-on="value.events"
        />
      </div>
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
        const { component, intialTransform, afterTransform, eventName, text, valueProp } = maps[key]
        return {
          component,
          text,
          valueProp,
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
<style>
.prop-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}
.label {
  margin-right: 20px;
}
.component-a-slider {
  width: 80%;
}
</style>
