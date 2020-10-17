<template>
  <div class="work-detail-container">
    <a-row type="flex" justify="center">
      <a-col :span="8">
        <img src="https://template.canva.cn/EADcCCrjE5Y/2/0/283w-JqyZ1G6p6nY.jpg" alt="">
      </a-col>
      <a-col :span="8">
        <h2>这是大标题</h2>
        <p>这是一句话描述</p>
      <div class="author">
        <a-avatar>
          <template v-slot:icon><UserOutlined /></template>
        </a-avatar>
        该模版由 <b>13611915632</b> 创作
      </div>
      <div class="bar-code-area" >
        <span>扫一扫，手机预览</span>
        <div ref="container"></div>
      </div>
      <div class="use-button">
        <a-button type="primary" size="large" :style="{'padding': '0 20px', 'height': '50px'}">使用模版</a-button>
      </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import QRCode from 'qrcodejs2'
export default defineComponent({
  name: 'TemplateDetail',
  components: {
    UserOutlined
  },
  setup () {
    const container = ref<null | HTMLElement>(null)
    onMounted(() => {
      if (container.value) {
        // eslint-disable-next-line no-new
        new QRCode(container.value, {
          text: 'https://template.canva.cn/EADcCCrjE5Y/2/0/283w-JqyZ1G6p6nY.jpg',
          width: 120,
          height: 120
        })
      }
    })
    return {
      container
    }
  }
})
</script>

<style scoped>
.work-detail-container {
  margin-top:50px;
}
.use-button {
  margin: 30px 0;
}
.ant-avatar {
  margin-right: 10px;
}
.bar-code-area {
  margin: 20px 0;
}
</style>
