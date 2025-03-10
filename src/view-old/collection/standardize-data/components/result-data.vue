<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import moment from 'moment'
import { useI18n } from '@/locale'
import lang from '@/locale/getMessage'
import Pagination from '@/components/Pagination'
import { useAppStore, useRouteUser } from '@/store'
import { cloneDeep } from 'lodash-unified'
import { apiGetCollect, apiGetListCollectWarning } from '@/api/collect'
import { getListRoute, getListStation } from '@/api/expressway'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'result-data',
})

const route = useRoute()
const { t } = useI18n()
const appStore = useAppStore()
const locale = computed(() => lang[appStore.lang])
const listLoading = ref(false)
const formSearchDefault = {
  warningType: '',
  routeId: null,
  stationId: null,
  createTime: [],
  page: 1,
  size: 10,
}
const filter = reactive(cloneDeep(formSearchDefault))
const totalItem = ref(0)
const currentPage = ref(1)
const dataTable = ref([])
const maxHeight = computed(() => {
  const viewportHeight = window.innerHeight
  return viewportHeight - 270
})
const listTypeReport = ref([
  {
    id: 1,
    name: 'Logfile thiết bị không liên tục',
  },
  {
    id: 2,
    name: 'Logfile tín hiệu không liên tục',
  },
  {
    id: 3,
    name: 'File qua API không liên tục',
  },
  {
    id: 4,
    name: 'File từ BE không liên tục',
  },
])
const listRoute = ref([])
const listStation = ref([])
const routeUser = useRouteUser()

onMounted(() => {
  filter.routeId = Number(route.query.route) || ''
  setListStation(filter.routeId)
  filter.stationId = Number(route.query.station) || ''
  handleSearchReport()
  handleGetRoutes()
})
const handleGetRoutes = async () => {
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
const handleSearchReport = async () => {
  listLoading.value = true
  filter.createTime = filter.createTime || []
  const params = {
    warningType: filter.warningType || null,
    page: filter.page,
    size: filter.size,
    startDate:
      filter.createTime && filter.createTime.length > 0
        ? moment(filter.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        : null,
    endDate:
      filter.createTime && filter.createTime.length > 0
        ? moment(filter.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
        : null,
    routeId: filter.routeId,
    stationId: filter.stationId,
  }
  const res = await apiGetListCollectWarning(params)
  if (res.status === 200) {
    listLoading.value = false
    dataTable.value = res.data
    totalItem.value = res.total
  } else {
    listLoading.value = false
  }
}
const indexMethod = index => {
  return (currentPage.value - 1) * filter.size + index + 1
}
const handleSizeChange = size => {
  filter.size = size
  handleSearchReport()
}
const handlePageChange = page => {
  filter.page = page
  handleSearchReport()
}
const onChangeUpdatePage = page => {
  currentPage.value = page
}
const formatTime = time => {
  return moment(time).format('DD/MM/YYYY HH:mm:ss')
}
</script>

<template>
  <div>
    <div class="paddingX-24 padding-top-14 search-group flex flex-wrap gap-px-8 margin-bottom-10">
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
      <el-select
        v-model="filter.warningType"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
        filterable
        collapse-tags
        clearable
        :placeholder="t('monitoring.toll.warningType')"
      >
        <el-option
          v-for="item in listTypeReport"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-config-provider :locale="locale">
        <el-date-picker
          v-model="filter.createTime"
          type="daterange"
          :start-placeholder="t('el.datepicker.startTime')"
          :range-separator="t('el.datepicker.to')"
          :end-placeholder="t('el.datepicker.endTime')"
          clearable
          value-format="YYYY-MM-DD"
          format="DD/MM/YYYY"
          class="w-full md:max-w-[30%] lg:max-w-[300px] height-32"
          name="timeCreate"
        />
      </el-config-provider>
      <el-button
        style="background-color: #059efb; border: none"
        class="border-1 paddingX-20"
        @click="handleSearchReport"
        type="primary"
        >{{ $t('configUser.search') }}
      </el-button>
    </div>
    <hr class="margin-bottom-12" />
    <div class="paddingX-24 table-group">
      <div class="padding-12 bg-white">
        <el-config-provider :locale="locale">
          <el-table
            v-loading="listLoading"
            :data="dataTable"
            fit
            highlight-current-row
            style="width: 100%"
            class="cell-main-3"
            :max-height="maxHeight"
          >
            <el-table-column
              type="index"
              :index="indexMethod"
              width="50"
              label="STT"
            />
            <el-table-column
              :label="$t('configUser.userManagement.route')"
              width="200px"
            >
              <template #default="{ row }">
                <span>{{ row.routeName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('configUser.station')"
              width="200px"
            >
              <template #default="{ row }">
                <span>{{ row.stationName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('collection.reportType')"
              width="200px"
            >
              <template #default="{ row }">
                <span>{{ row.warningType }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('monitoring.toll.contentWarning')"
              width="500px"
            >
              <template #default="{ row }">
                <span>{{ row.content }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('collection.time')">
              <template #default="{ row }">
                <span>{{ formatTime(row.createTime) }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="overflow-x-auto">
            <Pagination
              class="margin-top-12"
              v-model:page.sync="filter.page"
              v-model:size.sync="filter.size"
              :total="totalItem"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
              @update:page="onChangeUpdatePage"
            />
          </div>
        </el-config-provider>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
