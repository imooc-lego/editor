<template>
  <div class="image-processer">
    <a-modal
      title="裁剪图片"
      v-model:visible="showModal"
      @ok="handleOk"
      @cancel="showModal = false"
      okText="确认"
      cancelText="取消"
    >
      <div class="image-cropper">
        <img :src="baseImageUrl" id="processed-image" />
      </div>
    </a-modal>
    <div class="image-preview" :style="{ backgroundImage: backgrondUrl }">
    </div>
    <div class="image-process">
      <uploader
        action="http://localhost:7001/api/upload"
        @file-uploaded="handleFileUploaded"
        :beforeUpload="commonUploadCheck"
      >
        <div class="uploader-container">
          <a-button>
            <template v-slot:icon><UploadOutlined /></template>更换图片
          </a-button>
        </div>
        <template #loading>
          <div class="uploader-container">
          <a-button>
            <template v-slot:icon><LoadingOutlined /></template>上传中
          </a-button>
          </div>
        </template>
        <template #uploaded>
          <a-button>
            <template v-slot:icon><UploadOutlined /></template>更换图片
          </a-button>
        </template>
      </uploader>
      <a-button  @click="showModal = true">
        <template v-slot:icon><ScissorOutlined /></template>裁剪图片
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from 'vue'
import Cropper from 'cropperjs'
import { message } from 'ant-design-vue'
import { UploadOutlined, ScissorOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import Uploader from './Uploader.vue'
import { commonUploadCheck } from '../helper'
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true
    }
  },
  components: {
    UploadOutlined,
    ScissorOutlined,
    LoadingOutlined,
    Uploader
  },
  emits: ['change'],
  setup (props, context) {
    const showModal = ref(false)
    let cropperData: any
    watch(showModal, (newValue) => {
      if (newValue) {
        nextTick(() => {
          const image = document.getElementById('processed-image') as HTMLImageElement
          const cropper = new Cropper(image, {
            aspectRatio: 16 / 9,
            checkCrossOrigin: false,
            crop (event) {
              const { x, y, width, height } = event.detail
              cropperData = {
                x: Math.floor(x),
                y: Math.floor(y),
                width: Math.floor(width),
                height: Math.floor(height)
              }
            }
          })
        })
      }
    })
    const baseImageUrl = computed(() => props.value.split('?')[0])
    const backgrondUrl = computed(() => `url(${props.value})`)
    const handleOk = () => {
      const { x, y, width, height } = cropperData
      const cropperedUrl = baseImageUrl.value + `?x-oss-process=image/crop,x_${x},y_${y},w_${width},h_${height}`
      context.emit('change', cropperedUrl)
      showModal.value = false
    }
    const handleFileUploaded = (uploadedData: any) => {
      message.success('上传成功')
      context.emit('change', uploadedData.data.url)
    }
    return {
      showModal,
      handleOk,
      baseImageUrl,
      backgrondUrl,
      commonUploadCheck,
      handleFileUploaded
    }
  }
})
</script>

<style>
  .image-processer {
    display: flex;
    justify-content: space-between;
  }
  .image-preview {
    width: 150px;
    height: 84px;
    border: 1px dashed #e6ebed;
    background: no-repeat 50%/contain;
  }
  .image-cropper img {
    display: block;
    /* This rule is very important, please don't ignore this */
    max-width: 100%;
  }
  .image-process {
    padding: 5px 0;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>
