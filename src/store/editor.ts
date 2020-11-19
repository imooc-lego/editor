import { Module } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep, isUndefined } from 'lodash'
import { GlobalDataProps, asyncAndCommit } from './index'
import { insertAt } from '../helper'
import { MoveDirection } from '../plugins/dataOperations'
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

export interface HistoryProps {
  id: string;
  componentId?: string;
  type: 'add' | 'delete' | 'modify';
  data: any;
  index?: number;
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
  // 当前操作的历史记录
  histories: HistoryProps[];
  // 当前历史记录的操作位置
  historyIndex: number;
}
const pageDefaultProps = { backgroundColor: '#ffffff', backgroundImage: '', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '560px' }
// the max numbers for history items
const maxHistoryNumber = 20
const pushHistory = (state: EditProps, historyRecord: HistoryProps) => {
  // check if historyIndex is already moved
  if (state.historyIndex !== -1) {
    // if already moved, we need delete all the records greater than the index
    state.histories = state.histories.slice(0, state.historyIndex)
    // move the historyIndex to the last  -1
    state.historyIndex = -1
  }
  // if histories length is less than max number, just push it to the end
  if (state.histories.length < maxHistoryNumber) {
    state.histories.push(historyRecord)
  } else {
    // if histories length is larger then max number,
    // 1 shift the first,
    // 2 push to last
    state.histories.shift()
    state.histories.push(historyRecord)
  }
}

const modifyHistory = (state: EditProps, history: HistoryProps, type: 'undo' | 'redo') => {
  const { componentId, data } = history
  const { key, oldValue, newValue } = data
  // modify the page setting
  if (!componentId) {
    state.page.props[key] = type === 'undo' ? oldValue : newValue
  } else {
    const updatedComponent = state.components.find((component) => component.id === componentId) as any
    if (Array.isArray(key)) {
      key.forEach((keyName: string, index) => {
        updatedComponent.props[keyName] = type === 'undo' ? oldValue[index] : newValue[index]
      })
    } else {
      updatedComponent.props[key] = type === 'undo' ? oldValue : newValue
    }
  }
}
let globalTimeout = 0
let cachedOldValue: any

