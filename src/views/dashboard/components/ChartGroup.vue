<template>
  <div class="chart-group">
    <div class="chart-title">{{ title }}</div>
    <div class="chart-option flex-wrap sm:flex-nowrap">
      <el-select
        v-model="chartType"
        class="w-[150px] flex-grow-0 flex-shrink-0"
      >
        <el-option
          value="bar"
          :label="t('dashboard.barChart')"
          >{{ t('dashboard.barChart') }}</el-option
        >
        <el-option
          value="line"
          :label="t('dashboard.lineChart')"
          >{{ t('dashboard.lineChart') }}</el-option
        >
      </el-select>
      <el-select
        v-model="timeType"
        class="w-[100px] flex-grow-0 flex-shrink-0"
      >
        <el-option
          value="day"
          :label="t('el.datepicker.day')"
          v-if="filterDate"
          >{{ t('el.datepicker.day') }}</el-option
        >
        <el-option
          value="month"
          :label="t('el.datepicker.month')"
          >{{ t('el.datepicker.month') }}</el-option
        >
        <el-option
          value="quarter"
          :label="t('el.datepicker.quarter')"
          >{{ t('el.datepicker.quarter') }}</el-option
        >
        <el-option
          value="year"
          :label="t('dateTime.year')"
          >{{ t('dateTime.year') }}</el-option
        >
      </el-select>
      <el-date-picker
        v-model="startEnd"
        :type="pickerFormat.type"
        :start-placeholder="t('el.datepicker.begin')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.end')"
        value-format="YYYY-MM-DD"
        :popper-class="pickerFormat.popper"
        :format="pickerFormat.format"
        :disabled-date="disabledDate"
        :editable="false"
        @calendar-change="handleCalenderChange"
        class="!w-[250px] flex-grow-0 flex-shrink-0 height-32"
        :key="timeType"
        v-if="filterDate"
      >
        <template
          #default="cell"
          v-if="timeType === 'quarter'"
        >
          <div
            class="el-date-table-cell"
            :class="{ current: cell.isCurrent }"
          >
            <span class="el-date-table-cell__text">Q{{ Math.floor(cell.text / 3) + 1 }}</span>
          </div>
        </template>
      </el-date-picker>
      <el-button
        class="fs-14 height-32 el-button--main rounded-[2px] ml-auto"
        @click="search"
        :disabled="!startEnd || !startEnd.length"
        :loading="loading"
        >{{ t('dashboard.viewChart') }}
      </el-button>
    </div>
    <div v-loading="loading">
      <ChartBar
        :data="chartData"
        :date-type="timeTypeRef"
        :color="color"
        :unit="unit"
        v-if="chartType === 'bar'"
      />
      <ChartLine
        :data="chartData"
        :date-type="timeTypeRef"
        :color="color"
        :unit="unit"
        v-if="chartType === 'line'"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import moment from 'moment/moment'
import ChartBar from './ChartBar.vue'
import ChartLine from './ChartLine.vue'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()

const loading = ref(true)

const dayLimit = 29
const monthLimit = 11
const quarterLimit = 5
const yearLimit = 5

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  unit: {
    type: String,
    default: 'xe',
  },
  color: {
    type: String,
    default: '#4D86FF',
  },
  filterDate: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: null,
  },
})
const emit = defineEmits(['handleView'])
const chartData = ref([])

watch(
  () => props.data,
  value => {
    loading.value = false
    if (value && value.length > 0) {
      chartData.value = value
    } else {
      chartData.value = props.filterDate ? defaultData() : defaultForecastData()
    }
  }
)

const chartType = ref('bar')
const timeType = ref(props.filterDate ? 'day' : 'month')
const timeTypeRef = ref(props.filterDate ? 'day' : 'month')
const startEnd = ref(
  props.filterDate
    ? [
        moment().add(-1, 'day').startOf('month').format('YYYY-MM-DD'),
        moment().add(-1, 'day').endOf('day').format('YYYY-MM-DD'),
    ]
    : [
        moment().startOf('month').add(-monthLimit, 'month').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
    ]
)
const pickerFormat = ref(
  props.filterDate
    ? {
      type: 'daterange',
      format: 'DD/MM/YYYY',
    }
    : {
      type: 'monthrange',
      format: 'MM/YYYY',
    }
)
watch(timeType, value => {
  switch (value) {
    case 'day':
      pickerFormat.value = {
        type: 'daterange',
        format: 'DD/MM/YYYY',
        popper: '',
      }
      limitDate.min = null
      limitDate.max = moment().add(-1, 'day').endOf('day')
      break
    case 'month':
      pickerFormat.value = {
        type: 'monthrange',
        format: 'MM/YYYY',
        popper: '',
      }
      limitDate.min = null
      limitDate.max = moment().endOf('month')
      break
    case 'quarter': {
      pickerFormat.value = {
        type: 'monthrange',
        format: '[Q]Q/YYYY',
        popper: 'quarter-select',
      }
      limitDate.min = null
      limitDate.max = moment().endOf('quarter')
      break
    }
    case 'year': {
      pickerFormat.value = {
        type: 'yearrange',
        format: 'YYYY',
        popper: '',
      }
      limitDate.min = null
      limitDate.max = moment().endOf('year')
      break
    }
    default: {
      pickerFormat.value = {
        type: 'daterange',
        format: 'DD/MM/YYYY',
        popper: '',
      }
    }
  }
  if (props.filterDate) {
    startEnd.value = null
  }
})

