// this file map the component props to ant-design-vue form element
// every prop should have five props
// 1 component 确定对应是哪个 component
// 2 更改 value 的 事件名称
// 3 intialTransform 初始值的变换，有些初始值需要处理以后在传递给组件
// 4 afterTransform 触发更改以后，不同类型需要不同处理，因为 e 的值是不同的，或者需要回灌的值不同
// 5 text 属性对应的中文名称
// 6 给组件赋值的时候 属性的名称，一般是 value，也有可能是另外的，比如 checkbox 就是 checked
interface PropDetailType {
  component: string;
  eventName: string;
  intialTransform: (v: any) => any;
  afterTransform: (v: any) => any;
  text: string;
  valueProp: string;
  subComponent?: string;
  options?: { text: string; value: any }[];
  extraProps?: { [key: string]: any };
}
interface MapTypes {
  [key: string]: PropDetailType;
}

const defaultMap = {
  component: 'a-input',
  eventName: 'change',
  valueProp: 'value',
  intialTransform: (v: any) => v,
  afterTransform: (e: any) => e
}
const numberToPxHandle = {
  ...defaultMap,
  component: 'a-input-number',
  intialTransform: (v: any) => parseInt(v),
  afterTransform: (e: any) => e + 'px'
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
    text: '链接'
  },
  fontSize: {
    ...numberToPxHandle,
    text: '字号'
  },
  fontWeight: {
    ...defaultMap,
    component: 'a-switch',
    intialTransform: (v: any) => v === 'bold',
    afterTransform: (e: any) => e ? 'bold' : 'normal',
    text: '加粗',
    valueProp: 'checked'
  },
  lineHeight: {
    ...defaultMap,
    component: 'a-slider',
    text: '行高',
    extraProps: { min: 0, max: 10 }
  },
  textAlign: {
    ...defaultMap,
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    afterTransform: (e: any) => e.target.value,
    text: '对齐',
    options: [
      { value: 'left', text: '左' },
      { value: 'center', text: '中' },
      { value: 'right', text: '右' }
    ]
  },
  color: {
    ...defaultMap,
    component: 'color-picker',
    text: '文字颜色'
  },
  backgroundColor: {
    ...defaultMap,
    component: 'color-picker',
    text: '背景颜色'
  },
  // actions
  actionType: {
    ...defaultMap,
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '点击',
    options: [
      { value: '', text: '无' },
      { value: 'to', text: '跳转到 URL' }
    ]
  },
  url: {
    ...defaultMap,
    afterTransform: (e: any) => e.target.value,
    text: '链接'
  },
  // sizes
  height: {
    ...defaultMap,
    component: 'a-input-number',
    intialTransform: (v: any) => v ? parseInt(v) : '',
    afterTransform: (e: any) => e ? `${e}px` : '',
    text: '高度'
  },
  marginLeft: {
    ...numberToPxHandle,
    text: '左边距'
  },
  marginRight: {
    ...numberToPxHandle,
    text: '右边距'
  },
  marginTop: {
    ...numberToPxHandle,
    text: '上边距'
  },
  // border types
  borderStyle: {
    ...defaultMap,
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '边框类型',
    options: [
      { value: 'none', text: '无' },
      { value: 'solid', text: '实线' },
      { value: 'dashed', text: '破折线' },
      { value: 'dotted', text: '点状线' }
    ]
  },
  borderColor: {
    ...defaultMap,
    component: 'color-picker',
    text: '边框颜色'
  },
  borderWidth: {
    ...defaultMap,
    component: 'a-slider',
    intialTransform: (v: any) => parseInt(v),
    afterTransform: (e: any) => e + 'px',
    text: '边框宽度',
    extraProps: { min: 0, max: 20 }
  },
  borderRadius: {
    ...defaultMap,
    component: 'a-slider',
    intialTransform: (v: any) => parseInt(v),
    afterTransform: (e: any) => e + 'px',
    text: '边框圆角',
    extraProps: { min: 0, max: 20 }
  },
  // shadow and opactiy
  opacity: {
    ...defaultMap,
    component: 'a-slider',
    text: '透明度',
    intialTransform: (v: any) => v ? v * 100 : 100,
    afterTransform: (e: any) => (e / 100),
    extraProps: { min: 0, max: 100, reverse: true }
  },
  position: {
    ...defaultMap,
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '定位',
    options: [
      { value: '', text: '默认' },
      { value: 'absolute', text: '绝对定位' }
    ]
  },
  left: {
    ...numberToPxHandle,
    text: '位置X'
  },
  top: {
    ...numberToPxHandle,
    text: '位置Y'
  }
  // position and xy
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
