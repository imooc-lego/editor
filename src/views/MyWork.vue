<template>
  <div class="homepage-container">
    <h2>我的作品</h2>
    <a-row :gutter="16">
      <a-col :span="6" v-for="item in items" :key="item" class="poster-item">
        <a-card hoverable>
          <template v-slot:cover>
            <img src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" v-if="item % 2 === 0" />
            <img src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" v-else />
          </template>
          <template class="ant-card-actions" v-slot:actions>
            <EditOutlined key="setting" />
            <BarChartOutlined key="edit" />
            <a-dropdown>
              <EllipsisOutlined key="ellipsis" />
              <template v-slot:overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:;"><CopyOutlined/> 复制</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;"><DeleteOutlined /> 删除</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
          <a-card-meta title="未命名作品">
          </a-card-meta>
        </a-card>
        <div class="tag-list">
          <a-tag color="red">
            未发布
          </a-tag>
        </div>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center">
      <a-button type="primary" size="large">
        加载更多
      </a-button>
    </a-row>
  </div>
</template>

<script>
import { EditOutlined, BarChartOutlined, EllipsisOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons-vue'
export default {
  components: {
    EditOutlined,
    BarChartOutlined,
    EllipsisOutlined,
    CopyOutlined,
    DeleteOutlined
  },
  data () {
    return { items: [0, 1, 2, 3, 4, 5] }
  }
}
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
</style>
