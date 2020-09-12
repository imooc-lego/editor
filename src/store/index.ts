import { createStore } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
interface ComponentData {
  props: { [key: string]: any };
  id: string;
  name: string;
}
export interface GlobalDataProps {
  components: ComponentData[];
  currentElement: string;
}
export default createStore<GlobalDataProps>({
  state: {
    components: [],
    currentElement: ''
  },
  mutations: {
    addComponentToEditor (state, component) {
      component.id = uuidv4()
      state.components.push(component)
    },
    editProps (state, index) {
      state.currentElement = index
    },
    updateValue (state, { key, value }) {
      const currentComponent = state.components.find((component) => component.id === state.currentElement)
      console.log(key, value)
      if (currentComponent) {
        currentComponent.props[key] = value
      }
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
