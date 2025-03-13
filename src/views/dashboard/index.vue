<template>
  <div class="padding-20">
    <h2 class="text-2xl font-bold">Biểu đồ tổng quan</h2>
    <el-row :gutter="20" class="mt-3">
      <el-col :span="6">
        <el-card>
          <div class="flex justify-between">
            <h6 class="text-gray-500">Tổng đơn hàng</h6>
          </div>
          <h2 class="text-[30px]">{{ orderStatistics.totalOrder }}</h2>
          <p class="text--success">Tăng 2% so với cùng kỳ</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="flex justify-between">
            <h6 class="text-gray-500">Số khách hàng</h6>
          </div>
          <h2 class="text-[30px]">{{ orderStatistics.totalUserPurchases }}</h2>
          <p class="text--success">Tăng 2% so với cùng kỳ</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="flex justify-between">
            <h6 class="text-gray-500">Số đơn thành công</h6>
          </div>
          <h2 class="text-[30px]">{{ orderStatistics.totalCompletedOrder }}</h2>
          <p class="text--success">Tăng 2% so với cùng kỳ</p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="flex justify-between">
            <h6 class="text-gray-500">Số đơn hủy</h6>
          </div>
          <h2 class="text-[30px]">{{ orderStatistics.totalRefundedOrder }}</h2>
          <p class="text--success">Tăng 2% so với cùng kỳ</p>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt-5">
      <el-col :span="12">
        <el-card class="card-bar">
          <div class="flex justify-between paddingX-20">
            <h5 class="text-xl font-semibold">Biểu đồ doanh thu</h5>
          </div>
          <Bar :data="dataBar"/>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="h-full">
          <div class="flex justify-between">
            <h5 class="text-xl font-semibold">Danh sách sản phẩm bán chạy</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="h-full"></el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import {apiGetOrderStatistic} from '@/api/dashboard'
import Bar from '@/views/dashboard/components/Bar.vue'

const orderStatistics = ref({
  totalOrder: 11,
  totalUserPurchases: 10,
  totalCompletedOrder: 4,
  totalRefundedOrder: 1,
})
const dataBar = ref([
  {
    date: '2025-03-01',
    revenue: 201
  },
  {
    date: '2025-03-02',
    revenue: 50
  },
  {
    date: '2025-03-03',
    revenue: 75.25
  },
  {
    date: '2025-03-04',
    revenue: 125.75
  },
  {
    date: '2025-03-05',
    revenue: 99.99
  },
  {
    date: '2025-03-06',
    revenue: 150
  },
  {
    date: '2025-03-07',
    revenue: 200.3
  },
  {
    date: '2025-03-08',
    revenue: 75
  },
  {
    date: '2025-03-09',
    revenue: 135.25
  },
  {
    date: '2025-03-10',
    revenue: 110.4
  },
  {
    date: '2025-03-11',
    revenue: 210.75
  },
  {
    date: '2025-03-12',
    revenue: 80.5
  },
  {
    date: '2025-03-13',
    revenue: 140.1
  },
  {
    date: '2025-03-14',
    revenue: 65.25
  },
  {
    date: '2025-03-15',
    revenue: 120
  },
  {
    date: '2025-03-16',
    revenue: 55.75
  },
  {
    date: '2025-03-17',
    revenue: 175.5
  },
  {
    date: '2025-03-18',
    revenue: 99.99
  },
  {
    date: '2025-03-19',
    revenue: 85.75
  },
  {
    date: '2025-03-20',
    revenue: 190.2
  },
])

onMounted(() => {
  // getDataDefault()
})
const getDataDefault = async () => {
  try {
    const params = {
      dateFilter: {
        fromDate: '2025-03-01',
        toDate: '2025-03-29'
      },
      // "monthYearFilter": {
      //     "month": 3,
      //     "year": 2025
      // },
      type: 1
    }
    const rs = await apiGetOrderStatistic(params)
    console.log(rs, 'data')
  } catch (e) {
    console.log(e)
  }
}
</script>

<style scoped lang="scss">
:deep(.card-bar .el-card__body) {
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-bottom: 0 !important;
}
</style>
