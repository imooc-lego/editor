<template>
  <div class="editor" id="editor-layout-main">
    <a-spin tip="读取中" class="editor-spinner" v-if="globalStatus.loading">
    </a-spin>
    <context-menu
      @on-select="(id) => { setActive(id) }"
    />
    <a-drawer
      title="设置面板"
      placement="right"
      width="400"
      :closable="true"
      v-model:visible="visible"
    >
      <publish-form
        @panel-close="visible = false"
        @publish-success="visible = false; showModal = true"
      >
      </publish-form>
    </a-drawer>
    <div class="final-preview" v-if="visible">
      <div class="final-preview-inner">
        <final-page :page="pageState" :components="components"></final-page>
      </div>
    </div>
    <a-modal
      title="发布成功"
      v-model:visible="showModal"
      width="700px"
      :footer="null"
    >
      <channel-form/>
    </a-modal>
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">
            <img alt="Vue logo" src="../assets/logo-simple.png" class="logo-img">
          </router-link>
          <input-edit :value="pageState.title" @change="titleChange">
            <h4>{{pageState.title}}</h4>
          </input-edit>
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
            <a-button type="primary" @click="publishWork">发布</a-button>
          </a-menu-item>
          <a-menu-item key="4">
            <user-profile :user="userInfo"></user-profile>
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
                  :editing="currentEditing"
                  @active="setActive"
                  @editing="setEditing"
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
              @select="(id) => { setActive(id, true) }"
              @change="handleChange"
            >
            </layer-list>
          </a-tab-pane>
          <a-tab-pane key="page" tab="页面设置">
            <div class="page-settings">
              <props-table :props="pageState.props" mutationName="updatePageProps"></props-table>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { forEach, pickBy } from 'lodash'
import PublishForm from './PublishForm.vue'
import ChannelForm from './ChannelForm.vue'
import LText from '../components/LText.vue'
import LImage from '../components/LImage.vue'
import LShape from '../components/LShape.vue'
import EditWrapper from '../components/EditWrapper.vue'
import ComponentsList from '../components/ComponentsList.vue'
import ContextMenu from '../components/ContextMenu.vue'
import EditGroup from '../components/EditGroup.vue'
import PropsTable from '../components/PropsTable.vue'
import LayerList from '../components/LayerList.vue'
import FinalPage from '../components/FinalPage.vue'
import UserProfile from '../components/UserProfile.vue'
import InputEdit from '../components/InputEdit.vue'
import mapPropsToComponents from '../propsMap'
import { GlobalDataProps } from '../store/index'
import { ComponentData } from '../store/editor'
import { initHotKeys } from '../plugins/hotKeys'
import { takeScreenshotAndUpload } from '../helper'

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
    PublishForm,
    ChannelForm,
    ContextMenu,
    UserProfile,
    InputEdit
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const components = computed(() => store.state.editor.components)
    const currentId = computed(() => store.state.editor.currentElement)
    const currentEditing = computed(() => store.state.editor.currentEditing)
    const currentElement = computed<ComponentData>(() => store.getters.getCurrentElement)
    const userInfo = computed(() => store.state.user)
    const pageState = computed(() => store.state.editor.page)
    const globalStatus = computed(() => store.state.status)
    const visible = ref(false)
    const showModal = ref(false)
    const activePanel = ref<TabType>('component')
    initHotKeys()
    const currentWorkId = route.params.id
    let timer: any
    const saveWork = () => {
      store.dispatch('saveWork', { id: currentWorkId }).then(() => {
        message.success('保存成功', 2)
      })
    }
    const publishWork = async () => {
      store.commit('setActive', '')
      const { data } = await takeScreenshotAndUpload('canvas-area')
      store.commit('updatePage', { key: 'coverImg', value: data.url })
      await store.dispatch('saveAndPublishWork', { id: currentWorkId })
      showModal.value = true
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
    watch(activePanel, (newValue) => {
      if (newValue !== 'component') {
        store.commit('setActive', '')
      }
    })
    const onItemCreated = (component: ComponentData) => {
      // we should copy this props, not pass by ref
      store.commit('addComponentToEditor', { name: component.name, props: { ...component.props } })
    }
    const setActive = (id: string, notSwitchPanel = false) => {
      store.commit('setActive', id)
      if (!notSwitchPanel) {
        activePanel.value = 'component'
      }
    }
    const setEditing = (id: string) => {
      store.commit('setEditing', id)
      activePanel.value = 'component'
    }
    const handleChange = (data: any) => {
      store.commit('updateComponent', data)
    }
    const setPageSetting = (e: Event) => {
      const currentTarget = e.target as HTMLElement
      if (currentTarget.classList.contains('body-container')) {
        store.commit('setActive', '')
        activePanel.value = 'page'
      }
    }
    const updatePosition = (data: { left: number; top: number; id: string; width: number; height: number}) => {
      const { id } = data
      forEach(pickBy(data, (v, k) => k !== 'id'), (value, key) => {
        const newValue = (key === 'width' || key === 'height') ? value + 'px' : value.toString()
        store.commit('updateProp', { key, value: newValue, id })
      })
    }
    const titleChange = (newTitle: string) => {
      store.commit('updatePage', { key: 'title', value: newTitle })
      nextTick(() => {
        saveWork()
      })
    }
    return {
      visible,
      showModal,
      onItemCreated,
      handleChange,
      components,
      setActive,
      setEditing,
      currentId,
      currentElement,
      currentEditing,
      mapPropsToComponents,
      updatePosition,
      setPageSetting,
      activePanel,
      pageState,
      userInfo,
      globalStatus,
      saveWork,
      publishWork,
      titleChange
    }
  }
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.header .logo-img {
  margin-right: 20px;
  height: 40px;
}
.page-title {
  display: flex;
}
.header h4 {
  color: #ffffff;
}
.editor-spinner {
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
  min-width: 322px;
  border: 1px solid #efefef;
  background: #fff;
  overflow: hidden;
  position: fixed;
  margin-top: 50px;
}
.preview-list.active {
  border: 1px solid #1890ff;
}
.sidebar-container {
  padding: 20px;
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
