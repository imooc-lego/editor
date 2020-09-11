// this file map the component props to ant-design-vue form element
// every prop should have five props
// 1 component 确定对应是哪个 component
// 2 更改 value 的 事件名称
// 3 intialTransform 初始值的变换，有些初始值需要处理以后在传递给组件
// 4 afterTransform 触发更改以后，不同类型需要不同处理，因为 e 的值是不同的，或者需要回灌的值不同
// 5 text 属性对应的中文名称
interface PropDetailType {
  component: string;
  eventName: string;
  intialTransform: (v: any) => any;
  afterTransform: (v: any) => any;
  text: string;
}
interface MapTypes {
  [key: string]: PropDetailType;
}

const defaultMap = {
  component: 'a-input',
  eventName: 'change',
  intialTransform: (v: any) => v,
  afterTransform: (e: any) => e
}
const mapPropsToComponents: MapTypes = {
  text: {
    ...defaultMap,
    afterTransform: (e: any) => e.target.value,
    text: '文本'
  },
  href: {
    ...defaultMap,
    afterTransform: (e: any) => e.target.value,
    text: '链接地址'
  },
  fontSize: {
    component: 'a-input-number',
    eventName: 'change',
    intialTransform: (v: any) => parseInt(v),
    afterTransform: (e: any) => e + 'px',
    text: '字号'
  },
  fontWeight: {
    component: 'a-switch',
    eventName: 'change',
    intialTransform: (v: any) => v === 'bold',
    afterTransform: (e: any) => e ? 'bold' : 'normal',
    text: '是否加粗'
  },
  lineHeight: {
    ...defaultMap,
    component: 'a-slider',
    text: '行高'
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