const debounceChange = (cachedValue: any, callback: () => void, timeout = 1000) => {
  if (globalTimeout) {
    clearTimeout(globalTimeout)
  }
  if (isUndefined(cachedOldValue)) {
    cachedOldValue = cachedValue
  }
  globalTimeout = setTimeout(() => {
    callback()
    globalTimeout = 0
    cachedOldValue = undefined
  }, timeout)
}
const editorModule: Module<EditProps, GlobalDataProps> = {
  state: {
    components: [],
    currentElement: '',
    currentEditing: '',
    isDirty: false,
    isChangedNotPublished: false,
    page: { props: pageDefaultProps, setting: {} },
    channels: [],
    histories: [],
    historyIndex: -1
  },
  mutations: {
    // reset editor to clear
    resetEditor (state) {
      state.page = { props: pageDefaultProps, setting: {} }
      state.components = []
      state.histories = []
      state.isDirty = false
      state.isChangedNotPublished = false
    },
    addComponentToEditor (state, component) {
      component.id = uuidv4()
      component.layerName = '图层' + (state.components.length + 1)
      state.components.push(component)
      pushHistory(state, {
        id: uuidv4(),
        componentId: component.id,
        type: 'add',
        data: cloneDeep(component)
      })
      state.isDirty = true
      state.isChangedNotPublished = true
    },
    // undo history
    undo (state) {
      // never undo before
      if (state.historyIndex === -1) {
        // undo to the last item of the histories array
        state.historyIndex = state.histories.length - 1
      } else {
        // undo to the previous step
        state.historyIndex--
      }
      // get the record
      const history = state.histories[state.historyIndex]
      // process the history data
      switch (history.type) {
        case 'add':
          // if we create a component, then we should remove it
          state.components = state.components.filter(component => component.id !== history.componentId)
          break
        case 'delete':
          // if we delete a component, we should restore it at the right position
          state.components = insertAt(state.components, history.index as number, history.data)
          break
        case 'modify': {
          modifyHistory(state, history, 'undo')
          break
        }
        default:
          break
      }
    },
    redo (state) {
      // can't redo when historyIndex is the last item or historyIndex is never moved
      if (state.historyIndex === -1) {
        return
      }
      // get the record
      const history = state.histories[state.historyIndex]
      // process the history data
      switch (history.type) {
        case 'add':
          state.components.push(history.data)
          // state.components = insertAt(state.components, history.index as number, history.data)
          break
        case 'delete':
          state.components = state.components.filter(component => component.id !== history.componentId)
          break
        case 'modify': {
          modifyHistory(state, history, 'redo')
          break
        }
        default:
          break
      }
      state.historyIndex++
    },
    setActive (state, id) {
      state.currentElement = id
    },
    setEditing (state, id) {
      state.currentEditing = id
    },
    updatePage (state, { key, value, level }) {
      const pageData = state.page as { [key: string]: any }
      if (level) {
        if (level === 'props') {
          const oldValue = pageData[level][key]
          debounceChange(oldValue, () => {
            pushHistory(state, {
              id: uuidv4(),
              type: 'modify',
              data: { oldValue: cachedOldValue, newValue: value, key }
            })
          })
        }
        pageData[level][key] = value
      } else {
        pageData[key] = value
      }
      state.isDirty = true
      state.isChangedNotPublished = true
    },
    moveComponent (state, data: { direction: MoveDirection; amount: number }) {
      const updatedComponent = state.components.find((component) => component.id === state.currentElement)
      if (updatedComponent) {
        const store = this as any
        const oldTop = parseInt(updatedComponent.props.top)
        const oldLeft = parseInt(updatedComponent.props.left)
        const { direction, amount } = data
        switch (direction) {
          case 'Up': {
            const newValue = oldTop - amount + 'px'
            store.commit('updateComponent', { key: 'top', value: newValue, isProps: true })
            break
          }
          case 'Down': {
            const newValue = oldTop + amount + 'px'
            store.commit('updateComponent', { key: 'top', value: newValue, isProps: true })
            break
          }
          case 'Left': {
            const newValue = oldLeft - amount + 'px'
            store.commit('updateComponent', { key: 'left', value: newValue, isProps: true })
            break
          }
          case 'Right': {
            const newValue = oldLeft + amount + 'px'
            store.commit('updateComponent', { key: 'left', value: newValue, isProps: true })
            break
          }
          default:
            break
        }
      }
    },
    updateComponent (state, { id, key, value, isProps }) {
      const updatedComponent = state.components.find((component) => component.id === (id || state.currentElement)) as any
      if (updatedComponent) {
        if (isProps) {
          const oldValue = Array.isArray(key) ? key.map((key: string) => updatedComponent.props[key]) : updatedComponent.props[key]

          debounceChange(oldValue, () => {
            pushHistory(state, {
              id: uuidv4(),
              componentId: (id || state.currentElement),
              type: 'modify',
              data: { oldValue: cachedOldValue, newValue: value, key }
            })
          })
          if (Array.isArray(key)) {
            key.forEach((keyName: string, index) => {
              updatedComponent.props[keyName] = value[index]
            })
          } else {
            updatedComponent.props[key] = value
          }
        } else {
          updatedComponent[key] = value
        }
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
        pushHistory(state, {
          id: uuidv4(),
          componentId: clone.id,
          type: 'add',
          data: cloneDeep(clone)
        })
      }
    },
    deleteComponent (state, id) {
      // find the current component and index
      const componentData = state.components.find(component => component.id === id) as ComponentData
      const componentIndex = state.components.findIndex(component => component.id === id)
      state.components = state.components.filter(component => component.id !== id)
      pushHistory(state, {
        id: uuidv4(),
        componentId: componentData.id,
        type: 'delete',
        data: componentData,
        index: componentIndex
      })
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
    },
    checkUndoDisable: (state) => {
      // no history item or move to the first item
      if (state.histories.length === 0 || state.historyIndex === 0) {
        return true
      }
      return false
    },
    checkRedoDisable: (state) => {
      // 1 no history item
      // 2 move to the last item
      // 3 never undo before
      if (state.histories.length === 0 ||
        state.historyIndex === state.histories.length ||
        state.historyIndex === -1) {
        return true
      }
      return false
    }
  }
}

export default editorModule
