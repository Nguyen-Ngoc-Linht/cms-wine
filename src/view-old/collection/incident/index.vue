<template>
  <div>
    <div class="flex flex-wrap gap-px-8 paddingX-24 padding-top-14 margin-bottom-10">
      <el-select
        v-model="filter.type"
        class="w-full md:max-w-[30%] lg:max-w-[200px] height-32"
        :placeholder="t('collection.incidentType')"
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
      <el-select
        v-model="filter.status"
        class="w-full md:max-w-[30%] lg:max-w-[200px] height-32"
        :placeholder="t('omsSetting.status')"
        clearable
      >
        <el-option
          v-for="item in listStatus"
          :key="item.code"
          :label="item.name"
          :value="item.code"
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
          @click="handleAdd()"
        >
          <div class="text-gray flex items-center">
            <svg-icon
              icon-class="el-icon-plus"
              class="width-20 height-20 margin-right-4"
            />
            {{ t('collection.addIncident') }}
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
        >
          <el-table-column
            :label="t('configUser.orderNumber')"
            width="75px"
            class-name="highlight"
          >
            <template #default="{ $index }">
              <span>{{ (filter.page - 1) * filter.size + $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('collection.incidentType')"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span v-if="row.type === 'MAINTENANCE'">{{ t('collection.incidentMaintain') }}</span>
              <span v-if="row.type === 'LANE_CONTROL'">{{ t('collection.incidentControl') }}</span>
              <span v-if="row.type === 'STATION_INCIDENT'">{{
                t('collection.incidentStation')
              }}</span>
              <span v-if="row.type === 'TRAFFIC_JAM'">{{ t('collection.incidentTraffic') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.route')"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span>{{ row.route?.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.station')"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span>{{ row.station?.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('collection.time')">
            <template #default="{ row }">
              <span>{{ formatDateTime(row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.status')">
            <template #default="{ row }">
              <span>
                <el-tag
                  v-if="row.status === 'PROCESSED'"
                  type="success"
                  >{{ t('configUser.processed') }}</el-tag
                >
                <el-tag
                  v-if="row.status === 'PROCESSING'"
                  type="primary"
                  >{{ t('configUser.processing') }}</el-tag
                >
                <el-tag
                  v-if="row.status === 'UNPROCESSED'"
                  type="warning"
                  >{{ t('configUser.unprocessed') }}</el-tag
                >
              </span>
            </template>
          </el-table-column>

          <el-table-column
            :label="t('configUser.action')"
            v-if="roleData.canUpdate || roleData.canDelete"
          >
            <template #default="{ row }">
              <div class="flex flex-wrap items-center gap-px-8">
                <div
                  class="pointer"
                  @click.stop="handleEdit(row)"
                  v-if="row.status !== 'PROCESSED' && roleData.canUpdate"
                >
                  <svg-icon
                    icon-class="edit-administrative"
                    class="width-24 height-24"
                  />
                </div>
                <div
                  class="pointer"
                  @click.stop="confirmDelete(row)"
                  v-if="roleData.canDelete"
                >
                  <svg-icon
                    icon-class="remove-administrative"
                    class="width-24 height-24"
                  />
                </div>
              </div>
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
      <FormIncident
        v-if="roleData.canUpdate || roleData.canCreate"
        :dialog-visible="showModalForm"
        :is-create="createForm"
        :type-lst="listType"
        :route-lst="routeLst"
        :select-value="selectValue"
        @handleClose="handleClose"
        @handleSuccess="handleSuccess"
      />
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
import { formatDateTime } from '@/utils/date'
import { formatNumber } from '@/utils'
import Pagination from '@/components/Pagination'
import FormIncident from './components/form-incident.vue'
import { apiIncident, apiGetListStatus } from '@/api/dashboard'
import { ElMessageBox, ElMessage } from 'element-plus'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()

const defaultFilter = {
  page: 1,
  size: 15,
  type: null,
  route: null,
  station: null,
  status: null,
  startEnd: [moment().add(-7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
}

const filter = reactive(cloneDeep(defaultFilter))
const loading = ref(true)

const listType = ref([
  {
    label: t('collection.incidentMaintain'),
    value: 'MAINTENANCE',
  },
  {
    label: t('collection.incidentControl'),
    value: 'LANE_CONTROL',
  },
  {
    label: t('collection.incidentStation'),
    value: 'STATION_INCIDENT',
  },
  {
    label: t('collection.incidentTraffic'),
    value: 'TRAFFIC_JAM',
  },
])
const routeLst = ref([])
const stationLst = ref([])
const listStatus = ref([])
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
      stationIds: [],
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
  const { page, size, type, route, station, startEnd, status } = filter

  const params = {
    method: 'LIST',
    arguments: {
      page: page - 1,
      size,
      type,
      routeId: route,
      stationId: station,
      status,
      range: {
        from: startEnd[0],
        to: startEnd[1],
      },
    },
  }
  apiIncident(params)
    .then(res => {
      dataList.value = res.data.data
      totalValue.value = res.data.totalItems
    })
    .catch(_ => {
      dataList.value = []
      totalValue.value = 0
    })
    .finally(_ => {
      listLoading.value = false
    })
}
const showModalForm = ref(false)
const createForm = ref(false)
const selectValue = ref(null)

const handleAdd = () => {
  createForm.value = true
  showModalForm.value = true
}

const handleEdit = row => {
  createForm.value = false
  selectValue.value = row
  showModalForm.value = true
}

const processing = ref(false)
const confirmDelete = row => {
  if (processing.value) {
    return
  }
  ElMessageBox.confirm(
    t('configUser.message.confirmDelete', [t('collection.incident').toLowerCase()]),
    t('omsSetting.warning'),
    {
      confirmButtonText: t('omsSetting.confirm'),
      cancelButtonText: t('omsSetting.cancel'),
      confirmButtonClass: 'el-button--main',
      cancelButtonClass: 'el-button--secondary',
      buttonSize: 'default',
    }
  ).then(res => {
    handleDelete(row)
  })
}

const handleDelete = row => {
  const data = {
    method: 'DELETE',
    arguments: {
      incidentId: row.id,
    },
  }
  processing.value = true
  apiIncident(data)
    .then(res => {
      getList()
      ElMessage({
        type: 'success',
        message: t('omsSetting.deleteSuccess1'),
      })
      handleClose()
    })
    .catch(_ => {
      ElMessage({
        message: t('omsSetting.failDelete'),
        type: 'error',
      })
    })
    .finally(_ => {
      processing.value = false
    })
}

const handleSuccess = () => {
  getList()
}
const handleClose = () => {
  showModalForm.value = false
}

const handleGetListStatus = () => {
  const params = {
    method: 'LIST',
  }
  apiGetListStatus(params)
    .then(res => {
      if (res.status === 200) {
        listStatus.value = res.data
      }
    })
    .catch(err => {
      console.log(err)
    })
}

onMounted(() => {
  getList()
  handleGetListStatus()
})

onBeforeMount(() => {
  getRouteList()
})

defineOptions({
  name: 'CollectionIncident',
})
</script>

<style scoped>
:deep(td.el-table__cell .cell) {
  color: #76809b;
}

:deep(td.el-table__cell.highlight .cell) {
  color: #000000;
}
</style>
