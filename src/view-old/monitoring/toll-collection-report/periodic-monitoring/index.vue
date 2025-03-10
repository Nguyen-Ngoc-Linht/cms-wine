<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5">
      <el-input
        v-model="filter.reportName"
        @keyup.enter="getList"
        :placeholder="t('el.transfer.filterPlaceholder')"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
      </el-input>
      <el-select
        v-model="filter.periodType"
        :placeholder="t('monitoring.tollCollectionReport.reportPeriod')"
        @change="updateDataSearch"
        clearable
        filterable
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
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
        v-if="filter.periodType === 'WEEKLY'"
        v-model="filter.week"
        :placeholder="t('weightStation.week')"
        clearable
        filterable
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listWeek"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-select
        v-if="filter.periodType === 'MONTHLY' || filter.periodType === 'WEEKLY'"
        v-model="filter.month"
        :placeholder="t('weightStation.month')"
        clearable
        filterable
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listMonth"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-select
        v-if="filter.periodType === 'QUARTERLY'"
        v-model="filter.quarter"
        :placeholder="t('el.datepicker.quarter')"
        clearable
        filterable
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listQuarter"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-model="filter.year"
        type="year"
        :placeholder="$t('weightStation.year')"
        value-format="YYYY"
        format="YYYY"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      />
      <el-select
        v-model="filter.routeId"
        @change="
          value => {
            setListStation(value)
          }
        "
        :placeholder="t('configUser.gland')"
        clearable
        filterable
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listRoute"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-select
        v-if="filter.periodType === 'WEEKLY'"
        v-model="filter.stationId"
        :placeholder="t('configUser.station')"
        clearable
        filterable
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listStation"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-button
        class="el-button--main"
        @click="searchData()"
        >{{ t('configUser.search') }}</el-button
      >
    </div>
    <div
      v-if="roleData.canCreate"
      class="flex items-center paddingX-24 mt-4"
    >
      <el-button
        text
        @click="handleOpenCreatePeriodicMonitoring"
        size="default"
        class="!p-0"
      >
        <div
          class="flex items-center pointer text-[#525B73]"
          style="line-height: 20px"
        >
          <svg-icon
            icon-class="el-icon-plus"
            class="width-20 height-20 margin-right-4"
          />
          {{ t('configUser.addNew') }}
        </div>
      </el-button>
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <div class="paddingX-24 mb-4">
      <div class="p-3 bg-white">
        <TableViolation
          :listLoading="listLoading"
          :fields="fields"
          :data="listPeriodicMonitoring"
          :STT="true"
          :page="filter.page"
          :size="filter.size"
          @show-view="handleViewPeriodic"
        >
          <template #name="{ row }">
            <span>
              {{ row.name }}
            </span>
          </template>
          <template #time="{ row }">
            <span>{{ setTimeView(row.periodType, row.period) }}</span>
          </template>
          <template #periodType="{ row }">
            <span>{{ setNamePeriodType(row.periodType) }}</span>
          </template>
          <template #route="{ row }">
            <span>{{ row.route ? row.route.name : '' }}</span>
          </template>
          <template #station="{ row }">
            <p v-if="row.station">{{ row.station.name }}</p>
          </template>
          <template #action="{ row }">
            <div class="flex">
              <el-tooltip
                v-if="roleData.canExport"
                :content="t('monitoring.tollCollectionReport.exportExcel')"
                placement="bottom"
                effect="light"
              >
                <span
                  @click.stop="handleExportFileReport(row, 'EXCEL')"
                  class="delete-member pointer mx-2"
                >
                  <svg-icon
                    style="width: 24px; height: 24px"
                    icon-class="excel-premium"
                    class="mr-2"
                  />
                </span>
              </el-tooltip>
              <el-tooltip
                v-if="roleData.canExport"
                :content="t('monitoring.tollCollectionReport.exportPdf')"
                placement="bottom"
                effect="light"
              >
                <span
                  @click.stop="handleExportFileReport(row, 'PDF')"
                  class="delete-member pointer mx-2"
                >
                  <svg-icon
                    style="width: 24px; height: 24px"
                    icon-class="pdf-premium"
                    class="mr-2"
                  />
                </span>
              </el-tooltip>
              <el-tooltip
                v-if="roleData.canUpdate && !row.isConfirmed"
                :content="t('monitoring.rating.editRating')"
                placement="bottom"
                effect="light"
              >
                <span
                  @click.stop="handleOpenUpdatePeriodicMonitoring(row)"
                  class="delete-member pointer mx-2"
                >
                  <svg-icon
                    style="width: 24px; height: 24px"
                    icon-class="edit-administrative"
                    class="mr-2"
                  />
                </span>
              </el-tooltip>
              <el-tooltip
                v-if="roleData.canUpdate && row.isSigned"
                :content="t('monitoring.tollCollectionReport.downloadFile')"
                placement="bottom"
                effect="light"
              >
                <span
                  @click.stop="handleDownloadFilePeriodicMonitoring(row)"
                  class="delete-member pointer mx-2"
                >
                  <svg-icon
                    style="width: 24px; height: 24px"
                    icon-class="export-file"
                    class="mr-2"
                  />
                </span>
              </el-tooltip>
              <el-tooltip
                v-if="roleData.canUpdate && row.isSigned"
                :content="t('monitoring.tollCollectionReport.removeFile')"
                placement="bottom"
                effect="light"
              >
                <span
                  @click.stop="openDialogDelete(row)"
                  class="delete-member pointer mx-1"
                >
                  <svg-icon
                    style="width: 24px; height: 24px"
                    icon-class="delete-file-singed"
                    class="mr-2"
                  />
                </span>
              </el-tooltip>
              <el-tooltip
                v-if="!row.isSigned"
                placement="bottom"
                :content="t('monitoring.tollCollectionReport.uploadFile')"
                effect="light"
              >
                <el-upload
                  v-model:file-list="row.listFile"
                  :limit="1"
                  :on-success="null"
                  :on-error="null"
                  :on-change="
                    (file, fileList) => {
                      handleFileChange(file, fileList, row)
                    }
                  "
                  :auto-upload="false"
                  :show-file-list="false"
                  accept=".pdf"
                  style="width: 50px"
                  @click.stop
                >
                  <span class="delete-member pointer mx-2">
                    <svg-icon
                      style="width: 24px; height: 24px"
                      icon-class="import-file"
                      class="mr-2"
                    />
                  </span>
                </el-upload>
              </el-tooltip>
            </div>
          </template>
        </TableViolation>
        <Pagination
          class="margin-top-12"
          v-model:page.sync="filter.page"
          v-model:size.sync="filter.size"
          :total="filter.total"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <el-dialog
      v-model="showDialogDelete"
      :title="$t('monitoring.tollCollectionReport.removeFile')"
      width="500"
      align-center
    >
      <span>{{ $t('monitoring.tollCollectionReport.confirmDeleteFile') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="showDialogDelete = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleDeleteFilePeriodic()"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import Pagination from '@/components/Pagination/index.vue'
import TableViolation from '@/components/Table/index.vue'
import { cloneDeep } from 'lodash-unified'
import { useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { usePermissionStore, useRouteUser, useUserStore } from '@/store'
import { dayjs, ElMessage } from 'element-plus'
import { getListRoute, getListStation } from '@/api/expressway'
import { apiExportFileReport, apiGetListPeriodicMonitoring } from '@/api/toll-collection'

const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = currentDate.getMonth() + 1
const currentQuarter = Math.ceil(currentMonth / 3)
const { t } = useI18n()
const routeUser = useRouteUser()
const router = useRouter()
const { roleData } = usePermissionStore()
const defaultFilter = {
  page: 1,
  size: 10,
  routeId: null,
  reportName: null,
  stationId: null,
  periodType: null,
  year: null,
  month: null,
  quarter: null,
  week: null,
  total: 0,
}
const filter = reactive(cloneDeep(defaultFilter))
const listRoute = ref([])
const listStation = ref([])
const listPeriodicReport = ref([
  {
    id: 1,
    name: t('weightStation.week'),
    value: 'WEEKLY',
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
])
const listQuarter = ref([
  {
    id: 1,
    name: t('el.datepicker.quarter', ['1']),
  },
  {
    id: 2,
    name: t('el.datepicker.quarter', ['2']),
  },
  {
    id: 3,
    name: t('el.datepicker.quarter', ['1']),
  },
  {
    id: 4,
    name: t('el.datepicker.quarter', ['4']),
  },
])
const listMonth = ref([
  {
    id: 1,
    name: t('el.datepicker.month1'),
  },
  {
    id: 2,
    name: t('el.datepicker.month2'),
  },
  {
    id: 3,
    name: t('el.datepicker.month3'),
  },
  {
    id: 4,
    name: t('el.datepicker.month4'),
  },
  {
    id: 5,
    name: t('el.datepicker.month5'),
  },
  {
    id: 6,
    name: t('el.datepicker.month6'),
  },
  {
    id: 7,
    name: t('el.datepicker.month7'),
  },
  {
    id: 8,
    name: t('el.datepicker.month8'),
  },
  {
    id: 9,
    name: t('el.datepicker.month9'),
  },
  {
    id: 10,
    name: t('el.datepicker.month10'),
  },
  {
    id: 11,
    name: t('el.datepicker.month11'),
  },
  {
    id: 12,
    name: t('el.datepicker.month12'),
  },
])
const listWeek = ref([
  {
    id: 1,
    name: t('weightStation.weekNumber', ['1']),
  },
  {
    id: 2,
    name: t('weightStation.weekNumber', ['2']),
  },
  {
    id: 3,
    name: t('weightStation.weekNumber', ['3']),
  },
  {
    id: 4,
    name: t('weightStation.weekNumber', ['4']),
  },
])

const showDialogDelete = ref(false)
const listLoading = ref(false)
const fields = ref([
  {
    key: 'name',
    label: t('monitoring.tollCollectionReport.reportName'),
    prop: 'name',
  },
  {
    key: 'periodType',
    label: t('monitoring.tollCollectionReport.reportPeriod'),
    prop: 'periodType',
  },
  {
    key: 'time',
    label: t('monitoring.tollCollectionReport.timeGetReport'),
    prop: 'time',
  },
  {
    key: 'route',
    label: t('configUser.gland'),
    prop: 'route',
  },
  {
    key: 'station',
    label: t('configUser.station'),
    prop: 'station',
  },
  {
    key: 'action',
    label: t('configUser.action'),
    prop: 'action',
  },
])

const listPeriodicMonitoring = ref([])
const infoPeriodicMonitoring = ref({})

onMounted(async () => {
  await setDataDefault()
  await getList()
})

const setDataDefault = async () => {
  const params = {
    routeIds: routeUser.routes,
  }
  const rs = await getListRoute(params)
  if (rs.status === 200) {
    listRoute.value = rs.data.dataRows
    // filter.routeId = listRoute.value[0].id
    // await setListStation(filter.routeId)
  }
}
const getList = async () => {
  listLoading.value = true
  const params = {
    method: 'LIST',
    arguments: {
      routeId: filter.routeId,
      stationId: filter.stationId,
      reportName: filter.reportName,
      periodType: filter.periodType,
      period: {
        year: filter.year,
        quarter: filter.periodType === 'QUARTERLY' ? filter.quarter : null,
        monthOfYear: filter.periodType !== 'QUARTERLY' ? filter.month : null,
        weekOfMonth: filter.periodType === 'WEEKLY' ? filter.week : null,
      },
      size: filter.size,
      page: filter.page - 1,
    },
  }
  await apiGetListPeriodicMonitoring(params).then(res => {
    listPeriodicMonitoring.value = res.data.data
    filter.total = res.data.totalItems
    listLoading.value = false
  })
}
const handleOpenCreatePeriodicMonitoring = () => {
  router.push('/monitoring/toll-collection-report/periodic-monitoring/add')
}
const handleOpenUpdatePeriodicMonitoring = data => {
  if (roleData.canUpdate) {
    router.push(`/monitoring/toll-collection-report/periodic-monitoring/edit/${data.id}`)
  }
}
const handleDownloadFilePeriodicMonitoring = async data => {
  const params = {
    method: 'DOWNLOAD_SIGNED_PDF',
    arguments: {
      reportId: data.id,
    },
  }
  const rs = await apiExportFileReport(params)
  if (rs.status === 200) {
    const base64Data = rs.data.data
    const typeDownload = 'application/pdf'
    const fileExtension = 'pdf'

    const blob = base64ToBlob(base64Data, typeDownload)
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${rs.data.name}`
    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    ElMessage.success(t('monitoring.tollCollectionReport.downloadSignedSuccess'))
  }
}
const handleDeleteFilePeriodic = async () => {
  const params = {
    method: 'DELETE_SIGNED_PDF',
    arguments: {
      reportId: infoPeriodicMonitoring.value.id,
    },
  }
  const rs = await apiExportFileReport(params)
  if (rs.status === 200) {
    ElMessage.success(t('monitoring.tollCollectionReport.deleteSignedSuccess'))
    showDialogDelete.value = false
    await getList()
  }
}
const handleExportFileReport = async (data, typeFile) => {
  try {
    const params = {
      method: 'EXPORT',
      arguments: {
        fileType: typeFile,
        reportId: data.id,
      },
    }
    const apiResponse = await apiExportFileReport(params)
    const base64Data = apiResponse.data.data
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
    a.download = `downloaded_file.${fileExtension}`
    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Có lỗi xảy ra khi tải file:', error)
  }
}
const handleViewPeriodic = data => {
  router.push(`/monitoring/toll-collection-report/periodic-monitoring/view/${data.id}`)
}
const openDialogDelete = data => {
  infoPeriodicMonitoring.value = data
  showDialogDelete.value = true
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

const setListStation = async routeId => {
  listStation.value = []
  filter.stationId = null
  const params = {
    page: 1,
    size: 20,
    keyword: '',
    routeIds: [routeId],
    unitIds: [],
  }
  const rs = await getListStation(params)
  if (rs.status === 200) {
    listStation.value = rs.data.dataRows
  } else {
    listStation.value = []
  }
}
const handleSizeChange = size => {
  filter.size = size
  getList()
}
const handlePageChange = page => {
  filter.page = page
  getList()
}
const setTimeView = (periodType, period) => {
  const week = period.weekOfMonth
  const month = period.monthOfYear
  const quarter = period.quarter
  const year = period.year
  switch (periodType) {
    case 'WEEKLY':
      return `${t('weightStation.week')} ${week} ${t('el.datepicker.month')} ${month} ${t(
        'el.datepicker.year'
      )} ${year}`
    case 'MONTHLY':
      return `${t('el.datepicker.month')} ${month} ${t('el.datepicker.year')} ${year}`
    case 'QUARTERLY':
      return `${t('el.datepicker.quarter')} ${quarter} ${t('el.datepicker.year')} ${year} `
    default:
      return ''
  }
}
const setNamePeriodType = type => {
  switch (type) {
    case 'WEEKLY':
      return t('weightStation.week')
    case 'MONTHLY':
      return t('el.datepicker.month')
    case 'QUARTERLY':
      return t('el.datepicker.quarter')
    default:
      return ''
  }
}
const updateDataSearch = typePeriodic => {
  // if (typePeriodic !== 'WEEKLY') {
  //   filter.stationId = null
  // }
}
const searchData = () => {
  // if (filter.periodType === undefined || filter.routeId === undefined) {
  //   ElMessage.error('Thiếu thông tin tìm kiếm')
  //   listPeriodicMonitoring.value = []
  // } else {
  //   if (filter.periodType === 'WEEKLY' && (filter.week === undefined || filter.month === undefined || filter.year === undefined)) {
  //     ElMessage.error('Thiếu thông tin tìm kiếm')
  //     listPeriodicMonitoring.value = []
  //   } else {
  //     if (filter.periodType === 'MONTHLY' && (filter.month === undefined || filter.year === undefined)) {
  //       ElMessage.error('Thiếu thông tin tìm kiếm')
  //       listPeriodicMonitoring.value = []
  //     } else {
  //       getList()
  //     }
  //   }
  // }
  getList()
}

// Upload file
const fileToBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = error => reject(error)
  })
}
const handleFileChange = async (file, fileList, data) => {
  try {
    console.log('Vô đây')
    const allowedTypes = ['application/pdf']
    if (!allowedTypes.includes(file.raw.type)) {
      const index = fileList.indexOf(file)
      if (index > -1) {
        fileList.splice(index, 1)
      }
      ElMessage.error('File không đúng định dạng pdf')
      return false
    }
    const base64 = await fileToBase64(file.raw)
    await sendToAPI(base64, data.id)
  } catch (error) {
    ElMessage.error('Có lỗi xảy ra khi chuyển đổi file.')
    console.error(error)
  }
}
const sendToAPI = async (base64, periodic_id) => {
  try {
    const params = {
      method: 'UPLOAD_SIGNED_PDF',
      arguments: {
        reportId: periodic_id,
        base64SignedPdf: base64,
      },
    }
    const rs = await apiExportFileReport(params)
    if (rs.status === 200) {
      ElMessage.success('Tải tài liệu có chữ ký thành công.')
      await getList()
    }
  } catch (e) {
    console.log(e)
  }
}
</script>

<style lang="scss">
.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}
</style>
