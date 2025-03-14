<template>
  <div class="padding-20">
    <div class="flex justify-between">
      <h2 class="text-2xl font-bold">Biểu đồ tổng quan</h2>
      <div class="flex items-center gap-3">
        <svg-icon
          icon-class="filter-fill"
          class="width-24 height-24 text-[#0dcaf0]"
        />
        <el-select
          v-model="filter.type"
          filterable
          collapse-tags
          collapse-tags-tooltip
          class="w-full md:max-w-[30%] lg:max-w-[120px] short"
        >
          <el-option label="Ngày" :value="1"></el-option>
          <el-option label="Tháng" :value="2"></el-option>
          <el-option label="Năm" :value="3"></el-option>
        </el-select>
        <el-date-picker
          v-model="filter.timeSearch"
          type="daterange"
          @change="getDataDefault"
          start-placeholder="Ngày bắt đầu"
          range-separator="đến"
          end-placeholder="Ngày kết thúc"
          clearable
          value-format="YYYY-MM-DD"
          format="DD/MM/YYYY"
          class="w-full md:max-w-[30%] lg:max-w-[360px] flex-grow-0"
        />
      </div>
    </div>
    <el-row :gutter="20" class="mt-4">
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
import { onMounted, reactive, ref, watch } from 'vue'
import {apiGetOrderStatistic, apiGetRevenueStatistic} from '@/api/dashboard'
import Bar from '@/views/dashboard/components/Bar.vue'
import {cloneDeep} from 'lodash-unified'
import moment from 'moment'

const defaultFilter = {
  type: 1,
  timeSearch: [
    moment().subtract(14, 'days').startOf('day').format('YYYY-MM-DD'),
    moment().endOf('day').format('YYYY-MM-DD'),
  ],
}
const filter = reactive(cloneDeep(defaultFilter))
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
])

onMounted(() => {
  getDataDefault()
})
const getDataDefault = async () => {
  try {
    const params = {
      dateFilter: {
        fromDate: filter.timeSearch && filter.timeSearch.length > 0 ? filter.timeSearch[0] : null,
        toDate: filter.timeSearch && filter.timeSearch.length > 0 ? filter.timeSearch[1] : null
      },
      // "monthYearFilter": {
      //     "month": 3,
      //     "year": 2025
      // },
      type: 1
    }
    const rs = await apiGetOrderStatistic(params)
    if (rs.code === 200) {
      orderStatistics.value = rs.data
    }
    const rsData = await apiGetRevenueStatistic(params)
    if (rsData.code === 200) {
      dataBar.value = rsData.data.dailyRevenues
    }
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
