<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5">
      <el-select
        v-model="filter.type"
        @change="
          value => {
            filter.time = []
          }
        "
        :placeholder="t('collection.reportType')"
        clearable
        filterable
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listType"
          :key="item.id"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-if="filter.type === 'KPI'"
        v-model="filter.laneType"
        :placeholder="t('configUser.typeLane')"
        filterable
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in laneType"
          :key="item.id"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
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
      <el-button
        :loading="processing"
        class="el-button--main"
        @click="viewReport()"
        >{{ t('statisticalReport.viewReport') }}</el-button
      >
    </div>
    <div
      v-if="showReport && roleData.canExport"
      class="flex items-center paddingX-24 mt-4 gap-2.5"
    >
      <el-button
        @click="exportFile('EXCEL')"
        text
        size="default"
        class="!p-0"
        :disabled="listDataTraffic.length === 0"
      >
        <div
          class="text-gray flex items-center"
          style="line-height: 20px"
        >
          <svg-icon
            icon-class="import-file"
            class="width-20 height-20 margin-right-4 me-2"
          />
          {{ t('monitoring.tollCollectionReport.exportExcel') }}
        </div>
      </el-button>
      <el-button
        @click="exportFile('PDF')"
        text
        size="default"
        class="!p-0"
        :disabled="listDataTraffic.length === 0"
      >
        <div
          class="text-gray flex items-center"
          style="line-height: 20px"
        >
          <svg-icon
            icon-class="import-file"
            class="width-20 height-20 margin-right-4 me-2"
          />
          {{ t('monitoring.tollCollectionReport.exportPdf') }}
        </div>
      </el-button>
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <div
      v-if="showReport"
      class="paddingX-24 mb-4"
    >
      <div class="bg-white">
        <div
          v-if="filterReport.type === 'TRAFFIC' || filterReport.type === 'REVENUE'"
          class="p-3 traffic-report"
        >
          <el-table
            v-loading="listLoading"
            :data="listDataTraffic"
            :span-method="mergeCells"
            border
          >
            <el-table-column
              :label="t('el.datepicker.day')"
              header-align="center"
            >
              <template #default="{ row }">
                <p class="text-center w-full">{{ formatDate(row.date) }}</p>
              </template>
            </el-table-column>
            <el-table-column
              v-if="!isLaneReport"
              :label="t('configUser.station')"
              header-align="center"
            >
              <template #default="{ row }">
                <p class="text-center">{{ row.station.name }}</p>
              </template>
            </el-table-column>
            <el-table-column
              v-if="isLaneReport"
              :label="t('configUser.lane')"
              header-align="center"
            >
              <template #default="{ row }">
                <p class="text-center">{{ row.lane }}</p>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('statisticalReport.collectionForm')"
              header-align="center"
            >
              <template #default="{ row }">
                <p class="text-center">{{ row.chargeType }}</p>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('statisticalReport.vehicleType', ['1'])"
              header-align="center"
            >
              <template #default="{ row }">
                <p class="text-center">{{ formatNumber(row.type1, '.') }}</p>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('statisticalReport.vehicleType', ['2'])"
              header-align="center"
            >
              <template #default="{ row }">
                <p class="text-center">{{ formatNumber(row.type2, '.') }}</p>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('statisticalReport.vehicleType', ['3'])"
              header-align="center"
            >
              <template #default="{ row }">
                <p class="text-center">{{ formatNumber(row.type3, '.') }}</p>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('statisticalReport.vehicleType', ['4'])"
              header-align="center"
            >
              <template #default="{ row }">
                <p class="text-center">{{ formatNumber(row.type4, '.') }}</p>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('statisticalReport.vehicleType', ['5'])"
              header-align="center"
            >
              <template #default="{ row }">
                <p class="text-center">{{ formatNumber(row.type5, '.') }}</p>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('statisticalReport.OTCVehicle')"
              header-align="center"
            >
              <template #default="{ row }">
                <p class="text-center">{{ formatNumber(row.otc, '.') }}</p>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('statisticalReport.plus')"
              header-align="center"
            >
              <template #default="{ row }">
                <p class="text-center">{{ formatNumber(row.otc, '.') }}</p>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('statisticalReport.MPVehicle')"
              header-align="center"
            >
              <template #default="{ row }">
                <p class="text-center">{{ formatNumber(row.free, '.') }}</p>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('el.table.sumText')"
              header-align="center"
            >
              <template #default="{ row }">
                <p class="text-center">{{ formatNumber(row.total, '.') }}</p>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-table
          v-loading="listLoading"
          v-if="filterReport.type === 'KPI'"
          :data="listDataRevenue"
          border
        >
          <el-table-column
            :label="t('statisticalReport.KPISystem', [titleTable.topTitle])"
            label-class-name="title-top"
            header-align="center"
          >
            <el-table-column
              :label="t('statisticalReport.educationStatistics', [titleTable.time])"
              header-align="center"
            >
              <template #default="{ row }">
                <span>{{ formatDate(row.date) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('statisticalReport.recordNbVehiclePass')"
              label-class-name="title-tab"
              header-align="center"
            >
              <el-table-column
                :label="t('statisticalReport.NbQualifiedVehicles')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ formatNumber(row._1) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="!filterReport.laneType"
                :label="t('statisticalReport.NbVehiclesEligibleOut')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ formatNumber(row._2) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="!filterReport.laneType"
                :label="t('statisticalReport.NbValidVehiclesEligibleOut')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ formatNumber(row._3) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="!filterReport.laneType"
                :label="t('statisticalReport.NbVehiclesNotEnough')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ formatNumber(row._4) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="!filterReport.laneType"
                :label="t('statisticalReport.NbVehiclesIneligible')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ formatNumber(row._5) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="!filterReport.laneType"
                :label="t('statisticalReport.validTerminalCard')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ formatNumber(row._6) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="!filterReport.laneType"
                :label="t('statisticalReport.totalNbQualified')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ formatNumber(row._7) }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-if="filterReport.laneType"
                :label="t('statisticalReport.NbVehiclesEligible')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ formatNumber(row._2) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterReport.laneType"
                :label="t('statisticalReport.NbVehiclesConditionsTrue')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ formatNumber(row._3) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterReport.laneType"
                :label="t('statisticalReport.NbVehiclesConditions')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ formatNumber(row._4) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="t('statisticalReport.totalNbVehiclesIdentified')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ filterReport.laneType ? formatNumber(row._5) : formatNumber(row._8) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="filterReport.laneType"
                :label="t('statisticalReport.totalNbQualifiedVehicles')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ formatNumber(row._6) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="t('statisticalReport.totalNbVehiclesTerminal')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ filterReport.laneType ? formatNumber(row._7) : formatNumber(row._9) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="t('statisticalReport.totalNbVehiclesPassing')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ filterReport.laneType ? formatNumber(row._8) : formatNumber(row._10) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="t('statisticalReport.nbTimeExcludesLicense')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ filterReport.laneType ? formatNumber(row._9) : formatNumber(row._11) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="t('statisticalReport.nbVehiclesLicenseFE')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ filterReport.laneType ? formatNumber(row._10) : formatNumber(row._12) }}</span>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column
              :label="t('statisticalReport.errorTransaction')"
              header-align="center"
              label-class-name="title-tab"
            >
              <el-table-column
                :label="
                  filterReport.laneType
                    ? t('statisticalReport.ETCTransactionEncounteredBE')
                    : t('statisticalReport.ETCTransactionEncounteredConnectBE')
                "
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ filterReport.laneType ? formatNumber(row._11) : formatNumber(row._13) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="t('statisticalReport.ETCTransactionBarieControl')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ filterReport.laneType ? formatNumber(row._12) : formatNumber(row._14) }}</span>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column
              :label="t('statisticalReport.KPISystemFE')"
              header-align="center"
              label-class-name="title-tab"
            >
              <el-table-column
                :label="t('statisticalReport.terminalCardKPI')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ filterReport.laneType ? row._13 : row._15 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="t('statisticalReport.licensePlateKPI')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ filterReport.laneType ? row._14 : row._16 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="t('statisticalReport.KPISystemFE98')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ filterReport.laneType ? row._15 : row._17 }}</span>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column
              :label="t('statisticalReport.freeRecordingKPI')"
              header-align="center"
              label-class-name="title-tab"
            >
              <el-table-column
                :label="t('statisticalReport.nbTransactionRecorded')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ filterReport.laneType ? formatNumber(row._16) : formatNumber(row._18) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="t('statisticalReport.freeRecordingKPI100')"
                header-align="center"
              >
                <template #default="{ row }">
                  <span>{{ filterReport.laneType ? row._17 : row._19 }}</span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-unified'
import { useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { usePermissionStore, useRouteUser } from '@/store'
import { getListRoute, getListStation } from '@/api/expressway'
import {
  apiGetReportDiscrepancy,
  apiGetReportInKPI,
  apiGetReportOutKPI,
} from '@/api/statistical-report'
import {ElMessage} from 'element-plus'
// import {formatNumber, downloadFileBase64} from '@/utils'

const { t } = useI18n()
const router = useRouter()
const routeUser = useRouteUser()
const { roleData } = usePermissionStore()
const defaultFilter = {
  type: '',
  laneType: true,
  routeId: null,
  stationId: null,
  time: [],
}
const filter = reactive(cloneDeep(defaultFilter))
const filterReport = reactive({
  type: 'TRAFFIC',
  laneType: true,
  routeId: null,
  stationId: null,
  time: [],
})

const listType = ref([
  {
    id: 1,
    name: 'Sai khác lưu lượng',
    value: 'TRAFFIC',
  },
  {
    id: 2,
    name: 'Sai khác doanh thu',
    value: 'REVENUE',
  },
  {
    id: 3,
    name: 'Sai khác KPI',
    value: 'KPI',
  },
])
const laneType = ref([
  {
    id: 1,
    name: 'KPI làn vào',
    value: true,
  },
  {
    id: 1,
    name: 'KPI làn ra',
    value: false,
  },
])
const listRoute = ref([])
const listStation = ref([])
const processing = ref(false)
const showReport = ref(true)
const listLoading = ref(false)
const isLaneReport = ref(false)

const listDataTraffic = ref([])
const listDataRevenue = ref([])
const titleTable = reactive({
  topTitle: '',
  time: '',
})

onMounted(() => {
  filter.type = 'TRAFFIC'
  setDataDefault()
})

const viewReport = async () => {
  try {
    console.log(filter.type)
    if (!filter.routeId) {
      ElMessage({
        message: 'Tuyến không được để trống!',
        type: 'error',
      })
      return
    }
    if (filter.time?.length === 0) {
      ElMessage({
        message: 'Thời gian không được để trống!',
        type: 'error',
      })
      return
    }
    processing.value = true
    if (filter.type === 'TRAFFIC' || filter.type === 'REVENUE') {
      const params = {
        method: 'LIST',
        arguments: {
          routeId: filter.routeId ? filter.routeId : null,
          stationId: filter.stationId ? filter.stationId : null,
          discrepancyType: filter.type,
          range: {
            from: filter.time?.length > 0 ? filter.time[0] : null,
            to: filter.time?.length > 0 ? filter.time[1] : null,
          },
        },
      }
      isLaneReport.value = !!filter.stationId
      const rs = await apiGetReportDiscrepancy(params)
      if (rs.status === 200) {
        listDataTraffic.value = rs.data.data.sort((a, b) => {
          if (a.date !== b.date) {
            return new Date(b.date) - new Date(a.date)
          }

          if (isLaneReport.value) {
            if (a.lane !== b.lane) {
              return a.lane - b.lane
            }
          } else {
            if (a.station.name !== b.station.name) {
              return a.station.name.localeCompare(b.station.name)
            }
          }
          return 0
        })
        showReport.value = true
        setFilterReport()
      } else {
      }
    } else if (filter.type === 'KPI') {
      const params = {
        method: 'LIST',
        arguments: {
          routeId: filter.routeId,
          stationId: filter.stationId,
          range: {
            from: filter.time.length > 0 ? filter.time[0] : null,
            to: filter.time.length > 0 ? filter.time[1] : null,
          },
        },
      }
      if (filter.laneType) {
        const rs = await apiGetReportInKPI(params)
        if (rs.status === 200) {
          const recipe = {
            createdAt: t('el.datepicker.day'),
            _1: '(1)',
            _2: '(2)',
            _3: '(3)',
            _4: '(4)',
            _5: '(5)',
            _6: '(6)',
            _7: '(7)=(1) + (3)',
            _8: '(8)',
            _9: '(9)',
            _10: '(10)',
            _11: '(11)',
            _12: '(12)',
            _13: '(13)',
            _14: '(14)',
            _15: '(15)=(8)/(9)',
            _16: '(16)=(12)/((10)-(11))',
            _17: '(17)=((1)-(13)-(14))/(7)',
            _18: '(18)',
            _19: '(19)=(18)/(10)',
          }
          listDataRevenue.value = []
          listDataRevenue.value = rs.data.data
          showReport.value = true
          setFilterReport()
        }
      } else {
        const rs = await apiGetReportOutKPI(params)
        if (rs.status === 200) {
          listDataRevenue.value = rs.data.data
          showReport.value = true
          setFilterReport()
        }
      }
      const station = listStation.value.find(item => item.id === filter.stationId)
      if (station) {
        titleTable.topTitle = `${t('configUser.station')} ${station.name}`
      }
      if (filter.time.length > 0) {
        const from = new Date(filter.time[0])
        const to = new Date(filter.time[1])

        titleTable.time = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1
      } else {
        titleTable.time = `${t('el.datepicker.noTimeSelected')}`
      }
    }
    processing.value = false
  } catch (e) {
    console.log(e)
    processing.value = false
  }
}
const exportFile = async typeFile => {
  try {
    if (filter.type === 'TRAFFIC' || filter.type === 'REVENUE') {
      const params = {
        method: 'EXPORT',
        arguments: {
          routeId: filter.routeId ? filter.routeId : null,
          stationId: filter.stationId ? filter.stationId : null,
          discrepancyType: filter.type,
          range: {
            from: filter.time.length > 0 ? filter.time[0] : null,
            to: filter.time.length > 0 ? filter.time[1] : null,
          },
          fileType: typeFile,
        },
      }
      const rs = await apiGetReportDiscrepancy(params)
      if (rs.status === 200) {
        downloadFile(rs, typeFile)
      }
    } else if (filter.type === 'KPI') {
      const params = {
        method: 'EXPORT',
        arguments: {
          routeId: filter.routeId ? filter.routeId : null,
          stationId: filter.stationId ? filter.stationId : null,
          range: {
            from: filter.time.length > 0 ? filter.time[0] : null,
            to: filter.time.length > 0 ? filter.time[1] : null,
          },
          fileType: typeFile,
        },
      }
      if (filter.laneType) {
        const rs = await apiGetReportInKPI(params)
        if (rs.status === 200) {
          downloadFile(rs, typeFile)
        }
      } else {
        const rs = await apiGetReportOutKPI(params)
        if (rs.status === 200) {
          downloadFile(rs, typeFile)
        }
      }
    }
  } catch (e) {
    console.log(e)
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
const downloadFile = (response, typeFile) => {
  const base64Data = response.data.data
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
  a.download = `${response.data.name}`
  document.body.appendChild(a)
  a.click()

  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const setFilterReport = () => {
  filterReport.routeId = filter.routeId
  filterReport.stationId = filter.stationId
  filterReport.time = filter.time
  filterReport.type = filter.type
  filterReport.laneType = filter.laneType
}
const formatDate = dateString => {
  if (!dateString) return ''
  const isoDateString = dateString.replace(' ', 'T')
  const date = new Date(isoDateString)
  if (isNaN(date)) return 'Invalid Date'

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}
const setDataDefault = async () => {
  const params = {
    routeIds: routeUser.routes,
  }
  const rs = await getListRoute(params)
  if (rs.status === 200) {
    listRoute.value = rs.data.dataRows
  }
}
const setListStation = async routeId => {
  listStation.value = []
  filter.stationId = null
  const params = {
    page: 1,
    size: 20,
    keyword: '',
    stationIds: [],
    routeIds: [routeId],
    unitIds: [],
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

const mergeCells = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    const sameDateRows = listDataTraffic.value.filter(item => item.date === row.date)
    if (rowIndex === listDataTraffic.value.indexOf(sameDateRows[0])) {
      return [sameDateRows.length, 1]
    } else {
      return [0, 0]
    }
  } else if (columnIndex === 1) {
    if (isLaneReport.value) {
      const sameLaneRows = listDataTraffic.value.filter(
        item => item.date === row.date && item.lane === row.lane
      )
      if (rowIndex === listDataTraffic.value.indexOf(sameLaneRows[0])) {
        return [sameLaneRows.length, 1]
      } else {
        return [0, 0]
      }
    } else {
      const sameStationRows = listDataTraffic.value.filter(
        item => item.date === row.date && item.station.name === row.station.name
      )
      if (rowIndex === listDataTraffic.value.indexOf(sameStationRows[0])) {
        return [sameStationRows.length, 1]
      } else {
        return [0, 0]
      }
    }
  }
}
const formatNumber = (number) => {
  const isNegative = number < 0
  const absNumber = Math.abs(number)

  const formattedNumber = absNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return isNegative ? `-${formattedNumber}` : formattedNumber
}
</script>

<style scoped lang="scss">
.traffic-report {
  :deep(.el-table th > .cell) {
    font-weight: 500;
    font-size: 15px !important;
  }
}

:deep(.el-table thead.is-group th.el-table__cell) {
  background: white;
}
:deep(.el-table th > .cell) {
  font-weight: 500;
  font-size: 11px;
}
:deep(.title-top > .cell) {
  font-size: 16px !important;
  text-transform: uppercase;
}

:deep(.title-tab > .cell) {
  font-size: 14px !important;
}
:deep(.el-table .el-table__header-wrapper) {
  border-bottom: 0px solid #ebebec;
}
</style>
