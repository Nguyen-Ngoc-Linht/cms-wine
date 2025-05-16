<template>
  <div class="chart-container w-full">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chartInstance = null

// prettier-ignore
const dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放']
// prettier-ignore
const data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220]

const zoomSize = 6

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)

  const option = {
    title: {
      text: '特性示例：渐变色 阴影 点击缩放',
      subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      },
      subtextStyle: {
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      data: dataAxis,
      axisLabel: {
        inside: false,
        color: '#666',
        fontSize: 12,
        rotate: 0
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ccc'
        }
      },
      z: 10
    },
    yAxis: {
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999'
      }
    },
    dataZoom: [
      {
        type: 'inside'
      }
    ],
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
            { offset: 1, color: '#188df0' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' }
            ])
          }
        },
        data
      }
    ]
  }

  chartInstance.setOption(option)

  // Handle zoom on click
  chartInstance.on('click', function (params) {
    const startValue = dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]
    const endValue =
      dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]

    chartInstance.dispatchAction({
      type: 'dataZoom',
      startValue,
      endValue
    })
  })

  window.addEventListener('resize', () => chartInstance.resize())
}

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', () => chartInstance.resize())
})
</script>

<style scoped>
.chart {
  width: 100%;
  height: 500px;
}
</style>
