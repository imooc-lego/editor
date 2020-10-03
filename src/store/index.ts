import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep } from 'lodash'

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
  id?: number;
  title?: string;
  desc?: string;
}
export interface UserProps {
  isLogin: boolean;
  username?: string;
  id?: string;
  phoneNumber?: string;
  nickName?: string;
  description?: string;
  updatedAt?: string;
  createdAt?: string;
  iat?: number;
  exp?: number;
}
export interface GlobalDataProps {
  // token
  token?: string;
  // user info
  user: UserProps;
  // 页面所有组件
  components: ComponentData[];
  // 当前被编辑的组件 id
  currentElement: string;
  // 当前被复制的组件
  copiedComponent?: ComponentData;
  // 页面设置
  page: PageData;

}
const asyncAndCommit = async (url: string, mutationName: string,
  commit: Commit,
  config: AxiosRequestConfig = { method: 'get' },
  extraData?: any) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}
export default createStore<GlobalDataProps>({
  state: {
    token: localStorage.getItem('token') || '',
    user: { isLogin: false },
    components: [],
    currentElement: '',
    page: { props: { backgroundColor: '#ffffff', backgroundImage: '' } }
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
      if (state.page.props) {
        state.page.props[key] = value
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
    fetchCurrentUser (state, rawData) {
      console.log(rawData.data)
      state.user = { isLogin: true, ...rawData.data }
    },
    login (state, rawData) {
      const { token } = rawData.data
      console.log(token)
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout (state) {
      state.token = ''
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    },
    createWork (state, rawData) {
      console.log(rawData)
      state.page = { ...state.page, ...rawData.data }
    },
    getWork (state, { data }) {
      console.log(data)
      const { content, title, desc } = data
      const pageData = { title, desc }
      state.page = { ...state.page, ...pageData }
      state.components = content.components
    }
  },
  actions: {
    fetchCurrentUser ({ commit }) {
      return asyncAndCommit('/users/getUserInfo', 'fetchCurrentUser', commit)
    },
    login ({ commit }, payload) {
      return asyncAndCommit('/users/loginByPhoneNumber', 'login', commit, { method: 'post', data: payload })
    },
    createWork ({ commit }, payload) {
      return asyncAndCommit('/works', 'createWork', commit, { method: 'post', data: payload })
    },
    getWork ({ commit }, id) {
      return asyncAndCommit(`/works/${id}`, 'getWork', commit)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      }).then(() => {
        return dispatch('createWork', { title: '未命名作品', desc: '未命名作品' })
      })
    }
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find((component) => component.id === state.currentElement)
    }
  },
  modules: {
  }
})
