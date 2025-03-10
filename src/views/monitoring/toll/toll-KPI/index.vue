<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5">
      <el-select
        v-model="filter.laneType"
        :placeholder="t('configUser.typeLane')"
        class="width-200 height-32"
        @change="handleTypeChange"
      >
        <el-option
          value="in"
          :label="t('configUser.laneIn')"
        ></el-option>
        <el-option
          value="out"
          :label="t('configUser.laneOut')"
        ></el-option>
      </el-select>
      <el-select
        v-model="filter.routeIds"
        @change="handleRouteChange"
        :placeholder="t('configUser.gland')"
        clearable
        filterable
        class="width-200 height-32"
        multiple
        collapse-tags
        collapse-tags-tooltip
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
        :placeholder="t('configUser.station')"
        clearable
        filterable
        multiple
        collapse-tags
        collapse-tags-tooltip
        class="width-200 height-32"
        @change="handleStationChange"
        :disabled="filter.routeIds?.length !== 1"
      >
        <el-option
          v-for="item in stationLst"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="filter.laneIds"
        :placeholder="t('configUser.numberLane')"
        clearable
        filterable
        multiple
        collapse-tags
        collapse-tags-tooltip
        class="width-200 height-32"
        :disabled="filter.station?.length !== 1"
      >
        <template
          v-for="station in stationLaneLst"
          :key="station.stationId"
        >
          <el-option
            v-for="item in station.lanes"
            :key="item.id"
            :label="item.number"
            :value="item.id"
          />
        </template>
      </el-select>
      <el-date-picker
        v-model="filter.timeSearch"
        type="daterange"
        :start-placeholder="t('el.datepicker.startTime')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.endTime')"
        :clearable="false"
        value-format="YYYY-MM-DD"
        format="DD/MM/YYYY"
        class="w-full md:max-w-[30%] lg:max-w-[300px] flex-grow-0"
      />
      <el-button
        @click="getList"
        class="el-button--main"
        >{{ t('configUser.search') }}</el-button
      >
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <div class="paddingX-24 mb-4">
      <div class="p-3 bg-white">
        <el-table
          ref="multipleTable"
          :data="dataList"
          style="width: 100%"
          max-height="720"
          v-loading="listLoading"
          :row-class-name="showRowName"
          :span-method="spanMethod"
        >
          <el-table-column
            :label="t('dateTime.day')"
            property="rptDate"
            width="180"
            class-name="date-col highlight"
          >
            <template #default="{ row }">
              <span>{{ formatDate(row.rptDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.userManagement.routeStation')"
            class-name="route highlight"
          >
            <template #default="{ row }">
              <template v-if="row.isRoute">
                <div
                  class="flex items-center cursor-pointer"
                  @click="collapseRow(row.key, row.isShow)"
                >
                  <el-icon
                    class="expand"
                    :class="{ expanded: row.isShow }"
                  >
                    <ArrowDown />
                  </el-icon>
                  <span>{{ row.routeName }}</span>
                </div>
              </template>
              <template v-else>
                <div class="pl-2">
                  <span>{{ row.routeName }}</span>
                </div>
              </template>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.toll.terminalCardRecognitionRate')">
            <template #default="{ row }">
              <span>{{ row.ratioTagDetect || 0 }}%</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.toll.licensePlateRecognitionRate')">
            <template #default="{ row }">
              <span>{{ row.ratioPlateDetect || 0 }}%</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.toll.tollCollectionSystem')">
            <template #default="{ row }">
              <span>{{ row.etcRevenueKPI || 0 }}%</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.toll.vehicleDetectionRate')">
            <template #default="{ row }">
              <span>{{ row.vehicleDetectionRate || 0 }}%</span>
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
import { onBeforeMount, onMounted, reactive, ref } from 'vue'
import Pagination from '@/components/Pagination/index.vue'
import { dayjs, ElMessage } from 'element-plus'
import { getListTollKPI } from '@/api/toll'
import { useI18n } from '@/locale'
import { cloneDeep } from 'lodash-unified'
import { getListRoute, getListStation, apiGetLaneStation } from '@/api/expressway'
import { usePermissionStore, useRouteUser } from '@/store'
import moment from 'moment'
import { formatDate } from '@/utils/date'
import { ArrowDown } from '@element-plus/icons-vue'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()

const listLoading = ref(false)
const defaultFilter = {
  page: 1,
  size: 10,
  total: 0,
  laneType: 'in',
  routeIds: [],
  station: [],
  laneIds: [],
  timeSearch: [
    moment().add(-7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  ],
}
const filter = reactive(cloneDeep(defaultFilter))
const routeLst = ref([])
const stationLst = ref([])
const stationLaneLst = ref([])
const dataList = ref([])

onBeforeMount(() => {
  getRouteList()
})

const getRouteList = async () => {
  const params = {
    routeIds: routeUser.routes,
  }
  await getListRoute(params).then(res => {
    routeLst.value = res?.data?.dataRows || []
  })
}
const getStationList = routeIds => {
  stationLst.value = []

  if (routeIds?.length) {
    const params = {
      routeIds,
      stationIds: [],
    }
    getListStation(params).then(res => {
      stationLst.value = res?.data?.dataRows || []
    })
  }
}
const handleTypeChange = type => {
  getLaneList(filter.station, type)
}
const handleRouteChange = routeIds => {
  filter.laneIds = []
  filter.station = []
  stationLaneLst.value = []
  getStationList(routeIds)
}

const getLaneList = (stationIds, type) => {
  filter.laneIds = []
  stationLaneLst.value = []

  if (stationIds && stationIds.length > 0) {
    const params = {
      stationIds,
      type,
    }
    apiGetLaneStation(params).then(res => {
      stationLaneLst.value = res.data
    })
  }
}
const handleStationChange = stationIds => {
  getLaneList(stationIds, filter.laneType)
}

const getStationLaneSelect = () => {
  return stationLaneLst.value
    .map(station => {
      const filteredLanes = station.lanes
        .filter(lane => filter.laneIds?.includes(lane.id))
        .map(lane => lane.id)

      return {
        stationId: station.stationId,
        laneIds: filteredLanes,
      }
    })
    .filter(station => filter.station?.includes(station.stationId) || station.laneIds.length > 0)
}

const getList = async () => {
  if (listLoading.value) return

  const { laneType, routeIds, timeSearch, page, size } = filter
  const params = {
    page: page - 1,
    size,
    laneType,
    routeIds,
    stations: getStationLaneSelect(),
    startDate: moment(timeSearch[0]).format('YYYY-MM-DDTHH:mm:ss'),
    endDate: moment(timeSearch[1]).format('YYYY-MM-DDTHH:mm:ss'),
  }
  listLoading.value = true
  getListTollKPI(params)
    .then(res => {
      dataList.value = formatInput(res.data.data)
      filter.total = res.data.total
    })
    .catch(_ => {
      dataList.value = []
      filter.total = 0
    })
    .finally(() => {
      listLoading.value = false
    })
}

const formatInput = data => {
  const formatData = []
  data?.forEach((val, idx) => {
    const { stationKpis, ...infoRoute } = val
    formatData.push({
      ...infoRoute,
      isRoute: true,
      isShow: false,
      hasChild: stationKpis?.length > 0,
      key: idx,
    })
    stationKpis.forEach(s => {
      formatData.push({
        ...s,
        rptDate: val.rptDate,
        routeName: s.stationName,
        isRoute: false,
        isShow: false,
        hasChild: false,
        key: idx,
      })
    })
  })
  return formatData
}

const collapseRow = (key, isShow) => {
  dataList.value.forEach(i => {
    if (i.key === key) {
      i.isShow = !isShow
    }
  })
}
const showRowName = ({ row }) => {
  if (row.isRoute) return 'row-route'
  else if (!row.isShow) return 'hidden'
}

const spanMethod = ({ row, column, rowIndex }) => {
  if (column.property === 'rptDate') {
    const isFirst = rowIndex === 0 || dataList.value[rowIndex - 1].rptDate !== row.rptDate
    if (isFirst) {
      let showRows = 1
      for (let i = rowIndex + 1; i < dataList.value.length; i++) {
        const val = dataList.value[i]
        if (val.rptDate !== row.rptDate) break
        if (val.isRoute || val.isShow) showRows++
      }
      return [showRows, 1]
    } else {
      return [0, 0]
    }
  }
  return [1, 1]
}
const handleSizeChange = size => {
  filter.size = size
  getList()
}
const handlePageChange = page => {
  filter.page = page
  getList()
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.el-checkbox__input.is-checked .el-checkbox__inner {
  border-color: #059efb;
}

.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #059efb;
  font-weight: 700;
}

.expand {
  cursor: pointer;
  width: 1.1em;
  height: 1.1em;
  margin: 0 10px;
  transition: ease-in-out 0.2s;

  svg {
    width: 1.1em;
    height: 1.1em;
  }
}

.expanded {
  transform: rotate(-180deg);
}

:deep(.el-table .row-route .route.el-table__cell span) {
  font-weight: 500;
}

:deep(.el-table .row-route .date-col.el-table__cell) {
  border-right: var(--el-table-border);
  border-left: var(--el-table-border);
}

:deep(td.el-table__cell .cell) {
  color: #76809b;
}
:deep(td.el-table__cell.highlight .cell) {
  color: #000000;
}
</style>
