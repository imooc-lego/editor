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
        <div class="sidebar-container">
          <h2>组件面板</h2>
          <components-list @on-item-click="onItemCreated">
          </components-list>
        </div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <ul class="preview-list">
            <li v-for="item in components" :key="item.id">
              <EditWrapper @edit="editProps(item.id)" :active="currentIndex === item.id" :props="item.props">
                <component :is="item.name" v-bind="item.props"/>
              </EditWrapper>
            </li>
          </ul>
        </a-layout-content>
      </a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <a-tabs type="card">
          <a-tab-pane key="1" tab="属性设置">
            <div v-if="currentElement">
              <div>
                <edit-group :props="currentElement.props"></edit-group>
              </div>
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
import LTitle from '../components/LTitle.vue'
import LLink from '../components/LLink.vue'
import EditWrapper from '../components/EditWrapper.vue'
import ComponentsList from '../components/ComponentsList.vue'
import EditGroup from '../components/EditGroup.vue'
import mapPropsToComponents from '../propsMap'
import componentsDefaultProps from '../defaultProps'
export default defineComponent({
  name: 'Home',
  components: {
    LTitle,
    LLink,
    EditWrapper,
    ComponentsList,
    EditGroup
  },
  setup () {
    const store = useStore()
    const components = computed(() => store.state.components)
    const currentIndex = computed(() => store.state.currentElement)
    const currentElement = computed(() => store.getters.getCurrentElement)
    const visible = ref(false)
    const showModal = ref(false)

    const handleOk = () => {
      showModal.value = false
    }
    const onItemCreated = (name: string) => {
      const { props } = componentsDefaultProps[name]
      // we should copy this props, not pass by ref
      store.commit('addComponentToEditor', { name, props: { ...props } })
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
      currentIndex,
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
.preview-container {
  padding: 24px;
  margin: 0;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.preview-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: relative;
  height: 600px;
  width: 320px;
  padding: 5px;
  border: 1px solid #efefef;
  background: #fff;
}
.sidebar-container {
  padding: 20px;
}
</style>
