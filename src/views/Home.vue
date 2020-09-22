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
    <div class="menu-container" ref="menuRef">
    <a-menu mode="vertical" style="width: 200px; border: 1px solid #ccc;">
      <a-menu-item key="1">
        <MailOutlined />
        Navigation One
      </a-menu-item>
      <a-menu-item key="2">
        <MailOutlined />
        Navigation One
      </a-menu-item>
      <a-menu-item key="3">
        <MailOutlined />
        Navigation One
      </a-menu-item>
    </a-menu>
    </div>
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
        <a-layout-content class="preview-container" id="canvas-area">
          <p>画布区域</p>
          <ul class="preview-list">
            <li v-for="item in components" :key="item.id">
              <EditWrapper v-if="!item.isHidden"
                @edit="editProps(item.id)"
                :active="currentId === item.id" :props="item.props"
              >
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
              <div v-if="!currentElement.isLocked">
                <edit-group :props="currentElement.props"></edit-group>
              </div>
              <div v-else>
                <a-empty>
                  <template #description>
                    <p>该元素被锁定，无法编辑</p>
                  </template>
                </a-empty>
              </div>
            </div>
            <div v-else>
              <a-empty>
                <template #description>
                  <p>在画布中选择元素并开始编辑</p>
                </template>
              </a-empty>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="图层设置">
            <layer-list
              :list="components" :selectedId="currentId"
              @select="(id) => { editProps(id) }"
              @change="handleChange"
            >
            </layer-list>
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref } from 'vue'
import { useStore } from 'vuex'
import LText from '../components/LText.vue'
import LImage from '../components/LImage.vue'
import EditWrapper from '../components/EditWrapper.vue'
import ComponentsList from '../components/ComponentsList.vue'
import EditGroup from '../components/EditGroup.vue'
import LayerList from '../components/LayerList.vue'
import mapPropsToComponents from '../propsMap'
import { ComponentData, GlobalDataProps } from '../store/index'
import { initHotKeys } from '../plugins/hotKeys'
import useContextMenu from '../hooks/useContextMenu'
export default defineComponent({
  name: 'Home',
  components: {
    LText,
    LImage,
    EditWrapper,
    ComponentsList,
    EditGroup,
    LayerList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const components = computed(() => store.state.components)
    const currentId = computed(() => store.state.currentElement)
    const currentElement = computed<ComponentData>(() => store.getters.getCurrentElement)
    const visible = ref(false)
    const showModal = ref(false)
    const menuRef = ref<null | HTMLElement>(null)
    initHotKeys()
    useContextMenu(menuRef)
    const handleOk = () => {
      showModal.value = false
    }
    const onItemCreated = (component: ComponentData) => {
      // we should copy this props, not pass by ref
      store.commit('addComponentToEditor', { name: component.name, props: { ...component.props } })
    }
    const editProps = (id: string) => {
      store.commit('editProps', id)
    }
    const handleChange = (data: any) => {
      store.commit('updateComponent', data)
    }
    return {
      visible,
      showModal,
      handleOk,
      onItemCreated,
      handleChange,
      components,
      editProps,
      currentId,
      currentElement,
      mapPropsToComponents,
      menuRef
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
  border: 1px solid #efefef;
  background: #fff;
}
.sidebar-container {
  padding: 20px;
}
.menu-container {
  display: none;
  position: absolute;
  z-index: 1000;
}
</style>
