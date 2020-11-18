<template>
  <div class="publish-form-container">
    <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
      <a-col :span="6">
        扫码预览：
      </a-col>
      <a-col :span="10">
        <div id="preview-barcode-container">

        </div>
      </a-col>
    </a-row>
    <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
      <a-col :span="6">
        上传封面：
      </a-col>
      <a-col :span="10">
        <styled-uploader
          text="上传封面图"
          @file-uploaded="updateAvatar"
          :uploaded="form.uploaded"
        >
        </styled-uploader>
      </a-col>
    </a-row>
    <a-form
      :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
      :model="form" :rules="rules"
      ref="publishForm"
    >
      <a-form-item label="标题" required name="title">
        <a-input v-model:value="form.title" @change="updatePage('title', form.title)"/>
      </a-form-item>
      <a-form-item label="副标题" required name="subTitle">
        <a-input v-model:value="form.subTitle" @change="updatePage('desc', form.subTitle)"/>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 18, offset: 4 }">
        <a-button type="primary" @click="checkAndpublish" :loading="loading">
          发布
        </a-button>
        <a-button style="margin-left: 10px;" @click="saveWork" :loading="loading">
          保存
        </a-button>
        <a-button style="margin-left: 10px;" @click="cancelEdit">
          取消
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref, nextTick, computed, watch, onMounted } from 'vue'
import StyledUploader from '../components/StyledUploader.vue'
import { commonUploadCheck, UploadImgProps, takeScreenshotAndUpload } from '../helper'
import QRCode from 'qrcodejs2'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { GlobalDataProps } from '../store'
import { baseH5URL } from '../main'
interface RuleFormInstance {
  validate: () => Promise<any>;
}
export default defineComponent({
  components: {
    StyledUploader
  },
  emits: ['panel-close', 'publish-success'],
  setup (props, context) {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const currentWorkId = route.params.id
    const pageData = computed(() => store.state.editor.page)
    const loading = computed(() => store.state.status.loading)
    const { title, desc, setting } = pageData.value
    const previewURL = `${baseH5URL}/p/preview/${pageData.value.id}-${pageData.value.uuid}`
    const form = reactive({
      title: title || '',
      subTitle: desc || '',
      uploaded: { data: { url: (setting && setting.shareImg) || 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f79389d4737571e2e1dc7cb.png' } }
    })
    // in case title changed from outside
    watch(() => pageData.value.title, (newTitle) => {
      if (newTitle) {
        form.title = newTitle
      }
    })
    onMounted(() => {
      const ele = document.getElementById('preview-barcode-container')
      if (ele) {
        // clear the barcode
        ele.innerHTML = ''
        // eslint-disable-next-line no-new
        new QRCode(ele, {
          text: previewURL,
          width: 120,
          height: 120
        })
      }
    })
    const publishForm = ref() as Ref<RuleFormInstance>
    const rules = {
      title: [
        { required: true, message: '标题不能为空', trigger: 'blur' }
      ],
      subTitle: [
        { required: true, message: '副标题不能为空', trigger: 'blur' }
      ]
    }
    const updatePage = (key: string, value: string, settings = false) => {
      store.commit('updatePage', { key, value, level: settings ? 'setting' : false })
    }
    const updateAvatar = (rawData: UploadImgProps) => {
      const url = rawData.data.urls[0]
      form.uploaded = {
        data: { url }
      }
      updatePage('shareImg', url, true)
    }
    const validate = () => {
      return publishForm.value.validate()
    }
    const publishWork = async () => {
      store.commit('setActive', '')
      await nextTick()
      try {
        const rawData = await takeScreenshotAndUpload('canvas-area')
        if (rawData) {
          store.commit('updatePage', { key: 'coverImg', value: rawData.data.urls[0] })
        }
      } catch (e) {
        console.error(e)
      } finally {
        await store.dispatch('saveAndPublishWork', { id: currentWorkId })
        context.emit('publish-success', true)
      }
    }
    const checkAndpublish = () => {
      validate()
        .then(() => { return publishWork() })
        .then(() => { context.emit('publish-success', true) })
    }
    const saveWork = () => {
      validate()
        .then(() => store.dispatch('saveWork', { id: currentWorkId }))
        .then(() => { context.emit('panel-close', true) })
    }
    const cancelEdit = () => {
      context.emit('panel-close', true)
    }
    return {
      form,
      rules,
      publishForm,
      checkAndpublish,
      saveWork,
      cancelEdit,
      commonUploadCheck,
      updatePage,
      updateAvatar,
      loading
    }
  }
})
</script>

<style>
.publish-form-container .file-upload-container {
  height: 130px;
}
.publish-form-container .ant-form-item-label {
  text-align: left;
}
#preview-barcode-container {
  border: 2px dotted #efefef;
  padding: 10px;
}
</style>
