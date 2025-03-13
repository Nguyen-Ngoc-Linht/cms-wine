<template>
  <div class="chart-cont">
    <div ref="chartRef" class="chart" v-if="data.length"></div>
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
    grid: {
      left: '50px',
      right: '20px',
      top: '20px',
      bottom: '50px',
    },
    xAxis: {
      type: 'category',
      data: xData.value,
      axisLabel: { fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 12 },
    },
    tooltip: {
      trigger: 'axis',
      formatter: params => {
        return `${params[0].axisValue}: <b>${params[0].data}</b> VND`
      },
    },
    series: [
      {
        type: 'bar',
        data: yData.value,
        itemStyle: { color: props.color },
        barWidth: '50%',
      },
    ],
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
