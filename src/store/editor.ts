import { Module } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep } from 'lodash'
import { GlobalDataProps, asyncAndCommit } from './index'
export interface ComponentData {
  props: { [key: string]: any };
  id: string;
  name: string;
  layerName?: string;
  isHidden?: boolean;
  isLocked?: boolean;
}
export interface PageData {
  props: { [key: string]: any };
  setting: { [key: string]: any };
  id?: number;
  title?: string;
  desc?: string;
  coverImg?: string;
  uuid?: string;
  latestPublishAt?: string;
  updatedAt?: string;
  isTemplate?: boolean;
}
export interface ChannelProps {
  id: number;
  name: string;
  workId: number;
}
export interface EditProps {
  // 页面所有组件
  components: ComponentData[];
  // 当前被编辑的组件 id
  currentElement: string;
  // 当前被复制的组件
  copiedComponent?: ComponentData;
  // 当前 work 的数据
  page: PageData;
  // 当前 work 的 channels
  channels: ChannelProps[];
}
const editorModule: Module<EditProps, GlobalDataProps> = {
  state: {
    components: [],
    currentElement: '',
    page: { props: { backgroundColor: '#ffffff', backgroundImage: '', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', height: '600px' }, setting: {} },
    channels: []
  },
  mutations: {
    addComponentToEditor (state, component) {
      component.id = uuidv4()
      component.layerName = '图层' + (state.components.length + 1)
      state.components.push(component)
    },
    editProps (state, index) {
      state.currentElement = index
    },
    updateProp (state, { key, value, id }) {
      const currentComponent = state.components.find((component) => component.id === (id || state.currentElement))
      if (currentComponent) {
        currentComponent.props[key] = value
      }
    },
    updatePage (state, { key, value }) {
      (state.page as { [key: string]: any })[key] = value
    },
    updatePageProps (state, { key, value }) {
      if (state.page.props) {
        state.page.props[key] = value
      }
    },
    updatePageSetting (state, { key, value }) {
      if (state.page.setting) {
        state.page.setting[key] = value
      }
    },
    updateComponent (state, { id, key, value }) {
      const updatedComponent = state.components.find((component) => component.id === id) as any
      if (updatedComponent) {
        updatedComponent[key] = value
      }
    },
    copyComponent (state, index) {
      const currentComponent = state.components.find((component) => component.id === index)
      if (currentComponent) {
        state.copiedComponent = currentComponent
      }
    },
    pasteCopiedComponent (state) {
      if (state.copiedComponent) {
        const clone = cloneDeep(state.copiedComponent)
        clone.id = uuidv4()
        clone.layerName = clone.layerName + '副本'
        state.components.push(clone)
      }
    },
    deleteComponent (state, index) {
      state.components = state.components.filter(component => component.id !== index)
    },
    createWork (state, rawData) {
      state.page = { ...state.page, ...rawData.data }
    },
    getWork (state, { data }) {
      const { content, ...rest } = data
      state.page = { ...state.page, ...rest }
      if (content.props) {
        state.page.props = { ...state.page.props, ...content.props }
      }
      if (content.setting) {
        state.page.setting = { ...state.page.setting, ...content.setting }
      }
      state.components = content.components
    },
    getChannels (state, { data }) {
      state.channels = data.list
    },
    createChannel (state, { data }) {
      state.channels = [...state.channels, data]
    },
    deleteChannel (state, { extraData }) {
      state.channels = state.channels.filter(channel => channel.id !== extraData.id)
    },
    saveWork (state) {
      state.page.updatedAt = new Date().toISOString()
    },
    publishWork (state) {
      state.page.latestPublishAt = new Date().toISOString()
    },
    publishTemplate (state) {
      state.page.isTemplate = true
    }
  },
  actions: {
    createWork ({ commit }, payload) {
      return asyncAndCommit('/works', 'createWork', commit, { method: 'post', data: payload })
    },
    getWork ({ commit }, id) {
      return asyncAndCommit(`/works/${id}`, 'getWork', commit)
    },
    getChannels ({ commit }, id) {
      return asyncAndCommit(`/channel/getWorkChannels/${id}`, 'getChannels', commit)
    },
    createChannel ({ commit }, payload) {
      return asyncAndCommit('/channel', 'createChannel', commit, { method: 'post', data: payload })
    },
    deleteChannel ({ commit }, id) {
      return asyncAndCommit(`channel/${id}`, 'deleteChannel', commit, { method: 'delete' }, { id })
    },
    saveWork ({ commit, state }, payload) {
      const { id, data } = payload
      if (data) {

      } else {
        // save current work
        const { title, desc, props, coverImg } = state.page
        const postData = {
          title,
          desc,
          coverImg,
          content: {
            components: state.components,
            props
          }
        }
        return asyncAndCommit(`/works/${id}`, 'saveWork', commit, { method: 'patch', data: postData })
      }
    },
    publishWork ({ commit }, id) {
      return asyncAndCommit(`/works/publish/${id}`, 'publishWork', commit, { method: 'post' })
    },
    publishTemplate ({ commit }, id) {
      return asyncAndCommit(`/works/publish-template/${id}`, 'publishTemplate', commit, { method: 'post' })
    },
    saveAndPublishWork ({ dispatch, state }, payload) {
      const { id } = state.page
      return dispatch('saveWork', payload)
        .then(() => dispatch('publishWork', id))
        .then(() => dispatch('getChannels', id))
        .then(() => {
          if (state.channels.length === 0) {
            return dispatch('createChannel', { name: '默认', workId: id })
          } else {
            return Promise.resolve({})
          }
        })
    }
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find((component) => component.id === state.currentElement)
    }
  }
}

export default editorModule
