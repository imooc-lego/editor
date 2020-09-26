<template>
  <div class="publish-form-container">
    <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
      <a-col :span="4">
        封面图
      </a-col>
      <a-col :span="10">
        <styled-uploader text="上传封面图"></styled-uploader>
      </a-col>
    </a-row>
    <a-form
      :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }"
      :model="form" :rules="rules"
      ref="publishForm"
    >
      <a-form-item label="标题" required name="title">
        <a-input v-model:value="form.title" />
      </a-form-item>
      <a-form-item label="副标题" required name="subTitle">
        <a-input v-model:value="form.subTitle" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 18, offset: 4 }">
        <a-button type="primary" @click="publish">
          发布
        </a-button>
        <a-button style="margin-left: 10px;">
          保存
        </a-button>
        <a-button style="margin-left: 10px;">
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
interface RuleFormInstance {
  validate: () => Promise<any>;
}
export default defineComponent({
  components: {
    StyledUploader
  },
  setup () {
    const form = reactive({
      title: '',
      subTitle: ''
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
    const publish = () => {
      publishForm.value.validate().then(() => { console.log('passed') })
    }

    return {
      form,
      rules,
      publishForm,
      publish,
      commonUploadCheck
    }
  }
})
</script>

<style>
.publish-form-container .file-upload-container {
  height: 130px;
}
</style>
