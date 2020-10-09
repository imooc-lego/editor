<template>
  <div class="publish-channel-container">
    <a-row :style="{ marginBottom: '20px' }">
      <a-col :span="8" class="left-col">
        封面图
        <img :src="page.coverImg" :alt="page.title" />
      </a-col>
      <a-col :span="16" class="right-col">
        <a-row>
          <a-col :span="6">
            <img :src="page.setting.shareImg" :alt="page.title" />
          </a-col>
          <a-col :span="18" class="left-gap">
            <h4>{{page.title}}</h4>
            <p>{{page.desc}}</p>
          </a-col>
        </a-row>
        <a-tabs type="card" :style="{ marginTop: '20px' }" @change="tabChange">
          <a-tab-pane key="channels" tab="发布为作品">
            <a-row v-for="channel in channels" :key="channel.id" class="channel-item">
              <a-col :span="6">
                <div :id="`channel-barcode-${channel.id}`" class="barcode-container"></div>
              </a-col>
              <a-col :span="18" class="left-gap">
                <h4>{{channel.name}}</h4>
                <a-row>
                  <a-col :span="18">
                    <a-input :value="generateChannelURL(channel.id)" :readonly="true" :id="`channel-url-${channel.id}`"/>
                  </a-col>
                  <a-col :span="6">
                    <a-button class="copy-button" :data-clipboard-target="`#channel-url-${channel.id}`">复制</a-button>
                  </a-col>
                </a-row>
              </a-col>
              <div class="delete-area">
                <a-button type="danger" size="small" @click="deleteChannel(channel.id)" :disabled="deleteDisabled">删除渠道</a-button>
              </div>
            </a-row>
            <a-form layout="inline" :model="form" :rules="rules" ref="publishForm" :style="{ marginTop: '20px' }">
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
          <a-tab-pane key="template" tab="发布为模版">
            <a-row class="channel-item">
              <a-col :span="6">
                <div id="channel-barcode-template" class="barcode-container"></div>
              </a-col>
              <a-col :span="18" class="left-gap">
                <h4>模版信息</h4>
                <a-row>
                  <a-col :span="18">
                    <a-input :value="generateChannelURL()" :readonly="true" id="channel-url-template"/>
                  </a-col>
                  <a-col :span="6">
                    <a-button class="copy-button" data-clipboard-target="#channel-url-template">复制</a-button>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <div class="template-submit">
              <a-button
                  type="primary"
                  size="large"
                  @click="publishTemplate"
              >
                  发布模版
              </a-button>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref, computed, onMounted, watch, nextTick } from 'vue'
import { last } from 'lodash'
import ClipboardJS from 'clipboard'
import QRCode from 'qrcodejs2'
import { message } from 'ant-design-vue'
import { commonUploadCheck } from '../helper'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { GlobalDataProps } from '../store'
import { baseH5URL } from '../main'
interface RuleFormInstance {
  validate: () => Promise<any>;
}
export default defineComponent({

  emits: ['panel-close', 'publish-success'],
  setup (props, context) {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const currentWorkId = route.params.id as string
    const page = computed(() => store.state.editor.page)
    const channels = computed(() => store.state.editor.channels)
    const qrCodeGenerated = ref(false)
    const generateChannelURL = (id?: number) =>
      id ? `${baseH5URL}/p/${page.value.id}-${page.value.uuid}?channel=${id}` : `${baseH5URL}/p/${page.value.id}-${page.value.uuid}`
    const generateQRCode = (id?: number) => {
      const ele = document.getElementById(id ? `channel-barcode-${id}` : 'channel-barcode-template')
      if (ele) {
        // eslint-disable-next-line no-new
        new QRCode(ele, {
          text: generateChannelURL(id),
          width: 80,
          height: 80
        })
      }
    }
    onMounted(() => {
      store.dispatch('getChannels', currentWorkId)
      const clipboard = new ClipboardJS('.copy-button')
      clipboard.on('success', (e) => {
        message.success('复制成功', 1)
        e.clearSelection()
      })
      setTimeout(() => {
        channels.value.forEach(channel => {
          generateQRCode(channel.id)
        })
      }, 500)
    })
    watch(channels, (newChannels, oldChannels) => {
      // creating new channel
      if ((newChannels.length > oldChannels.length) && (oldChannels.length !== 0)) {
        // grab the last item for new channel
        const createdChannel = last(newChannels)
        if (createdChannel) {
          generateQRCode(createdChannel.id)
        }
      }
    })
    const tabChange = (activeKey: string) => {
      if (activeKey === 'template' && !qrCodeGenerated.value) {
        nextTick(() => {
          generateQRCode()
          qrCodeGenerated.value = true
        })
      }
    }
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
    const deleteDisabled = computed(() => channels.value.length === 1)
    const createChannel = () => {
      const payload = {
        name: form.channelName,
        workId: parseInt(currentWorkId)
      }
      store.dispatch('createChannel', payload).then(() => {
        form.channelName = ''
      })
    }
    const deleteChannel = (id: number) => {
      store.dispatch('deleteChannel', id)
    }
    const publishTemplate = () => {
      store.dispatch('publishTemplate', currentWorkId).then(() => {
        message.success('模版发布成功', 1)
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
      generateChannelURL,
      deleteChannel,
      deleteDisabled,
      tabChange,
      publishTemplate
    }
  }
})
</script>

<style>
.left-col img {
  width: 80%;
}
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
  top: 10px;
  right: 20px;
}
.channel-item {
  padding: 10px 0;
  border-bottom: 1px solid #efefef;
}
.barcode-container {
  height: 80px;
  width: 80px;
}
.template-submit {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
