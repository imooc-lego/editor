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
  isHot?: boolean;
  isNew?: boolean;
  author?: string;
  copiedCount?: number;
  status?: string;
  user? : {
    gender: string;
    nickName: string;
    picture: string;
    userName: string;
  };
}
export interface ChannelProps {
  id: number;
  name: string;
  workId: number;
}
export interface EditProps {
  // 页面所有组件
  components: ComponentData[];
  // 当前被选中的组件 id
  currentElement: string;
  // 当前正在 inline editing 的组件
  currentEditing: string;
  // 当前数据已经被修改
  isDirty: boolean;
  // 当前模版是否修改但未发布
  isChangedNotPublished: boolean;
  // 当前被复制的组件
  copiedComponent?: ComponentData;
  // 当前 work 的数据
  page: PageData;
  // 当前 work 的 channels
  channels: ChannelProps[];
}
const pageDefaultProps = { backgroundColor: '#ffffff', backgroundImage: '', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', height: '500px' }
const editorModule: Module<EditProps, GlobalDataProps> = {
  state: {
    components: [],
    currentElement: '',
    currentEditing: '',
    isDirty: false,
    isChangedNotPublished: false,
    page: { props: pageDefaultProps, setting: {} },
    channels: []
  },
  mutations: {
    // reset editor to clear
    resetEditor (state) {
      state.page = { props: pageDefaultProps, setting: {} }
      state.components = []
      state.isDirty = false
      state.isChangedNotPublished = false
    },
    addComponentToEditor (state, component) {
      component.id = uuidv4()
      component.layerName = '图层' + (state.components.length + 1)
      state.components.push(component)
      state.isDirty = true
      state.isChangedNotPublished = true
    },
    setActive (state, id) {
      state.currentElement = id
    },
    setEditing (state, id) {
      state.currentEditing = id
    },
    updateProp (state, { key, value, id }) {
      const currentComponent = state.components.find((component) => component.id === (id || state.currentElement))
      if (currentComponent) {
        currentComponent.props[key] = value
        state.isDirty = true
        state.isChangedNotPublished = true
      }
    },
    updatePage (state, { key, value }) {
      (state.page as { [key: string]: any })[key] = value
      state.isDirty = true
      state.isChangedNotPublished = true
    },
    updatePageProps (state, { key, value }) {
      if (state.page.props) {
        state.page.props[key] = value
        state.isDirty = true
        state.isChangedNotPublished = true
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
        state.isDirty = true
        state.isChangedNotPublished = true
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
        state.isDirty = true
        state.isChangedNotPublished = true
      }
    },
    deleteComponent (state, index) {
      state.components = state.components.filter(component => component.id !== index)
      state.isDirty = true
      state.isChangedNotPublished = true
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
      state.isDirty = false
      state.page.updatedAt = new Date().toISOString()
    },
    copyWork (state) {
      state.page.updatedAt = new Date().toISOString()
    },
    publishWork (state) {
      state.isChangedNotPublished = false
      state.page.latestPublishAt = new Date().toISOString()
    },
    publishTemplate (state) {
      state.page.isTemplate = true
    }
  },
  actions: {
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
        const { title, desc, props, coverImg, setting } = state.page
        const postData = {
          title,
          desc,
          coverImg,
          content: {
            components: state.components,
            props,
            setting
          }
        }
        return asyncAndCommit(`/works/${id}`, 'saveWork', commit, { method: 'patch', data: postData })
      }
    },
    copyWork ({ commit }, id) {
      return asyncAndCommit(`/works/copy/${id}`, 'copyWork', commit, { method: 'post' })
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
