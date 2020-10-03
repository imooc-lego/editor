<template>
  <div class="create-component-list">
    <div
      v-for="(item, index) in list" :key="index"
      @click="onItemClick(item)" class="component-item"
    >
      <component :is="item.name" v-bind="item.props" v-if="item.type !== 'upload'" :style="createResetCss"/>
      <uploader
        v-else
        action="http://localhost:7001/api/upload"
        @file-uploaded="(uploaded) => { handleFileUploaded(uploaded, item) }"
        :beforeUpload="commonUploadCheck"
      >
        <div class="uploader-container">
          <FileImageOutlined :style="{fontSize: '30px'}"/>
          <h4>上传图片</h4>
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
            <h4>上传图片</h4>
          </div>
        </template>
      </uploader>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import LText from './LText.vue'
import LImage from './LImage.vue'
import Uploader from './Uploader.vue'
import { componentsDefaultProps } from '../defaultProps'
import { commonUploadCheck, imageDimensions } from '../helper'
const textDefaultProps = componentsDefaultProps['l-text'].props
const imageDefaultProps = componentsDefaultProps['l-image'].props

interface CreateComponentType {
  name: string;
  type?: string;
  props: { [key: string]: string };
}
const createResetCss = {
  width: '',
  position: 'static'
}
// the component name list
const componentsList: CreateComponentType[] = [
  {
    name: 'l-text',
    props: {
      ...textDefaultProps,
      text: '大标题',
      fontSize: '30px',
      fontWeight: 'bold',
      tag: 'h2'
    }
  },
  {
    name: 'l-text',
    props: {
      ...textDefaultProps,
      text: '正文内容',
      tag: 'p'
    }
  },
  {
    name: 'l-text',
    props: {
      ...textDefaultProps,
      text: '链接内容',
      color: '#1890ff',
      textDecoration: 'underline',
      tag: 'p'
    }
  },
  {
    name: 'l-text',
    props: {
      ...textDefaultProps,
      text: '按钮内容',
      color: '#ffffff',
      backgroundColor: '#1890ff',
      borderWidth: '1px',
      borderColor: '#1890ff',
      borderRadius: '2px',
      paddingLeft: '10px',
      paddingRight: '10px',
      paddingTop: '5px',
      paddingBottom: '5px',
      width: '100px',
      tag: 'button',
      textAlign: 'center'
    }
  },
  {
    name: 'l-image',
    type: 'upload',
    props: {
      ...imageDefaultProps
    }
  }
]
export default defineComponent({
  components: {
    LText,
    LImage,
    Uploader,
    FileImageOutlined,
    LoadingOutlined
  },
  name: 'components-list',
  emits: ['on-item-click'],
  setup (props, context) {
    const onItemClick = (data: CreateComponentType) => {
      if (data.type !== 'upload') {
        context.emit('on-item-click', data)
      }
    }
    const handleFileUploaded = (uploadedData: any, data: CreateComponentType) => {
      message.success('上传成功')
      data.props.imageSrc = uploadedData.data.url
      imageDimensions(uploadedData.file).then(dimension => {
        const maxWidth = 300
        data.props.width = ((dimension.width > maxWidth) ? maxWidth : dimension.width) + 'px'
        context.emit('on-item-click', data)
      })
    }
    return {
      list: componentsList,
      onItemClick,
      commonUploadCheck,
      handleFileUploaded,
      createResetCss
    }
  }
})
</script>

<style scoped>
.component-item {
  margin-bottom: 10px;
  cursor: pointer;
}
.uploader-container {
  text-align: center;
  padding: 10px;
  width: 100px;
  color: #ffffff;
  background: #1890ff;
}
.uploader-container h4 {
  color: #ffffff;
  margin-bottom: 0;
}
</style>
