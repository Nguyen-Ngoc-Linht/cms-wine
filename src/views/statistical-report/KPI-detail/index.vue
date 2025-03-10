<template>
  <div>
    <div class="flex flex-wrap gap-px-8 paddingX-24 padding-top-14">
      <!--      <el-select-->
      <!--        v-model="filter.periodicReport"-->
      <!--        class="w-full md:max-w-[30%] lg:max-w-[200px] height-32"-->
      <!--        @change="handleRouteChange"-->
      <!--        :placeholder="t('collection.reportType')"-->
      <!--        clearable-->
      <!--      >-->
      <!--        <el-option-->
      <!--          v-for="item in listPeriodicReport"-->
      <!--          :key="item.id"-->
      <!--          :label="item.name"-->
      <!--          :value="item.value"-->
      <!--        >-->
      <!--        </el-option>-->
      <!--      </el-select>-->
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
        v-model="filter.timeGetReportDay"
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
      <div class="flex gap-px-12 items-center">
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
        <el-button
          v-if="roleData.canUpdate"
          text
          size="default"
          class="!p-0"
          @click="openEdit()"
        >
          <div class="text-gray flex items-center">
            <svg-icon
              icon-class="el-edit"
              class="width-20 height-20 margin-right-4"
            />
            {{ t('collection.editReport') }}
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
          <el-table-column :label="t('collection.reportType')">
            <template #default="{ row }">
              <span>{{ checkTypeReport(row) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.tollCollectionReport.timeGetReport')">
            <template #default="{ row }">
              <span>{{ setTimeGetReport(row) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.route')">
            <template #default="{ row }">
              <span>{{ row['routeResponse'] ? row['routeResponse']['name'] : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.station')">
            <template #default="{ row }">
              <span>{{ row['stationResponse'] ? row['stationResponse']['name'] : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('administration.category.report.timeCreate')">
            <template #default="{ row }">
              <span>{{ setTimeView(row.createdAt) }}</span>
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

    <Dialog
      :show="showDialogEdit"
      :appendToBody="true"
      :width="'682'"
      :title="t('collection.editReport')"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <ModalEditReport @closeUpdate="handleCloseDialog" />
      </template>
    </Dialog>
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
import Pagination from '@/components/Pagination'
import { apiGetReportKPIDetail } from '@/api/statistical-report'
import { ElMessage } from 'element-plus'
import Dialog from '@/components/Dialog/index.vue'
import ModalEditReport from '@/views/statistical-report/KPI-detail/ModalEditReport.vue'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()
const router = useRouter()

const timeGetReport = reactive({
  day: null,
  month: null,
  quarter: null,
  year: null,
  startDate: null,
  endDate: null,
})
const defaultFilter = {
  page: 1,
  size: 10,
  route: null,
  periodicReport: null,
  timeGetReport: null,
  timeGetReportDay: null,
  total: 0,
}
const filter = reactive(cloneDeep(defaultFilter))
const routeList = ref([])
const stationList = ref([])
const listPeriodicReport = ref([
  {
    id: 1,
    name: t('weightStation.day'),
    value: 0,
  },
  {
    id: 2,
    name: t('el.datepicker.month'),
    value: 1,
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
  if (filter.timeGetReportDay !== null && filter.timeGetReportDay !== undefined) {
    timeGetReport.startDate = filter.timeGetReportDay[0]
    timeGetReport.endDate = filter.timeGetReportDay[1]
    timeGetReport.month = null
    timeGetReport.year = null
  } else {
    timeGetReport.startDate = null
    timeGetReport.endDate = null
    timeGetReport.month = null
    timeGetReport.year = null
  }
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
    const params = {
      method: 'LIST',
      arguments: {
        page: filter.page - 1,
        size: filter.size,
        routeId: filter.route,
        directionStatus: 0,
        dateFilter: {
          startDate: timeGetReport.startDate,
          endDate: timeGetReport.endDate,
        },
        monthYearFilter: {
          monthRequest: timeGetReport.month,
          yearRequest: timeGetReport.year,
        },
      },
    }
    const rs = await apiGetReportKPIDetail(params)
    if (rs.status === 200) {
      dataList.value = rs.data.data
      filter.total = rs.data.totalItems
    }
    listLoading.value = false
  } catch (e) {
    console.log(e)
    listLoading.value = false
  }
}

const showDialog = ref(false)
const showDialogEdit = ref(false)
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
    const rs = await apiGetReportKPIDetail(params)
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
  router.push('/statistical-report/KPI-detail/add')
}
const openEdit = data => {
  showDialogEdit.value = true
}
const handleView = data => {
  router.push(`/statistical-report/KPI-detail/view/${data.id}`)
}
const handleDelete = async () => {
  try {
    const params = {
      method: 'DELETE',
      arguments: {
        id: infoReport.value.id,
      },
    }
    const rs = await apiGetReportKPIDetail(params)
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
const checkTypeReport = data => {
  const month = data.month
  const year = data.year
  const startDate = data.startDate
  const endDate = data.endDate
  if (month !== null) {
    return t('el.datepicker.month')
  }
  if (startDate !== null) {
    return t('el.datepicker.day')
  }
}
const setTimeGetReport = data => {
  const month = data.month
  const year = data.year
  const startDate = data.startDate
  const endDate = data.endDate
  if (month !== null) {
    return `${t('el.datepicker.month')} ${month}/${year}`
  }
  if (startDate !== null) {
    return `${showTime(startDate)} - ${showTime(endDate)}`
  }
}
const setTimeView = timeCreateReport => {
  const date = new Date(timeCreateReport)

  const padZero = num => String(num).padStart(2, '0')

  const day = padZero(date.getDate())
  const month = padZero(date.getMonth() + 1)
  const year = date.getFullYear()

  const hours = padZero(date.getHours())
  const minutes = padZero(date.getMinutes())
  const seconds = padZero(date.getSeconds())

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}
const showTime = timeReport => {
  const date = new Date(timeReport)
  const padZero = num => String(num).padStart(2, '0')
  const day = padZero(date.getDate())
  const month = padZero(date.getMonth() + 1)
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}
const handleCloseDialog = () => {
  showDialogEdit.value = false
  getList()
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
