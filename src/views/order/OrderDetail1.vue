<template>
  <div class="order-detail">
    <div class="order-header">
      <h3 class="order-title">Chi tiết đơn hàng #{{ orderInfo.id }}</h3>
      <el-tag
          :type="getStatusType(orderInfo.status)"
          size="large"
          class="status-tag"
      >
        {{ formatStatusOrder(orderInfo.status) }}
      </el-tag>
    </div>

    <el-divider />

    <div class="order-content">
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="info-section">
            <h4 class="section-title">Thông tin đơn hàng</h4>
            <div class="info-item">
              <span class="label">Mã đơn hàng:</span>
              <span class="value">#{{ orderInfo.id }}</span>
            </div>
            <div class="info-item">
              <span class="label">Người đặt:</span>
              <span class="value">{{ orderInfo.createdBy }}</span>
            </div>
            <div class="info-item">
              <span class="label">Ngày tạo:</span>
              <span class="value">{{ formatDateTime(orderInfo.createTime) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Ngày cập nhật:</span>
              <span class="value">{{ formatDateTime(orderInfo.modifyTime) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Phương thức thanh toán:</span>
              <span class="value">{{ formatPaymentMethod(orderInfo.paymentMethod) }}</span>
            </div>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="info-section">
            <h4 class="section-title">Thông tin thanh toán</h4>
            <div class="info-item">
              <span class="label">Tổng tiền:</span>
              <span class="value amount">{{ formatNumber(orderInfo.totalAmount, '.') }} VND</span>
            </div>
            <div class="info-item" v-if="orderInfo.discount">
              <span class="label">Giảm giá:</span>
              <span class="value">{{ formatNumber(orderInfo.discount, '.') }} VND</span>
            </div>
            <div class="info-item" v-if="orderInfo.tax">
              <span class="label">Thuế:</span>
              <span class="value">{{ formatNumber(orderInfo.tax, '.') }} VND</span>
            </div>
            <div class="info-item" v-if="orderInfo.shippingFee">
              <span class="label">Phí vận chuyển:</span>
              <span class="value">{{ formatNumber(orderInfo.shippingFee, '.') }} VND</span>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="info-section" v-if="orderInfo.note">
        <h4 class="section-title">Ghi chú</h4>
        <div class="note-content">
          {{ orderInfo.note }}
        </div>
      </div>

      <div class="info-section" v-if="orderInfo.items && orderInfo.items.length > 0">
        <h4 class="section-title">Danh sách sản phẩm</h4>
        <el-table :data="orderInfo.items" style="width: 100%">
          <el-table-column prop="name" label="Tên sản phẩm" min-width="200" />
          <el-table-column prop="quantity" label="Số lượng" width="100" align="center" />
          <el-table-column prop="price" label="Đơn giá" width="120" align="right">
            <template #default="{ row }">
              {{ formatNumber(row.price, '.') }} VND
            </template>
          </el-table-column>
          <el-table-column prop="total" label="Thành tiền" width="140" align="right">
            <template #default="{ row }">
              {{ formatNumber(row.quantity * row.price, '.') }} VND
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="info-section" v-if="orderInfo.deliveryInfo">
        <h4 class="section-title">Thông tin giao hàng</h4>
        <div class="info-item">
          <span class="label">Địa chỉ:</span>
          <span class="value">{{ orderInfo.deliveryInfo.address }}</span>
        </div>
        <div class="info-item" v-if="orderInfo.deliveryInfo.phone">
          <span class="label">Số điện thoại:</span>
          <span class="value">{{ orderInfo.deliveryInfo.phone }}</span>
        </div>
        <div class="info-item" v-if="orderInfo.deliveryInfo.expectedDate">
          <span class="label">Ngày giao dự kiến:</span>
          <span class="value">{{ formatDate(orderInfo.deliveryInfo.expectedDate) }}</span>
        </div>
      </div>

      <div class="info-section" v-if="orderInfo.history && orderInfo.history.length > 0">
        <h4 class="section-title">Lịch sử đơn hàng</h4>
        <el-timeline>
          <el-timeline-item
              v-for="(item, index) in orderInfo.history"
              :key="index"
              :timestamp="formatDateTime(item.time)"
              placement="top"
          >
            <div class="timeline-content">
              <div class="timeline-status">{{ formatStatusOrder(item.status) }}</div>
              <div class="timeline-note" v-if="item.note">{{ item.note }}</div>
              <div class="timeline-user" v-if="item.updatedBy">Bởi: {{ item.updatedBy }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>

    <div class="order-actions" v-if="orderInfo.status === 'PROCESSING'">
      <el-button
          type="success"
          @click="handleSuccessOrder"
          :loading="actionLoading"
      >
        <el-icon><Check /></el-icon>
        Xác nhận hoàn thành
      </el-button>
      <el-button
          type="danger"
          @click="handleCancelOrder"
          :loading="actionLoading"
      >
        <el-icon><Close /></el-icon>
        Hủy đơn hàng
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Close } from '@element-plus/icons-vue'
import { formatNumber } from '@/utils'

const props = defineProps({
  orderInfo: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['refresh', 'close'])

const actionLoading = ref(false)

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
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

const formatPaymentMethod = (method) => {
  switch (method) {
    case 'VNPAY':
      return 'Thanh toán VNPAY'
    case 'MOMO':
      return 'Thanh toán MOMO'
    case 'QRCODE':
      return 'Quét mã QRCODE'
    case 'CASH':
      return 'Tiền mặt'
    default:
      return method
  }
}

const getStatusType = (status) => {
  switch (status) {
    case 'SUCCESS':
      return 'success'
    case 'FAILED':
      return 'danger'
    case 'PENDING':
      return 'warning'
    case 'PROCESSING':
      return 'primary'
    case 'CANCELED':
      return 'info'
    case 'REFUNDED':
      return 'success'
    default:
      return 'info'
  }
}

const handleSuccessOrder = () => {
  ElMessageBox.confirm(
      'Xác nhận đơn hàng đã được giao thành công?',
      'Xác nhận',
      {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        type: 'success',
      }
  ).then(() => {
    emit('success-order', props.orderInfo.id)
  })
}

const handleCancelOrder = () => {
  ElMessageBox.confirm(
      'Bạn có chắc chắn muốn hủy đơn hàng này?',
      'Cảnh báo',
      {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
        type: 'warning',
      }
  ).then(() => {
    emit('cancel-order', props.orderInfo.id)
  })
}
</script>

<style lang="scss" scoped>
.order-detail {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .order-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #303133;
  }

  .status-tag {
    font-weight: 600;
  }
}

.order-content {
  .info-section {
    margin-bottom: 24px;

    .section-title {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      border-bottom: 2px solid #e4e7ed;
      padding-bottom: 8px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f5f7fa;

      &:last-child {
        border-bottom: none;
      }

      .label {
        font-weight: 500;
        color: #606266;
        min-width: 140px;
      }

      .value {
        color: #303133;
        text-align: right;
        flex: 1;

        &.amount {
          font-weight: 600;
          color: #e6a23c;
          font-size: 16px;
        }
      }
    }

    .note-content {
      background: #f5f7fa;
      padding: 12px;
      border-radius: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }
}

.timeline-content {
  .timeline-status {
    font-weight: 600;
    color: #303133;
    margin-bottom: 4px;
  }

  .timeline-note {
    color: #606266;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .timeline-user {
    color: #909399;
    font-size: 12px;
  }
}

.order-actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
  text-align: right;

  .el-button {
    margin-left: 12px;
  }
}

:deep(.el-table) {
  .el-table__header {
    background-color: #f5f7fa;
  }
}

:deep(.el-timeline-item__timestamp) {
  font-size: 12px;
  color: #909399;
}
</style>
