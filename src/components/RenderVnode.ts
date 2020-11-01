import { defineComponent, h, isVNode } from 'vue'

const RenderVnode = defineComponent({
  props: {
    vNode: {
      type: [Object, String],
      required: true
    }
  },
  render () {
    if (isVNode(this.vNode)) {
      return this.vNode
    } else {
      return h('div', this.vNode as any)
    }
  }
})

export default RenderVnode
