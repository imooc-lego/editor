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
    <div class="image-preview">
      <img :src="value" />
    </div>
    <div class="image-process">
      <a-button @click="showModal = true">
        <template v-slot:icon><UploadOutlined /></template>更换图片
      </a-button>
      <a-button  @click="showModal = true">
        <template v-slot:icon><ScissorOutlined /></template>裁剪图片
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from 'vue'
import Cropper from 'cropperjs'
import { UploadOutlined, ScissorOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true
    }
  },
  components: {
    UploadOutlined,
    ScissorOutlined
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
    const handleOk = () => {
      const { x, y, width, height } = cropperData
      const cropperedUrl = baseImageUrl.value + `?x-oss-process=image/crop,x_${x},y_${y},w_${width},h_${height}`
      context.emit('change', cropperedUrl)
      showModal.value = false
    }
    return {
      showModal,
      handleOk,
      baseImageUrl
    }
  }
})
</script>

<style>
  .image-processer {
    display: flex;
    justify-content: space-between;
  }
  .image-preview img {
    width: 150px;
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
