<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5">
      <el-input
        v-model="filter.keyword"
        :placeholder="t('el.transfer.filterPlaceholder')"
        @keyup.enter="getList"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
      </el-input>
      <el-select
        v-model="filter.errorType"
        :placeholder="t('monitoring.requestProcessingETC.typeError')"
        clearable
        filterable
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listTypeError"
          :key="item.id"
          :label="item.name"
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
          :key="item.id"
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
        v-model="filter.startEnd"
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
        @click="searchListData()"
        class="el-button--main"
      >{{ t('configUser.search') }}
      </el-button
      >
    </div>
    <div
      v-if="roleData.canCreate"
      class="flex items-center paddingX-24 gap-x-5 mt-4"
    >
      <el-button
        text
        @click="handleAddRequestProcessing()"
        size="default"
        class="!p-0"
      >
        <div
          class="flex items-center pointer text-[#525B73]"
          style="line-height: 20px"
        >
          <svg-icon
            icon-class="el-icon-plus"
            class="width-20 height-20 margin-right-4"
          />
          {{ t('monitoring.requestProcessingETC.addNewRequest') }}
        </div>
      </el-button>
    </div>
    <hr class="margin-bottom-12 mt-2"/>
    <div
      v-if="roleData.canRead"
      class="paddingX-24 mb-4"
    >
      <div class="px-3 py-3 bg-white">
        <TableViolation
          :fields="fields"
          :listLoading="listLoading"
          :data="listRequestProcessing"
          :selectRow="false"
          :STT="true"
          :page="filter.page"
          :size="filter.size"
          @show-view="handleViewRequestProcessing"
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
            <span v-else>
              {{ row.name }}
            </span>
          </template>
          <template #status="{ row }">
            <span
              v-if="row.status === 0"
              class="bg-outline-info text--info box-action"
            >{{ t('configUser.open') }}</span
            >
            <span
              v-if="row.status === 3"
              class="bg-outline-secondary text--secondary box-action"
            >{{ t('configUser.closed') }}</span
            >
            <span
              v-if="row.status === 1"
              class="bg-outline-success text--success box-action"
            >{{ t('configUser.processing') }}</span
            >
            <span
              v-if="row.status === 2"
              class="bg-outline-warning text--warning box-action"
            >{{ t('configUser.processes') }}</span
            >
          </template>
          <template #errorType="{ row }">
            <span>
              {{ setDataErrorType(row.errorType) }}
            </span>
          </template>
          <template #route="{ row }">
            <span>
              {{ row.route.name }}
            </span>
          </template>
          <template #station="{ row }">
            <span>
              {{ row.station.name }}
            </span>
          </template>
          <template #createTime="{ row }">
            <span>
              {{ formatDate(row.createTime) }}
            </span>
          </template>
          <template #modifyTime="{ row }">
            <span>
              {{ formatDate(row.modifyTime) }}
            </span>
          </template>
          <template #operation="{ row }">
            <el-tooltip
              :content="t('monitoring.rating.editRating')"
              v-if="row.status === 0 && roleData.canUpdate && checkShowAction(row)"
              placement="bottom"
              effect="light"
            >
              <span
                @click.stop="handleEditRequestProcessing(row)"
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
              :content="t('monitoring.requestProcessingETC.sendRequest')"
              v-if="row.status === 0 && roleData.canNotify && checkShowAction(row)"
              placement="bottom"
              effect="light"
            >
              <span
                @click.stop="openDialogSendRequest(row)"
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
              v-if="row.status === 1 && roleData.canExplain"
              :content="
                row.executionContent !== null
                  ? t('monitoring.requestProcessingETC.updateContentToImplement')
                  : t('monitoring.requestProcessingETC.addContentToImplement')
              "
              placement="bottom"
              effect="light"
            >
              <span
                @click.stop="handleAddNewRequestProcessing(row)"
                class="delete-member pointer ms-2 me-3"
              >
                <svg-icon
                  style="width: 20px; height: 20px"
                  icon-class="plus"
                  class="mr-2"
                />
              </span>
            </el-tooltip>
            <el-tooltip
              v-if="row.executionContent !== null && row.status === 1 && roleData.canApprove"
              :content="t('monitoring.requestProcessingETC.submitContentReport')"
              placement="bottom"
              effect="light"
            >
              <span
                @click.stop="openDialogSendRequest2(row)"
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
              v-if="row.status === 2 && roleData.canConfirm && checkShowAction(row)"
              :content="t('monitoring.requestProcessingETC.closeRequest')"
              placement="bottom"
              effect="light"
            >
              <span
                @click.stop="openDiaLogCloseRequest(row)"
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
              :content="t('monitoring.requestProcessingETC.deleteRequest')"
              v-if="
                (row.status === 0 || row.status === 1) && roleData.canDelete && checkShowAction(row)
              "
              placement="bottom"
              effect="light"
            >
              <span
                @click.stop="openDialogDeleteRequest(row)"
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
    <!--    -->
    <Dialog
      :show="showDialogSend"
      :appendToBody="true"
      :width="'682'"
      :title="t('monitoring.requestProcessingETC.sendRequest')"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <SendRequest
          :requestInfo="infoRequestProcessing"
          @closeUpdate="handleCloseDialog"
        ></SendRequest>
      </template>
    </Dialog>
    <el-dialog
      v-model="deleteRequestDialog"
      :title="$t('monitoring.requestProcessingETC.deleteRequest')"
      width="500"
      align-center
    >
      <span>{{ $t('monitoring.requestProcessingETC.confirmDeleteRequest') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="deleteRequestDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleDeleteRequestProcessingVEC()"
          >
            {{ $t('el.datepicker.clear') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="closeRequestDialog"
      :title="$t('monitoring.requestProcessingETC.closeRequest')"
      width="500"
      align-center
    >
      <span>{{ $t('monitoring.requestProcessingETC.confirmCloseRequest') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="closeRequestDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleCloseRequestProcessingVEC()"
          >
            {{ $t('configUser.closed') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="activateRequestDialog"
      :title="$t('monitoring.requestProcessingETC.sendReportRequest')"
      width="500"
      align-center
    >
      <span>{{ $t('monitoring.requestProcessingETC.confirmSendContentRequest') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="activateRequestDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleSendRequestProcessingVEC()"
          >
            {{ $t('configUser.send') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
import Dialog from '@/components/Dialog/index.vue'
import TableViolation from '@/components/Table/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import SendRequest from '@/views/monitoring/request-processing-ETC/sendRequest.vue'
import {
  apiCloseRequestProcessingVEC,
  apiDeleteRequestProcessingVEC,
  apiUpdateSenderRequestProcessingVEC,
  getListRequestProcessingVEC,
} from '@/api/requestProcessingETC'
import {useRoute, useRouter} from 'vue-router'
import {usePermissionStore, useRouteUser, useUserStore} from '@/store'
import {ElMessage} from 'element-plus'
import {useI18n} from '@/locale'
import {cloneDeep} from 'lodash-unified'
import {getListRoute, getListStation} from '@/api/expressway'
import moment from 'moment/moment'

const {t} = useI18n()

const router = useRouter()
const route = useRoute()
const {roleData} = usePermissionStore()
const routeUser = useRouteUser()
const userStore = useUserStore()

const defaultFilter = {
  page: 1,
  size: 10,
  keyword: '',
  routeId: '',
  stationId: [],
  status: [],
  errorType: null,
  createTime: null,
  startEnd: [
    moment().startOf('month').format('YYYY-MM-DD 00:00:00'),
    moment().endOf('month').format('YYYY-MM-DD 23:59:59'),
  ],
  total: 0,
}
const filter = reactive(cloneDeep(defaultFilter))
const showDialogSend = ref(false)
const deleteRequestDialog = ref(false)
const closeRequestDialog = ref(false)
const activateRequestDialog = ref(false)
const listLoading = ref(false)
const fields = ref([
  {
    key: 'name',
    label: t('monitoring.requestProcessingETC.requestName'),
    prop: 'name',
  },
  {
    key: 'errorType',
    label: t('monitoring.requestProcessingETC.typeError'),
    prop: 'errorType',
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
    key: 'createdBy',
    label: t('monitoring.requestProcessingETC.creator'),
    prop: 'createdBy',
  },
  {
    key: 'createTime',
    label: t('monitoring.requestProcessingETC.dateCreate'),
    prop: 'createTime',
    width: 150,
  },
  {
    key: 'modifyTime',
    label: t('monitoring.requestProcessingETC.dateUpdate'),
    prop: 'modifyTime',
    width: 150,
  },
  {
    key: 'status',
    label: t('configUser.status'),
    prop: 'status',
    width: 150,
  },
  {
    key: 'operation',
    label: t('configUser.operation'),
    prop: 'operation',
    width: 200,
  },
])
const listRoute = ref([])
const listStation = ref([])
const listStatus = ref([
  {
    id: 1,
    name: t('configUser.open'),
    value: 0,
  },
  {
    id: 2,
    name: t('configUser.processing'),
    value: 1,
  },
  {
    id: 3,
    name: t('configUser.processes'),
    value: 2,
  },
  {
    id: 4,
    name: t('configUser.closed'),
    value: 3,
  },
])
const listTypeError = ref([
  {
    id: 1,
    name: t('monitoring.requestProcessingETC.outOfMoney'),
    value: 1,
  },
  {
    id: 2,
    name: t('monitoring.requestProcessingETC.deviceFailure'),
    value: 2,
  },
  {
    id: 3,
    name: t('monitoring.requestProcessingETC.suspectedEquipmentFailure'),
    value: 3,
  },
])
const listRequestProcessing = ref([])
const infoRequestProcessing = ref({})

onMounted(async () => {
  const params = route.query
  if (params && params && Object.keys(params).length > 0) {
    await setDataSearch(params)
  }
  await setDataDefault()
  await getList()
})

const setDataSearch = async (params) => {
  if (params.routeId !== 'undefined') {
    filter.routeId = parseInt(params.routeId)
    await setListStation(filter.routeId)
    const stationIdArray = params.stationId.split(',').map(id => parseInt(id.trim(), 10))
    filter.stationId.push(...stationIdArray)
  }
  filter.errorType = parseInt(params.errorType) || null
  if (params.status) filter.status.push(parseInt(params.status))
  filter.startEnd = [`${params.createTime} 00:00:00`, `${params.createTime} 23:59:59`]
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
const getList = async () => {
  listLoading.value = true
  const params = {
    keyword: filter.keyword,
    routeId: filter.routeId,
    stationIds: filter.stationId,
    status: filter.status,
    errorType: filter.errorType,
    page: filter.page,
    size: filter.size,
    // createTime: filter.createTime,
    startTime:
      filter.startEnd && filter?.startEnd.length > 0
        ? moment(filter.startEnd[0], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        : null,
    endTime:
      filter.startEnd && filter?.startEnd.length > 0
        ? moment(filter.startEnd[1], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD 23:59:59')
        : null,
  }
  const rs = await getListRequestProcessingVEC(params)
  if (rs.status === 200) {
    listRequestProcessing.value = rs.data.dataRows
    filter.total = rs.data.totalCount
    filter.createTime = null
  }
  listLoading.value = false
}
const handleAddRequestProcessing = () => {
  router.push(`/monitoring/request-processing`)
}
const handleEditRequestProcessing = data => {
  router.push(`/monitoring/request-processing/${data.id}`)
}
const handleViewRequestProcessing = data => {
  router.push(`/monitoring/request-processing-view/${data.id}`)
}
const handleAddNewRequestProcessing = data => {
  router.push(`/monitoring/add-new-request-processing/${data.id}`)
}
const handleDeleteRequestProcessingVEC = async () => {
  const request_id = infoRequestProcessing.value.id
  if (request_id) {
    const rs = await apiDeleteRequestProcessingVEC(request_id)
    if (rs.status === 200) {
      ElMessage({
        message: t('omsSetting.deleteSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      getList()
    } else {
      ElMessage({
        message: t('el.image.error'),
        type: 'error',
        duration: 3 * 1000,
      })
    }
  }
  deleteRequestDialog.value = false
}
const handleCloseRequestProcessingVEC = async () => {
  const request_id = infoRequestProcessing.value.id
  if (request_id) {
    const rs = await apiCloseRequestProcessingVEC(request_id)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      closeRequestDialog.value = false
      getList()
    }
  }
}
const handleSendRequestProcessingVEC = async () => {
  const request_id = infoRequestProcessing.value.id
  if (request_id) {
    const params = {
      leaderId: infoRequestProcessing.value.supplierLeader,
      type: 2,
    }
    const rs = await apiUpdateSenderRequestProcessingVEC(request_id, params)
    if (rs.status === 200) {
      ElMessage({
        message: t('monitoring.requestProcessingETC.successSendRequest'),
        type: 'success',
        duration: 3 * 1000,
      })
      activateRequestDialog.value = false
      await getList()
    }
  }
}
const setListStation = async routeId => {
  listStation.value = []
  filter.stationId = []
  const params = {
    page: 1,
    size: 20,
    keyword: '',
    stationIds: [],
    routeIds: [routeId],
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
const searchListData = () => {
  getList()
}
const openDialogSendRequest = data => {
  infoRequestProcessing.value = data
  showDialogSend.value = true
}
const openDialogDeleteRequest = data => {
  infoRequestProcessing.value = data
  deleteRequestDialog.value = true
}
const openDiaLogCloseRequest = data => {
  infoRequestProcessing.value = data
  closeRequestDialog.value = true
}
const openDialogSendRequest2 = data => {
  infoRequestProcessing.value = data
  activateRequestDialog.value = true
}
const handleSizeChange = size => {
  filter.size = size
  getList()
}
const handlePageChange = page => {
  filter.page = page
  getList()
}
const handleCloseDialog = () => {
  showDialogSend.value = false
  getList()
}
const formatDate = dateString => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
const setDataErrorType = type => {
  switch (type) {
    case 1:
      return t('monitoring.requestProcessingETC.outOfMoney')
    case 2:
      return t('monitoring.requestProcessingETC.deviceFailure')
    case 3:
      return t('monitoring.requestProcessingETC.suspectedEquipmentFailure')
    default:
      return ''
  }
}

const checkShowAction = data => {
  return userStore.userName === data.createdBy
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