const limitDate = reactive({
  max: props.filterDate ? moment().add(-1, 'day').endOf('day') : moment().endOf('month'),
  min: null,
})
const handleCalenderChange = value => {
  let max = null
  let min = null

  if (timeType.value === 'day') {
    max = moment().add(-1, 'day').endOf('day')
  } else if (timeType.value === 'month') {
    max = moment().endOf('month')
  } else if (timeType.value === 'quarter') {
    max = moment().endOf('quarter')
  } else if (timeType.value === 'year') {
    max = moment().endOf('year')
  }

  if (value && !value[1]) {
    const chooseValue = moment(value[0])
    if (timeType.value === 'day') {
      min = chooseValue.clone().add(-dayLimit, 'day').startOf('day')
      if (chooseValue.isBefore(max.clone().add(-dayLimit, 'day'))) {
        max = chooseValue.clone().add(dayLimit, 'day').endOf('day')
      }
    } else if (timeType.value === 'month') {
      min = chooseValue.clone().add(-monthLimit, 'month').startOf('month')
      if (chooseValue.isBefore(max.clone().add(-monthLimit, 'month'))) {
        max = chooseValue.clone().add(monthLimit, 'month').endOf('month')
      }
    } else if (timeType.value === 'quarter') {
      min = chooseValue.clone().add(-quarterLimit, 'quarter').startOf('quarter')
      if (chooseValue.isBefore(max.clone().add(-quarterLimit, 'quarter'))) {
        max = chooseValue.clone().add(quarterLimit, 'quarter').endOf('quarter')
      }
    } else if (timeType.value === 'year') {
      min = chooseValue.clone().add(-yearLimit, 'year').startOf('year')
      if (chooseValue.isBefore(max.clone().add(yearLimit, 'year'))) {
        max = chooseValue.clone().add(yearLimit, 'year').endOf('year')
      }
    }
  }

  limitDate.min = min
  limitDate.max = max
}

const disabledDate = time => {
  if (limitDate.min) {
    return moment(time).isAfter(limitDate.max) || moment(time).isBefore(limitDate.min)
  } else if (limitDate.max) {
    return moment(time).isAfter(limitDate.max)
  } else if (timeType.value === 'day') {
    return true
  }
}

const defaultData = () => {
  if (timeType.value === 'year') {
    return startEnd.value
      ? startEnd.value.map(i => ({ value: 0, timestamp: moment(i).format('YYYY') }))
      : []
  } else if (timeType.value === 'quarter') {
    return startEnd.value
      ? startEnd.value.map(i => ({ value: 0, timestamp: moment(i).format('YYYY[Q]Q') }))
      : []
  } else if (timeType.value === 'month') {
    return startEnd.value
      ? startEnd.value.map(i => ({ value: 0, timestamp: moment(i).format('YYYY-MM') }))
      : []
  }

  return startEnd.value
    ? startEnd.value.map(i => ({ value: 0, timestamp: moment(i).format('YYYY-MM-DD') }))
    : []
}
const defaultForecastData = () => {
  if (timeType.value === 'year') {
    return [
      { value: 0, timestamp: moment().add(1, 'year').format('YYYY') },
      { value: 0, timestamp: moment().add(6, 'year').format('YYYY') },
    ]
  } else if (timeType.value === 'quarter') {
    return [
      { value: 0, timestamp: moment().add(1, 'quarter').format('YYYY[Q]Q') },
      { value: 0, timestamp: moment().add(6, 'quarter').format('YYYY[Q]Q') },
    ]
  }
  return [
    { value: 0, timestamp: moment().add(1, 'month').format('YYYY-MM') },
    { value: 0, timestamp: moment().add(12, 'month').format('YYYY-MM') },
  ]
}

const startEndFilter = ref(null)

const search = () => {
  loading.value = true
  startEndFilter.value = startEnd.value
  emit('handleView', {
    timeType: timeType.value,
    startEnd: startEnd.value,
  })
}

watch(
  () => props.data,
  value => {
    loading.value = false
    timeTypeRef.value = timeType.value
  }
)
defineOptions({
  name: 'ChartGroup',
})
defineExpose({
  search,
})
</script>

<style lang="scss">
.quarter-select {
  .el-date-range-picker {
    width: 500px;

    .el-picker-panel__body {
      min-width: 500px;
    }
  }

  .el-month-table {
    border-collapse: collapse;
    width: 100%;

    tbody {
      display: grid;
      grid-template-columns: repeat(2, 1fr); /* 3 columns */
      grid-template-rows: repeat(2, auto); /* 4 rows */
    }

    tr {
      display: contents; /* Flatten <tr> structure to let grid layout work */
    }

    td {
      display: none;
      width: 100%;
    }

    tr:nth-of-type(1) {
      td:nth-of-type(1),
      td:nth-of-type(4) {
        display: block;
        width: 100%;
      }
    }

    tr:nth-of-type(2) {
      td:nth-of-type(3) {
        display: block;
        width: 100%;
      }
    }

    tr:nth-of-type(3) {
      td:nth-of-type(2) {
        display: block;
        width: 100%;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.chart-group {
  width: 100%;
  background: #fff;
  border: 1px solid #ebebec;
  border-radius: 2px;
  padding: 10px;
}

.chart-title {
  color: #212633;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 8px;
}

.chart-option {
  display: flex;
  gap: 8px;
}
</style>
