<template>
  <div>
    <div class="flex flex-wrap gap-px-8 paddingX-24 padding-top-14 margin-bottom-10">
      <el-select
        v-model="filter.route"
        class="w-full md:max-w-[30%] lg:max-w-[200px] height-32"
        @change="handleRouteChange"
        :placeholder="t('configUser.userManagement.route')"
        clearable
      >
        <el-option
          v-for="item in routeLst"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="filter.station"
        class="w-full md:max-w-[30%] lg:max-w-[200px] height-32"
        :placeholder="t('configUser.userManagement.station')"
        clearable
      >
        <el-option
          v-for="item in stationLst"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-model="filter.startEnd"
        type="daterange"
        :start-placeholder="t('el.datepicker.startTime')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.endTime')"
        value-format="YYYY-MM-DD"
        format="DD/MM/YYYY"
        class="w-full md:max-w-[30%] lg:max-w-[320px] flex-grow-0 height-32"
        :clearable="false"
      />
      <el-button
        class="fs-14 height-32 el-button--main rounded-[2px]"
        @click="search"
        >{{ t('placeholder.search') }}
      </el-button>
    </div>
    <div
      class="flex items-center justify-between paddingX-24 padding-bottom-10"
      v-if="roleData.canExport"
    >
      <div class="flex gap-px-16 items-center">
        <el-button
          text
          size="default"
          class="!p-0"
          @click="handleExport(true)"
          :loading="processExport === 'EXCEL'"
          :disabled="processExport || !dataList.length"
        >
          <div class="text-gray flex items-center">
            <svg-icon
              v-if="!processExport"
              icon-class="export-file"
              class="width-20 height-20 margin-right-4"
            />
            {{ t('reconciliation.exportExcel') }}
          </div>
        </el-button>
        <el-button
          text
          size="default"
          class="!p-0"
          @click="handleExport(false)"
          :loading="processExport === 'PDF'"
          :disabled="processExport || !dataList.length"
        >
          <div class="text-gray flex items-center">
            <svg-icon
              v-if="!processExport"
              icon-class="export-file"
              class="width-20 height-20 margin-right-4"
            />
            {{ t('reconciliation.exportPDF') }}
          </div>
        </el-button>
      </div>
    </div>
    <hr class="margin-bottom-12" />
    <div class="paddingX-24">
      <div
        v-loading="listLoading"
        class="padding-12 bg-white"
      >
        <el-table
          ref="multipleTable"
          :data="dataList"
          style="width: 100%"
          max-height="650"
          :border="false"
        >
          <el-table-column
            :label="t('configUser.orderNumber')"
            width="60px"
            class-name="highlight"
          >
            <template #default="{ $index }">
              <span>{{ (filter.page - 1) * filter.size + $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('dateTime.day')"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span>{{ formatDate(row.reportDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.userManagement.route')"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span>{{ row.route }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.userManagement.station')"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span>{{ row.station }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.transactionLostInReport')">
            <template #default="{ row }">
              <span>{{ formatNumber(row.gstpNotInBc, '.') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.transactionLostInSystem')">
            <template #default="{ row }">
              <span>{{ formatNumber(row.bcNotInGstp, '.') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('reconciliation.diffReportAndSystem')"
            align="center"
          >
            <el-table-column :label="t('reconciliation.wrongRoute')">
              <template #default="{ row }">
                <span>{{ formatNumber(row.deviationRoute, '.') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="t('reconciliation.wrongVehicleType')">
              <template #default="{ row }">
                <span>{{ formatNumber(row.deviationVehicle, '.') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="t('reconciliation.wrongAmount')">
              <template #default="{ row }">
                <span>{{ formatNumber(row.deviationValue, '.') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="t('reconciliation.wrongTime')">
              <template #default="{ row }">
                <span>{{ formatNumber(row.deviationDate, '.') }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div class="margin-top-12">
        <Pagination
          v-model:page="filter.page"
          v-model:size="filter.size"
          :total="totalValue"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue'
import moment from 'moment/moment'
import { useI18n } from '@/locale'
import { usePermissionStore, useRouteUser } from '@/store'
import { getListRoute, getListStation } from '@/api/expressway'
import { formatDate } from '@/utils/date'
import { formatNumber, downloadFileBase64 } from '@/utils'
import Pagination from '@/components/Pagination'
import { cloneDeep } from 'lodash-unified'
import { apiGetTollReconcReport, apiExportTollReconcReport } from '@/api/reconciliation'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()

const defaultFilter = {
  page: 1,
  size: 15,
  route: null,
  station: null,
  startEnd: [
    moment().add(-7, 'days').startOf('day').format('YYYY-MM-DD HH:mm'),
    moment().format('YYYY-MM-DD HH:mm'),
  ],
}

const filter = reactive(cloneDeep(defaultFilter))
const loading = ref(true)

const routeLst = ref([])
const stationLst = ref([])
const getRouteList = async () => {
  const params = {
    routeIds: routeUser.routes,
  }
  await getListRoute(params).then(res => {
    routeLst.value = res?.data?.dataRows || []
  })
}
const getStationList = routeId => {
  filter.station = null
  if (routeId) {
    const params = {
      routeIds: [routeId],
      stationsIds: routeUser.GET_STATIONS(routeId),
    }
    getListStation(params).then(res => {
      stationLst.value = res?.data?.dataRows || []
    })
  } else {
    stationLst.value = []
  }
}
const handleRouteChange = routeId => {
  getStationList(routeId)
}

const dataList = ref([])
const totalValue = ref(0)
const totalData = ref({})
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

const getList = () => {
  const { route, station, startEnd, page, size } = filter
  const data = {
    routeId: route,
    stationId: station,
    page,
    size,
    fromDate: startEnd[0],
    toDate: startEnd[1],
  }
  apiGetTollReconcReport(data)
    .then(res => {
      dataList.value = res.data.data
      totalValue.value = res.data.total
    })
    .catch(_ => {
      dataList.value = []
      totalValue.value = 0
    })
    .finally(_ => {
      listLoading.value = false
    })
}

const processExport = ref(false)
const handleExport = isExcel => {
  if (processExport.value) return
  const { route, station, startEnd } = filter
  const data = {
    routeId: route,
    stationId: station,
    fromDate: startEnd[0],
    toDate: startEnd[1],
    fileType: isExcel ? 'EXCEL' : 'PDF',
  }
  processExport.value = isExcel ? 'EXCEL' : 'PDF'
  apiExportTollReconcReport(data)
    .then(res => {
      const { name, data } = res.data
      downloadFileBase64(name, data)
    })
    .finally(() => {
      processExport.value = null
    })
}

onBeforeMount(() => {
  getRouteList()
})

onMounted(() => {
  getList()
})

defineOptions({
  name: 'ReconciliationReport',
})
</script>

<style scoped lang="scss">
:deep(.el-table thead.is-group th.el-table__cell) {
  background-color: var(--el-table-header-bg-color);
}
:deep(td.el-table__cell .cell) {
  color: #76809b;
}
:deep(td.el-table__cell.highlight .cell) {
  color: #000000;
}
</style>
