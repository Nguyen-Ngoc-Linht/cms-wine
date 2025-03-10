<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5">
      <el-input
        v-model="filter.keyword"
        @keyup.enter="getList()"
        :placeholder="t('el.transfer.filterPlaceholder')"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
      </el-input>
      <el-select
        v-model="filter.eventType"
        :placeholder="t('monitoring.errorHandling.typeEvent')"
        clearable
        filterable
        multiple
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listEventType"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="filter.status"
        :placeholder="t('configUser.status')"
        clearable
        filterable
        multiple
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listStatus"
          :key="item.value"
          :label="item.name"
          :value="item.value"
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
        v-model="filter.time"
        type="daterange"
        :start-placeholder="t('el.datepicker.startTime')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.endTime')"
        clearable
        value-format="YYYY-MM-DD HH:mm:ss"
        format="DD/MM/YYYY"
        class="w-full md:max-w-[30%] lg:max-w-[360px] flex-grow-0"
      />
      <el-button
        class="el-button--main"
        @click="searchListData()"
        >{{ t('configUser.search') }}</el-button
      >
    </div>
    <div
      v-if="roleData.canCreate"
      class="flex items-center paddingX-24 mt-4"
    >
      <el-button
        text
        size="default"
        class="!p-0"
        @click="handleAddEvent()"
      >
        <div
          class="flex items-center pointer text-[#525B73]"
          style="line-height: 20px"
        >
          <svg-icon
            icon-class="el-icon-plus"
            class="width-20 height-20 margin-right-4"
          />
          {{ t('monitoring.errorHandling.addEvent') }}
        </div>
      </el-button>
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <div class="paddingX-24 mb-4">
      <div class="px-3 py-3 bg-white">
        <TableViolation
          :listLoading="listLoading"
          :fields="fields"
          :STT="true"
          :data="listEvent"
          :page="filter.page"
          :size="filter.size"
          @show-view="handleViewEvent"
        >
          <template #name="{ row }">
            <el-tooltip
              v-if="row.name.length > 100"
              :content="row.name"
              placement="bottom"
              effect="light"
              popper-class="custom-tooltip"
            >
              <span class="text-hover">
                {{ row.name.length > 100 ? row.name.slice(0, 100) + '...' : row.name }}
              </span>
            </el-tooltip>
            <span
              v-else
              class="text-hover"
            >
              {{ row.name }}
            </span>
          </template>
          <template #route="{ row }">
            <span>{{ row.route.name }}</span>
          </template>
          <template #station="{ row }">
            <span>{{ row.station ? row.station.name : '' }}</span>
          </template>
          <template #createTime="{ row }">
            <span>{{ formatDate(row.createTime) }}</span>
          </template>
          <template #eventType="{ row }">
            <span>{{ setTypeError(row.eventType) }}</span>
          </template>
          <template #modifyTime="{ row }">
            <span>{{ formatDate(row.modifyTime) }}</span>
          </template>
          <template #statusEventType="{ row }">
            <span
              v-if="row.status === 'OPEN'"
              class="bg-outline-info text--info box-action"
              >{{ $t('configUser.open') }}</span
            >
            <span
              v-if="row.status === 'CLOSED'"
              class="bg-outline-secondary text--secondary box-action"
              >{{ $t('configUser.closed') }}</span
            >
            <span
              v-if="row.status === 'PROCESSING'"
              class="bg-outline-success text--success box-action"
              >{{ $t('configUser.processing') }}</span
            >
            <span
              v-if="row.status === 'PROCESSED'"
              class="bg-outline-warning text--warning box-action"
              >{{ t('configUser.processes') }}</span
            >
          </template>
          <template #action="{ row }">
            <el-tooltip
              :content="t('monitoring.rating.editRating')"
              v-if="row.status === 'OPEN' && roleData.canUpdate"
              placement="bottom"
              effect="light"
            >
              <span
                @click.stop="handleEditEvent(row)"
                class="delete-member pointer ms-2 me-3"
              >
                <svg-icon
                  style="width: 24px; height: 24px"
                  icon-class="edit-administrative"
                  class="mr-2"
                />
              </span>
            </el-tooltip>
            <el-tooltip
              :content="t('monitoring.errorHandling.sendEvent')"
              v-if="row.status === 'OPEN' && roleData.canNotify"
              placement="bottom"
              effect="light"
            >
              <span
                @click.stop="openSendEventDialog(row)"
                class="delete-member pointer ms-2 me-3"
              >
                <svg-icon
                  style="width: 20px; height: 20px"
                  icon-class="sendEvent"
                  class="mr-2"
                />
              </span>
            </el-tooltip>
            <el-tooltip
              :content="t('monitoring.errorHandling.updateProgress')"
              v-if="row.status === 'PROCESSING' && roleData.canExplain"
              placement="bottom"
              effect="light"
            >
              <span
                @click.stop="handleUpdateProcessEvent(row)"
                class="delete-member pointer ms-2 me-3"
              >
                <svg-icon
                  style="width: 24px; height: 24px"
                  icon-class="transform"
                  class="mr-2"
                />
              </span>
            </el-tooltip>
            <el-tooltip
              :content="t('monitoring.errorHandling.closeEvent')"
              v-if="row.status === 'PROCESSED' && row.canAction && roleData.canConfirm"
              placement="bottom"
              effect="light"
            >
              <span
                @click.stop="openCloseDialog(row)"
                class="delete-member pointer ms-2 me-3"
              >
                <svg-icon
                  style="width: 24px; height: 24px"
                  icon-class="pause"
                  class="mr-2"
                />
              </span>
            </el-tooltip>
            <el-tooltip
              :content="t('monitoring.errorHandling.deleteEvent')"
              v-if="(row.status === 'OPEN' || row.status === 'PROCESSING') && roleData.canDelete"
              placement="bottom"
              effect="light"
            >
              <span
                @click.stop="openDeleteDialog(row)"
                class="delete-member pointer ms-2 me-3"
              >
                <svg-icon
                  style="width: 24px; height: 24px"
                  icon-class="remove-administrative"
                  class="mr-2"
                />
              </span>
            </el-tooltip>
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

    <Dialog
      :show="showDialog"
      :appendToBody="true"
      :width="'682'"
      :title="titleDialog"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <SendEvent
          @closeUpdate="handleCloseDialog"
          :eventInfo="infoEvent"
        ></SendEvent>
      </template>
    </Dialog>
    <el-dialog
      v-model="showDialogDelete"
      :title="$t('monitoring.errorHandling.deleteEvent')"
      width="500"
      align-center
    >
      <span>{{ $t('monitoring.errorHandling.confirmDeleteEvent') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="showDialogDelete = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleDeleteEvent()"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="showDialogClose"
      :title="$t('monitoring.errorHandling.closeEvent')"
      width="500"
      align-center
    >
      <span>{{ $t('monitoring.errorHandling.confirmCloseEvent') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="showDialogClose = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleCloseEvent()"
          >
            {{ $t('configUser.closed') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import Pagination from '@/components/Pagination/index.vue'
import TableViolation from '@/components/Table/index.vue'
import SendEvent from '@/views/monitoring/error-handling/sendEvent.vue'
import Dialog from '@/components/Dialog/index.vue'
import { cloneDeep } from 'lodash-unified'
import { useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { usePermissionStore, useRouteUser, useUserStore } from '@/store'
import { getListRoute, getListStation } from '@/api/expressway'
import { apiCloseEvent, apiDeleteEvent, apiGetListEvent } from '@/api/errorHandling'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()

const defaultFilter = {
  page: 1,
  size: 10,
  status: [],
  keyword: '',
  routeId: '',
  stationId: '',
  eventType: [],
  time: [],
  total: 0,
}
const filter = reactive(cloneDeep(defaultFilter))
const showDialog = ref(false)
const showDialogDelete = ref(false)
const showDialogClose = ref(false)
const titleDialog = ref(t('monitoring.errorHandling.sendEvent'))
const fields = ref([
  {
    key: 'name',
    label: t('monitoring.errorHandling.nameEvent'),
    prop: 'name',
  },
  {
    key: 'eventType',
    label: t('monitoring.errorHandling.typeEvent'),
    prop: 'eventType',
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
    key: 'createBy',
    label: t('monitoring.requestProcessingETC.creator'),
    prop: 'createBy',
  },
  {
    key: 'createTime',
    label: t('monitoring.requestProcessingETC.dateCreate'),
    prop: 'createTime',
    width: 120,
  },
  {
    key: 'modifyTime',
    label: t('monitoring.requestProcessingETC.dateUpdate'),
    prop: 'modifyTime',
    width: 120,
  },
  {
    key: 'statusEventType',
    label: t('configUser.status'),
    prop: 'statusEventType',
  },
  {
    key: 'action',
    label: t('configUser.action'),
    prop: 'action',
  },
])
const listLoading = ref(false)
const listRoute = ref([])
const listStation = ref([])
const listStatus = ref([
  {
    key: 0,
    name: t('configUser.open'),
    value: 0,
  },
  {
    key: 1,
    name: t('configUser.processing'),
    value: 1,
  },
  {
    key: 2,
    name: t('configUser.processes'),
    value: 2,
  },
  {
    key: 3,
    name: t('configUser.closed'),
    value: 3,
  },
])
const listEventType = ref([
  {
    id: 0,
    label: t('monitoring.errorHandling.maintenancePlan'),
    value: 0,
  },
  {
    id: 1,
    label: t('monitoring.errorHandling.periodicInspectionAndAcceptancePlan'),
    value: 1,
  },
  {
    id: 2,
    label: t('monitoring.errorHandling.monitoringAndEvaluationPlan'),
    value: 2,
  },
  {
    id: 3,
    label: t('monitoring.errorHandling.reportProblem'),
    value: 3,
  },
])
const listEvent = ref([])
const infoEvent = ref({})

onMounted(() => {
  setDataDefault()
  getList()
})

const getList = async () => {
  listLoading.value = true
  const params = {
    keyword: filter.keyword,
    page: filter.page,
    size: filter.size,
    status: filter.status,
    station: filter.stationId,
    eventType: filter.eventType,
    route: filter.routeId,
    startTime: filter.time && filter.time.length > 0 ? filter.time[0] : '',
    endTime: filter.time && filter.time.length > 0 ? filter.time[1] : '',
  }
  const rs = await apiGetListEvent(params)
  if (rs.status === 200) {
    listEvent.value = rs.data.dataRows
    filter.total = rs.data.totalCount
  }
  listLoading.value = false
}
const setDataDefault = async () => {
  const params = {
    routeIds: routeUser.routes,
  }
  const rs = await getListRoute(params)
  if (rs.status === 200) {
    listRoute.value = rs.data.dataRows
  }
}
const handleAddEvent = () => {
  if (roleData.canCreate) {
    router.push(`/monitoring/error-handling-view`)
  }
}
const handleEditEvent = data => {
  if (roleData.canUpdate) {
    router.push(`/monitoring/error-handling-view/${data.id}`)
  }
}
const handleUpdateProcessEvent = data => {
  if (roleData.canExplain) {
    router.push(`/monitoring/update-process-event/${data.id}`)
  }
}
const handleViewEvent = data => {
  if (roleData.canRead) {
    router.push(`/monitoring/event/${data.id}`)
  }
}
const handleDeleteEvent = async () => {
  const event_id = infoEvent.value.id
  if (event_id && roleData.canDelete) {
    const rs = await apiDeleteEvent(event_id)
    if (rs.status === 200) {
      ElMessage({
        message: t('omsSetting.deleteSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      await getList()
      showDialogDelete.value = false
    } else {
      ElMessage({
        message: t('el.image.error'),
        type: 'error',
        duration: 3 * 1000,
      })
    }
  }
  showDialogDelete.value = false
}
const handleCloseEvent = async () => {
  const event_id = infoEvent.value.id
  if (event_id) {
    const rs = await apiCloseEvent(event_id)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      showDialogClose.value = false
      getList()
    }
  }
}
const searchListData = () => {
  getList()
}
const setListStation = async routeId => {
  listStation.value = []
  filter.stationId = ''
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
const openDeleteDialog = data => {
  infoEvent.value = data
  showDialogDelete.value = true
}
const openCloseDialog = data => {
  infoEvent.value = data
  showDialogClose.value = true
}
const openSendEventDialog = data => {
  console.log(data)
  infoEvent.value = data
  showDialog.value = true
}
const handleCloseDialog = () => {
  showDialog.value = false
  getList()
}
const setTypeError = type => {
  switch (type) {
    case 0:
      return t('monitoring.errorHandling.maintenancePlan')
    case 1:
      return t('monitoring.errorHandling.periodicInspectionAndAcceptancePlan')
    case 2:
      return t('monitoring.errorHandling.monitoringAndEvaluationPlan')
    case 3:
      return t('monitoring.errorHandling.reportProblem')
    default:
      return ''
  }
}
const formatDate = dateString => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
</script>

<style lang="scss" scoped>
.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}

.box-action {
  height: 24px;
  padding: 2px 10px;
}
</style>
