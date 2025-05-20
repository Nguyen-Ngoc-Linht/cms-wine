<template>
  <div class="chart-container w-full">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import {onMounted, onBeforeUnmount, ref, computed, watch} from 'vue'
import * as echarts from 'echarts'
import moment from 'moment'
import {formatNumber} from '@/utils'

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
  if (!chartRef.value || !props.data.length) {
    console.warn('Chart reference or data is missing')
    return
  }

  chartInstance = echarts.init(chartRef.value)
  updateOption()
}
const updateOption = () => {
  const zoomSize = 6
  const option = {
    title: null,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const val = params[0].data
        return `${params[0].axisValue}: <b>${formatNumber(val, '.')}đ</b>`
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      top: '6.4%',
      containLabel: true,
    },
    xAxis: {
      data: xData.value,
      axisLabel: {
        inside: false,
        color: '#666',
        fontSize: 12,
        rotate: 0,
      },
      axisTick: { show: false },
      axisLine: {
        show: true,
        lineStyle: { color: '#ccc' },
      },
      z: 10,
    },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#999',
        formatter: value => {
          if (value >= 1e9) return (value / 1e9).toFixed(1) + 'tỉ'
          if (value >= 1e6) return (value / 1e6).toFixed(1) + 'tr'
          if (value >= 1e3) return (value / 1e3).toFixed(1) + 'k'
          return value
        },
      },
    },
    dataZoom: [{ type: 'inside' }],
    series: [
      {
        type: 'bar',
        showBackground: true,
        itemStyle: {
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 10,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' },
            ]),
          },
        },
        data: yData.value,
      },
    ],
  }

  chartInstance.setOption(option)
  const length = yData.value.length
  chartInstance.on('click', (params) => {
    const startIndex = Math.max(params.dataIndex - zoomSize / 2, 0)
    const endIndex = Math.min(
      params.dataIndex + zoomSize / 2,
      length - 1
    )

    chartInstance.dispatchAction({
      type: 'dataZoom',
      startValue: xData[startIndex],
      endValue: xData[endIndex],
    })
  })

  const resizeHandler = () => chartInstance.resize()
  window.addEventListener('resize', resizeHandler)

  return resizeHandler
}

watch(() => props.data, updateOption, { deep: true })
onMounted(() => {
  const resizeHandler = initChart()
  chartRef.value.resizeHandler = resizeHandler
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  if (chartRef.value?.resizeHandler) {
    window.removeEventListener('resize', chartRef.value.resizeHandler)
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
}

.chart {
  width: 100%;
  height: 500px;
}
</style>
