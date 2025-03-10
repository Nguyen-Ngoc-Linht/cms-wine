<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5">
      <el-select
        v-model="filter.type"
        :placeholder="t('monitoring.toll.transactionTypeAbnormal')"
        clearable
        filterable
        multiple
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listAbnormalType"
          :key="item.id"
          :label="item.name"
          :value="item.id"
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
        v-model="filter.station"
        :placeholder="t('configUser.station')"
        clearable
        multiple
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
        v-model="filter.timeSearch"
        type="daterange"
        :start-placeholder="t('el.datepicker.startTime')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.endTime')"
        clearable
        value-format="DD/MM/YYYY"
        format="DD/MM/YYYY"
        class="w-full md:max-w-[30%] lg:max-w-[300px]"
      />
      <el-button
        @click="getList"
        class="el-button--main"
        >{{ t('configUser.search') }}</el-button
      >
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <div class="paddingX-24 mb-4">
      <div class="px-3 py-3 bg-white">
        <TableViolation
          :listLoading="listLoading"
          :data="listAbnormalToll"
          :fields="fields"
          :STT="true"
          :page="filter.page"
          :size="filter.size"
          :row-class-name="tableRowClassName"
        >
          <template #abnormal_type="{ row }">
            <span>{{ row.abnormal_type ? row.abnormal_type.name : '' }}</span>
          </template>
          <template #entryStation="{ row }">
            <span>{{ row.station_in ? row.station_in.name : '' }}</span>
          </template>
          <template #exitStation="{ row }">
            <span>{{ row.station_out ? row.station_out.name : '' }}</span>
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
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import Pagination from '@/components/Pagination/index.vue'
import { dayjs, ElMessage } from 'element-plus'
import TableViolation from '@/components/Table/index.vue'
import { useI18n } from '@/locale'
import { cloneDeep } from 'lodash-unified'
import { getListRoute, getListStation } from '@/api/expressway'
import { usePermissionStore, useRouteUser } from '@/store'
import { apiGetAbnormalTypeAll, apiGetListAbnormal } from '@/api/toll'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()

const listLoading = ref(false)
const fields = ref([
  {
    key: 'abnormal_type',
    label: t('monitoring.toll.transactionType'),
    prop: 'abnormal_type',
  },
  {
    key: 'e_tag',
    label: 'Etag',
    prop: 'e_tag',
  },
  {
    key: 'entryStation',
    label: t('configUser.entryStation'),
    prop: 'entryStation',
  },
  {
    key: 'laneInNumber',
    label: t('reconciliation.laneIn'),
    prop: 'laneInNumber',
  },
  {
    key: 'checkin_date_in',
    label: t('reconciliation.timeIn'),
    prop: 'checkin_date_in',
  },
  {
    key: 'exitStation',
    label: t('configUser.exitStation'),
    prop: 'exitStation',
  },
  {
    key: 'laneOutNumber',
    label: t('reconciliation.laneOut'),
    prop: 'laneOutNumber',
  },
  {
    key: 'checkin_date_out',
    label: t('reconciliation.timeOut'),
    prop: 'checkin_date_out',
  },
  {
    key: 'bksnd',
    label: 'BKSND',
    prop: 'bksnd',
  },
  {
    key: 'vehicle_type',
    label: t('configUser.vehicleType'),
    prop: 'vehicle_type',
  },
  {
    key: 'bksdk',
    label: 'BKSDK',
    prop: 'bksdk',
  },
  {
    key: 'price',
    label: t('monitoring.toll.faceValue'),
    prop: 'price',
  },
])
const defaultFilter = {
  page: 1,
  size: 10,
  total: 0,
  type: null,
  routeId: null,
  station: null,
  timeSearch: [],
}
const filter = reactive(cloneDeep(defaultFilter))
const listRoute = ref([])
const listStation = ref([])
const listAbnormalType = ref([])

const listAbnormalToll = ref([])
const infoAbnormalToll = ref({})

onMounted(() => {
  setDataDefault()
  getList()
})

const setDataDefault = async () => {
  const today = dayjs().format('DD/MM/YYYY')
  const sevenDaysAgo = dayjs().subtract(7, 'day').format('DD/MM/YYYY')
  console.log(today, sevenDaysAgo)
  filter.timeSearch = [sevenDaysAgo, today]

  const params = {
    routeIds: routeUser.routes,
  }
  const rs = await getListRoute(params)
  if (rs.status === 200) {
    listRoute.value = rs.data.dataRows
  }

  const list = await apiGetAbnormalTypeAll()
  if (list.status === 200) {
    listAbnormalType.value = list.data
  }
}
const getList = async () => {
  listLoading.value = true
  const params = {
    abnormal_type: filter.type,
    route_id: filter.routeId,
    station_id: filter.station,
    from_time: filter.timeSearch ? filter.timeSearch[0] : null,
    to_time: filter.timeSearch ? filter.timeSearch[1] : null,
    page: filter.page,
    size: filter.size,
    monitor_type: 1,
  }
  const rs = await apiGetListAbnormal(params)
  if (rs.status === 200) {
    listAbnormalToll.value = rs.data.data
    filter.total = rs.data.total
    listLoading.value = false
  }
}

const setListStation = async routeId => {
  listStation.value = []
  filter.station = null
  const params = {
    page: 1,
    size: 20,
    keywords: '',
    routeIds: [routeId],
    stationIds: [],
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

const selectedRows = ref([])
const tableRowClassName = ({ row }) => {
  const station_in = row.station_in !== null
  const station_out = row.station_out !== null
  if (row.abnormal_type.name.includes('Có TT trạm vào không có TT trạm ra')) {
    return 'selected-rows'
  }
  return selectedRows.value.includes(row) ? 'selected-rows' : ''
}
</script>

<style lang="scss">
.el-checkbox__input.is-checked .el-checkbox__inner {
  border-color: #059efb;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #059efb;
  font-weight: 700;
}
</style>

<style scoped lang="scss">
:deep(.el-table .selected-rows) {
  --el-table-tr-bg-color: #fcecaa !important;
}
</style>
