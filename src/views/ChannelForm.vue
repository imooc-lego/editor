<template>
  <div class="publish-channel-container">
    <a-row :style="{ marginBottom: '20px' }">
      <a-col :span="8">
        封面图
      </a-col>
      <a-col :span="16" class="right-col">
        <a-row>
          <a-col :span="6">
            <img :src="page.coverImg" :alt="page.title" />
          </a-col>
          <a-col :span="18" class="left-gap">
            <h4>{{page.title}}</h4>
            <p>{{page.desc}}</p>
          </a-col>
        </a-row>
        <a-tabs type="card" :style="{ marginTop: '20px' }">
          <a-tab-pane key="1" tab="发布为作品">
            <a-row v-for="channel in channels" :key="channel.id" class="channel-item">
              <a-col :span="6">
                <img :src="page.coverImg" :alt="page.title" />
              </a-col>
              <a-col :span="18" class="left-gap">
                <h4>{{channel.name}}</h4>
                <a-row>
                  <a-col :span="18">
                    <a-input :value="generateChannelURL(channel.id)" :disabled="true" />
                  </a-col>
                  <a-col :span="6">
                    <a-button>复制</a-button>
                  </a-col>
                </a-row>
              </a-col>
              <div class="delete-area"><a-button type="danger" size="small">删除渠道</a-button></div>
            </a-row>
            <a-form layout="inline" :model="form" :rules="rules" ref="publishForm">
              <a-form-item required name="channelName">
                <a-input v-model:value="form.channelName" placeholder="渠道名称"></a-input>
              </a-form-item>
              <a-form-item>
                <a-button
                  type="primary"
                  :disabled="form.channelName === ''"
                  @click="createChannel"
                >
                  创建新渠道
                </a-button>
              </a-form-item>
            </a-form>

          </a-tab-pane>
          <a-tab-pane key="2" tab="发布为模版">
            Content of Tab Pane 2
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { commonUploadCheck } from '../helper'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { GlobalDataProps } from '../store'
import { baseH5URL } from '../main'
interface RuleFormInstance {
  validate: () => Promise<any>;
}
export default defineComponent({
  // components: {
  //   StyledUploader
  // },
  emits: ['panel-close', 'publish-success'],
  setup (props, context) {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const currentWorkId = route.params.id as string
    const page = computed(() => store.state.page)
    const channels = computed(() => store.state.channels)
    onMounted(() => {
      store.dispatch('getChannels', currentWorkId)
    })
    const form = reactive({
      channelName: ''
    })
    const publishForm = ref() as Ref<RuleFormInstance>
    const rules = {
      channelName: [
        { required: true, message: '标题不能为空', trigger: 'change' }
      ]
    }
    const updatePage = (key: string, value: string) => {
      store.commit('updatePage', { key, value })
    }
    const generateChannelURL = (id: number) => `${baseH5URL}/p/${id}-${page.value.uuid}`

    const createChannel = () => {
      axios.post('/channel', { name: form.channelName, workId: parseInt(currentWorkId) }).then(data => {
        console.log(data)
      })
    }
    const cancelEdit = () => {
      context.emit('panel-close', true)
    }
    return {
      form,
      rules,
      publishForm,
      cancelEdit,
      commonUploadCheck,
      updatePage,
      page,
      createChannel,
      channels,
      generateChannelURL
    }
  }
})
</script>

<style>
.right-col img {
  width: 80px;
}
.left-gap {
  padding-left: 5px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.delete-area {
  position: absolute;
  top: 0;
  right: 20px;
}
.channel-item {
  padding: 10px 0;
  border-bottom: 1px solid #efefef;
}
</style>
