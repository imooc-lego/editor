<template>
  <div class="template-list-component">
    <a-row :gutter="16">
      <a-col :span="6" v-for="item in list" :key="item.id" class="poster-item">
        <a-card hoverable>
          <template v-slot:cover>
            <img :src="item.coverImg"  />
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
.poster-title {
  height: 70px;
}
.poster-title h2 {
  margin-bottom: 0px;
}
</style>
