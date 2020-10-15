import { Module } from 'vuex'
import { GlobalDataProps, asyncAndCommit } from './index'
import { PageData } from './editor'
import { objToQueryString } from '../helper'
export type WorkProp = Required<Omit<PageData, 'props' | 'setting'>>

export interface WorksProp {
  templates: WorkProp[];
  works: WorkProp[];
  totalWorks: number;
  totalTemplates: number;
}

const workModule: Module<WorksProp, GlobalDataProps> = {
  state: {
    templates: [],
    works: [],
    totalWorks: 0,
    totalTemplates: 0
  },
  mutations: {
    fetchTemplates (state, { data, extraData }) {
      const { pageIndex } = extraData
      const { list, count } = data.data
      if (pageIndex === 0) {
        state.templates = list
      } else {
        state.templates = [...state.templates, ...list]
      }
      state.totalTemplates = count
    },
    fetchWorks (state, { data, extraData }) {
      const { pageIndex } = extraData
      const { list, count } = data.data
      if (pageIndex === 0) {
        state.works = list
      } else {
        state.works = [...state.works, ...list]
      }
      state.totalWorks = count
    },
    createWork (state, { data }) {
      state.works.unshift(data)
    },
    deleteWork (state, { extraData }) {
      state.works = state.works.filter(work => work.id !== extraData.id)
    }
  },
  actions: {
    fetchTemplates ({ commit }, queryObj = { pageIndex: 0, pageSize: 8 }) {
      const queryString = objToQueryString(queryObj)
      return asyncAndCommit(`/templates?${queryString}`, 'fetchTemplates', commit, { method: 'get' }, { pageIndex: queryObj.pageIndex })
    },
    fetchWorks ({ commit }, queryObj = { pageIndex: 0, pageSize: 8 }) {
      const queryString = objToQueryString(queryObj)
      return asyncAndCommit(`/works?${queryString}`, 'fetchWorks', commit, { method: 'get' }, { pageIndex: queryObj.pageIndex })
    },
    deleteWork ({ commit }, id) {
      return asyncAndCommit(`/works/${id}`, 'deleteWork', commit, { method: 'delete' }, { id })
    },
    createWork ({ commit }, payload: WorkProp) {
      return asyncAndCommit('/works', 'createWork', commit, { method: 'post', data: payload })
    }
  }
}

export default workModule
