<template>
  <div
    class="flex flex-wrap gap-px-8 paddingX-24 padding-top-14"
    :class="{ 'padding-bottom-14': !roleData.canDelete }"
  >
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
      class="w-full md:max-w-[30%] lg:max-w-[270px] flex-grow-0 height-32"
      clearable
    />
    <el-button
      class="fs-14 height-32 el-button--main rounded-[2px]"
      @click="search"
      >{{ t('placeholder.search') }}
    </el-button>
    <div
      v-if="roleData.canDelete && listSelect.length > 0"
      class="ml-auto flex-shrink-0 flex justify-end items-center"
    >
      <span class="delete-member pointer mx-1">
        <svg-icon
          style="width: 24px; height: 24px"
          icon-class="remove-administrative"
          @click="handleDelete"
          v-loading="processing"
        />
      </span>
      <h4 class="mb-0">{{ t('configUser.selected') }}: {{ listSelect.length }}</h4>
    </div>
  </div>
  <hr class="margin-bottom-12 mt-4" />
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
      >
        <el-table-column
          align="center"
          type="selection"
          width="40"
          label="#"
          :selectable="canSelectRow"
          v-if="roleData.canDelete"
        />
        <el-table-column
          :label="t('configUser.orderNumber')"
          width="70px"
        >
          <template #default="{ $index }">
            <span>{{ (filter.page - 1) * filter.size + $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('administration.backup.fileName')">
          <template #default="{ row }">
            <span>{{ row.fileName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('administration.backup.folder')">
          <template #default="{ row }">
            <span>{{ row.pathFolder }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('configUser.route')">
          <template #default="{ row }">
            <span>{{ row.routeName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('configUser.station')">
          <template #default="{ row }">
            <span>{{ row.stationName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('collection.time')">
          <template #default="{ row }">
            <span>{{ formatDateTime(row.createTime) }}</span>
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
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue'
import moment from 'moment/moment'
import { useI18n } from '@/locale'
import { usePermissionStore, useRouteUser } from '@/store'
import { cloneDeep } from 'lodash-unified'
import { getListRoute, getListStation } from '@/api/expressway'
import { apiGetCollect, apiDeleteCollect } from '@/api/collect'
import { formatDateTime } from '@/utils/date'
import { formatNumber } from '@/utils'
import Pagination from '@/components/Pagination'
import { ElMessageBox, ElMessage } from 'element-plus'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()

const defaultFilter = {
  page: 1,
  size: 15,
  route: null,
  station: null,
  startEnd: [moment().add(-7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
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

const dataList = ref([])
const totalValue = ref(0)
const listLoading = ref(true)
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
    type: 5,
    pageNumber: page,
    pageSize: size,
    startDate:
      filter.startEnd && filter.startEnd.length > 0
        ? moment(startEnd[0]).format('YYYY-MM-DDTHH:mm:ss')
        : null,
    endDate:
      filter.startEnd && filter.startEnd.length > 0
        ? moment(startEnd[1]).format('YYYY-MM-DDTHH:mm:ss')
        : null,
  }
  listLoading.value = true
  apiGetCollect(data)
    .then(res => {
      dataList.value = res.data
      totalValue.value = res.total
    })
    .catch(_ => {
      dataList.value = []
      totalValue.value = 0
    })
    .finally(_ => {
      listLoading.value = false
    })
}

const listSelect = ref([])
const canSelectRow = () => {
  return roleData.canDelete
}
const handleSelectionChange = rows => {
  listSelect.value = rows
}
const processing = ref(false)
const handleDelete = () => {
  if (processing.value) {
    return
  }
  ElMessageBox.confirm(t('omsSetting.confirmMultiDelete'), {
    confirmButtonText: t('omsSetting.confirm'),
    cancelButtonText: t('omsSetting.cancel'),
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  })
    .then(() => {
      const data = {
        ids: listSelect.value.map(val => val.id),
      }
      processing.value = true
      apiDeleteCollect(data)
        .then(res => {
          getList()
          ElMessage({
            type: 'success',
            message: t('omsSetting.deleteSuccess1'),
          })
        })
        .catch(_ => {
          ElMessage({
            type: 'error',
            message: t('omsSetting.failDelete'),
          })
        })
        .finally(_ => {
          processing.value = false
        })
    })
    .catch(() => {})
}
onBeforeMount(() => {
  getRouteList()
})
onMounted(() => {
  getList()
})
defineOptions({
  name: 'FELogfileList',
})
</script>

<style scoped></style>
