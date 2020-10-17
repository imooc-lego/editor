<template>
  <div class="template-list-component">
    <a-row :gutter="16">
      <a-col :span="6" v-for="item in list" :key="item.id" class="poster-item">
        <router-link :to="(type === 'work') ? `/editor/${item.id}` : `/template/${item.id}`">
          <a-card hoverable>
            <template v-slot:cover>
              <img :src="item.coverImg"  v-if="item.coverImg" />
              <img src="http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png"  v-else />
              <div class="hover-item">
                <a-button size="large" type="primary">{{(type === 'work') ? '编辑该作品': '使用该模版创建'}}</a-button>
              </div>
            </template>
            <a-card-meta :title="item.title">
              <template v-slot:description>
                <div class="description-detail">
                  <span>作者：{{item.author}}</span>
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
import { WorkProp } from '../store/works'
export default defineComponent({
  name: 'template-list',
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
.tag-list {
  position: absolute;
  top: -4px;
  left: 6px;
}
.ant-card-cover > img {
  height: 300px;
  object-fit: cover;
}
.description-detail {
  display: flex;
  justify-content: space-between;
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
}
.ant-card-cover > img {
  transition: all ease-in .2s;
}
.hover-item {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: none;
  background: rgba(0, 0, 0, .7);
  align-items: center;
  justify-content: center;
}
.poster-item:hover .hover-item {
  display: flex;
}
.poster-item:hover img {
  transform: scale(1.25);
}
</style>
