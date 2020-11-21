// this file map the component props to ant-design-vue form element
// every prop should have five props
// 1 component 确定对应是哪个 component
// 2 更改 value 的 事件名称
// 3 intialTransform 初始值的变换，有些初始值需要处理以后在传递给组件
// 4 afterTransform 触发更改以后，不同类型需要不同处理，因为 e 的值是不同的，或者需要回灌的值不同
// 5 text 属性对应的中文名称
// 6 给组件赋值的时候 属性的名称，一般是 value，也有可能是另外的，比如 checkbox 就是 checked
import { h, VNode } from 'vue'
interface PropDetailType {
  component: string;
  eventName: string;
  intialTransform: (v: any) => any;
  afterTransform: (v: any) => any;
  text?: string;
  valueProp: string;
  subComponent?: string;
  options?: { text: string | VNode; value: any }[];
  extraProps?: { [key: string]: any };
  // 该属性有可能和其他联动，由改父属性控制它的行为
  parent?: string;
  // 可能还要向外传递更多事件
  extraEvent?: string;
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
  intialTransform: (v: string) => v ? parseInt(v) : 0,
  afterTransform: (e: number) => e ? `${e}px` : '0'
}
const fontFamilyArr = [
  { text: '宋体', value: '"SimSun","STSong"' },
  { text: '黑体', value: '"SimHei","STHeiti"' },
  { text: '楷体', value: '"KaiTi","STKaiti"' },
  { text: '仿宋', value: '"FangSong","STFangsong"' },
  { text: 'Arial', value: '"Arial", sans-serif' },
  { text: 'Arial Black', value: '"Arial Black", sans-serif' },
  { text: 'Comic Sans MS', value: '"Comic Sans MS"' },
  { text: 'Courier New', value: '"Courier New", monospace' },
  { text: 'Georgia', value: '"Georgia", serif' },
  { text: 'Times New Roman', value: '"Times New Roman", serif' }
]

const fontFamilyOptions = fontFamilyArr.map(font => {
  return {
    value: font.value,
    text: h('span', { style: { fontFamily: font.value } }, font.text)
  }
})
const mapPropsToComponents: MapTypes = {
  text: {
    ...defaultMap,
    component: 'textarea-fix',
    afterTransform: (e: any) => e.target.value,
    text: '文本',
    extraProps: { rows: 3 }
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
  fontFamily: {
    ...defaultMap,
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '字体',
    options: [
      { value: '', text: '无' },
      ...fontFamilyOptions
    ]
  },
  fontWeight: {
    ...defaultMap,
    component: 'icon-switch',
    intialTransform: (v: string) => v === 'bold',
    afterTransform: (e: boolean) => e ? 'bold' : 'normal',
    valueProp: 'checked',
    extraProps: { iconName: 'BoldOutlined', tip: '加粗' }
  },
  fontStyle: {
    ...defaultMap,
    component: 'icon-switch',
    intialTransform: (v: string) => v === 'italic',
    afterTransform: (e: boolean) => e ? 'italic' : 'normal',
    valueProp: 'checked',
    extraProps: { iconName: 'ItalicOutlined', tip: '斜体' }
  },
  textDecoration: {
    ...defaultMap,
    component: 'icon-switch',
    intialTransform: (v: string) => v === 'underline',
    afterTransform: (e: boolean) => e ? 'underline' : 'none',
    valueProp: 'checked',
    extraProps: { iconName: 'UnderlineOutlined', tip: '下划线' }
  },
  lineHeight: {
    ...defaultMap,
    component: 'a-slider',
    text: '行高',
    intialTransform: (v: string) => v ? parseFloat(v) : 0,
    afterTransform: (e: number) => e.toString(),
    extraProps: { min: 0, max: 3, step: 0.1 }
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
    text: '链接',
    parent: 'actionType'
  },
  // sizes
  height: {
    ...defaultMap,
    component: 'a-input-number',
    intialTransform: (v: string) => v ? parseInt(v) : '',
    afterTransform: (e: number) => e ? `${e}px` : '',
    text: '高度'
  },
  width: {
    ...defaultMap,
    component: 'a-input-number',
    intialTransform: (v: string) => v ? parseInt(v) : '',
    afterTransform: (e: number) => e ? `${e}px` : '',
    text: '宽度'
  },
  paddingLeft: {
    ...numberToPxHandle,
    text: '左边距'
  },
  paddingRight: {
    ...numberToPxHandle,
    text: '右边距'
  },
  paddingTop: {
    ...numberToPxHandle,
    text: '上边距'
  },
  paddingBottom: {
    ...numberToPxHandle,
    text: '下边距'
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
    intialTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => e + 'px',
    text: '边框宽度',
    extraProps: { min: 0, max: 20 }
  },
  borderRadius: {
    ...defaultMap,
    component: 'a-slider',
    intialTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => e + 'px',
    text: '边框圆角',
    extraProps: { min: 0, max: 200 }
  },
  // shadow and opactiy
  opacity: {
    ...defaultMap,
    component: 'a-slider',
    text: '透明度',
    intialTransform: (v: number) => v ? v * 100 : 100,
    afterTransform: (e: number) => (e / 100),
    extraProps: { min: 0, max: 100, reverse: true }
  },
  boxShadow: {
    ...defaultMap,
    component: 'shadow-picker'
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
    text: 'X轴坐标'
  },
  top: {
    ...numberToPxHandle,
    text: 'Y轴坐标'
  },
  imageSrc: {
    ...defaultMap,
    component: 'image-processer'
  },
  backgroundImage: {
    ...defaultMap,
    component: 'background-processer',
    intialTransform: (v: string) => {
      if (v) {
        const matches = v.match(/\((.*?)\)/)
        if (matches && matches.length > 1) {
          return matches[1].replace(/('|")/g, '')
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    afterTransform: (e: string) => e ? `url('${e}')` : '',
    extraProps: { ratio: 8 / 15, showDelete: true },
    extraEvent: 'uploaded'
  },
  backgroundSize: {
    ...defaultMap,
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '背景大小',
    options: [
      { value: 'contain', text: '自动缩放' },
      { value: 'cover', text: '自动填充' },
      { value: '', text: '默认' }
    ]
  },
  backgroundRepeat: {
    ...defaultMap,
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '背景重复',
    options: [
      { value: 'no-repeat', text: '无重复' },
      { value: 'repeat-x', text: 'X轴重复' },
      { value: 'repeat-y', text: 'Y轴重复' },
      { value: 'repeat', text: '全部重复' }
    ]
  }
}

export default mapPropsToComponents
