<template>
  <div class="background-processer">
    <uploader v-if="!value"
      action="http://localhost:7001/api/upload"
      :beforeUpload="commonUploadCheck"
      @file-uploaded="handleFileUploaded"
    >
      <div class="uploader-container">
        <FileImageOutlined :style="{fontSize: '30px'}"/>
        <h4>上传背景图片</h4>
      </div>
      <template #loading>
        <div class="uploader-container">
          <LoadingOutlined :style="{fontSize: '30px'}" spin/>
          <h4>上传中</h4>
        </div>
      </template>
      <template #uploaded>
        <div class="uploader-container">
          <FileImageOutlined :style="{fontSize: '30px'}"/>
          <h4>上传背景图片</h4>
        </div>
      </template>
    </uploader>
    <image-processer :value="value" @change="updateUrl" v-else :ratio="ratio"></image-processer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import ImageProcesser from './ImageProcess.vue'
import { commonUploadCheck } from '../helper'
import Uploader from './Uploader.vue'

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
    Uploader,
    FileImageOutlined,
    LoadingOutlined
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
.uploader-container {
  text-align: center;
  padding: 10px;
  width: 100%;
  border: 2px dotted #efefef;
  color: #ccc;
  height: 200px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  transition: all .25s ease-in-out;
}
.uploader-container:hover {
  border: 2px dotted #1890ff;
  color: #1890ff;
}
.uploader-container h4 {
  color: #999;
  transition: all .25s ease-in-out;
}
.uploader-container:hover h4 {
  color: #1890ff;
}
</style>
