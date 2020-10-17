<template>
  <div class="template-list-component">
    <a-skeleton v-if="loading"/>
    <a-row :gutter="16">
      <a-col :span="6" v-for="item in listWithBarcode" :key="item.id" class="poster-item">
        <a-card hoverable @mouseenter="() => showBarcode(item.id, item.barcodeUrl)">
          <template v-slot:cover>
            <img :src="item.coverImg"  v-if="item.coverImg" />
            <img src="http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png"  v-else />
            <div class="hover-item">
              <div :id="`barcode-${item.id}`" class="barcode-container">
              </div>
            </div>
          </template>
          <template class="ant-card-actions" v-slot:actions>
            <router-link :to="`/editor/${item.id}`"><EditOutlined key="edit" /></router-link>
            <router-link :to="`/static/${item.id}`"><BarChartOutlined key="chart" /></router-link>
            <a-dropdown>
              <EllipsisOutlined key="ellipsis" />
              <template v-slot:overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:;" @click.prevent="copyClicked(item.id)"><CopyOutlined/> 复制</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;"  @click.prevent="deleteClicked(item.id)"><DeleteOutlined /> 删除</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <a-card-meta :title="item.title">
          </a-card-meta>
        </a-card>
        <div class="tag-list">
          <a-tag color="red" v-if="item.status === '1'">
            未发布
          </a-tag>
          <a-tag color="green" v-else>
            已发布
          </a-tag>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, nextTick } from 'vue'
import { EditOutlined, BarChartOutlined, EllipsisOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import QRCode from 'qrcodejs2'
import { WorkProp } from '../store/works'
import { Modal } from 'ant-design-vue'
import { baseH5URL } from '../main'
export default defineComponent({
  name: 'works-list',
  emits: ['on-copy', 'on-delete'],
  components: {
    EditOutlined,
    BarChartOutlined,
    EllipsisOutlined,
    CopyOutlined,
    DeleteOutlined
  },
  props: {
    list: {
      type: Array as PropType<WorkProp[]>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup (props, context) {
    const container = ref<null | HTMLElement>(null)
    const listWithBarcode = computed(() => {
      return props.list.map(item => {
        item.barcodeUrl = `${baseH5URL}/p/${item.id}-${item.uuid}`
        return item
      })
    })
    const showBarcode = (id: number, url?: string) => {
      nextTick(() => {
        const container = document.getElementById(`barcode-${id}`)
        if (container && url && !container.hasChildNodes()) {
          // eslint-disable-next-line no-new
          new QRCode(container, {
            text: url,
            width: 120,
            height: 120
          })
        }
      })
    }
    const deleteClicked = (id: number) => {
      Modal.confirm({
        title: '确定要删除该作品吗？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          context.emit('on-delete', id)
        }
      })
    }
    const copyClicked = (id: number) => {
      context.emit('on-copy', id)
    }
    return {
      deleteClicked,
      copyClicked,
      listWithBarcode,
      showBarcode,
      container
    }
  }
})
</script>

<style scoped>
.poster-item {
  position: relative;
  margin-bottom: 20px;
}
.tag-list {
  position: absolute;
  top: -4px;
  left: 6px;
}
.ant-card-cover img {
  height: 300px;
  object-fit: cover;
}
.description-detail {
  display: flex;
  justify-content: space-between;
}
.barcode-container {
  width: 120px;
  height: 120px;
}
</style>
