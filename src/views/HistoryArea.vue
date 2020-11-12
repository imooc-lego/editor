<template>
  <div class="history-area">
    <a-modal
      title="快捷键操作"
      v-model:visible="modalVisible"
      :footer="null"
      width="400px"
    >
      <ul class="shortcut-list">
        <li v-for="(item, key) in operationText" :key="key" class="shortcut-list-item">
          <span class="text">{{item.text}}</span>  <span class="bold">{{item.shortcut}}</span>
        </li>
      </ul>
    </a-modal>

    <div class="operation-list">
      <a-tooltip>
        <template #title>
          快捷键提示
        </template>
        <a-button shape="circle" @click="modalVisible = true">
          <template #icon><QuestionOutlined /> </template>
        </a-button>
      </a-tooltip>
      <a-tooltip>
        <template #title>
          撤销
        </template>
        <a-button shape="circle" @click="undoHistory" :disabled="undoIsDisabled">
          <template #icon><UndoOutlined /> </template>
        </a-button>
      </a-tooltip>
      <a-tooltip>
        <template #title>
          重做
        </template>
        <a-button shape="circle" @click="redoHistory" :disabled="redoIsDisabled">
          <template #icon><RedoOutlined /> </template>
        </a-button>
      </a-tooltip>
    </div>
    <li v-for="(item, index) in histories" :key="item.id">
      <span :class="{ bold: index === historyIndex}">{{item.type}} - {{item.data.layerName}}</span>
    </li>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { RedoOutlined, UndoOutlined, QuestionOutlined } from '@ant-design/icons-vue'
import { GlobalDataProps } from '../store/index'
import { operationText } from '../plugins/dataOperations'
export default defineComponent({
  components: {
    RedoOutlined,
    UndoOutlined,
    QuestionOutlined
  },
  setup () {
    const modalVisible = ref(false)
    const store = useStore<GlobalDataProps>()
    const histories = computed(() => store.state.editor.histories)
    const historyIndex = computed(() => store.state.editor.historyIndex)
    const undoIsDisabled = computed<boolean>(() => store.getters.checkUndoDisable)
    const redoIsDisabled = computed<boolean>(() => store.getters.checkRedoDisable)
    const undoHistory = () => {
      store.commit('undo')
    }
    const redoHistory = () => {
      store.commit('redo')
    }
    return {
      histories,
      undoHistory,
      redoHistory,
      undoIsDisabled,
      redoIsDisabled,
      historyIndex,
      modalVisible,
      operationText
    }
  }
})
</script>

<style>
.history-area {
  position: absolute;
  right: 0;
}
.operation-list {
  display: flex;
}
.shortcut-list {
  list-style-type: none;
  padding: 0;
  width: 300px;
  margin: 0 auto;
}
.shortcut-list-item {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.shortcut-list .text {
  color: rgba(0,0,0,.45)
}
.operation-list button {
  margin-left: 10px;
}
.history-area .bold {
  font-weight: bold;
}
.shortcut-list .bold {
  color: #1890ff;
}
</style>
