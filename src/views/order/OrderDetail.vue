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
              <span class="label">Mã khách hàng:</span>
              <span class="value">{{ orderInfo.userId }}</span>
            </div>
            <div class="info-item">
              <span class="label">Ngày tạo:</span>
              <span class="value">{{ formatDateTime(orderInfo.createTime) }}</span>
            </div>
            <div
              class="info-item"
              v-if="orderInfo.modifyTime"
            >
              <span class="label">Ngày cập nhật:</span>
              <span class="value">{{ formatDateTime(orderInfo.modifyTime) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Phương thức thanh toán:</span>
              <span class="value">{{ formatPaymentMethod(orderInfo.paymentMethod) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Lý do hủy đơn (nếu có):</span>
              <span class="value">{{ formatPaymentMethod(orderInfo.reasonCanceled) }}</span>
            </div>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="info-section">
            <h4 class="section-title">Thông tin khách hàng</h4>
            <div
              v-if="userLoading"
              class="loading-container"
            >
              <el-skeleton
                :rows="4"
                animated
              />
            </div>
            <div v-else-if="userInfo">
              <div class="info-item">
                <span class="label">Tên khách hàng:</span>
                <span class="value">{{ userInfo.firstName + ' ' + userInfo.lastName }}</span>
              </div>
              <div class="info-item">
                <span class="label">Email:</span>
                <span class="value">{{ userInfo.email }}</span>
              </div>
              <div
                class="info-item"
                v-if="userInfo.phone"
              >
                <span class="label">Số điện thoại:</span>
                <span class="value">{{ userInfo.phone }}</span>
              </div>
              <div
                class="info-item"
                v-if="userInfo.address"
              >
                <span class="label">Địa chỉ:</span>
                <span class="value">{{ userInfo.address }}</span>
              </div>
            </div>
            <div
              v-else
              class="error-message"
            >
              <el-alert
                title="Không thể tải thông tin khách hàng"
                type="warning"
                :closable="false"
                show-icon
              />
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <div class="info-section">
            <h4 class="section-title">Thông tin thanh toán</h4>
            <div class="payment-info">
              <div class="info-item">
                <span class="label">Tổng tiền:</span>
                <span class="value amount">{{ formatNumber(orderInfo.totalAmount, '.') }} VND</span>
              </div>
              <div
                class="info-item"
                v-if="orderInfo.discount"
              >
                <span class="label">Giảm giá:</span>
                <span class="value">-{{ formatNumber(orderInfo.discount, '.') }} VND</span>
              </div>
              <div
                class="info-item"
                v-if="orderInfo.tax"
              >
                <span class="label">Thuế:</span>
                <span class="value">{{ formatNumber(orderInfo.tax, '.') }} VND</span>
              </div>
              <div
                class="info-item"
                v-if="orderInfo.shippingFee"
              >
                <span class="label">Phí vận chuyển:</span>
                <span class="value">{{ formatNumber(orderInfo.shippingFee, '.') }} VND</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <div
        class="info-section"
        v-if="orderInfo.note"
      >
        <h4 class="section-title">Ghi chú</h4>
        <div class="note-content">
          {{ orderInfo.note }}
        </div>
      </div>

      <div
        class="info-section"
        v-if="orderInfo.orderDetails && orderInfo.orderDetails.length > 0"
      >
        <h4 class="section-title">Danh sách sản phẩm</h4>
        <el-table
          :data="orderInfo.orderDetails"
          style="width: 100%"
          class="product-table"
        >
          <el-table-column
            label="Mã sản phẩm"
            width="120"
          >
            <template #default="{ row }">
              <el-tag
                size="small"
                type="info"
                >{{ row.variant.variantCode }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column
            label="Tên sản phẩm"
            min-width="250"
          >
            <template #default="{ row }">
              <div class="product-info">
                <div class="product-name">{{ row.variant.variantName }}</div>
                <div
                  class="product-attributes"
                  v-if="row.variant.variantAttributes && row.variant.variantAttributes.length > 0"
                >
                  <el-tag
                    v-for="attr in row.variant.variantAttributes"
                    :key="attr.productVariantAttributeId"
                    size="small"
                    type="success"
                    class="attribute-tag"
                  >
                    {{ attr.attribute.name }}: {{ attr.value }}
                  </el-tag>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="quantity"
            label="Số lượng"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag
                size="large"
                type="primary"
                >{{ row.quantity }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column
            label="Đơn giá"
            width="140"
            align="right"
          >
            <template #default="{ row }">
              <span class="price">{{ formatNumber(row.variant.price, '.') }} VND</span>
            </template>
          </el-table-column>

          <el-table-column
            label="Thành tiền"
            width="160"
            align="right"
          >
            <template #default="{ row }">
              <span class="total-price">{{ formatNumber(row.variant.price * row.quantity, '.') }} VND</span>
            </template>
          </el-table-column>

          <el-table-column
            label="Tồn kho"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag
                :type="
                  row.variant.quantity > 10
                    ? 'success'
                    : row.variant.quantity > 0
                    ? 'warning'
                    : 'danger'
                "
                size="small"
              >
                {{ row.variant.quantity }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div
        class="info-section"
        v-if="orderInfo.history && orderInfo.history.length > 0"
      >
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
              <div
                class="timeline-note"
                v-if="item.note"
              >
                {{ item.note }}
              </div>
              <div
                class="timeline-user"
                v-if="item.updatedBy"
              >
                Bởi: {{ item.updatedBy }}
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>

    <div
      class="order-actions"
      v-if="orderInfo.status === 'PENDING'"
    >
      <el-button
        type="primary"
        @click="handleProcessOrder"
        :loading="actionLoading"
      >
        <el-icon>
          <DocumentChecked />
        </el-icon>
        Xử lý đơn hàng
      </el-button>
      <el-button
        type="success"
        @click="handleSuccessOrder"
        :loading="actionLoading"
      >
        <el-icon>
          <Check />
        </el-icon>
        Xác nhận hoàn thành
      </el-button>
      <el-button
        type="danger"
        @click="handleCancelOrder"
        :loading="actionLoading"
      >
        <el-icon>
          <Close />
        </el-icon>
        Hủy đơn hàng
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Close, DocumentChecked } from '@element-plus/icons-vue'
import { getUserDetail } from '@/api/user'
import {
  formatDateTime,
  formatNumber,
  formatPaymentMethod,
  formatStatusOrder,
  getStatusType,
} from '@/utils'

const props = defineProps({
  orderInfo: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['refresh', 'close', 'success-order', 'cancel-order', 'process-order'])

const actionLoading = ref(false)
const userLoading = ref(false)
const userInfo = ref({})

// Fetch user information when component mounts
onMounted(async () => {
  if (props.orderInfo.userId) {
    await fetchUserInfo()
  }
})

// Fetch user information when component mounts
onMounted(async () => {
  if (props.orderInfo.userId) {
    await fetchUserInfo()
  }
})

const fetchUserInfo = async () => {
  try {
    userLoading.value = true
    const rs = await getUserDetail(props.orderInfo.userId)
    userInfo.value = rs.data
  } catch (error) {
    console.error('Error fetching user info:', error)
    ElMessage.error('Không thể tải thông tin khách hàng')
    userInfo.value = null
  } finally {
    userLoading.value = false
  }
}

const handleProcessOrder = () => {
  ElMessageBox.confirm('Xác nhận bắt đầu xử lý đơn hàng này?', 'Xác nhận', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    type: 'info',
  }).then(() => {
    emit('process-order', props.orderInfo.id)
  })
}

const handleSuccessOrder = () => {
  ElMessageBox.confirm('Xác nhận đơn hàng đã được giao thành công?', 'Xác nhận', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    type: 'success',
  }).then(() => {
    emit('success-order', props.orderInfo.id)
  })
}

const handleCancelOrder = () => {
  ElMessageBox.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?', 'Cảnh báo', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    type: 'warning',
  }).then(() => {
    emit('cancel-order', props.orderInfo.id)
  })
}
</script>

<style lang="scss" scoped>
.order-detail {
  padding: 24px;
  max-height: 80vh;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .order-title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .status-tag {
    font-weight: 600;
    padding: 8px 16px;
    font-size: 14px;
  }
}

.order-content {
  .info-section {
    margin-bottom: 32px;
    background: #f8fafc;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;

    .section-title {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 8px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 60px;
        height: 2px;
        background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      }
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: rgba(59, 130, 246, 0.05);
        margin: 0 -12px;
        padding: 12px;
        border-radius: 4px;
      }

      &:last-child {
        border-bottom: none;
      }

      .label {
        font-weight: 500;
        color: #475569;
        min-width: 160px;
        font-size: 14px;
      }

      .value {
        color: #1e293b;
        text-align: right;
        flex: 1;
        font-weight: 500;

        &.amount {
          font-weight: 700;
          color: #f59e0b;
          font-size: 18px;
        }
      }
    }

    .payment-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .note-content {
      background: #ffffff;
      padding: 16px;
      border-radius: 6px;
      color: #475569;
      line-height: 1.6;
      border: 1px solid #e2e8f0;
      font-style: italic;
    }

    .loading-container {
      padding: 16px 0;
    }

    .error-message {
      margin: 16px 0;
    }
  }
}

.product-table {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .product-info {
    .product-name {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 8px;
      font-size: 15px;
    }

    .product-attributes {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;

      .attribute-tag {
        font-size: 11px;
        padding: 2px 6px;
      }
    }
  }

  .price {
    color: #059669;
    font-weight: 600;
    font-size: 14px;
  }

  .total-price {
    color: #dc2626;
    font-weight: 700;
    font-size: 15px;
  }
}

.timeline-content {
  background: #ffffff;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .timeline-status {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
    font-size: 15px;
  }

  .timeline-note {
    color: #475569;
    font-size: 14px;
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .timeline-user {
    color: #64748b;
    font-size: 12px;
    font-style: italic;
  }
}

.order-actions {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 2px solid #e2e8f0;
  text-align: right;
  background: #f8fafc;
  margin-left: -24px;
  margin-right: -24px;
  margin-bottom: -24px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 24px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  .el-button {
    margin-left: 12px;
    padding: 12px 24px;
    font-weight: 600;
    border-radius: 6px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
}

:deep(.el-table) {
  .el-table__header {
    background-color: #f1f5f9;

    th {
      background-color: #f1f5f9 !important;
      color: #334155;
      font-weight: 600;
    }
  }

  .el-table__row {
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f8fafc !important;
    }
  }
}

:deep(.el-timeline-item__timestamp) {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

:deep(.el-divider) {
  margin: 24px 0;
  border-color: #e2e8f0;
}

:deep(.el-skeleton__item) {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 400% 100%;
  animation: loading 1.4s ease infinite;
}

@keyframes loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

// Responsive design
@media (max-width: 768px) {
  .order-detail {
    padding: 16px;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .order-title {
      font-size: 20px;
    }
  }

  .info-section {
    .payment-info {
      grid-template-columns: 1fr;
    }

    .info-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;

      .label {
        min-width: auto;
        font-weight: 600;
        color: #1e293b;
      }

      .value {
        text-align: left;
      }
    }
  }

  .order-actions {
    text-align: center;

    .el-button {
      margin: 4px;
      width: calc(50% - 8px);
    }
  }
}
</style>
