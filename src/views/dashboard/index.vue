<template>
  <div class="dashboard-container">
    <div class="padding-20">
      <!-- Header với bộ lọc -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold text-gray-800">Quản Trị</h2>
        <div class="flex items-center gap-3">
          <div class="filter-icon">
            <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
            </svg>
          </div>
          <el-select
              v-model="filter.type"
              filterable
              collapse-tags
              collapse-tags-tooltip
              class="w-32"
              @change="handleFilterTypeChange"
          >
            <el-option label="Ngày" :value="1"></el-option>
            <el-option label="Tháng" :value="2"></el-option>
            <el-option label="Năm" :value="3"></el-option>
          </el-select>

          <!-- Filter theo ngày -->
          <el-date-picker
              v-if="filter.type === 1"
              v-model="filter.timeSearch"
              type="daterange"
              @change="getDataDefault"
              start-placeholder="Ngày bắt đầu"
              range-separator="đến"
              end-placeholder="Ngày kết thúc"
              clearable
              value-format="YYYY-MM-DD"
              format="DD/MM/YYYY"
              class="w-80"
          />

          <!-- Filter theo tháng -->
          <div v-if="filter.type === 2" class="flex items-center gap-2">
            <el-select
                v-model="filter.month"
                placeholder="Chọn tháng"
                class="w-32"
                @change="getDataDefault"
            >
              <el-option
                  v-for="month in months"
                  :key="month.value"
                  :label="month.label"
                  :value="month.value"
              />
            </el-select>
            <el-select
                v-model="filter.year"
                placeholder="Chọn năm"
                class="w-28"
                @change="getDataDefault"
            >
              <el-option
                  v-for="year in years"
                  :key="year"
                  :label="year"
                  :value="year"
              />
            </el-select>
          </div>

          <!-- Filter theo năm -->
          <el-select
              v-if="filter.type === 3"
              v-model="filter.selectedYear"
              placeholder="Chọn năm"
              class="w-32"
              @change="getDataDefault"
          >
            <el-option
                v-for="year in years"
                :key="year"
                :label="year"
                :value="year"
            />
          </el-select>
        </div>
      </div>

      <!-- Thống kê tổng quan -->
      <el-row :gutter="20" class="mb-6">
        <el-col :span="6">
          <el-card class="stat-card stat-card-orders">
            <div class="stat-content">
              <div class="stat-icon">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div class="stat-info">
                <h6 class="stat-label">Tổng đơn hàng</h6>
                <h2 class="stat-value">{{ formatNumber(orderStatistics.totalOrder) }}</h2>
                <p class="stat-change positive">
                  <span class="change-icon">↗</span>
                  Tăng 12% so với {{ getPreviousPeriodText() }}
                </p>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="stat-card stat-card-customers">
            <div class="stat-content">
              <div class="stat-icon">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div class="stat-info">
                <h6 class="stat-label">Khách hàng</h6>
                <h2 class="stat-value">{{ formatNumber(orderStatistics.totalUserPurchases) }}</h2>
                <p class="stat-change positive">
                  <span class="change-icon">↗</span>
                  Tăng 8% so với {{ getPreviousPeriodText() }}
                </p>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="stat-card stat-card-success">
            <div class="stat-content">
              <div class="stat-icon">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="stat-info">
                <h6 class="stat-label">Đơn thành công</h6>
                <h2 class="stat-value">{{ formatNumber(orderStatistics.totalCompletedOrder) }}</h2>
                <p class="stat-change positive">
                  <span class="change-icon">↗</span>
                  Tăng 15% so với {{ getPreviousPeriodText() }}
                </p>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="stat-card stat-card-revenue">
            <div class="stat-content">
              <div class="stat-icon">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="stat-info">
                <h6 class="stat-label">Doanh thu</h6>
                <h2 class="stat-value">{{ formatCurrency(totalRevenue) }}</h2>
                <p class="stat-change positive">
                  <span class="change-icon">↗</span>
                  Tăng 25% so với {{ getPreviousPeriodText() }}
                </p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- Biểu đồ và thống kê -->
      <el-row :gutter="20" class="mb-6">
        <el-col :span="16">
          <el-card class="chart-card">
            <div class="chart-header">
              <h5 class="chart-title">Biểu đồ doanh thu theo {{ getChartTitle() }}</h5>
              <div class="chart-legend">
                <span class="legend-item">
                  <span class="legend-color revenue"></span>
                  Doanh thu
                </span>
                <span class="legend-item">
                  <span class="legend-color orders"></span>
                  Đơn hàng
                </span>
              </div>
            </div>
            <div class="chart-container">
              <Bar :data="chartData" :loading="chartLoading" :type="filter.type" />
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="chart-card">
            <div class="chart-header">
              <h5 class="chart-title">Top sản phẩm bán chạy</h5>
            </div>
            <div class="chart-container">
              <Pie :data="pieData" :loading="chartLoading" />
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- Bảng sản phẩm bán chạy và đơn hàng gần đây -->
      <el-row :gutter="20" class="mb-6">
        <el-col :span="12">
          <el-card class="table-card">
            <div class="table-header">
              <h5 class="table-title">Sản phẩm bán chạy nhất</h5>
              <el-button type="text" class="view-all-btn no-border">Xem tất cả</el-button>
            </div>
            <div class="product-list">
              <div
                  v-for="(product, index) in topProducts"
                  :key="product.id"
                  class="product-item"
              >
                <div class="product-rank">{{ index + 1 }}</div>
                <div class="product-image">
                  <img :src="getImage(product.url)" :alt="product.name" />
                </div>
                <div class="product-info">
                  <h6 class="product-name">{{ product.name }}</h6>
                  <p class="product-category">{{ product.category }}</p>
                </div>
                <div class="product-stats">
                  <div class="product-sold">{{ product.totalQuantity }} đã bán</div>
                  <div class="product-price">{{ formatCurrency(product.totalRevenue) }}</div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="table-card">
            <div class="table-header">
              <h5 class="table-title">Đơn hàng gần đây</h5>
              <el-button type="text" class="view-all-btn no-border">Xem tất cả</el-button>
            </div>
            <div class="order-list">
              <div
                  v-for="order in recentOrders"
                  :key="order.id"
                  class="order-item"
              >
                <div class="order-info">
                  <h6 class="order-id">#{{ order.id }}</h6>
                  <p class="order-customer">{{ order.user.firstName + ' ' + order.user.lastName }}</p>
                  <p class="order-time">{{ formatDateTime(order.createTime) }}</p>
                </div>
                <div class="order-details">
                  <div class="order-amount">{{ formatCurrency(order.totalAmount) }}</div>
                  <el-tag
                      :type="getOrderStatusType(order.status)"
                      size="small"
                      class="order-status"
                  >
                    {{ formatOrderStatus(order.status) }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- Thống kê chi tiết -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="detail-card">
            <div class="detail-header">
              <h5 class="detail-title">Phân tích khách hàng</h5>
            </div>
            <div class="detail-content">
              <div class="detail-item">
                <span class="detail-label">Khách hàng mới</span>
                <span class="detail-value">{{ customerStats.newCustomers }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Khách hàng quay lại</span>
                <span class="detail-value">{{ customerStats.returningCustomers }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Tỷ lệ giữ chân</span>
                <span class="detail-value">{{ customerStats.retentionRate }}%</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="detail-card">
            <div class="detail-header">
              <h5 class="detail-title">Hiệu suất bán hàng</h5>
            </div>
            <div class="detail-content">
              <div class="detail-item">
                <span class="detail-label">Tỷ lệ chuyển đổi</span>
                <span class="detail-value">{{ salesStats.conversionRate }}%</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Giá trị đơn hàng TB</span>
                <span class="detail-value">{{ formatCurrency(salesStats.avgOrderValue) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Tỷ lệ hủy đơn</span>
                <span class="detail-value">{{ salesStats.cancelRate }}%</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="detail-card">
            <div class="detail-header">
              <h5 class="detail-title">Kho hàng</h5>
            </div>
            <div class="detail-content">
              <div class="detail-item">
                <span class="detail-label">Tổng sản phẩm</span>
                <span class="detail-value">{{ inventoryStats.totalProducts }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Sắp hết hàng</span>
                <span class="detail-value text-warning">{{ inventoryStats.lowStock }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Hết hàng</span>
                <span class="detail-value text-danger">{{ inventoryStats.outOfStock }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref, computed, watch} from 'vue'
import { cloneDeep } from 'lodash-unified'
import moment from 'moment'
import Bar from './components/Bar.vue'
import Pie from './components/Pie.vue'
import { apiGetOrderStatistic, apiGetRevenueStatistic, apiGetTopProductRevenue, apiGetRecentOrders } from '@/api/dashboard'
import {useConfig} from '@/config'

// Reactive data
const defaultFilter = {
  type: 1,
  timeSearch: [
    moment().subtract(14, 'days').startOf('day').format('YYYY-MM-DD'),
    moment().endOf('day').format('YYYY-MM-DD'),
  ],
  month: moment().month() + 1,
  year: moment().year(),
  selectedYear: moment().year()
}

const filter = reactive(cloneDeep(defaultFilter))
const chartLoading = ref(false)

// Danh sách tháng
const months = ref([
  { label: 'Tháng 1', value: 1 },
  { label: 'Tháng 2', value: 2 },
  { label: 'Tháng 3', value: 3 },
  { label: 'Tháng 4', value: 4 },
  { label: 'Tháng 5', value: 5 },
  { label: 'Tháng 6', value: 6 },
  { label: 'Tháng 7', value: 7 },
  { label: 'Tháng 8', value: 8 },
  { label: 'Tháng 9', value: 9 },
  { label: 'Tháng 10', value: 10 },
  { label: 'Tháng 11', value: 11 },
  { label: 'Tháng 12', value: 12 }
])

// Danh sách năm (từ 2020 đến năm hiện tại + 1)
const years = ref(
    (() => {
      const currentYear = moment().year()
      const list = []
      for (let y = 2020; y <= currentYear + 1; y++) {
        list.push(y)
      }
      return list.reverse()
    })()
)

const orderStatistics = ref({
  totalOrder: 0,
  totalUserPurchases: 0,
  totalCompletedOrder: 0,
  totalRefundedOrder: 0,
})

const chartData = ref([])

const topProducts = ref([
  {
    id: 1,
    name: 'FORTUNATTO SAUVIGNON BLANC 2023',
    category: 'Rượu vang trắng',
    sold: 156,
    price: 255000,
    image: 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  },
  {
    id: 2,
    name: 'FORTUNATTO RESERVA CARMENERE 2022',
    category: 'Rượu vang đỏ',
    sold: 134,
    price: 758000,
    image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  },
  {
    id: 3,
    name: 'CHÂTEAU MARGAUX 2018',
    category: 'Rượu vang cao cấp',
    sold: 89,
    price: 2500000,
    image: 'https://images.pexels.com/photos/1407847/pexels-photo-1407847.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  },
  {
    id: 4,
    name: 'DOMAINE DE LA CÔTE PINOT NOIR',
    category: 'Rượu vang đỏ',
    sold: 76,
    price: 1200000,
    image: 'https://images.pexels.com/photos/1407848/pexels-photo-1407848.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  },
  {
    id: 5,
    name: 'CLOUDY BAY CHARDONNAY 2022',
    category: 'Rượu vang trắng',
    sold: 65,
    price: 890000,
    image: 'https://images.pexels.com/photos/1407849/pexels-photo-1407849.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
  }
])

const recentOrders = ref([
  {
    id: 1004,
    user: {
      id: 'e570f804-375a-43bc-8b78-ba1fc19d79e9',
      firstName: 'Nguyễn ',
      lastName: 'Hoàng',
    },
    totalAmount: 2529000,
    status: 'PENDING',
    createTime: '2025-01-15 14:30:00'
  }
])

const customerStats = ref({
  newCustomers: 156,
  returningCustomers: 736,
  retentionRate: 82.5
})

const salesStats = ref({
  conversionRate: 3.2,
  avgOrderValue: 1850000,
  cancelRate: 7.3
})

const inventoryStats = ref({
  totalProducts: 245,
  lowStock: 12,
  outOfStock: 3
})

// Computed properties
const totalRevenue = computed(() => {
  return chartData.value.reduce((sum, item) => sum + Number(item.revenue), 0)
})

const pieData = computed(() => {
  return topProducts.value.slice(0, 5).map(product => ({
    name: product.name,
    value: product.totalQuantity,
    color: getRandomColor()
  }))
})

// Methods
const formatNumber = (value) => {
  if (!value) return '0'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const formatCurrency = (value) => {
  if (!value) return '0 VND'
  return formatNumber(value) + ' VND'
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return moment(dateString).format('DD/MM/YYYY HH:mm')
}

const formatOrderStatus = (status) => {
  const statusMap = {
    'SUCCESS': 'Thành công',
    'PENDING': 'Chờ xử lý',
    'PROCESSING': 'Đang xử lý',
    'CANCELED': 'Đã hủy',
    'REFUNDED': 'Đã hoàn tiền'
  }
  return statusMap[status] || status
}

const getOrderStatusType = (status) => {
  const typeMap = {
    'SUCCESS': 'success',
    'PENDING': 'warning',
    'PROCESSING': 'primary',
    'CANCELED': 'danger',
    'REFUNDED': 'info'
  }
  return typeMap[status] || 'info'
}

const getRandomColor = () => {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']
  return colors[Math.floor(Math.random() * colors.length)]
}

const getPreviousPeriodText = () => {
  switch (filter.type) {
    case 1:
      return 'kỳ trước'
    case 2:
      return 'tháng trước'
    case 3:
      return 'năm trước'
    default:
      return 'kỳ trước'
  }
}

const getChartTitle = () => {
  switch (filter.type) {
    case 1:
      return 'ngày'
    case 2:
      return 'tháng'
    case 3:
      return 'năm'
    default:
      return 'thời gian'
  }
}

const handleFilterTypeChange = () => {
  // Reset filter values when type changes
  if (filter.type === 1) {
    filter.timeSearch = [
      moment().subtract(14, 'days').startOf('day').format('YYYY-MM-DD'),
      moment().endOf('day').format('YYYY-MM-DD'),
    ]
  } else if (filter.type === 2) {
    filter.month = moment().month() + 1
    filter.year = moment().year()
  } else if (filter.type === 3) {
    filter.selectedYear = moment().year()
  }

  console.log(filter, 'â')
  getDataDefault()
}

const getDataDefault = async () => {
  try {
    chartLoading.value = true

    const params = {
      type: filter.type,
      limit: 10
    }

    // Xây dựng params theo loại filter
    if (filter.type === 1) {
      // Filter theo ngày
      params.dateFilter = {
        fromDate: filter.timeSearch && filter.timeSearch.length > 0 ? filter.timeSearch[0] : null,
        toDate: filter.timeSearch && filter.timeSearch.length > 0 ? filter.timeSearch[1] : null
      }
    } else if (filter.type === 2) {
      // Filter theo tháng
      params.monthYearFilter = {
        month: filter.month,
        year: filter.year
      }
    } else if (filter.type === 3) {
      // Filter theo năm
      params.monthYearFilter = {
        year: filter.selectedYear
      }
    }

    const [orderResponse, revenueResponse, topProductSales] = await Promise.all([
      apiGetOrderStatistic(params),
      apiGetRevenueStatistic(params),
      apiGetTopProductRevenue(params)
    ])

    if (orderResponse.code === 200) {
      orderStatistics.value = orderResponse.data
    }

    if (revenueResponse.code === 200) {
      if (params.type === 3) {
        chartData.value = revenueResponse.data.monthlyRevenues || []
      } else {
        chartData.value = revenueResponse.data.dailyRevenues || []
      }
    }

    if (topProductSales.code === 200) {
      topProducts.value = topProductSales.data
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    chartLoading.value = false
  }
}

// recent orders
const getRecentOrders = async () => {
  const rs = await apiGetRecentOrders()
  if (rs.code === 200) {
    recentOrders.value = rs.data
  }
}

const config = useConfig()
const baseUrl = ref(config.VITE_PROXY_DOMAIN)
const getImage = (url) => {
  return url ? baseUrl.value + 'media-service/api/v1.0/images' + url.replace(/^\.\/uploads/, '/uploads') : null
}

// Lifecycle
onMounted(() => {
  getDataDefault()
  getRecentOrders()
})

watch(() => filter.type, () => {
  handleFilterTypeChange()
  console.log(filter, 'aaaa')
})

watch(() => filter.timeSearch, () => {
  if (filter.type === 1) {
    getDataDefault()
    console.log('TimeSearch changed', filter)
  }
})

watch([() => filter.month, () => filter.year], () => {
  if (filter.type === 2 && filter.month && filter.year) {
    getDataDefault()
    console.log('Month/Year changed', filter)
  }
})

watch(() => filter.selectedYear, () => {
  if (filter.type === 3 && filter.selectedYear) {
    getDataDefault()
    console.log('SelectedYear changed', filter)
  }
})
</script>

<style scoped lang="scss">
.dashboard-container {
  background: #f8fafc;
  min-height: 100vh;
}

.padding-20 {
  padding: 20px;
}

.filter-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #eff6ff;
  border-radius: 8px;
}

// Stat Cards
.stat-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  }

  &.stat-card-orders::before {
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  }

  &.stat-card-customers::before {
    background: linear-gradient(90deg, #10b981, #059669);
  }

  &.stat-card-success::before {
    background: linear-gradient(90deg, #f59e0b, #d97706);
  }

  &.stat-card-revenue::before {
    background: linear-gradient(90deg, #8b5cf6, #7c3aed);
  }
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  .stat-card-orders & {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  }

  .stat-card-customers & {
    background: linear-gradient(135deg, #10b981, #059669);
  }

  .stat-card-success & {
    background: linear-gradient(135deg, #f59e0b, #d97706);
  }

  .stat-card-revenue & {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  }
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
  line-height: 1;
}

.stat-change {
  font-size: 12px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;

  &.positive {
    color: #059669;
  }

  &.negative {
    color: #dc2626;
  }
}

.change-icon {
  font-weight: bold;
}

// Chart Cards
.chart-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  height: 400px;

  :deep(.el-card__body) {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.chart-header {
  padding: 20px 20px 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.chart-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;

  &.revenue {
    background: #3b82f6;
  }

  &.orders {
    background: #10b981;
  }
}

.chart-container {
  flex: 1;
  padding: 0 20px 20px 20px;
}

// Table Cards
.table-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  height: 400px;

  :deep(.el-card__body) {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.table-header {
  padding: 20px 20px 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 16px;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.view-all-btn {
  color: #3b82f6;
  font-size: 14px;
  padding: 0;
  border: none !important;
}

// Product List
.product-list {
  flex: 1;
  padding: 0 20px 20px 20px;
  overflow-y: auto;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
}

.product-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.product-image {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 2px 0;
  line-height: 1.2;
}

.product-category {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.product-stats {
  text-align: right;
}

.product-sold {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 2px;
}

.product-price {
  font-size: 14px;
  font-weight: 600;
  color: #059669;
}

// Order List
.order-list {
  flex: 1;
  padding: 0 20px 20px 20px;
  overflow-y: auto;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
}

.order-info {
  flex: 1;
}

.order-id {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 2px 0;
}

.order-customer {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 2px 0;
}

.order-time {
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
}

.order-details {
  text-align: right;
}

.order-amount {
  font-size: 14px;
  font-weight: 600;
  color: #059669;
  margin-bottom: 4px;
}

.order-status {
  font-size: 11px;
}

// Detail Cards
.detail-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.detail-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 16px;
}

.detail-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  color: #6b7280;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;

  &.text-warning {
    color: #f59e0b;
  }

  &.text-danger {
    color: #dc2626;
  }
}

// Responsive
@media (max-width: 768px) {
  .padding-20 {
    padding: 16px;
  }

  .stat-value {
    font-size: 24px;
  }

  .chart-card,
  .table-card {
    height: 300px;
  }

  .product-name {
    font-size: 13px;
  }

  .order-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .order-details {
    text-align: left;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
