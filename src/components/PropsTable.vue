<template>
  <div class="props-table">
    <li v-for="(value, key) in finalProps" :key="key" class="prop-item">
      <span class="label">{{value.text}}:</span>
      <div :class="`prop-component component-${value.component}`">
        <component
          v-if="!value.options"
          :is="value.component"
          v-bind="value.extraProps"
          :[value.valueProp]="value.value"
          v-on="value.events"
        />
        <component
          v-else
          :is="value.component"
          v-bind="value.extraProps"
          :[value.valueProp]="value.value"
          v-on="value.events"
        >
          <component
            :is="value.subComponent"
            v-for="(option, k) in value.options" :key="k"
            :value="option.value"
          >
            {{option.text}}
          </component>
        </component>
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
import ColorPicker from './ColorPicker.vue'
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
  components: {
    ColorPicker
  },
  setup (props) {
    const { commit } = useStore()
    const handleCommit = (data: any) => {
      commit('updateValue', data)
    }
    const extraProps = defaults[props.type].extraProps || {}
    const finalProps = computed(() => {
      return map(props.props, (value, key) => {
        console.log(key)
        const {
          component, intialTransform, afterTransform,
          eventName, text, valueProp, options, subComponent
        } = maps[key]
        return {
          component,
          text,
          valueProp,
          value: intialTransform(value),
          extraProps: extraProps[key],
          events: {
            [eventName]: (e: any) => { handleCommit({ value: afterTransform(e), key }) }
          },
          options,
          subComponent
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
  width: 17%;
}
.component-a-slider {
  width: 80%;
}
</style>
