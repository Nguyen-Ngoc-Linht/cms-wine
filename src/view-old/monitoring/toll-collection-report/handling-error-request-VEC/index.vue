<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5">
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
        v-model="filter.stationId"
        :placeholder="t('configUser.station')"
        clearable
        filterable
        multiple
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
      <el-button class="el-button--main" @click="getList()">{{ t('configUser.search') }}</el-button>
    </div>
    <div class="flex items-center paddingX-24 mt-4 gap-2.5">
      <el-button
        v-if="roleData.canExport"
        @click="handleExportFile('EXCEL')"
        text
        size="default"
        class="!p-0"
      >
        <div class="flex items-center pointer text-[#525B73]" style="line-height: 20px">
          <svg-icon
            icon-class="import-file"
            class="width-20 height-20 margin-right-4 me-2"
          />
          {{ t('monitoring.tollCollectionReport.exportExcel') }}
        </div>
      </el-button>
      <el-button
        v-if="roleData.canExport"
        @click="handleExportFile('PDF')"
        text
        size="default"
        class="!p-0"
      >
        <div class="flex items-center pointer text-[#525B73]" style="line-height: 20px">
          <svg-icon
            icon-class="import-file"
            class="width-20 height-20 margin-right-4 me-2"
          />
          {{ t('monitoring.tollCollectionReport.exportPdf') }}
        </div>
      </el-button>
    </div>
    <hr class="margin-bottom-12 mt-2"/>
    <div class="paddingX-24 mb-4">
      <div class="p-3 bg-white">
        <el-table
          :data="listReportHandlingErrorRequest"
          :span-method="tableSpanMethod"
          v-loading="listLoading"
          border
        >
          <el-table-column :label="t('configUser.orderNumber')" width="50">
            <template #default="{ $index }">
              <span v-if="shouldShowStt($index)" class="px-4">
                {{ getStt($index) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="time" :label="t('el.datepicker.day')" width="200">
            <template #default="{ row }">
              <span class="w-full px-5">{{row.time}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.requestProcessingETC.typeError')">
            <template #default="{ row }">
              <span class="w-100 px-5">{{setTypeError(row.type)}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.tollCollectionReport.requestOpen')">
            <template #default="{ row }">
              <p @click="nagiHandleRequestETC(0, row.type, row)" class="w-100 text-center text-hover cursor-pointer">{{row.statusOpenCount}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.tollCollectionReport.requestProcessing')">
            <template #default="{ row }">
              <p @click="nagiHandleRequestETC(1, row.type, row)" class="w-100 text-center text-hover cursor-pointer">{{row.statusProcessingCount}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.tollCollectionReport.requestProcessed')">
            <template #default="{ row }">
              <p @click="nagiHandleRequestETC(2, row.type, row)" class="w-100 text-center text-hover cursor-pointer">{{row.statusProcessedCount}}</p>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.tollCollectionReport.requestClosed')">
            <template #default="{ row }">
              <p @click="nagiHandleRequestETC(3, row.type, row)" class="w-100 mb-0 text-center text-hover cursor-pointer">{{row.statusClosedCount}}</p>
            </template>
          </el-table-column>
        </el-table>
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
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
import Pagination from '@/components/Pagination/index.vue'
import {cloneDeep} from 'lodash-unified'
import {useRouter} from 'vue-router'
import {useI18n} from '@/locale'
import {usePermissionStore, useRouteUser, useUserStore} from '@/store'
import {dayjs, ElMessage} from 'element-plus'
import {getListRoute, getListStation} from '@/api/expressway'
import {
  apiExportFileReport,
  apiExportFileSupervision,
  apiGetListSupervision,
} from '@/api/toll-collection'
import {getObjectValueNotNull} from '@/utils/filter'

const {t} = useI18n()
const router = useRouter()
const routeUser = useRouteUser()
const {roleData} = usePermissionStore()
const defaultFilter = {
  page: 1,
  size: 10,
  routeId: null,
  stationId: [],
  time: [],
  total: 0,
}
const filter = reactive(cloneDeep(defaultFilter))

const listRoute = ref([])
const listStation = ref([])
const listLoading = ref(false)
const listReportHandlingErrorRequest = ref([])

onMounted(async () => {
  await setDataDefault()
  await getList()
})

const setDataDefault = async () => {
  const today = dayjs().format('YYYY-MM-DD')
  const sevenDaysAgo = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
  filter.time = [sevenDaysAgo, today]

  const params = {
    routeIds: routeUser.routes,
  }
  const rs = await getListRoute(params)
  if (rs.status === 200) {
    listRoute.value = rs.data.dataRows
    filter.routeId = listRoute.value[0].id
    await setListStation(filter.routeId)
    filter.stationId = []
    for (const station of listStation.value) {
      filter.stationId.push(station.id)
    }
  }
}
const getList = async () => {
  if (filter.stationId === undefined || filter.stationId.length === 0) {
    filter.stationId = []
    for (const station of listStation.value) {
      filter.stationId.push(station.id)
    }
  }
  if (!filter.time) {
    ElMessage.error(t('monitoring.tollCollectionReport.selectSearchPeriod'))
    return
  }
  const params = {
    method: 'LIST',
    arguments: {
      routeId: filter.routeId ? filter.routeId : null,
      stationIds: filter.stationId.length > 0 ? filter.stationId : null,
      range: {
        from: filter.time ? filter.time[0] : null,
        to: filter.time ? filter.time[1] : null
      }
    }
  }
  const rs = await apiGetListSupervision(params)
  if (rs.status === 200) {
    listReportHandlingErrorRequest.value = convertList(rs.data.data).sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateB - dateA
    })
    filter.total = rs.data.totalItems
  } else {
    listReportHandlingErrorRequest.value = []
  }
}
const handleExportFile = async (typeFile) => {
  try {
    const params = {
      method: 'EXPORT',
      arguments: {
        fileType: typeFile,
        routeId: filter.routeId,
        stationIds: filter.stationId.length > 0 ? filter.stationId : null,
        range: {
          from: filter.time ? filter.time[0] : null,
          to: filter.time ? filter.time[1] : null
        }
      }
    }
    const apiResponse = await apiExportFileSupervision(params)
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
    a.download = `${apiResponse.data.name}`
    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Có lỗi xảy ra khi tải file:', error)
  }
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
const setListStation = async (routeId) => {
  listStation.value = []
  filter.stationId = []
  const params = {
    page: 1,
    size: 20,
    keyword: '',
    stationIds: [],
    routeIds: [routeId],
    unitIds: []
  }
  // const listStationUser = routeUser.GET_STATIONS(routeId)
  // if (listStationUser.length > 0) {
  //   params.stationIds = listStationUser
  // }
  const rs = await getListStation(params)
  if (rs.status === 200) {
    listStation.value = rs.data.dataRows
  } else {
    listStation.value = []
  }
}
const convertList = (list) => {
  const length = list.length
  for (let i = 0; i < length; i++) {
    const [year, month, day] = list[i].date.split('-')
    list[i].time = `${day}/${month}/${year}`
  }
  return list
}

const tableSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    const previousRow = listReportHandlingErrorRequest.value[rowIndex - 1]
    if (previousRow && previousRow.time === row.time) {
      return [0, 0]
    } else {
      const rowspan = listReportHandlingErrorRequest.value.filter(
        (item) => item.time === row.time
      ).length
      return [rowspan, 1]
    }
  }
  if (column.property === 'time') {
    const previousRow = listReportHandlingErrorRequest.value[rowIndex - 1]
    if (previousRow && previousRow.time === row.time) {
      return [0, 0]
    } else {
      const rowspan = listReportHandlingErrorRequest.value.filter(
        (item) => item.time === row.time
      ).length
      return [rowspan, 1]
    }
  }

  return [1, 1]
}
const shouldShowStt = (index) => {
  if (index === 0) return true
  const previousRow = listReportHandlingErrorRequest.value[index - 1]
  const currentRow = listReportHandlingErrorRequest.value[index]
  return previousRow.time !== currentRow.time
}
const getStt = (index) => {
  let stt = 1
  for (let i = 0; i < index; i++) {
    const previousRow = listReportHandlingErrorRequest.value[i - 1]
    const currentRow = listReportHandlingErrorRequest.value[i]
    if (!previousRow || previousRow.time !== currentRow.time) {
      stt++
    }
  }
  return stt
}
const handleSizeChange = (size) => {
  filter.size = size
  getList()
}
const handlePageChange = page => {
  filter.page = page
  getList()
}
const setTypeError = (typeError) => {
  switch (typeError) {
    case 'OUT_OF_MONEY': return t('monitoring.requestProcessingETC.outOfMoney')
    case 'EQUIPMENT_FAILURE' : return t('monitoring.requestProcessingETC.deviceFailure')
    case 'SUSPECTED_EQUIPMENT_FAILURE' : return t('monitoring.requestProcessingETC.suspectedEquipmentFailure')
    default: return ''
  }
}
const setTypeErrorNb = (typeError) => {
  switch (typeError) {
    case 'OUT_OF_MONEY':
      return 1
    case 'EQUIPMENT_FAILURE':
      return 2
    case 'SUSPECTED_EQUIPMENT_FAILURE':
      return 3
    default:
      return ''
  }
}
const nagiHandleRequestETC = (status, type, data) => {
  // const query = getObjectValueNotNull({
  //   routeId: filter.routeId,
  //   status,
  //   errorType: setTypeErrorNb(type),
  //   stationId: filter.stationId,
  //   createTime: data.date
  // })
  //
  // router.push({
  //   path: `/monitoring/VEC-request-processing`,
  //   query
  // })
  console.log(data)
  router.push(`/monitoring/VEC-request-processing?routeId=${filter.routeId}&status=${status}&errorType=${setTypeErrorNb(type)}&stationId=${filter.stationId}&createTime=${data.date}`)
}
</script>

<style scoped lang="scss">
.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}
</style>
