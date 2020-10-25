<template>
  <div class="work-detail-container">
    <a-row type="flex" justify="center">
      <a-col :span="8" class="cover-img">
        <img :src="currentTemplate.coverImg" alt="">
      </a-col>
      <a-col :span="8">
        <h2>{{currentTemplate.title}}</h2>
        <p>{{currentTemplate.desc}}</p>
      <div class="author">
        <a-avatar>
          <template v-slot:icon><UserOutlined /></template>
        </a-avatar>
        该模版由 <b>{{currentTemplate.author}}</b> 创作
      </div>
      <div class="bar-code-area" >
        <span>扫一扫，手机预览</span>
        <div ref="container"></div>
      </div>
      <div class="use-button">
        <a-button
          type="primary" size="large"
          :style="{'padding': '0 20px', 'height': '50px'}"
          @click="onCopy(currentTemplate.id)"
          :loading="isCreating"
        >
          {{ isCreating ? '创建中...' : '使用模版' }}
        </a-button>
      </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import QRCode from 'qrcodejs2'
import { GlobalDataProps } from '../store/index'
import { WorkProp } from '../store/works'
import { baseH5URL } from '../main'
export default defineComponent({
  name: 'TemplateDetail',
  components: {
    UserOutlined
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const router = useRouter()
    const isCreating = ref(false)
    const currentTemplateId = route.params.id
    const container = ref<null | HTMLElement>(null)
    const currentTemplate = computed<WorkProp>(() => store.getters.getCurrentTemplate(currentTemplateId) || {})
    const channelURL = computed(() => `${baseH5URL}/p/${currentTemplate.value.id}-${currentTemplate.value.uuid}`)
    const onCopy = (id: number) => {
      if (store.state.user.isLogin) {
        isCreating.value = true
        store.dispatch('copyWork', id).then(({ data }) => {
          router.push(`/editor/${data.id}`)
        })
      } else {
        router.push('/login')
      }
    }
    onMounted(() => {
      store.dispatch('fetchTemplate', currentTemplateId).then(() => {
        if (container.value) {
          // eslint-disable-next-line no-new
          new QRCode(container.value, {
            text: channelURL.value,
            width: 120,
            height: 120
          })
        }
      })
    })
    return {
      container,
      currentTemplate,
      isCreating,
      onCopy
    }
  }
})
</script>

<style scoped>
.work-detail-container {
  margin-top:50px;
}
.cover-img {
  margin-right: 30px;
}
.cover-img img {
  width: 100%;
}
.use-button {
  margin: 30px 0;
}
.ant-avatar {
  margin-right: 10px;
}
.bar-code-area {
  margin: 20px 0;
}
</style>
