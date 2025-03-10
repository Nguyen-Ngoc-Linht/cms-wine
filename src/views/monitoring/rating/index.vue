<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5">
      <el-input
        v-model="filter.keyword"
        @keyup.enter="getList"
        :placeholder="t('el.transfer.filterPlaceholder')"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
      </el-input>
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
        v-model="filter.timeSearch"
        type="daterange"
        :start-placeholder="t('el.datepicker.startTime')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.endTime')"
        clearable
        value-format="YYYY-MM-DD"
        format="DD/MM/YYYY"
        @change="handleDateChange"
        class="w-full md:max-w-[30%] lg:max-w-[360px] flex-grow-0"
      />
      <el-button
        class="el-button--main"
        @click="searchListRating()"
        >{{ t('configUser.search') }}</el-button
      >
    </div>
    <div class="flex items-center paddingX-24 mt-4">
      <el-button
        v-if="roleData.canCreate"
        text
        size="default"
        class="!p-0"
        @click="handleAddReview()"
      >
        <div
          class="flex items-center pointer text-[#525B73]"
          style="line-height: 20px"
        >
          <svg-icon
            icon-class="el-icon-plus"
            class="width-20 height-20 margin-right-4"
          />
          {{ t('monitoring.rating.addRating') }}
        </div>
      </el-button>
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <div class="paddingX-24 mb-4">
      <div class="px-3 py-3 bg-white">
        <TableViolation
          :listLoading="listLoading"
          :data="listRating"
          :fields="fields"
          :selectRow="false"
          :STT="true"
          :page="filter.page"
          :size="filter.size"
          @show-view="handleViewRating"
        >
          <template #title="{ row }">
            <el-tooltip
              v-if="row.title.length > 100"
              :content="row.title"
              placement="bottom"
              effect="light"
              popper-class="custom-tooltip"
            >
              <span class="text-hover">
                {{ row.title.length > 100 ? row.title.slice(0, 100) + '...' : row.title }}
              </span>
            </el-tooltip>
            <span
              v-else
              class="text-hover"
            >
              {{ row.title }}
            </span>
          </template>
          <template #route="{ row }">
            <span>{{ row.route.name }}</span>
          </template>
          <template #station="{ row }">
            <span>{{ row.station.name }}</span>
          </template>
          <template #createTime="{ row }">
            <span>{{
              formatDate(row.scoringWeek.startDate) + ' - ' + formatDateAdd(row.scoringWeek.endDate)
            }}</span>
          </template>
          <template #modifyTime="{ row }">
            <span>{{ formatDate(row.modifyTime) }}</span>
          </template>
          <template #operation="{ row }">
            <span
              @click.stop="editRating(row)"
              v-if="roleData.canUpdate && checkShowEdit(row)"
              class="delete-member pointer ms-2 me-3"
            >
              <svg-icon
                style="width: 24px; height: 24px"
                icon-class="edit-administrative"
                class="mr-2"
              />
            </span>
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
    <!--    -->
    <el-dialog
      v-model="deleteRatingDialog"
      :title="$t('configUser.deleteFareTable')"
      width="500"
      align-center
    >
      <span>{{ $t('omsSetting.confirmDelete') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="deleteRatingDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleDeleteRating()"
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
import { dayjs } from 'element-plus'
import TableViolation from '@/components/Table/index.vue'
import { getListRating } from '@/api/rating'
import { cloneDeep } from 'lodash-unified'
import { useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { getListRoute, getListStation } from '@/api/expressway'
import { usePermissionStore, useUserStore, useRouteUser } from '@/store'

const { t } = useI18n()
const router = useRouter()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()
const userStore = useUserStore()

const defaultFilter = {
  page: 1,
  size: 10,
  criteriaGroup: '',
  keyword: '',
  routeId: null,
  stationId: null,
  timeSearch: [],
  total: 0,
}
const filter = reactive(cloneDeep(defaultFilter))
const listLoading = ref(false)
const fields = ref([
  {
    key: 'title',
    label: t('monitoring.rating.title'),
    prop: 'title',
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
    key: 'createTime',
    label: t('monitoring.rating.timeRating'),
    prop: 'createTime',
  },
  {
    key: 'modifyTime',
    label: t('weightVehicle.updateTime'),
    prop: 'modifyTime',
    width: 150,
  },
  {
    key: 'totalScore',
    label: t('monitoring.rating.totalPoint'),
    prop: 'totalScore',
    width: 100,
  },
  {
    key: 'operation',
    label: t('configUser.operation'),
    prop: 'operation',
    width: 100,
  },
])
const deleteRatingDialog = ref(false)
const listRating = ref([])
const infoRating = ref({})
const listRoute = ref([])
const listStation = ref([])

onMounted(() => {
  initializeDateRange()
  setData()
  getList()
})

const initializeDateRange = () => {
  const today = dayjs().format('YYYY-MM-DD')
  const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD')

  filter.startTime = `${firstDayOfMonth} 00:00:00`
  filter.endTime = `${today} 23:59:59`
  filter.timeSearch = [dayjs(firstDayOfMonth), dayjs(today)]
}
const setData = async () => {
  const params = {
    routeIds: routeUser.routes,
  }
  const rs = await getListRoute(params)
  if (rs.status === 200) {
    listRoute.value = rs.data.dataRows
  }
}
const getList = async () => {
  listLoading.value = true
  const params = {
    pageIndex: filter.page,
    pageSize: filter.size,
    title: filter.keyword,
    routeId: filter.routeId,
    stationId: filter.stationId,
    startDate: filter.startTime,
    endDate: filter.endTime,
  }
  const rs = await getListRating(params)
  if (rs.status === 200) {
    listRating.value = rs.data.content
    listLoading.value = false
    filter.total = rs.data.totalElements
  }
}

const handleAddReview = () => {
  router.push(`/monitoring/rating/add`)
}
const handleViewRating = data => {
  router.push(`/monitoring/rating/view/${data.id}`)
}
const editRating = data => {
  router.push(`/monitoring/rating/edit/${data.id}`)
}
const handleDeleteRating = async data => {}
const openDialogDelete = async row => {
  infoRating.value = true
  deleteRatingDialog.value = true
}
const searchListRating = () => {
  getList()
}
const setListStation = async routeId => {
  listStation.value = []
  filter.stationId = null
  const params = {
    page: 1,
    size: 20,
    keyword: '',
    routeIds: [routeId],
    stationIds: [],
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
const handleSizeChange = size => {
  filter.size = size
  getList()
}
const handlePageChange = page => {
  filter.page = page
  getList()
}
const formatDate = dateStr => {
  if (dateStr && dateStr !== '') {
    return dayjs(dateStr).format('DD/MM/YYYY')
  } else {
    return ''
  }
}
const formatDateAdd = dateStr => {
  if (dateStr && dateStr !== '') {
    return dayjs(dateStr).add(1, 'day').format('DD/MM/YYYY')
  } else {
    return ''
  }
}
const handleDateChange = dates => {
  if (dates && dates.length === 2) {
    const [startTime, endTime] = dates
    const formattedStartTime = `${startTime} 00:00:00`
    const formattedEndTime = `${endTime} 23:59:59`

    filter.startTime = formattedStartTime
    filter.endTime = formattedEndTime
  } else {
    filter.startTime = null
    filter.endTime = null
  }
}

const checkShowEdit = data => {
  return data.createdBy === userStore.uuid
}
</script>

<style lang="scss" scoped>
.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}

.custom-tooltip .el-popper {
  max-width: 90vh;
}
</style>

<style lang="scss">
.el-popper {
  --el-popper-border-radius: var(--el-popover-border-radius, 4px);
  position: absolute;
  border-radius: var(--el-popper-border-radius);
  padding: 5px 11px;
  z-index: 2000;
  font-size: 12px;
  line-height: 20px;
  min-width: 10px;
  max-width: 90vh;
  word-wrap: break-word;
  visibility: visible;
}
</style>
