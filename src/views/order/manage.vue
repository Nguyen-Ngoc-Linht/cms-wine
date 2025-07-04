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
      >{{ t('configUser.search') }}
      </el-button>
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
                class="text-hover"
            >
              {{ row.name }}
            </span>
          </template>
          <template #totalAmount="{ row }">
            <span>{{ formatNumber(row.totalAmount, '.') }}</span>
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
          <template #action="{ row }">
            <div class="action-buttons">
              <!-- Nút xem chi tiết -->
              <el-tooltip content="Xem chi tiết" placement="top">
                <span
                    @click="handleViewDetail(row)"
                    class="action-btn pointer"
                >
                  <svg-icon
                      style="width: 20px; height: 20px"
                      icon-class="eyes"
                      class="mr-2"
                  />
                </span>
              </el-tooltip>

              <!-- Nút xác nhận hoàn thành (chỉ hiện với đơn hàng PROCESSING) -->
              <el-tooltip
                  v-if="row.status === 'PROCESSING'"
                  content="Xác nhận hoàn thành"
                  placement="top"
              >
                <span
                    @click="handleSuccessOrder(row)"
                    class="action-btn pointer mx-1"
                >
                  <svg-icon
                      style="width: 20px; height: 20px"
                      icon-class="done_plus"
                      class="mr-2"
                  />
                </span>
              </el-tooltip>

              <!-- Nút hủy đơn hàng (chỉ hiện với đơn hàng PROCESSING hoặc PENDING) -->
              <el-tooltip
                  v-if="['PROCESSING', 'PENDING'].includes(row.status)"
                  content="Hủy đơn hàng"
                  placement="top"
              >
                <span
                    @click="handleCancelOrder(row)"
                    class="action-btn pointer"
                >
                  <svg-icon
                      style="width: 20px; height: 20px"
                      icon-class="x"
                      class="mr-2"
                  />
                </span>
              </el-tooltip>
            </div>
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

    <!-- Dialog xem chi tiết đơn hàng -->
    <el-dialog
        v-model="showDetailDialog"
        title="Chi tiết đơn hàng"
        width="70%"
        :before-close="handleCloseDetailDialog"
        append-to-body
        destroy-on-close
        class="custom-dialog"
        align-center
    >
      <OrderDetailVue
          :orderInfo="selectedOrder"
          @refresh="handleRefreshAfterAction"
          @close="handleCloseDetailDialog"
          @success-order="handleSuccessOrderFromDetail"
          @cancel-order="handleCancelOrderFromDetail"
      />
    </el-dialog>

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
import { useI18n } from '@/locale'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { apiChangeStatusOrder, apiGetAllOrder, apiGetOrderDetail, apiCancelOrder } from '@/api/order'
import { formatNumber } from '@/utils'
import OrderDetailVue from '@/views/order/OrderDetail.vue'

const { t } = useI18n()

