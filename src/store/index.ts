import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import editor, { EditProps } from './editor'
import user, { UserProps } from './user'

export interface GlobalStatus {
  loading: boolean;
  error: any;
  opName?: string;
}

export interface GlobalDataProps {
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
    user: {} as UserProps,
    status: { loading: false, error: null, opName: '' },
    editor: {} as EditProps
  },
  mutations: {
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
  modules: {
    editor,
    user
  }
})
