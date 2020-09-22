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
export interface GlobalDataProps {
  components: ComponentData[];
  currentElement: string;
  copiedComponent?: ComponentData;
}
export default createStore<GlobalDataProps>({
  state: {
    components: [],
    currentElement: ''
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
    updateCurrentProp (state, { key, value }) {
      const currentComponent = state.components.find((component) => component.id === state.currentElement)
      if (currentComponent) {
        currentComponent.props[key] = value
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
