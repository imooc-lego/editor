<template>
  <div class="home" id="components-layout-demo-basic">
    <a-drawer
      title="设置面板"
      placement="right"
      width="400"
      :closable="true"
      v-model:visible="visible"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
    <a-modal
      title="Title"
      v-model:visible="showModal"
      @ok="handleOk"
    >
      <p>发布成功</p>
    </a-modal>
    <a-layout>
      <a-layout-header class="header">
        <div class="logo" />
        <a-menu
          :selectable="false"
          theme="dark"
          mode="horizontal"
          :style="{ lineHeight: '64px' }"
        >
          <a-menu-item key="1">
            <a-button type="primary" @click="visible = true">预览和设置</a-button>
          </a-menu-item>
          <a-menu-item key="2">
            <a-button type="primary">保存</a-button>
          </a-menu-item>
          <a-menu-item key="3">
            <a-button type="primary" @click="showModal = true">发布</a-button>
          </a-menu-item>
        </a-menu>
      </a-layout-header>
    </a-layout>
    <a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <h2>点击下列组件列表添加</h2>
        <div  @click="onItemCreated">
          <Title></Title>
        </div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '90vh' }"
        >
          预览区域
          <ul>
            <li v-for="(item, index) in components" :key="index">
              <div @click="editProps(index)">
                <component :is="item.name" v-bind="item.props"/>
              </div>
            </li>
          </ul>
        </a-layout-content>
      </a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <a-tabs type="card">
          <a-tab-pane key="1" tab="属性设置">
            <div v-if="currentElement">
              <prop-table :props="currentElement.props"></prop-table>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="功能设置">
            Content of Tab Pane 2
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import Title, { defaultProps } from '../components/Title.vue'
import PropTable from '../components/PropsTable.vue'
import mapPropsToComponents from '../propsMap'
export default defineComponent({
  name: 'Home',
  components: {
    Title,
    PropTable
  },
  setup () {
    const store = useStore()
    const components = computed(() => store.state.components)
    const currentElement = computed(() => store.getters.getCurrentElement)
    const visible = ref(false)
    const showModal = ref(false)

    const handleOk = () => {
      showModal.value = false
    }
    const onItemCreated = (type: string) => {
      store.commit('addComponentToEditor', { name: 'title', props: defaultProps })
    }
    const editProps = (index: number) => {
      store.commit('editProps', index)
    }
    return {
      visible,
      showModal,
      handleOk,
      onItemCreated,
      components,
      editProps,
      currentElement,
      mapPropsToComponents
    }
  }
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}
</style>
