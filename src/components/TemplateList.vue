<template>
  <div class="template-list-component">
    <a-row :gutter="16">
      <a-col :span="6" v-for="item in list" :key="item.id" class="poster-item">
        <router-link :to="(type === 'work') ? `/editor/${item.id}` : `/template/${item.id}`">
          <a-card hoverable>
            <template v-slot:cover>
              <img :src="item.coverImg"  v-if="item.coverImg" />
              <img src="http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png"  v-else />
              <!-- <div class="blur-image">
                <img :src="item.coverImg"  v-if="item.coverImg" />
                <img src="http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png"  v-else />
              </div> -->
              <div class="hover-item">
                <a-button size="large" type="primary">{{(type === 'work') ? '编辑该作品': '使用该模版创建'}}</a-button>
              </div>
            </template>
            <a-card-meta :title="item.title">
              <template v-slot:description>
                <div class="description-detail">
                  <span v-if="item.user">作者：{{item.user.nickName}}</span>
                  <span class="user-number"><UserOutlined /> {{item.copiedCount}}</span>
                </div>
              </template>
            </a-card-meta>
          </a-card>
          <div class="tag-list">
            <a-tag color="red" v-if="item.isHot">
              HOT
            </a-tag>
            <a-tag color="green" v-if="item.isNew">
              NEW
            </a-tag>
          </div>
        </router-link>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import { WorkProp } from '../store/works'
export default defineComponent({
  name: 'template-list',
  components: {
    UserOutlined
  },
  props: {
    list: {
      type: Array as PropType<WorkProp[]>,
      required: true
    },
    type: {
      type: String,
      default: 'work'
    }
  }
})
</script>

<style>
.poster-item {
  position: relative;
  margin-bottom: 20px;
}
.poster-item .ant-card {
  border-radius: 12px;
}
.tag-list {
  position: absolute;
  top: -4px;
  left: 6px;
}
.poster-item .ant-card-cover {
  height: 390px;
}
.poster-item .ant-card-cover > img {
  width: 100%;
}
.poster-item .blur-image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  padding-top: 15px;
}
.blur-image > img {
  width: 70%;
  text-align: center;
  margin: 0 auto;
}
.poster-item .ant-card-hoverable {
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
}
.poster-item .ant-card-body {
  padding: 0
}
.poster-item .ant-card-meta {
  margin: 0;
}
.poster-item .ant-card-meta-title {
  color: #333;
  padding: 10px 12px;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 0 !important;
}
.description-detail {
  display: flex;
  justify-content: space-between;
  padding: 13px 12px;
  color: #999;
}
.user-number {
  font-weight: bold;
}
.poster-title {
  height: 70px;
}
.poster-title h2 {
  margin-bottom: 0px;
}
.poster-item .ant-card-cover {
  position: relative;
  overflow: hidden;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.poster-item .ant-card-cover  img {
  transition: all ease-in .2s;
}
.hover-item {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: none;
  background: rgba(0, 0, 0, .8);
  align-items: center;
  justify-content: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.poster-item:hover .hover-item {
  display: flex;
}
.poster-item:hover img {
  transform: scale(1.25);
}
.barcode-container img {
  border-radius: 0;
}
</style>