const defaultFilter = {
  page: 1,
  size: 20,
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
const showDetailDialog = ref(false)
const titleDialog = ref(t('monitoring.errorHandling.sendEvent'))
const selectedOrder = ref({})
const detailLoading = ref(false)

const fields = ref([
  {
    key: 'id',
    label: 'Mã đơn',
    prop: 'id',
    width: 70,
    align: 'center',
  },
  {
    key: 'userId',
    label: 'Mã khách hàng',
    prop: 'userId',
  },
  {
    key: 'totalAmount',
    label: 'Tổng tiền (VND)',
    prop: 'totalAmount',
    width: 200,
  },
  {
    key: 'note',
    label: 'Ghi chú',
    prop: 'note',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    prop: 'status',
    width: 200,
  },
  {
    key: 'paymentMethod',
    label: 'Phương thức',
    prop: 'paymentMethod',
    align: 'center',
    width: 150,
  },
  {
    key: 'createTime',
    label: 'Ngày tạo',
    prop: 'createTime',
    align: 'center',
    width: 150,
  },
  {
    key: 'action',
    label: 'Thao tác',
    prop: 'action',
    align: 'center',
    width: 150,
  },
])

const listLoading = ref(false)
const list = ref([])
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
])
const listPaymentMethod = ref([
  {
    id: 1,
    label: 'Thanh toán VNPAY',
    value: 'VNPAY',
  },
  {
    id: 2,
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
  getList()
})

const getList = async () => {
  listLoading.value = true
  const fromDate = filter.time?.[0] || null
  const toDate = filter.time?.[1] || null
  const params = {
    keyword: filter.keyword,
    paymentMethod: filter.paymentMethod,
    status: filter.status,
    fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
    toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
    paged: {
      page: filter.page,
      size: filter.size,
    },
  }
  const rs = await apiGetAllOrder(params)
  if (rs.code === 200) {
    list.value = rs.data.content
    filter.total = rs.data.totalElements
  }
  listLoading.value = false
}

// Xem chi tiết đơn hàng
const handleViewDetail = async (row) => {
  detailLoading.value = true
  try {
    const rs = await apiGetOrderDetail(row.id)
    if (rs.code === 200) {
      selectedOrder.value = rs.data
      showDetailDialog.value = true
    } else {
      ElMessage.error('Không thể tải chi tiết đơn hàng')
    }
  } catch (error) {
    ElMessage.error('Lỗi khi tải chi tiết đơn hàng')
    console.error('Error loading order detail:', error)
  } finally {
    detailLoading.value = false
  }
}

// Đóng dialog chi tiết
const handleCloseDetailDialog = () => {
  showDetailDialog.value = false
  selectedOrder.value = {}
}

// Refresh sau khi thực hiện action
const handleRefreshAfterAction = () => {
  getList()
  handleCloseDetailDialog()
}

// Xác nhận hoàn thành đơn hàng từ dialog chi tiết
const handleSuccessOrderFromDetail = (orderId) => {
  successOrder(orderId)
}

// Hủy đơn hàng từ dialog chi tiết
const handleCancelOrderFromDetail = (orderId) => {
  cancelOrder(orderId)
}

// Hủy đơn hàng
const handleCancelOrder = (row) => {
  ElMessageBox.prompt(
      'Vui lòng nhập lý do hủy đơn hàng',
      'Hủy đơn hàng #' + row.id,
      {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        inputPattern: /.+/,
        inputErrorMessage: 'Vui lòng nhập lý do hủy',
        inputType: 'textarea',
      }
  ).then(({ value }) => {
    cancelOrder(row.id, value)
  }).catch(() => {
    // User cancelled
  })
}

// API hủy đơn hàng
const cancelOrder = async (orderId, reason = '') => {
  try {
    const rs = await apiCancelOrder(orderId, reason)
    if (rs.code === 200) {
      await getList()
      ElMessage({
        type: 'success',
        message: `Đơn hàng #${orderId} đã được hủy thành công`,
      })
      if (showDetailDialog.value) {
        handleCloseDetailDialog()
      }
    } else {
      ElMessage.error(rs.message || 'Không thể hủy đơn hàng')
    }
  } catch (error) {
    ElMessage.error('Lỗi khi hủy đơn hàng')
    console.error('Error canceling order:', error)
  }
}

const handleViewEvent = data => {}
const handleDeleteEvent = async () => {}
const handleCloseEvent = async () => {}
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
const formatDate = dateString => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
const formatStatusOrder = status => {
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
const handleSuccessOrder = data => {
  ElMessageBox.confirm('Xác nhận hàng đã giao đến người dùng', 'Cảnh báo', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  })
    .then(() => {
      successOrder(data.id)
    })
    .catch(() => {})
}
const successOrder = async (id) => {
  const params = {
    id,
    status: 'SUCCESS',
  }
  const rs = await apiChangeStatusOrder(params)
  if (rs.code === 200) {
    await getList()
    ElMessage({
      type: 'success',
      message: 'Xác nhận đơn hàng có mã: ' + id + ' đã được giao thành công',
    })
    if (showDetailDialog.value) {
      handleCloseDetailDialog()
    }
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

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
  }

  &.view-btn {
    background-color: #e1f5fe;
    color: #0288d1;

    &:hover {
      background-color: #b3e5fc;
    }
  }

  &.success-btn {
    background-color: #e8f5e8;
    color: #4caf50;

    &:hover {
      background-color: #c8e6c9;
    }
  }

  &.cancel-btn {
    background-color: #ffebee;
    color: #f44336;

    &:hover {
      background-color: #ffcdd2;
    }
  }
}
::v-deep(.custom-dialog .el-dialog) {
  top: 10vh !important;
}
</style>
