<template>
  <div class="publish-form-container">
    <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
      <a-col :span="4">
        封面图
      </a-col>
      <a-col :span="10">
        <styled-uploader
          text="上传封面图"
          @file-uploaded="(rawData) => { updatePage('coverImg', rawData.data.url) }"
          :uploaded="form.uploaded"
        >
        </styled-uploader>
      </a-col>
    </a-row>
    <a-form
      :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }"
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
        <a-button type="primary" @click="publishWork">
          发布
        </a-button>
        <a-button style="margin-left: 10px;" @click="saveWork">
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
import { defineComponent, reactive, ref, Ref } from 'vue'
import StyledUploader from '../components/StyledUploader.vue'
import { commonUploadCheck } from '../helper'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { GlobalDataProps } from '../store'
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
    const { title, desc, coverImg } = store.state.page
    console.log(store.state.page)
    const form = reactive({
      title: title || '',
      subTitle: desc || '',
      uploaded: coverImg ? { data: { url: coverImg } } : null
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
    const updatePage = (key: string, value: string) => {
      store.commit('updatePage', { key, value })
    }
    const validate = () => {
      return publishForm.value.validate()
    }
    const publishWork = () => {
      console.log(store.state.page)
      validate()
        .then(() => store.dispatch('saveAndPublishWork', { id: currentWorkId }))
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
      publishWork,
      saveWork,
      cancelEdit,
      commonUploadCheck,
      updatePage
    }
  }
})
</script>

<style>
.publish-form-container .file-upload-container {
  height: 130px;
}
</style>
