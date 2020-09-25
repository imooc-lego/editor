import { createStore } from 'vuex'
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
  id: string;
  name: string;
}
export interface GlobalDataProps {
  // 页面所有组件
  components: ComponentData[];
  // 当前被编辑的组件 id
  currentElement: string;
  // 当前被复制的组件
  copiedComponent?: ComponentData;
  // 页面设置
  page: PageData;

}
export default createStore<GlobalDataProps>({
  state: {
    components: [],
    currentElement: '',
    page: { id: uuidv4(), name: '新工程', props: { backgroundColor: '#ffffff', backgroundImage: '' } }
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
    }
  },
  actions: {
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find((component) => component.id === state.currentElement)
    }
  },
  modules: {
  }
})
