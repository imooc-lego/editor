declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}
declare module 'vue-draggable-next'
declare module 'qrcodejs2'
declare module 'echarts/lib/echarts'