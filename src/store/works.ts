import { Module } from 'vuex'
import { GlobalDataProps, asyncAndCommit } from './index'
import { PageData } from './editor'
import { objToQueryString } from '../helper'
export type WorkProp = Required<Omit<PageData, 'props' | 'setting'>> & {
  barcodeUrl?: string;
}

export interface StaticProps {
  eventDate: string;
  eventData: { pv: number };
  eventKey: string;
  _id: string;
}

export interface WorksProp {
  templates: WorkProp[];
  works: WorkProp[];
  statics: { id: number; name: string; list: StaticProps[]}[];
  totalWorks: number;
  totalTemplates: number;
  searchText: string;
}

const workModule: Module<WorksProp, GlobalDataProps> = {
  state: {
    templates: [],
    works: [],
    totalWorks: 0,
    statics: [],
    totalTemplates: 0,
    searchText: ''
  },
  mutations: {
    fetchTemplates (state, { data, extraData }) {
      const { pageIndex, searchText } = extraData
      const { list, count } = data.data
      if (pageIndex === 0) {
        state.templates = list
      } else {
        state.templates = [...state.templates, ...list]
      }
      state.totalTemplates = count
      state.searchText = searchText || ''
    },
    fetchTemplate (state, { data }) {
      state.templates = [data]
    },
    fetchWorks (state, { data, extraData }) {
      const { pageIndex, searchText } = extraData
      const { list, count } = data.data
      if (pageIndex === 0) {
        state.works = list
      } else {
        state.works = [...state.works, ...list]
      }
      state.totalWorks = count
      state.searchText = searchText || ''
    },
    createWork (state, { data }) {
      state.works.unshift(data)
    },
    deleteWork (state, { extraData }) {
      state.works = state.works.filter(work => work.id !== extraData.id)
    },
    recoverWork (state, { extraData }) {
      state.works = state.works.filter(work => work.id !== extraData.id)
    },
    fetchStatic (state, { data, extraData }) {
      const list = data.data
      const { name, id } = extraData
      state.statics.push({ name, id, list })
    },
    clearStatic (state) {
      state.statics = []
    }
  },
  actions: {
    fetchTemplates ({ commit }, queryObj = { pageIndex: 0, pageSize: 8, title: '' }) {
      if (!queryObj.title) {
        delete queryObj.title
      }
      const queryString = objToQueryString(queryObj)
      return asyncAndCommit(`/templates?${queryString}`, 'fetchTemplates', commit, { method: 'get' }, { pageIndex: queryObj.pageIndex, searchText: queryObj.title })
    },
    fetchTemplate ({ commit }, id) {
      return asyncAndCommit(`/templates/${id}`, 'fetchTemplate', commit)
    },
    fetchWorks ({ commit }, queryObj = { pageIndex: 0, pageSize: 8, title: '' }) {
      if (!queryObj.title) {
        delete queryObj.title
      }
      const queryString = objToQueryString(queryObj)
      return asyncAndCommit(`/works?${queryString}`, 'fetchWorks', commit, { method: 'get' }, { pageIndex: queryObj.pageIndex, searchText: queryObj.title })
    },
    deleteWork ({ commit }, id) {
      return asyncAndCommit(`/works/${id}`, 'deleteWork', commit, { method: 'delete' }, { id })
    },
    createWork ({ commit }, payload: WorkProp) {
      return asyncAndCommit('/works', 'createWork', commit, { method: 'post', data: payload })
    },
    fetchStatic ({ commit }, queryObj) {
      const newObj = { category: 'h5', action: 'pv', ...queryObj }
      const queryString = objToQueryString(newObj)
      return asyncAndCommit(`http://182.92.168.192:8080/api/event?${queryString}`, 'fetchStatic', commit, { method: 'get' }, { name: queryObj.name, id: queryObj.label })
    },
    recoverWork ({ commit }, id) {
      return asyncAndCommit(`/works/put-back/${id}`, 'recoverWork', commit, { method: 'post' }, { id })
    }
  },
  getters: {
    getCurrentTemplate: state => (id: string) => {
      return state.templates.find((template) => template.id === parseInt(id))
    }
  }
}

export default workModule
