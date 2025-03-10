<template>
  <div class="chart-gauge">
    <div
      ref="chartRef"
      class="chart"
    ></div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, nextTick, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { numberFormatter } from '@/utils'

const props = defineProps({
  data: {
    type: Number,
    default: 80,
  },
  title: {
    type: String,
  },
})

const color = computed(() => {
  if (props.data < 50) {
    return '#FF3B49'
  } else if (props.data < 70) {
    return '#FD8312'
  } else {
    return '#2AC050'
  }
})

const chartRef = ref(null)
const options = ref(null)
let chartInstance = null

const initChart = () => {
  chartInstance = echarts.init(chartRef.value)
  updateOption()
}
const updateOption = () => {
  options.value = {
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          // thanh progress
          show: true,
          overlap: false, // hiển thị chồng lên nhau khi có nhiều biểu đồ
          roundCap: true, // bo viền
          clip: false, // không tràn
          itemStyle: {
            // viền
            borderWidth: 0,
            borderColor: color.value,
            color: color.value,
          },
        },
        axisLine: {
          // độ rộng vòng
          lineStyle: {
            width: 4,
            color: [[1, '#e9e9e9']],
          },
        },
        splitLine: {
          // vạch chia
          show: false,
          distance: 0,
          length: 10,
        },
        axisTick: {
          // vạch chia đơn vị
          show: false,
        },
        axisLabel: {
          // nhãn đơn vị
          show: false,
          distance: 50,
        },
        data: [
          {
            // dữ liệu
            value: Math.round(props.data * 100) / 100 || 0,
            name: '',
            title: {
              // tiêu đề của vòng ở trung tâm
              show: false,
              offsetCenter: ['0%', '0%'],
            },
            detail: {
              // dữ liệu của vòng ở trung tâm
              // valueAnimation: true,
              offsetCenter: ['5%', '5%'],
              color: color.value,
            },
          },
        ],
        title: {
          // tiêu đề
          fontSize: 14,
        },
        detail: {
          // dữ liệu ở trung tâm
          width: 50,
          height: 50,
          fontSize: 14,
          color: 'inherit',
          formatter: '{value}%',
        },
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

onMounted(() => {
  initChart()
})

defineOptions({
  name: 'ChartGauge',
})
</script>

<style scoped>
@import '@/styles/variables.module.scss';
.chart {
  width: 80px;
  height: 80px;
}

.chart-gauge {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 5%;
  align-items: center;
  background: #fff;
  border: 1px solid #ebebec;
  border-radius: 2px;
  padding: 0 10px;
}

.title {
  color: $menuText;
  font-weight: 600;
}
</style>
