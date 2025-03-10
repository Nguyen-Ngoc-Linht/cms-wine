<template>
  <div>
    <div class="flex flex-wrap gap-px-8 paddingX-24 padding-top-14">
      <el-select
        v-model="filter.periodicReport"
        class="w-full md:max-w-[30%] lg:max-w-[200px] height-32"
        :placeholder="t('monitoring.tollCollectionReport.reportPeriod')"
        clearable
      >
        <el-option
          v-for="item in listPeriodicReport"
          :key="item.id"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="filter.route"
        class="w-full md:max-w-[30%] lg:max-w-[200px] height-32"
        @change="handleRouteChange"
        :placeholder="t('configUser.userManagement.route')"
        clearable
      >
        <el-option
          v-for="item in routeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-model="filter.time"
        type="daterange"
        :start-placeholder="t('el.datepicker.startTime')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.endTime')"
        clearable
        value-format="YYYY-MM-DD"
        format="DD/MM/YYYY"
        class="w-full md:max-w-[30%] lg:max-w-[360px] flex-grow-0"
      />
      <el-button
        class="fs-14 height-32 el-button--main rounded-[2px]"
        @click="search"
        >{{ t('placeholder.search') }}
      </el-button>
    </div>
    <div class="flex items-center justify-between paddingX-24 paddingY-10">
      <div class="flex gap-px-16 items-center">
        <el-button
          v-if="roleData.canCreate"
          text
          size="default"
          class="!p-0"
          @click="handleAdd()"
        >
          <div class="text-gray flex items-center">
            <svg-icon
              icon-class="el-icon-plus"
              class="width-20 height-20 margin-right-4"
            />
            {{ t('monitoring.tollCollectionReport.makeReport') }}
          </div>
        </el-button>
      </div>
    </div>
    <hr class="margin-bottom-12" />
    <div class="paddingX-24">
      <div
        v-if="roleData.canRead"
        v-loading="listLoading"
        class="padding-12 bg-white"
      >
        <el-table
          ref="multipleTable"
          :data="dataList"
          style="width: 100%"
          max-height="650"
          @row-click="handleView"
        >
          <el-table-column
            :label="t('configUser.orderNumber')"
            width="60px"
          >
            <template #default="{ $index }">
              <span>{{ (filter.page - 1) * filter.size + $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.tollCollectionReport.reportName')">
            <template #default="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.tollCollectionReport.reportPeriod')">
            <template #default="{ row }">
              <span>{{ setPeriod(row.period) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.tollCollectionReport.timeGetReport')">
            <template #default="{ row }">
              <span>{{ setTimeView(row.period, row.date) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.route')">
            <template #default="{ row }">
              <span>{{ row['route'] ? row['route']['name'] : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.action')">
            <template #default="{ row }">
              <div class="flex flex-wrap items-center gap-px-8">
                <div
                  v-if="roleData.canExport"
                  class="pointer"
                  @click.stop="handleExport(row, 'PDF')"
                >
                  <svg-icon
                    icon-class="pdf-premium"
                    class="width-24 height-24"
                  />
                </div>
                <div
                  v-if="roleData.canExport"
                  class="pointer"
                  @click.stop="handleExport(row, 'EXCEL')"
                >
                  <svg-icon
                    icon-class="excel-premium"
                    class="width-24 height-24"
                  />
                </div>
                <div
                  v-if="roleData.canUpdate"
                  class="pointer"
                  @click.stop="handleEdit(row)"
                >
                  <svg-icon
                    icon-class="edit-administrative"
                    class="width-24 height-24"
                  />
                </div>
                <div
                  v-if="roleData.canDelete"
                  class="pointer"
                  @click.stop="openDelete(row)"
                >
                  <svg-icon
                    icon-class="remove-administrative"
                    class="width-24 height-24"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="margin-top-12">
          <Pagination
            v-model:page="filter.page"
            v-model:size="filter.size"
            :total="filter.total"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showDialog"
      :title="$t('monitoring.tollCollectionReport.deleteReport')"
      width="500"
      align-center
    >
      <span>Bạn có chắc chắn muốn xóa báo cáo này không?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="showDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleDelete()"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import { usePermissionStore, useRouteUser } from '@/store'
import { cloneDeep } from 'lodash-unified'
import { getListRoute, getListStation } from '@/api/expressway'
import { formatDateTime } from '@/utils/date'
import Pagination from '@/components/Pagination'
import { apiSupervisionTrafficRevenueReport } from '@/api/statistical-report'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()
const router = useRouter()

const defaultFilter = {
  page: 1,
  size: 10,
  route: null,
  periodicReport: null,
  time: null,
  from: {
    year: null,
    month: null,
    day: null,
  },
  to: {
    year: null,
    month: null,
    day: null,
  },
  total: 0,
}
const filter = reactive(cloneDeep(defaultFilter))
const routeList = ref([])
const stationList = ref([])
const listPeriodicReport = ref([
  {
    id: 1,
    name: t('weightStation.day'),
    value: 'DAILY',
  },
  {
    id: 2,
    name: t('el.datepicker.month'),
    value: 'MONTHLY',
  },
  {
    id: 3,
    name: t('el.datepicker.quarter'),
    value: 'QUARTERLY',
  },
  {
    id: 4,
    name: t('el.datepicker.year'),
    value: 'YEARLY',
  },
])

onMounted(() => {
  getRouteList()
  getList()
})
const getRouteList = async () => {
  const params = {
    routeIds: routeUser.routes,
  }

  await getListRoute(params).then(res => {
    routeList.value = res?.data?.dataRows || []
  })
}
const getStationList = routeId => {
  if (routeId) {
    const params = {
      routeIds: [routeId],
      stationsIds: [],
    }
    getListStation(params).then(res => {
      stationList.value = res?.data?.dataRows || []
      if (stationList.value.indexOf(filter.station) === -1) {
        filter.station = null
      }
    })
  } else {
    stationList.value = []
  }
}
const handleRouteChange = routeId => {
  stationList.value = []
  getStationList(routeId)
}
const base64ToBlob = (base64, mimeType = 'application/octet-stream') => {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

const dataList = ref([])
const infoReport = ref({})
const listLoading = ref(false)

const search = () => {
  getList()
}
const handleSizeChange = size => {
  filter.size = size
  getList()
}
const handlePageChange = page => {
  filter.page = page
  getList()
}
const getList = async () => {
  try {
    listLoading.value = true
    if (filter.time !== null && filter.time !== undefined) {
      const startDate = filter.time[0]
      const endDate = filter.time[1]
      const [year, month, day] = startDate.split('-').map(Number)
      const [year2, month2, day2] = endDate.split('-').map(Number)
      filter.from.year = year
      filter.from.month = month
      filter.from.day = day
      filter.to.year = year2
      filter.to.month = month2
      filter.to.day = day2
    } else {
      filter.from.year = null
      filter.from.month = null
      filter.from.day = null
      filter.to.year = null
      filter.to.year = null
      filter.to.year = null
    }
    const params = {
      method: 'LIST',
      arguments: {
        page: filter.page - 1,
        size: filter.size,
        period: filter.periodicReport,
        range: {
          from: {
            year: filter.from.year,
            quarter: null,
            month: filter.from.month,
            day: filter.from.day,
          },
          to: {
            year: filter.to.year,
            quarter: null,
            month: filter.to.month,
            day: filter.to.day,
          },
        },
        routeId: filter.route,
      },
    }
    const rs = await apiSupervisionTrafficRevenueReport(params)
    if (rs.status === 200) {
      dataList.value = rs.data.content
      filter.total = rs.data.totalElements
    }
    listLoading.value = false
  } catch (e) {
    console.log(e)
    listLoading.value = false
  }
}

const showDialog = ref(false)
const openDelete = data => {
  showDialog.value = true
  infoReport.value = data
}
const handleExport = async (data, typeFile) => {
  try {
    const params = {
      method: 'EXPORT',
      arguments: {
        reportId: data.id,
        fileType: typeFile,
      },
    }
    const rs = await apiSupervisionTrafficRevenueReport(params)
    if (rs.status === 200) {
      const base64Data = rs.data.data
      let typeDownload = 'application/pdf'
      let fileExtension = 'pdf'

      if (typeFile === 'EXCEL') {
        typeDownload = 'application/excel'
        fileExtension = 'xlsx'
      }
      const blob = base64ToBlob(base64Data, typeDownload)
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `${rs.data.name}`
      document.body.appendChild(a)
      a.click()

      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  } catch (e) {
    console.log(e)
  }
}
const handleAdd = () => {
  router.push('/statistical-report/traffic-revenue/add')
}
const handleEdit = data => {
  router.push(`/statistical-report/traffic-revenue/edit/${data.id}`)
}
const handleView = data => {
  router.push(`/statistical-report/traffic-revenue/view/${data.id}`)
}
const handleDelete = async () => {
  try {
    const params = {
      method: 'DELETE',
      arguments: {
        reportId: infoReport.value.id,
      },
    }
    const rs = await apiSupervisionTrafficRevenueReport(params)
    if (rs.status === 200) {
      ElMessage.success('Xóa báo cáo thành công')
      await getList()
    }
    showDialog.value = false
  } catch (e) {
    showDialog.value = false
    console.log(e)
  }
}
const setPeriod = name => {
  switch (name) {
    case 'DAILY':
      return t('el.datepicker.day')
    case 'MONTHLY':
      return t('el.datepicker.month')
    case 'YEARLY':
      return t('el.datepicker.year')
    case 'QUARTERLY':
      return t('el.datepicker.quarter')
    default:
      return ''
  }
}
const setTimeView = (periodType, period) => {
  const day = period.dayOfMonth
  const month = period.monthOfYear
  const quarter = period.quarter
  const year = period.year
  switch (periodType) {
    case 'DAILY':
      return `${t('weightStation.day')} ${day} ${t('el.datepicker.month')} ${month} ${t(
        'el.datepicker.year'
      )} ${year}`
    case 'MONTHLY':
      return `${t('el.datepicker.month')} ${month} ${t('el.datepicker.year')} ${year}`
    case 'YEARLY':
      return `${t('el.datepicker.year')} ${year}`
    case 'QUARTERLY':
      return `${t('el.datepicker.quarter')} ${quarter} ${t('el.datepicker.year')} ${year} `
    default:
      return ''
  }
}

defineOptions({
  name: 'ReportPostInspection',
})
</script>

<style scoped lang="scss">
.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}
</style>
