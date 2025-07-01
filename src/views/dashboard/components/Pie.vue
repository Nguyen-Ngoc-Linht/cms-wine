<template>
  <div class="pie-chart-container">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="6" animated />
    </div>
    <div v-else ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'
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

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  const seriesData = props.data.map((item, index) => ({
    name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
    value: item.value,
    itemStyle: {
      color: colors[index % colors.length]
    }
  }))

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return `<div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
                <div>Đã bán: <span style="font-weight: 600;">${params.value} sản phẩm</span></div>
                <div>Tỷ lệ: <span style="font-weight: 600;">${params.percent}%</span></div>`
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      textStyle: {
        fontSize: 11,
        color: '#6b7280'
      },
      formatter: function(name) {
        return name.length > 15 ? name.substring(0, 15) + '...' : name
      }
    },
    series: [
      {
        name: 'Sản phẩm bán chạy',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['65%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#111827'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: false
        },
        data: seriesData
      }
    ]
  }

  chartInstance.setOption(option)
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
.pie-chart-container {
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
