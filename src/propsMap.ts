import store from './store'
// this file map the component props to ant-design-vue form element
interface MapTypes {
  [key: string]: any;
}
const mapPropsToComponents: MapTypes = {
  // every prop should have four props
  // 1 component 确定对应是哪个 component
  // 2 更改 value 的 事件名称
  // 3 valueTransform 初始值的变换，有些初始值需要处理以后在传递给组件
  // 3 触发更改以后的事件，不同事件需要不同处理，因为 e 的值是不同的
  text: {
    component: 'a-input',
    eventName: 'change',
    valueTransform: (v: any) => v,
    eventHandler: (e: any, key: any) => {
      store.commit('updateValue', { value: e.target.value, key })
    }
  },
  fontSize: {
    component: 'a-input-number',
    eventName: 'change',
    valueTransform: (v: any) => parseInt(v),
    eventHandler: (e: any, key: any) => {
      store.commit('updateValue', { value: e + 'px', key })
    }
  },
  fontWeight: {
    component: 'a-switch',
    eventName: 'change',
    valueTransform: (v: any) => v === 'bold',
    eventHandler: (e: any, key: any) => {
      store.commit('updateValue', { value: e ? 'bold' : 'normal', key })
    }
  }
  // fontSize: 'a-input-number',
  // // we don't have this yet, will do it later
  // color: 'color-picker',
  // backgroundColor: 'color-picker',
  // fontWeight: 'a-switch',
  // fontStyle: 'a-switch',
  // textDecoration: 'a-switch',
  // lineHeight: 'a-slider',
  // letterSpacing: 'a-slider'
}

export default mapPropsToComponents
