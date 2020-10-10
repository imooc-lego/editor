<template>
  <div class="work-detail-container">
    <a-row>
      <a-col :span="12">
        <img src="https://template.canva.cn/EADcCCrjE5Y/2/0/283w-JqyZ1G6p6nY.jpg" alt="">
      </a-col>
      <a-col :span="12">
        <h2>这是大标题</h2>
        <p>这是一句话描述</p>
      <div>
        <a-avatar size="large">
          <template v-slot:icon><UserOutlined /></template>
        </a-avatar>
      </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    UserOutlined
  }
})
</script>

<style>

</style>
