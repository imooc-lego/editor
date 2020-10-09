import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep } from 'lodash'
import editor, { EditProps } from './editor'

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

export interface GlobalStatus {
  loading: boolean;
  error: any;
  opName?: string;
}

export interface GlobalDataProps {
  // token
  token?: string;
  // user info
  user: UserProps;
  // 全局状态，loading，error 等等
  status: GlobalStatus;
  editor: EditProps;
}
export type ICustomAxiosConfig = AxiosRequestConfig & {
  mutationName: string;
}
export const asyncAndCommit = async (url: string, mutationName: string,
  commit: Commit,
  config: AxiosRequestConfig = { method: 'get' },
  extraData?: any) => {
  const newConfig: ICustomAxiosConfig = { ...config, mutationName }
  const { data } = await axios(url, newConfig)
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
    status: { loading: false, error: null, opName: '' },
    editor: {} as EditProps
  },
  mutations: {
    fetchCurrentUser (state, rawData) {
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
    setLoading (state, { status, opName }) {
      state.status.loading = status
      if (opName) {
        state.status.opName = opName
      }
    },
    setError (state, e) {
      state.status.error = e
    }
  },
  actions: {
    fetchCurrentUser ({ commit }) {
      return asyncAndCommit('/users/getUserInfo', 'fetchCurrentUser', commit)
    },
    login ({ commit }, payload) {
      return asyncAndCommit('/users/loginByPhoneNumber', 'login', commit, { method: 'post', data: payload })
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      }).then(() => {
        return dispatch('createWork', { title: '未命名作品', desc: '未命名作品', coverImg: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f79389d4737571e2e1dc7cb.png' })
      })
    }
  },
  modules: {
    editor
  }
})
