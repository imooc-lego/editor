import { Module } from 'vuex'
import axios from 'axios'
import { GlobalDataProps, asyncAndCommit } from './index'

export interface UserDataProps {
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

export interface UserProps {
  isLogin: boolean;
  token: string;
  data: UserDataProps;
}

const userModule: Module<UserProps, GlobalDataProps> = {
  state: {
    token: localStorage.getItem('token') || '',
    isLogin: false,
    data: { }
  },
  mutations: {
    fetchCurrentUser (state, rawData) {
      state.isLogin = true
      state.data = { ...rawData.data }
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
      state.isLogin = false
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
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
  }
}

export default userModule
