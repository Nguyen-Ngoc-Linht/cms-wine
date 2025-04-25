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
          v-model="filter.paymentMethod"
          placeholder="Phương thức thanh toán"
          clearable
          filterable
          multiple
          collapse-tags
          collapse-tags-tooltip
          class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
            v-for="item in listPaymentMethod"
            :key="item.id"
            :label="item.label"
            :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
          v-model="filter.status"
          placeholder="Trạng thái"
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
            :label="item.label"
            :value="item.value"
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
    <hr class="margin-bottom-12 mt-2" />
    <div class="paddingX-24 mb-4">
      <div class="px-3 py-3 bg-white">
        <TableViolation
            :listLoading="listLoading"
            :fields="fields"
            :STT="true"
            :data="list"
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
                class="text-hover">
              {{ row.name }}
            </span>
          </template>
          <template #totalAmount="{ row }">
            <span>{{ formatNumber(row.totalAmount, '.') + ' VND' }}</span>
          </template>
          <template #createTime="{ row }">
            <span>{{ formatDate(row.createTime) }}</span>
          </template>
          <template #modifyTime="{ row }">
            <span>{{ formatDate(row.modifyTime) }}</span>
          </template>
          <template #status="{ row }">
            <span>{{ formatStatusOrder(row.status) }}</span>
          </template>
          <template #createdBy="{ row }">
            <span>{{ row.createdBy }}</span>
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
import Dialog from '@/components/Dialog/index.vue'
import { cloneDeep } from 'lodash-unified'
import { useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import {dayjs, ElMessage} from 'element-plus'
import {apiGetAllOrder} from '@/api/order'
import { formatNumber } from '@/utils'

const { t } = useI18n()
const router = useRouter()

const defaultFilter = {
  page: 1,
  size: 10,
  status: [],
  keyword: '',
  paymentMethod: [],
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
    key: 'id',
    label: t('order.id'),
    prop: 'id',
    width: 70,
    align: 'center',
  },
  {
    key: 'createdBy',
    label: t('order.userId'),
    prop: 'createdBy',
    align: 'center',
  },
  {
    key: 'totalAmount',
    label: t('order.totalAmount'),
    prop: 'totalAmount',
  },
  {
    key: 'note',
    label: t('order.note'),
    prop: 'note',
  },
  {
    key: 'status',
    label: t('order.status'),
    prop: 'status',
  },
  {
    key: 'paymentMethod',
    label: t('order.paymentMethod'),
    prop: 'paymentMethod',
    // width: 120,
    align: 'center',
  },
  {
    key: 'createTime',
    label: t('order.createTime'),
    prop: 'createTime',
    // width: 120,
    align: 'center',
  },
])
const listLoading = ref(false)
const list = ref([])
const listStation = ref([])
const listStatus = ref([
  {
    id: 1,
    label: 'Đơn hàng được xử lý thành công',
    value: 'SUCCESS',
  },
  {
    id: 2,
    label: 'Đơn hàng không thành công',
    value: 'FAILED',
  },
  {
    id: 3,
    label: 'Đơn hàng đang được xử lý',
    value: 'PROCESSING',
  },
  {
    id: 4,
    label: 'Đơn hàng bị hủy',
    value: 'CANCELED',
  },
  // {
  //   id: 5,
  //   label: 'Đơn hàng đã được hoàn tiền',
  //   value: 'REFUNDED',
  // },
])
const listPaymentMethod = ref([
  {
    id: 1,
    label: 'Thanh toán VNPAY',
    value: 'VNPAY',
  },
  {
    id: 1,
    label: 'Thanh toán MOMO',
    value: 'MOMO',
  },
  {
    id: 3,
    label: 'Quét mã QRCODE',
    value: 'QRCODE',
  },
  {
    id: 4,
    label: 'Tiền mặt',
    value: 'CASH',
  },
])
const infoEvent = ref({})

onMounted(() => {
  setDataDefault()
  getList()
})

const getList = async () => {
  listLoading.value = true
  const fromDate = filter.time?.[0] || null
  const toDate = filter.time?.[1] || null
  const params = {
    paged: {
      keyword: filter.keyword,
      paymentMethod: filter.paymentMethod,
      status: filter.status,
      from: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
      to: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
      page: filter.page,
      size: filter.size
    }
  }
  const rs = await apiGetAllOrder(params)
  if (rs.code === 200) {
    list.value = rs.data.content
    filter.total = rs.data.totalElements
  }
  listLoading.value = false
}
const setDataDefault = async () => {
}
const handleViewEvent = data => {
}
const handleDeleteEvent = async () => {
}
const handleCloseEvent = async () => {
}
const searchListData = () => {
  console.log('hehe')
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
const formatStatusOrder = (status) => {
  switch (status) {
    case 'SUCCESS':
      return 'Thành công'
    case 'FAILED':
      return 'Không thành công'
    case 'PENDING':
      return 'Đang chờ xử lý'
    case 'PROCESSING':
      return 'Đang được xử lý'
    case 'CANCELED':
      return 'Đã bị hủy'
    case 'REFUNDED':
      return 'Đã hoàn tiền'
    default:
      return 'Trạng thái không xác định'
  }
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
