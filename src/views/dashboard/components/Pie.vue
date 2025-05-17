<template>
  <div class="chart-cont">
    <div ref="chartRef" class="chart" v-if="data.length"></div>
    <div></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch, computed } from 'vue'
import * as echarts from 'echarts'
import moment from 'moment'

const chartRef = ref(null)
let chartInstance = null

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  color: {
    type: String,
    default: '#4D86FF',
  },
})

const xData = computed(() => props.data.map(i => moment(i.date).format('DD/MM')))
const yData = computed(() => props.data.map(i => i.revenue))

const initChart = () => {
  chartInstance = echarts.init(chartRef.value)
  updateOption()
}

const updateOption = () => {
  const options = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['30%', '75%'],
        avoidLabelOverlap: false,
        padAngle: 2,
        itemStyle: {
          borderRadius: 6
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 24,
            fontWeight: 'bold',
            fontFamily: 'Inter',
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Vang đỏ' },
          { value: 735, name: 'Vang trắng' },
          { value: 580, name: 'Vang Pháp' },
          { value: 484, name: 'Rượu Bình dân' },
          { value: 300, name: 'Khác' }
        ]
      }
    ]
  }
  chartInstance.setOption(options)
}

watch(() => props.data, updateOption, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chartInstance.resize())
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', () => chartInstance.resize())
})
</script>

<style scoped>
.chart {
  width: 100%;
  height: 350px;
}
</style>
