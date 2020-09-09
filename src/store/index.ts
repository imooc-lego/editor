import { createStore } from 'vuex'

export interface GlobalDataProps {
  components: any[];
  currentElement: number;
}
export default createStore<GlobalDataProps>({
  state: {
    components: [],
    currentElement: -1
  },
  mutations: {
    addComponentToEditor (state, component) {
      state.components.push(component)
    },
    editProps (state, index) {
      state.currentElement = index
    },
    updateValue (state, { key, value }) {
      const currentComponent = state.components.find((component, index) => index === state.currentElement)
      if (currentComponent) {
        if (typeof value === 'number') {
          currentComponent.props[key] = value + 'px'
        } else {
          currentComponent.props[key] = value
        }
      }
    }
  },
  actions: {
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find((component, index) => index === state.currentElement)
    }
  },
  modules: {
  }
})
