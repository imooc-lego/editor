<template>
  <div class="create-component-list">
    <div
      v-for="(item, index) in list" :key="index"
      @click="onItemClick(item)" class="component-item"
    >
      <div class="component-wrapper" v-if="item.type !== 'upload'">
        <component :is="item.name" v-bind="item.props"  :style="generateResetCss(item.name)" class="inside-component"/>
        <span v-if="item.text" class="tip-text">{{item.text}}</span>
      </div>
      <uploader
        v-else
        action="/utils/upload-img"
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
import Uploader from './Uploader.vue'
import { componentsDefaultProps } from '../defaultProps'
import { commonUploadCheck, imageDimensions, UploadImgProps } from '../helper'
const textDefaultProps = componentsDefaultProps['l-text'].props
const imageDefaultProps = componentsDefaultProps['l-image'].props
const shapeDefaultProps = componentsDefaultProps['l-shape'].props
interface CreateComponentType {
  name: string;
  text?: string;
  type?: string;
  props: { [key: string]: string };
}
const generateResetCss = (name: string) => {
  return {
    position: 'static',
    ...((name !== 'l-shape') && { height: '' })
  }
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
      borderStyle: 'solid',
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
    name: 'l-shape',
    text: '长方形',
    props: {
      ...shapeDefaultProps,
      backgroundColor: '#efefef',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#ccc',
      width: '100px',
      height: '50px'
    }
  },
  {
    name: 'l-shape',
    text: '圆形',
    props: {
      ...shapeDefaultProps,
      backgroundColor: '#efefef',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#ccc',
      borderRadius: '100px',
      width: '100px',
      height: '100px'
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
    const handleFileUploaded = (uploadedData: UploadImgProps, data: CreateComponentType) => {
      message.success('上传成功')
      data.props.imageSrc = uploadedData.data.urls[0]
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
      generateResetCss
    }
  }
})
</script>

<style scoped>
.component-wrapper {
  width: 100px;
  position: relative;
}
.tip-text {
  position: absolute;
  text-align: center;
  top: 50%;
  width: 100%;
  margin-top: -10px;
}
.inside-component {
  width: 100px !important;
}
.component-item {
  margin-bottom: 15px;
  cursor: pointer;
  display: flex;
  justify-content: center;
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
