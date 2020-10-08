<template>
  <div class="props-table">
    <li v-for="(value, key) in finalProps"
      :key="key" class="prop-item"
      :class="{'no-text': !value.text}"
      :id="`item-${value.component}-${key}`"
    >
      <span class="label" v-if="value.text">{{value.text}}:</span>
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
import ColorPicker from './ColorPicker.vue'
import IconSwitch from './IconSwitch.vue'
import ShadowPicker from './ShadowPicker.vue'
import ImageProcesser from './ImageProcess.vue'
import BackgroundProcesser from './BackgroundProcesser.vue'
export default defineComponent({
  props: {
    props: {
      type: Object,
      required: true
    },
    mutationName: {
      type: String,
      default: 'updateProp'
    }
  },
  components: {
    ColorPicker,
    IconSwitch,
    ShadowPicker,
    ImageProcesser,
    BackgroundProcesser
  },
  setup (props) {
    const { commit } = useStore()
    const handleCommit = (data: any) => {
      commit(props.mutationName, data)
    }
    const finalProps = computed(() => {
      return map(props.props, (value, key) => {
        const {
          component, intialTransform, afterTransform,
          eventName, text, valueProp, options, subComponent, extraProps = {}
        } = maps[key]
        return {
          component,
          text,
          valueProp,
          value: intialTransform(value),
          extraProps,
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
  width: 28%;
}
.prop-item.no-text {
  display: inline-block;
  margin: 0 10px 0 0;
}
#item-icon-switch-2 {
  margin-left: 28%;
}
.prop-component {
  width: 70%;
}
/* .component-a-slider {
  width: 80%;
} */
.component-a-select .ant-select {
  width: 150px;
}
.prop-component.component-shadow-picker, .prop-component.component-image-processer, .prop-component.component-background-processer {
  width: 100%;
}
#item-background-processer-1 {
  width: 100%;
  cursor: pointer;
  margin-bottom: 15px;
}
#item-background-processer-1 .styled-upload-component .uploader-container {
  min-height: 200px;
}
</style>
