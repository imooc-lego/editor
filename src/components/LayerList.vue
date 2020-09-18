<template>
  <ul class="ant-list-items ant-list-bordered">
    <li
      class="ant-list-item"
      v-for="(item, index) in list" :key="item.id"
      :class="{active: item.id === selectedId}"
      @click="handleClick(item.id)"
    >
      <a-button shape="circle" size="sm">
        <template v-slot:icon><EyeOutlined /> </template
      ></a-button>
      <a-button shape="circle">
        <template v-slot:icon><LockOutlined /> </template
      ></a-button>
      <span>图层 - {{index}}</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { EyeOutlined, EyeInvisibleOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons-vue'
import { ComponentData } from '../store/index'
export default defineComponent({
  props: {
    list: {
      type: Array as PropType<ComponentData[]>,
      required: true
    },
    selectedId: {
      type: String,
      required: true
    }
  },
  emits: ['select'],
  components: {
    EyeOutlined,
    // EyeInvisibleOutlined,
    LockOutlined
    // UnlockOutlined
  },
  setup (props, context) {
    const handleClick = (id: string) => {
      context.emit('select', id)
    }
    return {
      handleClick
    }
  }
})
</script>

<style scoped>
.ant-list-item {
  padding: 10px 15px;
  transition: all 0.5s ease-out;
  cursor: pointer;
  justify-content: normal;
  border: 1px solid #fff;
  border-bottom-color: #f0f0f0;
}
.ant-list-item.active {
  border: 1px solid #1890ff;
}
.ant-list-item:hover {
  background: #e6f7ff;
}
.ant-list-item > * {
  margin-right: 10px;
}
.ant-list-item button {
  font-size: 12px;
}
</style>
