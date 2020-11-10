<template>
  <a-collapse v-model:activeKey="currentKey">
    <a-collapse-panel v-for="item in editGroups" :key="item.text" :header="item.text">
      <prop-table :props="item.props" :mutationExtraData="{ isProps: true }"></prop-table>
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts">
import { difference } from 'lodash'
import { defineComponent, PropType, computed, ref } from 'vue'
import PropTable from '../components/PropsTable.vue'
interface GroupProps {
  text: string;
  items: string[];
}
const defaultEditGroups: GroupProps[] = [
  {
    text: '尺寸',
    items: ['height', 'width', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom']
  },
  {
    text: '边框',
    items: ['borderStyle', 'borderColor', 'borderWidth', 'borderRadius']
  },
  {
    text: '阴影与透明度',
    items: ['opacity', 'boxShadow']
  },
  {
    text: '位置',
    items: ['left', 'top']
  },
  {
    text: '事件功能',
    items: ['actionType', 'url']
  }
]
export default defineComponent({
  props: {
    props: {
      type: Object,
      required: true
    },
    groups: {
      type: Array as PropType<GroupProps[]>,
      default: defaultEditGroups
    }
  },
  components: {
    PropTable
  },
  setup (props) {
    const currentKey = ref(props.groups.length ? props.groups[0].text : '')
    const newGroups = computed(() => {
      const allNormalProps = defaultEditGroups.reduce((prev, current) => {
        return [...prev, ...current.items]
      }, [] as string[])
      // tag 不能编辑，把它过滤掉
      allNormalProps.push('tag')
      allNormalProps.push('right')
      allNormalProps.push('position')
      // 计算每一个组件的独特属性，也就是把通用属性都去掉以后的属性
      const speicalProps = difference(Object.keys(props.props), allNormalProps)
      currentKey.value = '基本属性'
      return [
        {
          text: '基本属性',
          items: speicalProps
        },
        ...props.groups
      ]
    })
    const editGroups = computed(() => {
      return newGroups.value.map(group => {
        const propsMap = {} as { [key: string]: any }
        group.items.forEach(item => {
          propsMap[item] = props.props[item]
        })
        return {
          ...group,
          props: propsMap
        }
      })
    })
    return {
      currentKey,
      editGroups
    }
  }
})
</script>

<style>

</style>
