<template>
  <div class="mywork-container">
    <a-modal
      title="数据统计"
      v-model:visible="showModal"
      width="700px"
      :footer="null"
    >
      <a-range-picker
        :value="dateRange"
        @change="onDateChange"
        format="YYYY-MM-DD"
      />
      <div id="main" :style="{width: '500px', height: '300px'}"></div>
      <a-table :columns="tableColumns" :data-source="tableData">
      </a-table>
    </a-modal>
    <a-row type="flex" justify="space-between" align="middle" class="poster-title" >
      <div v-if="currentSearchText" class="searchResult">
        <h2>{{currentSearchText}}的结果</h2>
        <a-button
          shape="circle" size="small"
          :style="{marginLeft: '10px'}"
          @click="clearSearch"
        >
          ×
        </a-button>
      </div>
      <h2 v-else>我的作品</h2>
      <a-input-search
        v-model:value="searchText"
        placeholder="搜索我的模版"
        @search="onSearch"
      />
    </a-row>
    <a-empty v-if="works.length === 0 && !loading">
      <template v-slot:description>
        <span> 还没有任何作品 </span>
      </template>
      <a-button type="primary" size="large" @click="createDesign">
        创建你的第一个设计 🎉
      </a-button>
    </a-empty>

    <works-list :list="works" @on-delete="onDelete" @on-copy="onCopy" :loading="loading" @on-static="openStatic"></works-list>
    <a-row type="flex" justify="center">
      <a-pagination v-model:current="currentPage" :total="total" :pageSize="8" show-less-items @change="pageChange"/>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, nextTick, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import { GlobalDataProps } from '../store/index'
import WorksList from '../components/WorksList.vue'
import useCreateDesign from '../hooks/useCreateDesign'
import { toDateFormat, toDateFromDays } from '../helper'
export default defineComponent({
  components: {
    WorksList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const works = computed(() => store.state.works.works)
    const total = computed(() => store.state.works.totalWorks)
    const loading = computed(() => store.state.status.loading)
    const statics = computed(() => store.state.works.statics)
    const channels = computed(() => store.state.editor.channels)
    const currentPage = ref(1)
    const staticOptions = computed(() => {
      const legend = statics.value.map(stat => stat.name)
      const xAxis = statics.value.map(stat => {
        return {
          type: 'category',
          data: stat.list.map(i => i.eventDate.split('T')[0])
        }
      })
      const series = statics.value.map(stat => {
        return {
          type: 'line',
          name: stat.name,
          data: stat.list.map(i => i.eventData.pv)
        }
      })
      return {
        legend: {
          data: legend
        },
        xAxis,
        yAxis: {
          type: 'value'
        },
        series
      }
    })
    const tableColumns = [
      {
        title: '渠道名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'PV',
        dataIndex: 'pv',
        key: 'pv'
      },
      {
        title: '占比',
        dataIndex: 'percent',
        key: 'percent'
      }
    ]
    const totalPv = computed(() => {
      let total = 0
      statics.value.forEach(stat => {
        const pv = stat.list.reduce((prev, current) => current.eventData.pv + prev, 0)
        total += pv
      })
      return total
    })
    const tableData = computed(() => {
      return statics.value.map(stat => {
        const pv = stat.list.reduce((prev, current) => current.eventData.pv + prev, 0)
        return {
          name: stat.name,
          key: stat.id,
          pv,
          percent: (pv / totalPv.value) * 100 + '%'
        }
      })
    })
    const searchText = ref('')
    const showModal = ref(false)
    const currentStaticId = ref(0)
    const dateRange = ref([toDateFormat(toDateFromDays(new Date(), -30)), toDateFormat(new Date())])
    const currentSearchText = computed(() => store.state.works.searchText)
    const createDesign = useCreateDesign()
    let myChart: any
    onMounted(() => {
      store.dispatch('fetchWorks')
    })
    const onSearch = () => {
      const title = searchText.value.trim()
      if (title !== '') {
        store.dispatch('fetchWorks', { title, pageIndex: 0, pageSize: 8 })
      }
    }
    const clearSearch = () => {
      store.dispatch('fetchWorks', { title: '', pageIndex: 0, pageSize: 8 })
    }
    const onDelete = (id: number) => {
      store.dispatch('deleteWork', id)
    }
    const onCopy = (id: number) => {
      store.dispatch('copyWork', id).then(({ data }) => {
        router.push(`/editor/${data.id}`)
      })
    }
    const pageChange = () => {
      console.log(currentPage.value)
      store.dispatch('fetchWorks', { title: currentSearchText.value, pageIndex: (currentPage.value - 1), pageSize: 8 })
    }
    const getChannelStatic = (id: number) => {
      store.commit('clearStatic')
      store.dispatch('getChannels', id).then(() => {
        const promiseArr = channels.value.map(channel => {
          return store.dispatch('fetchStatic', {
            name: channel.name,
            label: id,
            value: channel.id,
            startDate: dateRange.value[0],
            endDate: dateRange.value[1]
          })
        })
        return Promise.all(promiseArr)
      }).then(() => {
        if (!myChart) {
          myChart = echarts.init(document.getElementById('main'))
        }
        myChart.setOption(staticOptions.value)
      })
    }
    const openStatic = (id: number) => {
      showModal.value = true
      currentStaticId.value = id
      getChannelStatic(id)
    }
    const onDateChange = (newDate: string, dateString: string) => {
      dateRange.value[0] = dateString[0]
      dateRange.value[1] = dateString[1]
      getChannelStatic(currentStaticId.value)
    }
    return {
      works,
      onDelete,
      onCopy,
      createDesign,
      loading,
      searchText,
      currentSearchText,
      onSearch,
      clearSearch,
      openStatic,
      showModal,
      onDateChange,
      dateRange,
      tableData,
      tableColumns,
      total,
      currentPage,
      pageChange
    }
  }
})
</script>

<style>
 .mywork-container .ant-input-search {
  width: 30%;
}
.searchResult {
  display: flex;
  align-items: center;
}
</style>
