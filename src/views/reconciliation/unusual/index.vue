<template>
  <div>
    <div class="flex flex-wrap gap-px-8 paddingX-24 padding-top-14">
      <el-select
        v-model="filter.alertTypeId"
        :placeholder="t('monitoring.toll.warningType')"
        clearable
        filterable
        collapse-tags
        collapse-tags-tooltip
        class="width-200 height-32"
      >
        <el-option
          v-for="item in listTypeWarning"
          :key="item.id"
          :label="item.typeName"
          :value="item.id"
        />
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
        class="width-200 height-32"
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
        class="width-200 height-32"
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
        v-model="filter.createTime"
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
        class="el-button--main"
        @click="searchListData()"
        >{{ t('configUser.search') }}</el-button
      >
    </div>
    <hr class="margin-bottom-12 mt-4" />
    <div class="paddingX-24">
      <div class="p-3 bg-white">
        <TableViolation
          :listLoading="listLoading"
          :data="warningListData"
          :fields="fields"
          :STT="true"
          :size="filter.size"
          :page="filter.page"
        >
          <template #alertType="{ row }">
            <span>{{ row.alertType ? row.alertType.typeName : '' }}</span>
          </template>
          <template #route="{ row }">
            <span>{{ row.route ? row.route.name : '' }}</span>
          </template>
          <template #station="{ row }">
            <span>{{ row.station ? row.station.name : '' }}</span>
          </template>
          <template #createTime="{ row }">
            <span>{{ formatDateTime(row.createTime) }}</span>
          </template>
          <template #revenueDecline="{ row }">
            <span>{{ formatNumber(row.revenueDecline) }}</span>
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
import TableViolation from '@/components/Table/index.vue'
import { cloneDeep } from 'lodash-unified'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from '@/locale'
import { useUserStore, useRouteUser } from '@/store'
import { getListRoute, getListStation } from '@/api/expressway'
import { ElMessage } from 'element-plus'
import moment from 'moment/moment'
import { apiGetAlertInfo, apiGetAlertType } from '@/api/toll'
import { formatNumber } from '@/utils'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const routeUser = useRouteUser()
const defaultFilter = {
  page: 1,
  size: 10,
  routeId: '',
  stationId: '',
  alertTypeId: null,
  createTime: [],
  total: 0,
}
const filter = reactive(cloneDeep(defaultFilter))
const fields = ref([
  {
    key: 'alertType',
    label: t('monitoring.toll.warningType'),
    prop: 'alertType',
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
    key: 'content',
    label: t('monitoring.toll.contentWarning'),
    prop: 'content',
  },
  {
    key: 'createTime',
    label: t('monitoring.toll.warningTime'),
    prop: 'createTime',
  },
  {
    key: 'revenueDecline',
    label: t('monitoring.toll.revenueDecline'),
    prop: 'revenueDecline',
  },
])
const listRoute = ref([])
const listStation = ref([])
const listTypeWarning = ref([])
const listLoading = ref(false)
const warningListData = ref([])

onMounted(async () => {
  await setDataDefault()
  filter.routeId = Number(route.query.route) || ''
  setListStation(filter.routeId)
  filter.stationId = Number(route.query.station) || ''
  await handleGetListTypeWarning()
  await getList()
})

const setDataDefault = async () => {
  const params = {
    routeIds: routeUser.routes,
  }
  const rs = await getListRoute(params)
  if (rs.status === 200) {
    listRoute.value = rs.data.dataRows
  }
}
const handleGetListTypeWarning = async () => {
  const res = await apiGetAlertType(2)
  if (res.status === 200) {
    listTypeWarning.value = res.data
  }
}
const getList = async () => {
  listLoading.value = true
  filter.timeCreate = filter.timeCreate || []
  const params = {
    type: 2,
    pageIndex: filter.page - 1,
    pageSize: filter.size,
    routeId: filter.routeId,
    stationId: filter.stationId,
    alertTypeId: filter.alertTypeId,
    startDate:
      filter.createTime && filter.createTime.length > 0
        ? moment(filter.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        : null,
    endDate:
      filter.createTime && filter.createTime.length > 0
        ? moment(filter.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
        : null,
  }
  const res = await apiGetAlertInfo(params)
  if (res.status === 200) {
    listLoading.value = false
    warningListData.value = res.data.content
    filter.total = res.data.totalElements
  }
  listLoading.value = false
}

const searchListData = () => {
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
const setListStation = async routeId => {
  listStation.value = []
  filter.stationId = ''
  const params = {
    page: 1,
    size: 20,
    keywords: '',
    routeIds: [routeId],
    stationIds: [],
    unitIds: [],
  }
  const listStationUser = routeUser.GET_STATIONS(routeId)
  if (listStationUser.length > 0) {
    params.stationIds = listStationUser
  }
  const rs = await getListStation(params)
  if (rs.status === 200) {
    listStation.value = rs.data.dataRows
  } else {
    listStation.value = []
  }
}
const formatDateTime = dateTime => {
  const [date, time] = dateTime.split(' ')
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year} ${time}`
}
</script>
