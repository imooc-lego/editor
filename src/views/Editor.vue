<template>
  <div class="editor" id="editor-layout-main">
    <a-spin tip="读取中" class="ediotr-spinner" v-if="globalStatus.loading">
    </a-spin>
    <a-drawer
      title="设置面板"
      placement="right"
      width="400"
      :closable="true"
      v-model:visible="visible"
    >
      <publish-form></publish-form>
    </a-drawer>
    <div class="final-preview" v-if="visible">
      <div class="final-preview-inner">
        <final-page :page="pageState" :components="components"></final-page>
      </div>
    </div>
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
        Navigation One
      </a-menu-item>
    </a-menu>
    </div>
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <h4>{{pageState.title}}</h4>
        </div>
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
            <a-button type="primary" @click="saveWork">保存</a-button>
          </a-menu-item>
          <a-menu-item key="3">
            <a-button type="primary" @click="showModal = true">发布</a-button>
          </a-menu-item>
          <a-menu-item key="4" v-if="userInfo.isLogin">
            <a-dropdown-button>
              {{userInfo.nickName}}
              <template v-slot:overlay>
                <a-menu>
                  <a-menu-item key="1">详细资料</a-menu-item>
                  <a-menu-item key="2" @click="logout">登出</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown-button>
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
          <div class="preview-list" id="canvas-area" @click="setPageSetting" :class="{active: activePanel === 'page'}">
            <div class="body-container" :style="pageState.props">
              <div v-for="item in components" :key="item.id">
                <EditWrapper v-if="!item.isHidden"
                  :id="item.id"
                  @edit="editProps"
                  @update-position="updatePosition"
                  :active="currentId === item.id" :props="item.props"
                >
                  <component :is="item.name" v-bind="item.props"/>
                </EditWrapper>
              </div>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <a-tabs type="card" v-model:activeKey="activePanel">
          <a-tab-pane key="component" tab="属性设置">
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
          <a-tab-pane key="layer" tab="图层设置">
            <layer-list
              :list="components" :selectedId="currentId"
              @select="(id) => { editProps(id) }"
              @change="handleChange"
            >
            </layer-list>
          </a-tab-pane>
          <a-tab-pane key="page" tab="页面设置">
            <div class="page-settings">
              <props-table :props="pageState.props" mutationName="updatePage"></props-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import PublishForm from './PublishForm.vue'
import LText from '../components/LText.vue'
import LImage from '../components/LImage.vue'
import LShape from '../components/LShape.vue'
import EditWrapper from '../components/EditWrapper.vue'
import ComponentsList from '../components/ComponentsList.vue'
import EditGroup from '../components/EditGroup.vue'
import PropsTable from '../components/PropsTable.vue'
import LayerList from '../components/LayerList.vue'
import FinalPage from '../components/FinalPage.vue'
import mapPropsToComponents from '../propsMap'
import { ComponentData, GlobalDataProps } from '../store/index'
import { initHotKeys } from '../plugins/hotKeys'
import useContextMenu from '../hooks/useContextMenu'
import { message } from 'ant-design-vue'

export type TabType = 'component' | 'layer' | 'page'
export default defineComponent({
  name: 'Home',
  components: {
    LText,
    LImage,
    LShape,
    EditWrapper,
    ComponentsList,
    EditGroup,
    LayerList,
    PropsTable,
    FinalPage,
    PublishForm
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const route = useRoute()
    const components = computed(() => store.state.components)
    const currentId = computed(() => store.state.currentElement)
    const currentElement = computed<ComponentData>(() => store.getters.getCurrentElement)
    const userInfo = computed(() => store.state.user)
    const pageState = computed(() => store.state.page)
    const globalStatus = computed(() => store.state.status)
    const visible = ref(false)
    const showModal = ref(false)
    const activePanel = ref<TabType>('component')
    const menuRef = ref<null | HTMLElement>(null)
    initHotKeys()
    useContextMenu(menuRef)
    const currentWorkId = route.params.id
    let timer: any
    const saveWork = () => {
      store.dispatch('saveWork', { id: currentWorkId }).then(() => {
        message.success('保存成功', 2)
      })
    }
    onMounted(() => {
      // fetch work
      if (currentWorkId) {
        store.dispatch('getWork', currentWorkId)
      }
      // start autoSave timer, per 30 secs
      timer = setInterval(saveWork, 1000 * 30)
    })
    onUnmounted(() => {
      clearInterval(timer)
    })
    const handleOk = () => {
      showModal.value = false
    }
    watch(activePanel, (newValue) => {
      if (newValue !== 'component') {
        store.commit('editProps', '')
      }
    })
    const onItemCreated = (component: ComponentData) => {
      // we should copy this props, not pass by ref
      store.commit('addComponentToEditor', { name: component.name, props: { ...component.props } })
    }
    const editProps = (id: string) => {
      store.commit('editProps', id)
      activePanel.value = 'component'
    }
    const handleChange = (data: any) => {
      store.commit('updateComponent', data)
    }
    const setPageSetting = (e: Event) => {
      const currentTarget = e.target as HTMLElement
      if (currentTarget.classList.contains('body-container')) {
        store.commit('editProps', '')
        activePanel.value = 'page'
      }
    }
    const updatePosition = (data: { x: number; y: number; id: string}) => {
      const { x, y, id } = data
      store.commit('updateProp', { key: 'left', value: x, id })
      store.commit('updateProp', { key: 'top', value: y, id })
    }
    const logout = () => {
      store.commit('logout')
      message.success('退出登录成功，2秒后跳转到首页', 2)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
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
      menuRef,
      updatePosition,
      setPageSetting,
      activePanel,
      pageState,
      userInfo,
      globalStatus,
      logout,
      saveWork
    }
  }
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.header h4 {
  color: #ffffff;
}
.ediotr-spinner {
  position: fixed;
  right: 50%;
  top: 10px;
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
  padding: 0;
  margin: 0;
  position: relative;
  height: 600px;
  min-width: 322px;
  border: 1px solid #efefef;
  background: #fff;
  overflow: hidden;
}
.preview-list.active {
  border: 1px solid #1890ff;
}
.sidebar-container {
  padding: 20px;
}
.menu-container {
  display: none;
  position: absolute;
  z-index: 1000;
}
.body-container {
  width: 100%;
  height: 100%;
  background-size: cover;
}
.page-settings {
  padding: 16px;
}
.final-preview {
  position: absolute;
  width: calc(100% - 400px);
  height: 100%;
  background: transparent;
  top: 0;
  left: 0;
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.final-preview-inner {
  width: 322px;
  height: 600px;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  position: relative;
}
</style>
