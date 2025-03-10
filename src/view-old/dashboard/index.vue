<template>
  <div
    v-if="roleData.canRead"
    v-loading="loading"
  >
    <div class="w-full paddingX-14 padding-top-14 padding-bottom-8">
      <el-row :gutter="8">
        <el-col
          :sm="12"
          :xl="6"
          class="mb-[8px] md:mb-0"
        >
          <div class="flex wrap-on-xs gap-px-8">
            <el-select
              v-model="filter.route"
              class="w-full"
              @change="handleRouteChange"
              :placeholder="t('configUser.userManagement.route')"
            >
              <el-option
                :value="0"
                :label="t('el.select.selectAll')"
                v-if="isAdmin"
              ></el-option>
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
              class="w-full"
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
          </div>
        </el-col>
        <el-col
          :sm="12"
          :xl="18"
        >
          <el-button
            class="fs-14 height-32 el-button--main rounded-[2px]"
            @click="search"
            >{{ t('placeholder.search') }}
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <div
        class="chart-cont paddingX-14"
        v-for="item in position"
        :key="item.id"
      >
        <KPIGroup
          v-if="item.type === 'kpi_in'"
          :title="t('dashboard.kpiIn')"
          type="kpi_in"
          :config="item.elements"
          :routeId="curFilter.route"
          :data="kpiData.in"
        />
        <KPIGroup
          v-if="item.type === 'kpi_out'"
          :title="t('dashboard.kpiOut')"
          type="kpi_out"
          :config="item.elements"
          :routeId="curFilter.route"
          :data="kpiData.out"
        />
        <Warning
          v-if="item.type === 'warning'"
          :config="item.elements"
          :data="warningData"
          :filter="curFilter"
        />
        <el-row :gutter="8">
          <template
            v-for="ele in item.elements"
            :key="item.type + ele.id"
          >
            <el-col
              :sm="24"
              :xl="12"
              class="mb-[8px]"
              v-if="ele.type === 'chart1'"
            >
              <ChartGroup
                :ref="el => (chartRef['chartTrafficFlow'] = el)"
                :data="dataTrafficFlow"
                color="#0078D4"
                @handle-view="getTrafficFlowChart"
                :title="t('dashboard.chartTraffic')"
                :unit="t('dashboard.vehicle')"
              />
            </el-col>
            <el-col
              :sm="24"
              :xl="12"
              class="mb-[8px]"
              v-if="ele.type === 'chart2'"
            >
              <ChartGroup
                :ref="el => (chartRef['chartRevenue'] = el)"
                :data="dataRevenue"
                color="#00BC37"
                @handle-view="getRevenueChart"
                :title="t('dashboard.chartRevenue')"
                :unit="t('dashboard.vnd')"
              />
            </el-col>
            <el-col
              :sm="24"
              :xl="12"
              class="mb-[8px]"
              v-if="ele.type === 'chart3'"
            >
              <ChartGroup
                :ref="el => (chartRef['chartTrafficForecast'] = el)"
                :data="dataTrafficForecast"
                color="#FF3B49"
                :filter-date="false"
                @handle-view="getTrafficForecastChart"
                :title="t('dashboard.chartTrafficForecast')"
                :unit="t('dashboard.vehicle')"
              />
            </el-col>
            <el-col
              :sm="24"
              :xl="12"
              class="mb-[8px]"
              v-if="ele.type === 'chart4'"
            >
              <ChartGroup
                :ref="el => (chartRef['chartRevenueForecast'] = el)"
                :data="dataRevenueForecast"
                color="#FEC318"
                :filter-date="false"
                @handle-view="getRevenueForecastChart"
                :title="t('dashboard.chartRevenueForecast')"
                :unit="t('dashboard.vnd')"
              />
            </el-col>
            <el-col
              :sm="24"
              :xl="12"
              class="mb-[8px]"
              v-if="ele.type === 'map'"
            >
              <MiniMap
                :route="routeDetail.route"
                :station="routeDetail.station"
              />
            </el-col>
            <el-col
              :sm="24"
              :xl="12"
              class="mb-[8px]"
              v-if="ele.type === 'notify'"
            >
              <div class="chart-table-group">
                <div class="chart-title">{{ t('dashboard.todo') }}</div>
                <div v-loading="loading">
                  <el-table
                    class="chart-table"
                    :data="explainList"
                    style="width: 100%"
                    height="380"
                  >
                    <el-table-column
                      :label="t('configUser.orderNumber')"
                      width="75px"
                      class-name="highlight"
                    >
                      <template #default="{ $index }">
                        <span>{{ $index + 1 }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="t('notify.content')"
                      class-name="highlight"
                    >
                      <template #default="{ row }">
                        <span>{{ row.message }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="t('configUser.time')">
                      <template #default="{ row }">
                        <span>{{ formatDateTime(row.createdAt) }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-col>
            <el-col
              :span="24"
              class="mb-[8px]"
              v-if="ele.type === 'incident'"
            >
              <div class="chart-table-group">
                <div class="chart-title">{{ t('dashboard.incident') }}</div>
                <div v-loading="loading">
                  <el-table
                    class="chart-table"
                    :data="incidentList"
                    style="width: 100%"
                    height="350"
                  >
                    <el-table-column
                      :label="t('configUser.orderNumber')"
                      width="75px"
                      class-name="highlight"
                    >
                      <template #default="{ $index }">
                        <span>{{ $index + 1 }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="t('dashboard.incidentType')"
                      class-name="highlight"
                    >
                      <template #default="{ row }">
                        <span v-if="row.type === 'MAINTENANCE'">{{
                          t('collection.incidentMaintain')
                        }}</span>
                        <span v-if="row.type === 'LANE_CONTROL'">{{
                          t('collection.incidentControl')
                        }}</span>
                        <span v-if="row.type === 'STATION_INCIDENT'">{{
                          t('collection.incidentStation')
                        }}</span>
                        <span v-if="row.type === 'TRAFFIC_JAM'">{{
                          t('collection.incidentTraffic')
                        }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="t('configUser.userManagement.route')"
                      class-name="highlight"
                    >
                      <template #default="{ row }">
                        <span>{{ row.route?.name }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="t('configUser.userManagement.station')"
                      class-name="highlight"
                    >
                      <template #default="{ row }">
                        <span>{{ row.station?.name }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="t('configUser.time')">
                      <template #default="{ row }">
                        <span>{{ formatDateTime(row.createdAt) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="t('configUser.status')">
                      <template #default="{ row }">
                        <el-tag
                          type="warning"
                          v-if="row.status === 'UNPROCESSED'"
                          class=""
                          >{{ t('dashboard.unprocessed') }}</el-tag
                        >
                        <el-tag
                          type="primary"
                          v-if="row.status === 'PROCESSING'"
                          >{{ t('dashboard.processing') }}</el-tag
                        >
                        <el-tag
                          type="success"
                          v-if="row.status === 'PROCESSED'"
                          >{{ t('dashboard.processed') }}</el-tag
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-col>
          </template>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { usePermissionStore, useRouteUser, useUserStore } from '@/store'
import { getListRoute, getListStation } from '@/api/expressway'
import {
  apiTrafficFlow,
  apiTrafficForecast,
  apiRevenue,
  apiRevenueForecast,
  apiGetKPI,
  apiGetExplainNotify,
  apiIncident,
  apiGetPosition,
  apiGetWarning,
} from '@/api/dashboard'

import ChartGauge from './components/ChartGauge.vue'
import ChartGroup from './components/ChartGroup.vue'
import { formatDate, formatDateTime } from '@/utils/date'
import moment from 'moment'
import MiniMap from './components/MiniMap.vue'
import KPIGroup from './components/KPIGroup.vue'
import Warning from './components/Warning.vue'
import { replaceQueryParamsWithObject } from '@/utils/filter'

const { roleData } = usePermissionStore()
const routeUser = useRouteUser()
const { isAdmin } = useUserStore()
const { t } = useI18n()

const router = useRouter()
const route = useRoute()

const loading = ref(true)

const filter = reactive({
  route: isAdmin ? 0 : null,
  station: null,
})

const curFilter = reactive({
  route: isAdmin ? 0 : null,
  station: null,
  routeDetail: null,
  stationDetail: null,
})

const routeLst = ref([])
const stationLst = ref([])

const getRouteList = async () => {
  const params = {
    routeIds: routeUser.routes,
  }

  await getListRoute(params).then(res => {
    routeLst.value = res?.data?.dataRows || []
    if (res?.data?.dataRows && res?.data?.dataRows.length > 0) {
      if (!isAdmin) {
        const routeId = res?.data?.dataRows[0].id
        filter.route = routeId
        curFilter.route = routeId
        handleRouteChange(routeId)
      }
      loading.value = false
    }
  })
}
const getStationList = routeId => {
  filter.station = null
  if (routeId) {
    const params = {
      routeIds: [routeId],
      stationIds: routeUser.GET_STATIONS(routeId),
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

const position = ref([])

const getPosition = async () => {
  await apiGetPosition().then(res => {
    position.value = res.data
  })
}

const search = () => {
  curFilter.route = filter.route
  curFilter.station = filter.station

  replaceQueryParamsWithObject({
    route: curFilter.route,
    station: curFilter.station,
  })

  getDashboardInfo()
}

const routeDetail = computed(() => ({
  route: routeLst.value.find(i => i.id === filter.route),
  station: stationLst.value.find(i => i.id === filter.station),
}))

const chartRef = ref({})
// const chartTrafficFlow = ref()
// const chartRevenue = ref()
// const chartTrafficForecast = ref()
// const chartRevenueForecast = ref()

const dataTrafficFlow = ref([])
const dataRevenue = ref([])
const dataTrafficForecast = ref([])
const dataRevenueForecast = ref([])
onBeforeMount(async () => {
  await getPosition()
})

onMounted(async () => {
  await getRouteList()
  filter.route = Number(route.query.route) || null
  if (filter.route) {
    handleRouteChange(filter.route)
  }
  filter.station = Number(route.query.station) || null
  curFilter.route = Number(route.query.route) || null
  curFilter.station = Number(route.query.station) || null

  const data = {
    timeType: 'day',
    startEnd: [
      moment().add(-1, 'day').startOf('month').format('YYYY-MM-DD'),
      moment().add(-1, 'day').format('YYYY-MM-DD'),
    ],
  }
  const dataForecast = {
    timeType: 'month',
    startEnd: [
      moment().startOf('month').add(-11, 'month').format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD'),
    ],
  }
  getKPI()
  getWarning()
  getIncidentNotify()
  getExplainNotify()
  getTrafficFlowChart(data)
  getTrafficForecastChart(dataForecast)
  getRevenueChart(data)
  getRevenueForecastChart(dataForecast)
})

const getDashboardInfo = () => {
  getKPI()
  getWarning()
  getIncidentNotify()
  getExplainNotify()

  Object.values(chartRef.value).forEach(ref => {
    if (ref && typeof ref.search === 'function') {
      ref.search()
    }
  })
}

const formatInput = data => {
  const startEnd = data.startEnd?.map(i => {
    const date = moment(i)
    const result = { year: date.year() }
    if (data.timeType === 'quarter') {
      result.quarter = date.quarter()
    } else if (data.timeType === 'month') {
      result.month = date.month() + 1
    } else if (data.timeType === 'day') {
      result.month = date.month() + 1
      result.day = date.date()
    }
    return result
  })
  return {
    timeUnit: data.timeType.toUpperCase(),
    startEnd,
    defaultData: data.defaultData,
  }
}
const getTrafficFlowChart = data => {
  data = formatInput(data)
  if (!data) {
    return
  }
  const params = {
    method: 'GET',
    arguments: {
      dateType: data.timeUnit,
      range: {
        from: data.startEnd[0],
        to: data.startEnd[1],
      },
      routeId: curFilter.route || null,
      stationId: curFilter.station,
    },
  }
  apiTrafficFlow(params)
    .then(res => {
      dataTrafficFlow.value = res.data
    })
    .catch(_ => {
      dataTrafficFlow.value = data.defaultData
    })
}
const getRevenueChart = data => {
  data = formatInput(data)
  if (!data) {
    return
  }
  const params = {
    method: 'GET',
    arguments: {
      dateType: data.timeUnit,
      range: {
        from: data.startEnd[0],
        to: data.startEnd[1],
      },
      routeId: curFilter.route || null,
      stationId: curFilter.station,
    },
  }

  apiRevenue(params)
    .then(res => {
      dataRevenue.value = res.data
    })
    .catch(_ => {
      dataRevenue.value = data.defaultData
    })
}
const getTrafficForecastChart = data => {
  data = formatInput(data)
  if (!data) {
    return
  }
  const params = {
    method: 'GET',
    arguments: {
      dateType: data.timeUnit,
      range: {
        from: data.startEnd[0],
        to: data.startEnd[1],
      },
      routeId: curFilter.route || null,
      stationId: curFilter.station,
    },
  }
  apiTrafficForecast(params)
    .then(res => {
      dataTrafficForecast.value = res.data
    })
    .catch(_ => {
      dataTrafficForecast.value = data.defaultData
    })
}
const getRevenueForecastChart = data => {
  data = formatInput(data)
  if (!data) {
    return
  }
  const params = {
    method: 'GET',
    arguments: {
      dateType: data.timeUnit,
      range: {
        from: data.startEnd[0],
        to: data.startEnd[1],
      },
      routeId: curFilter.route || null,
      stationId: curFilter.station,
    },
  }

  apiRevenueForecast(params)
    .then(res => {
      dataRevenueForecast.value = res.data
    })
    .catch(_ => {
      dataRevenueForecast.value = data.defaultData
    })
}

const kpiData = ref({})
const filterKPI = (data, type) => {
  const value = data.find(i => i.type === type)
  return value ? value.value * 100 : 0
}
const getKPI = () => {
  const params = {
    method: 'LIST',
    arguments: {},
  }
  if (curFilter.station) {
    params.arguments.stationId = curFilter.station
  } else {
    params.arguments.routeId = curFilter.route || null
  }
  apiGetKPI(params)
    .then(res => {
      kpiData.value = res.data
    })
    .catch(_ => {
      kpiData.value = {}
    })
}

const explainList = ref([])

const getExplainNotify = () => {
  const params = {
    method: 'LIST',
    arguments: {
      page: 0,
      size: 20,
    },
  }

  if (curFilter.station) {
    params.arguments.stationId = curFilter.station
  } else {
    params.arguments.routeId = curFilter.route || null
  }

  apiGetExplainNotify(params)
    .then(res => {
      explainList.value = res.data.data
    })
    .catch(_ => {
      explainList.value = []
    })
}

const incidentList = ref([])
const getIncidentNotify = () => {
  const params = {
    method: 'LIST',
    arguments: {
      page: 0,
      size: 20,
    },
  }
  if (curFilter.station) {
    params.arguments.stationId = curFilter.station
  } else {
    params.arguments.routeId = curFilter.route || null
  }
  apiIncident(params)
    .then(res => {
      incidentList.value = res.data.data
    })
    .catch(_ => {
      incidentList.value = []
    })
}

const warningData = ref(null)
const getWarning = () => {
  const params = {
    method: 'GET',
    arguments: {},
  }
  if (curFilter.station) {
    params.arguments.stationId = curFilter.station
  } else {
    params.arguments.routeId = curFilter.route || null
  }
  apiGetWarning(params)
    .then(res => {
      warningData.value = res.data
    })
    .catch(_ => {
      warningData.value = null
    })
}

const handleChangeTabs = activeName => {
  // Get the current URL
  const url = new URL(window.location.href)

  // Update or add the query parameter
  url.searchParams.set('tabs', activeName)
  window.history.replaceState({}, '', url)
}

defineOptions({
  name: 'Dashboard',
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.module.scss';
.wrap-on-xs {
  flex-wrap: wrap;
}

@media (min-width: 768px) {
  .wrap-on-xs {
    flex-wrap: nowrap;
  }
}

.chart-table-group {
  width: 100%;
  background: #fff;
  border: 1px solid #ebebec;
  border-radius: 2px;
  padding: 10px;
}

.chart-title {
  color: #059efb;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 8px;
}

.chart-table {
  width: 100%;
}

:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__active-bar) {
  background-color: #059efb;
  min-width: 250px;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: #cdcdce;
}

:deep(.el-tabs__item) {
  padding: 10px 0px;
  height: 45px;
  min-width: 250px;
  text-align: center;
  color: #76809b;
  background-color: #ebebec;
  border-bottom: 2px solid #cdcdce;

  &.is-active {
    background-color: #ffffff;
    color: #059efb;
    font-weight: 700;
  }
}

:deep(.hide-header) {
  background: red;
}

:deep(td.el-table__cell .cell) {
  color: $menuText;
}

:deep(td.el-table__cell.highlight .cell) {
  color: #000000;
}
</style>
