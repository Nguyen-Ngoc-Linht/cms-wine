<template>
  <div>
    <div class="flex flex-wrap gap-px-8 paddingX-24 padding-top-14 margin-bottom-10">
      <el-select
        v-model="filter.type"
        class="w-full md:max-w-[30%] lg:max-w-[200px] height-32"
        :placeholder="t('reconciliation.transactionType')"
        clearable
      >
        <el-option
          v-for="item in listType"
          :key="item.value"
          :label="item.label"
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
        type="datetimerange"
        :start-placeholder="t('el.datepicker.startTime')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.endTime')"
        value-format="YYYY-MM-DD HH:mm"
        format="DD/MM/YYYY HH:mm"
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
      v-if="roleData.canCreate"
    >
      <div class="flex gap-px-16 items-center">
        <el-button
          text
          size="default"
          class="!p-0"
          :disabled="!multipleSelection.length"
          @click="handleAddExplain"
        >
          <div class="text-gray flex items-center">
            <svg-icon
              icon-class="el-icon-plus"
              class="width-20 height-20 margin-right-4"
            />
            {{ t('reconciliation.createExplain') }}
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
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            align="center"
            type="selection"
            width="40"
            label="#"
            :selectable="canSelectRow"
          />
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
            :label="t('reconciliation.transactionType')"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span v-if="row.transFreeTypeId === 1">{{ t('reconciliation.autoDetect') }}</span>
              <span v-if="row.transFreeTypeId === 2">{{ t('reconciliation.noAutoDetect') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('reconciliation.freeType')"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span>{{ row.freeType }}</span>
              <!--              <span v-if="row.freeType === 4">{{ t('reconciliation.freeSingle') }}</span>-->
              <!--              <span v-if="row.freeType === 5">{{ t('reconciliation.freeConvoys') }}</span>-->
              <!--              <span v-if="row.freeType === 7">{{ t('reconciliation.freeNationwide') }}</span>-->
              <!--              <span v-if="row.freeType === 8">{{ t('reconciliation.freeWhitePlate') }}</span>-->
            </template>
          </el-table-column>
          <el-table-column label="Etag">
            <template #default="{ row }">
              <span>{{ row.etagOut }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.stationIn')">
            <template #default="{ row }">
              <span>{{ row.stationIn }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.timeIn')">
            <template #default="{ row }">
              <span>{{ formatDateTime(row.checkinDateIn) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.laneIn')">
            <template #default="{ row }">
              <span>{{ row.laneIn }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.stationOut')">
            <template #default="{ row }">
              <span>{{ row.stationOut }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.timeOut')">
            <template #default="{ row }">
              <span>{{ formatDateTime(row.checkinDateOut) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.laneOut')">
            <template #default="{ row }">
              <span>{{ row.laneOut }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.plateRec')">
            <template #default="{ row }">
              <span>{{ row.identificationPlate }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.vehicleType')">
            <template #default="{ row }">
              <span>{{ row.vehicleTypeOut }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.plateReg')">
            <template #default="{ row }">
              <span>{{ row.registrationPlate }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.amount')">
            <template #default="{ row }">
              <span>{{ formatNumber(row.price, '.') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('reconciliation.explainStatus')"
            class-name="no-ellipsis"
            width="150"
          >
            <template #default="{ row }">
              <el-tag
                type="warning"
                v-if="!row.explanationStatus || row.explanationStatus === 'NOT_EXPLAINED'"
                >{{ t('reconciliation.unExplained') }}</el-tag
              >
              <el-tag
                type="info"
                v-if="row.explanationStatus === 'WAIT_EXPLAINED'"
                >{{ t('reconciliation.waitExplain') }}</el-tag
              >
              <el-tag
                type="primary"
                v-if="row.explanationStatus === 'EXPLAINED'"
                >{{ t('reconciliation.explained') }}</el-tag
              >
              <el-tag
                type="success"
                v-if="row.explanationStatus === 'EXPLAINED_AND_UPDATED'"
                >{{ t('reconciliation.explainedAndUpdate') }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            :label="t('reconciliation.recordStatus')"
            class-name="no-ellipsis"
            width="140"
          >
            <template #default="{ row }">
              <el-tag
                type="danger"
                v-if="row.recognitionStatus === 'NOT_RECORDED_UPDATE'"
                >{{ t('reconciliation.unUpdated') }}</el-tag
              >
              <el-tag
                type="success"
                v-if="row.recognitionStatus === 'RECORDED_UPDATE'"
                >{{ t('reconciliation.updated') }}</el-tag
              >
              <el-tag
                type="info"
                v-if="row.recognitionStatus === 'NOT_RECORDED'"
                >{{ t('reconciliation.unRecorded') }}</el-tag
              >
              <el-tag
                type="primary"
                v-if="row.recognitionStatus === 'RECORDED'"
                >{{ t('reconciliation.recorded') }}</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
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
      <div class="margin-top-12"></div>
    </div>
    <ModalAddExplain
      :dialog-visible="showAdd"
      :route-lst="routeLst"
      :transaction-lst="multipleSelection"
      :reconciliation-type="'VEHICLE'"
      @handle-success="handleSuccessAdd"
      @handle-close="() => (showAdd = false)"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue'
import moment from 'moment/moment'
import { useI18n } from '@/locale'
import { usePermissionStore, useRouteUser } from '@/store'
import { cloneDeep } from 'lodash-unified'
import { getListRoute, getListStation } from '@/api/expressway'
import { formatDateTime } from '@/utils/date'
import { formatNumber } from '@/utils'
import Pagination from '@/components/Pagination'
import ModalAddExplain from '../../components/modal-add-explain.vue'
import { apiGetListReconc } from '@/api/reconciliation'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()

const listType = [
  {
    label: t('reconciliation.autoDetect'),
    value: 1,
  },
  {
    label: t('reconciliation.noAutoDetect'),
    value: 2,
  },
]

const defaultFilter = {
  page: 1,
  size: 15,
  type: null,
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
  if (routeId) {
    const params = {
      routeIds: [routeId],
      stationsIds: [],
    }
    getListStation(params).then(res => {
      stationLst.value = res?.data?.dataRows || []
    })
  } else {
    stationLst.value = []
  }
}
const handleRouteChange = routeId => {
  filter.station = null
  getStationList(routeId)
}
const canSelectRow = row => {
  return !row.explanationStatus || row.explanationStatus === 'NOT_EXPLAINED'
}

const tableRowClassName = ({ row }) => {
  if (row.freeVehicleDeviationType === 1) return 'row-wrong-list'
  else if (row.freeVehicleDeviationType === 0) return 'row-wrong-data'
  else return ''
}

const dataList = ref([])
const totalValue = ref(0)
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
  if (listLoading.value) return

  const { type, page, size, route, station, startEnd } = filter

  const data = {
    page,
    size,
    explanation_type: type,
    reconciliation_type: 'VEHICLE',
    route_id: route,
    station_id: station,
    start_time: moment(startEnd[0]).format('YYYY-MM-DD HH:mm:ss'),
    end_time: moment(startEnd[1]).format('YYYY-MM-DD HH:mm:ss'),
  }
  listLoading.value = true
  apiGetListReconc(data)
    .then(res => {
      dataList.value = res.data.data
      totalValue.value = res.data.total
    })
    .catch(e => {
      dataList.value = []
      totalValue.value = 0
    })
    .finally(() => {
      listLoading.value = false
    })
}

onMounted(() => {
  getList()
})

onBeforeMount(() => {
  getRouteList()
})

const multipleSelection = ref([])
const handleSelectionChange = val => {
  multipleSelection.value = val
}

const showDetail = ref(false)
const flagActive = ref(0)
const rowClicked = row => {
  flagActive.value = row.id
  showDetail.value = true
}

const showAdd = ref(false)

const handleAddExplain = () => {
  if (
    multipleSelection.value.some(i => i.stationOutId !== multipleSelection.value[0].stationOutId)
  ) {
    ElMessage({
      message: t('reconciliation.stationCheckNote'),
      type: 'warning',
    })
  } else {
    showAdd.value = true
  }
}

const handleSuccessAdd = () => {
  getList()
  showAdd.value = false
}

defineOptions({
  name: 'reconciliationData',
})
</script>

<style scoped lang="scss">
.add-text {
  color: #525b73;
}

.el-button.is-text.is-disabled {
  .add-text {
    color: #a8abb2;
  }
}

:deep(.no-ellipsis .cell) {
  text-overflow: unset; /* Remove ellipsis */
}

:deep(.el-tag) {
  height: unset;
  min-height: 24px;
  padding: 4px 9px;
  text-align: center;
  white-space: unset;
}

:deep(.el-table .row-wrong-list td) {
  background: #ffecb3 !important;
}

:deep(.el-table .row-wrong-data td) {
  background: #ffe7d1 !important;
}

:deep(.el-checkbox__input.is-disabled) {
  opacity: 0.4;
}

:deep(td.el-table__cell .cell) {
  color: #76809b;
}

:deep(td.el-table__cell.highlight .cell) {
  color: #000000;
}
</style>
