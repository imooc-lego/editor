<template>
  <div class="background-processer">
    <styled-uploader v-if="!value" @file-uploaded="handleFileUploaded"></styled-uploader>
    <image-processer :value="value" @change="updateUrl" v-else :ratio="ratio" :showDelete="true"></image-processer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { message } from 'ant-design-vue'
import ImageProcesser from './ImageProcess.vue'
import { commonUploadCheck } from '../helper'
import StyledUploader from './StyledUploader.vue'

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true
    },
    ratio: {
      type: Number
    }
  },
  components: {
    ImageProcesser,
    StyledUploader
  },
  emits: ['change'],
  setup (props, context) {
    console.log(props.value)
    const handleFileUploaded = (uploadedData: any) => {
      message.success('上传成功')
      context.emit('change', uploadedData.data.url)
    }
    const updateUrl = (value: string) => {
      context.emit('change', value)
    }
    return {
      handleFileUploaded,
      commonUploadCheck,
      updateUrl
    }
  }
})
</script>

<style scoped>
.delete-uploaded {
  margin-top:10px;
  display: block;
}
</style>
