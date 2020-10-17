<template>
  <div class="setting-container">
    <a-row type="flex" justify="center">
      <a-col :span="8">
        <h2>个人中心👤</h2>
        <p>你可以在这里修改昵称和头像</p>
        <styled-uploader
          text="上传封面图"
          @file-uploaded="updateAvatar"
          :uploaded="form.uploaded"
        >
        </styled-uploader>
        <a-form
          :model="form" :rules="rules"
          ref="publishForm" layout="vertical"
        >
          <a-form-item label="昵称" required name="username">
            <a-input v-model:value="form.username" placeholder="填写你的昵称">
              <template v-slot:prefix><UserOutlined style="color:rgba(0,0,0,.25)"/></template>
            </a-input>
          </a-form-item>
          <a-form-item label="性别" name="username">
            <a-radio-group v-model:value="form.gender">
              <a-radio-button value="0">
                男
              </a-radio-button>
              <a-radio-button value="1">
                女
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="update" size="large"
              :loading="status.loading && status.opName === 'login'"
            >
              {{ status.loading ? '加载中' : '更新个人资料'}}
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref, computed, reactive } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { GlobalDataProps } from '../store/index'
import StyledUploader from '../components/StyledUploader.vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
interface RuleFormInstance {
  validate: () => Promise<any>;
}
export default defineComponent({
  name: 'Setting',
  components: {
    UserOutlined,
    StyledUploader
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const publishForm = ref() as Ref<RuleFormInstance>
    const user = computed(() => store.state.user.data)
    const form = reactive({
      username: user.value.nickName || '',
      gender: user.value.gender || '0',
      uploaded: { data: { url: (user.value.picture || 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f79389d4737571e2e1dc7cb.png') } }
    })
    const status = computed(() => store.state.status)
    const rules = {
      username: [
        { required: true, message: '用户昵称不能为空', trigger: 'blur' }
      ]
    }
    const updateAvatar = (rawData: any) => {
      form.uploaded = {
        data: { url: rawData.data.url }
      }
    }
    const update = () => {
      publishForm.value.validate().then(() => {
        console.log(form.username)
        console.log(form.gender)
        const payload = {
          nickName: form.username,
          gender: parseInt(form.gender),
          picture: form.uploaded.data.url
        }
        store.dispatch('updateUser', payload).then(() => {
          message.success('更新信息成功', 1)
        })
      })
    }
    return {
      form,
      status,
      rules,
      update,
      updateAvatar,
      publishForm
    }
  }
})
</script>

<style>
.setting-container .file-upload-container {
  display: flex;
  justify-content: center;
}
.setting-container .uploader-container {
  width: 200px !important;
  height: 200px !important;
  border-radius: 200px;
}
.setting-container .uploader-container img {
  border-radius: 200px;
}
</style>
