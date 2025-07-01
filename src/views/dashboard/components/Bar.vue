<template>
  <div class="bar-chart-container">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>
    <div v-else ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch, nextTick, onUnmounted} from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartRef.value || props.loading) return

  chartInstance = echarts.init(chartRef.value)

  const dates = props.data.map(item => {
    const date = new Date(item.date)
    return `${date.getDate()}/${date.getMonth() + 1}`
  })

  const revenues = props.data.map(item => item.revenue)
  const orders = props.data.map(item => item.orders || Math.floor(item.revenue / 50000))

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      },
      formatter: function(params) {
        let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue}</div>`
        params.forEach(param => {
          if (param.seriesName === 'Doanh thu') {
            result += `<div style="display: flex; align-items: center; margin-bottom: 4px;">
              <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
              ${param.seriesName}: <span style="font-weight: 600; margin-left: 8px;">${formatCurrency(param.value)}</span>
            </div>`
          } else {
            result += `<div style="display: flex; align-items: center;">
              <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
              ${param.seriesName}: <span style="font-weight: 600; margin-left: 8px;">${param.value} đơn</span>
            </div>`
          }
        })
        return result
      }
    },
    legend: {
      data: ['Doanh thu', 'Đơn hàng'],
      top: 10,
      textStyle: {
        fontSize: 12,
        color: '#6b7280'
      }
    },
    xAxis: [
      {
        type: 'category',
        data: dates,
        axisPointer: {
          type: 'shadow'
        },
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 11
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Doanh thu (VND)',
        position: 'left',
        axisLabel: {
          formatter: function(value) {
            return formatShortCurrency(value)
          },
          color: '#6b7280',
          fontSize: 11
        },
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6'
          }
        }
      },
      {
        type: 'value',
        name: 'Đơn hàng',
        position: 'right',
        axisLabel: {
          formatter: '{value} đơn',
          color: '#6b7280',
          fontSize: 11
        },
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        }
      }
    ],
    series: [
      {
        name: 'Doanh thu',
        type: 'bar',
        yAxisIndex: 0,
        data: revenues,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#1d4ed8' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2563eb' },
              { offset: 1, color: '#1e40af' }
            ])
          }
        }
      },
      {
        name: 'Đơn hàng',
        type: 'line',
        yAxisIndex: 1,
        data: orders,
        lineStyle: {
          color: '#10b981',
          width: 3
        },
        itemStyle: {
          color: '#10b981'
        },
        symbol: 'circle',
        symbolSize: 6,
        emphasis: {
          itemStyle: {
            color: '#059669',
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  }

  chartInstance.setOption(option)
}

const formatCurrency = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'
}

const formatShortCurrency = (value) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  }
  return value.toString()
}

const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

watch(() => props.data, () => {
  if (!props.loading) {
    nextTick(() => {
      initChart()
    })
  }
}, { deep: true })

watch(() => props.loading, (newVal) => {
  if (!newVal) {
    nextTick(() => {
      initChart()
    })
  }
})

onMounted(() => {
  if (!props.loading) {
    nextTick(() => {
      initChart()
    })
  }

  window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', resizeChart)
})
</script>

<style scoped>
.bar-chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
}

.loading-container {
  padding: 20px;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
