<template>
  <div class="report-station">
    <div class="filter-form">
      <div>
        <el-date-picker
          v-model="filter.year"
          type="year"
          format="YYYY"
          class="width-120 height-32"
          :placeholder="t('el.datepicker.year')"
          @change="handleChangeYear($event)"
        />
      </div>
      <div>
        <el-date-picker
          v-model="filter.month"
          type="month"
          format="MM"
          class="width-120 height-32"
          :placeholder="t('el.datepicker.month')"
          :disabled="disbleMonth"
          @change="handleChangeMonth($event)"
        />
      </div>
      <div>
        <el-date-picker
          v-model="filter.startEnd"
          type="datetimerange"
          class="height-32"
          :start-placeholder="t('el.datepicker.startTime')"
          :range-separator="t('el.datepicker.to')"
          :end-placeholder="t('el.datepicker.endTime')"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="DD/MM/YYYY HH:mm:ss"
          :clearable="false"
          :default-time="filter.startEnd"
          @change="handleChangeStartEnd($event)"
        />
      </div>
      <el-button
        class="el-button--main"
        @click="getList()"
      >
        {{ t('placeholder.search') }}
      </el-button>
      <div>
        <ButtonFilter @filter="handleChangeFilter" />
      </div>
    </div>
    <div class="flex justify-between items-center margin-top-8">
      <div class="flex gap-px-8 items-center justify-start padding-bottom-8">
        <div
          class="pointer flex items-center justify-center text-[#525B73]"
          @click="getList"
        >
          <el-icon
            size="20px"
            class="mr-2"
          >
            <RefreshRight class="width-30 height-30" />
          </el-icon>
          {{ t('configUser.refresh') }}
        </div>
        <div
          v-loading="loadingExport"
          class="pointer flex items-center justify-center text-[#525B73] export-btn"
          @click="handleExport"
        >
          <svg-icon
            icon-class="export-file"
            class="width-20 height-20 margin-right-4"
          />
          {{ t('configUser.exportFile') }}
        </div>

        <el-divider
          direction="vertical"
          class="height-36"
        />

        <el-checkbox
          v-model="filter.detail"
          :label="t('placeholder.detail')"
        />
      </div>
      <div class="text-[#525B73]">
        {{ `${totalVehicleViolation} ${t('report.vehicleViolation')}` }}
      </div>
    </div>
    <el-divider class="margin-top-0 margin-bottom-8" />

    <div class="bg-white paddingX-16 paddingY-12">
      <el-table
        v-loading="loading"
        :data="listData"
        show-summary
        :summary-method="summaryTable"
        max-height="680px"
        class="cell-main-3-to-6"
        :span-method="colSpanMethod"
        :row-class-name="getRowClassName"
        @scroll.capture="handleScroll"
      >
        <el-table-column
          v-for="(col, index) in listColumns"
          :prop="col.prop"
          :key="col.prop"
          :width="col.width ?? 'auto'"
          :resizable="false"
          :header-align="col.headerAlign ?? 'left'"
          :align="col.align ?? 'left'"
        >
          <template #header>
            <el-tooltip
              v-if="index > 5"
              placement="bottom"
              effect="light"
            >
              <template #content>
                <div
                  v-html="t(`${col.label}Full`)"
                  class="text-center"
                ></div>
              </template>
              <div
                v-html="t(col.label)"
                class="font-bold"
              ></div>
            </el-tooltip>
            <div
              v-else
              v-html="t(col.label)"
              class="font-bold"
            ></div>
          </template>
          <template #default="scope">
            {{ getValueByKey(col.prop, scope.$index) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '@/locale'
import { downloadFile } from '@/utils/files.js'
import { ensureString, genKey } from '@/utils/app/string.js'
import _, { cloneDeep } from 'lodash'
import moment from 'moment'
import { computed, reactive, ref } from 'vue'
import ButtonFilter from './components/ButtonFilter.vue'
// import Export from '@/components/Export'
import { fetchReportViolationStation, exportReportViolationStation } from '@/api/report.js'

const { t } = useI18n()

const disbleMonth = ref(true)
const loading = ref(false)
const loadingExport = ref(false)
const totalVehicleViolation = ref(0)
const totalData = ref({
  countLevelOverloadTT46: 0,
  countLevelOverloadDK: 0,
  countTotal: 0,
})
const defaultFilter = {
  year: null,
  month: null,
  startEnd: [
    moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
    moment().endOf('month').format('YYYY-MM-DD 23:59:59'),
  ],
  detail: false,
  page: 0,
  size: 500,
}

const filter = reactive(cloneDeep(defaultFilter))
const dataExport = ref([])
const listData = ref([])

const listColumns = ref([
  { prop: 'STT', label: 'weightVehicle.numberOrder', width: 70 },
  { prop: 'weightStationName', label: 'report.station' },
  {
    prop: 'laneName',
    label: 'report.laneRoad',
    width: 100,
  },
  {
    prop: 'time',
    label: 'report.time',
    width: 200,
  },
  {
    prop: 'axel',
    label: 'report.axleNumber',
    width: 100,
    align: 'center',
    headerAlign: 'center',
  },
  {
    prop: 'countTotal',
    label: 'report.turnToLane',
    width: 100,
    align: 'center',
    headerAlign: 'center',
  },
  {
    prop: 'countLevelOverloadTT46',
    label: 'report.violationsToPenalty46',
    width: 170,
    align: 'center',
    headerAlign: 'center',
  },
  {
    prop: 'advOverLoadTT46',
    label: 'report.overloadTT46',
    width: 170,
    align: 'center',
    headerAlign: 'center',
  },
  {
    prop: 'countLevelOverloadDK',
    label: 'report.violationsToPenaltyDK',
    width: 170,
    headerAlign: 'center',
    align: 'center',
  },
  {
    prop: 'advOverLoadDK',
    label: 'report.overloadDK',
    width: 170,
    headerAlign: 'center',
    align: 'center',
  },
])

const handleChangeYear = year => {
  if (year) {
    disbleMonth.value = false
    filter.startEnd = [
      moment(year).startOf('year').format('YYYY-MM-DD 00:00:00'),
      moment(year).endOf('year').format('YYYY-MM-DD 23:59:59'),
    ]
  } else {
    disbleMonth.value = true
  }
}

const handleChangeMonth = month => {
  filter.startEnd = [
    moment(month).startOf('month').format('YYYY-MM-DD 00:00:00'),
    moment(month).endOf('month').format('YYYY-MM-DD 23:59:59'),
  ]
}

const getParamFilter = () => {
  return {
    year: filter.year || !filter.startEnd ? moment(filter.year).year() : null,
    month: filter.month ? moment(filter.month).month() : null,
    fromDate:
      filter?.startEnd[0] && filter.startEnd[0] !== 'Invalid date'
        ? moment(filter.startEnd[0], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        : null,
    toDate:
      filter?.startEnd[1] && filter.startEnd[1] !== 'Invalid date'
        ? moment(filter.startEnd[1], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        : null,
    weightStationId: filter.station ? ensureString(filter.station) : null,
    laneId: filter.lane ? ensureString(filter.lane) : null,
    axle: filter.vehicleAxle ? filter.vehicleAxle.join(',') : null,
    page: filter.page ?? 0,
    size: filter.size ?? 30,
  }
}

const getList = async () => {
  loading.value = true
  try {
    const param = getParamFilter()
    const { data, total } = await fetchReportViolationStation(param)
    listData.value = data.response
    totalData.value = {
      countLevelOverloadTT46: data.countAllLevelOverloadTT46 ?? 0,
      countLevelOverloadDK: data.countAllLevelOverloadDK ?? 0,
      countTotal: data.countAllTotal ?? 0,
    }
    totalVehicleViolation.value = data.countTotalVehicle ?? 0
    loading.value = false
  } catch (error) {
    console.log('getList ~ error:', error)
    loading.value = false
  }
}
getList()
const handleExport = async () => {
  if (loadingExport.value) return
  loadingExport.value = true

  try {
    const param = getParamFilter()
    const { data } = await exportReportViolationStation(param)
    if (data) {
      await downloadFile(data)
    }
    loadingExport.value = false
  } catch (error) {
    console.log('handleExport ~ error:', error)
    loadingExport.value = false
  }
}

const handleChangeFilter = async data => {
  Object.keys(data).forEach(key => {
    filter[key] = cloneDeep(data[key])
  })
  await getList()
}
const getValueByKey = (key, index) => {
  let value = _.get(listData.value[index], key) ?? ''

  if (key === 'STT') {
    value = filter.page * filter.size + index + 1
  } else if (key === 'time') {
    value = moment(value).format('DD/MM/YYYY')
  }

  return value
}
const sumByKey = (key, array) => {
  return array.reduce((total, obj) => {
    if (typeof obj[key] === 'number') {
      return total + obj[key]
    }

    if (!isNaN(parseFloat(obj[key])) && isFinite(obj[key])) {
      return total + parseFloat(obj[key])
    }
    return total
  }, 0)
}

const colSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (row.total) {
    if (columnIndex === 1) {
      return {
        rowspan: 1,
        colspan: 4,
      }
    } else if ([0, 2, 3].includes(columnIndex)) {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}

const getRowClassName = ({ row, rowIndex }) => {
  let className = ''
  if (row.total) {
    className += ' row-total'
  }
  return className
}

const handleScroll = event => {
  // const el = event.target
  // if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
  //   console.log('handleScroll ~ data:', event)
  // }
}

const handleChangeStartEnd = event => {
  filter.year = null
  filter.month = null
  disbleMonth.value = true
}

const summaryTable = ({ columns, data }) => {
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = t('report.total')
      return
    }
    if ([5, 6, 8].includes(index)) {
      sums[index] = totalData.value[column.property]
    }

    // if ([5, 6, 8].includes(index)) {
    //   const values = data.map(item => Number(item[column.property]))
    //   if (!values.every(value => Number.isNaN(value))) {
    //     sums[index] = `${values.reduce((prev, curr) => {
    //       const value = Number(curr)
    //       if (!Number.isNaN(value)) {
    //         return prev + curr
    //       } else {
    //         return prev
    //       }
    //     }, 0)}`
    //   } else {
    //     sums[index] = ''
    //   }
    // }
  })

  return sums
}
defineOptions({
  name: 'SummaryViolation',
})
</script>

<style lang="scss" scoped>
.filter-form {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 9px;
}
:deep(.row-total) {
  background-color: #ebebec;
  position: sticky;
  inset-block-end: 0;
  z-index: 9;
  .cell {
    color: #212633;
    font-weight: 600;
    font-size: 18px;
    text-align: center;
  }
}
:deep(.export-btn .el-loading-spinner svg) {
  width: 20px;
}
</style>
