<template>
  <div class="chart-cont">
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from '@/locale'
import moment from 'moment/moment'
import * as echarts from 'echarts'

const { t } = useI18n()
const chartRef = ref(null)

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  dateType: {
    type: String,
    default: 'month',
  },
  unit: {
    type: String,
    default: 'xe',
  },
  color: {
    type: String,
    default: '#4D86FF',
  },
})

const dateFormat = computed(() => {
  switch (props.dateType) {
    case 'day':
      return {
        input: 'YYYY-MM-DD',
        output: 'DD/MM',
        min: 24 * 3600 * 1000,
      }
    case 'month':
      return {
        input: 'YYYY-MM',
        output: 'MM/YYYY',
        min: 30 * 24 * 3600 * 1000,
      }
    case 'quarter':
      return {
        input: 'YYYY-[Q]Q',
        output: '[Q]Q/YYYY',
        min: 90 * 24 * 3600 * 1000,
      }
    case 'year':
      return {
        input: 'YYYY',
        output: 'YYYY',
        min: 365 * 24 * 3600 * 1000,
      }
    default:
      return {
        input: 'YYYY-MM',
        output: 'MM/YYYY',
        min: 30 * 24 * 3600 * 1000,
      }
  }
})

const options = ref(null)
let chartInstance = null

const initChart = () => {
  chartInstance = echarts.init(chartRef.value)
  updateOption()
}

const convertTime = timestamp => {
  const year = timestamp.year
  const quarter = timestamp.quarter
  let month = timestamp.month || 1
  const day = timestamp.day || 1

  if (quarter) {
    month = (quarter - 1) * 3 + 1
  }
  return moment({ year, month: month - 1, day }).format('YYYY-MM-DD')
}

const xData = computed(() => props.data?.map(i => convertTime(i.timestamp)))
const yData = computed(() => props.data?.map(i => [convertTime(i.timestamp), i.value]))
const updateOption = () => {
  options.value = {
    grid: {
      left: '35px', // Khoảng cách từ biểu đồ đến viền bên trái của container
      right: '21px', // Khoảng cách từ biểu đồ đến viền bên phải của container
      top: '20px', // Khoảng cách từ biểu đồ đến viền trên của container
      bottom: '25px', // Khoảng cách từ biểu đồ đến viền dưới của container
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: true, // Ẩn dấu gạch dọc
        alignWithLabel: true,
        customValues: xData,
      },
      axisLabel: {
        formatter: value => {
          return moment(value).format(dateFormat.value.output)
        },
        fontSize: 11,
        padding: [5, 0, 0, 0],
        showMaxLabel: true,
      },
      minInterval: dateFormat.value.min,
      boundaryGap: false,
    },
    yAxis: [
      {
        type: 'value',
        minInterval: 1,
        splitNumber: 5,
        axisLabel: {
          formatter: value => {
            let unit = ''
            if (value >= 1000000000) {
              unit = t('currency.billion')
              value = value / 1000000000
            } else if (value >= 1000000) {
              unit = t('currency.million')
              value = value / 1000000
            } else if (value >= 1000) {
              unit = t('currency.thousand')
              value = value / 1000
            }

            if (value < 10) {
              value = value.toFixed(1).replace(/\.?0+$/, '')
            } else {
              value = Math.floor(value)
            }

            return value + unit
          },
          fontSize: 11,
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: params => {
        const categoryName = params[0].axisValue
        const formattedCategoryName = moment(categoryName).format(dateFormat.value.output)
        let html = `<div>${formattedCategoryName}<br/>`
        params.forEach(item => {
          const formattedValue = new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(item.data[1])

          html += `<div>
                    <span class="tooltip-dot" style="  background-color: #5470c6"></span>
                    <span class="float-right"><span class="tooltip-value">${formattedValue}</span> <span>${props.unit}</span></span>
          </div>`
        })
        html += `</div>`
        return html
      },
    },
    legend: {
      show: false,
    },
    series: [
      {
        colorBy: 'series',
        itemStyle: {
          color: props.color ? props.color : '#4D86FF',
        },
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.4,
        },
        data: yData,
      },
    ],
  }
  chartInstance.setOption(options.value)
}

watch(
  () => props.data,
  newValue => {
    updateOption()
  }
)

watch(
  () => props.dateType,
  newValue => {
    updateOption()
  }
)

const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart) // Clean up the event listener
  chartInstance.dispose() // Dispose of the chart instance
})

defineOptions({
  name: 'ChartLine',
})
</script>

<style scoped lang="scss">
.chart-cont {
  margin-right: -5px;
}

.chart {
  width: 100%;
  height: 350px;
}

:deep(.tooltip-dot) {
  display: inline-block;
  margin-right: 4px;
  border-radius: 10px;
  width: 10px;
  height: 10px;
}

:deep(.tooltip-value) {
  margin-left: 10px;
  font-size: 14px;
  color: #666;
  font-weight: 900;
}
</style>
