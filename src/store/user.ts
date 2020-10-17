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
  picture?: string;
  gender?: string;
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
    updateUser (state, { extraData }) {
      state.data = { ...state.data, ...extraData }
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
      })
    },
    updateUser ({ commit }, payload) {
      return asyncAndCommit('/users/updateUserInfo', 'updateUser', commit, { method: 'patch', data: payload }, payload)
    }
  }
}

export default userModule
