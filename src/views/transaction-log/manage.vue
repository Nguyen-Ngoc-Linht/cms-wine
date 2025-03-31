<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5">
      <el-input
        v-model="filter.keyword"
        @keyup.enter="getList"
        :placeholder="t('el.transfer.filterPlaceholder')"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
      </el-input>
      <el-date-picker
        v-model="filter.timeSearch"
        type="daterange"
        :start-placeholder="t('el.datepicker.startTime')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.endTime')"
        clearable
        value-format="YYYY-MM-DD"
        format="DD/MM/YYYY"
        class="w-full md:max-w-[30%] lg:max-w-[360px] flex-grow-0"
      />
      <el-select
          v-model="filter.bankAccount"
          placeholder="Chọn tài khoản nhận tiền"
          clearable
          filterable
          multiple
          collapse-tags
          collapse-tags-tooltip
          class="w-full md:max-w-[30%] lg:max-w-[200px] short"
          @change="updateBankAccountFilter"
      >
        <el-option
            v-for="account in bankAccounts"
            :key="account.value"
            :label="account.label"
            :value="account.value"
        />
      </el-select>
      <el-button
        class="el-button--main"
        @click="getList()"
        >{{ t('configUser.search') }}
      </el-button>
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <!--  Table  -->
    <div class="paddingX-24 mt-3">
      <div class="padding-12 bg-white">
        <TableViolation
          :listLoading="listLoading"
          :fields="fields"
          :STT="true"
          :data="list"
          :page="filter.page"
          :size="filter.size"
        >
          <template #amount="{ row }">
            <span>{{ formatNumber(row.amount, '.') + ' VND' }}</span>
          </template>
          <template #bankAccount="{ row }">
            <span>{{ row.accountName + ' - ' + row.bankName}}</span>
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
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-unified'
import { useI18n } from '@/locale'
import TableViolation from '@/components/Table/index.vue'
import {
  apiGetAllTransactionLog

} from '@/api/transaction-log'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import Pagination from '@/components/Pagination/index.vue'
import {formatNumber} from '@/utils'
import {apiGetAllBankAccount} from '@/api/bank-account'

const { t } = useI18n()

const fields = ref([
  {
    key: 'id',
    label: 'ID',
    width: 80,
    prop: 'id',
  },
  {
    key: 'bankAccount',
    label: 'Tài khoản nhận',
    prop: 'bankAccount',
  },
  {
    key: 'transactionCode',
    label: 'Nội dung giao dịch',
    prop: 'transactionCode',
  },
  {
    key: 'amount',
    label: 'Tổng tiền',
    width: 150,
    prop: 'amount',
  },
  {
    key: 'payerName',
    label: 'UserId',
    prop: 'payerName',
  },
  {
    key: 'paymentTime',
    label: 'Thời gian chuyển',
    prop: 'paymentTime',
    // width: 150,
    align: 'center',
  },
])

const listLoading = ref(true)
const list = ref([])
const defaultFilter = {
  page: 1,
  size: 10,
  total: 0,
  bankAccountId: null,
  keyword: null,
  bankAccount: [],
  timeSearch: null,
}
const bankAccounts = ref([])
const filter = reactive(cloneDeep(defaultFilter))
const showDialog = ref(false)
const infoBankAccount = ref({})
onMounted(() => {
  getList()
  getBankAccounts()
})

const getList = async () => {
  listLoading.value = true
  const fromDate = filter.timeSearch?.[0] || null
  const toDate = filter.timeSearch?.[1] || null

  const params = {
    keyword: filter.keyword || null,
    fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
    toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
    bankAccountIds: filter.bankAccount.length > 0 ? filter.bankAccount : null, // Lấy danh sách ID tài khoản đã chọn
    paged: {
      page: filter.page,
      size: filter.size
    }
  }
  const rs = await apiGetAllTransactionLog(params)
  if (rs.code === 200) {
    list.value = rs.data.content.map((item, index) => ({
      ...item,
    }))
    filter.total = rs.data.totalElements
  }
  listLoading.value = false
}

const getBankAccounts = async () => {
  try {
    const res = await apiGetAllBankAccount()
    if (res.code === 200) {
      bankAccounts.value = res.data.map(item => ({
        label: item.bankName + ' - ' + item.accountNumber,
        value: item.id
      }))
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tài khoản:', error)
  }
}

const updateBankAccountFilter = () => {
  filter.bankAccountId = filter.bankAccount // Cập nhật danh sách ID tài khoản đã chọn
}

const handleSizeChange = size => {
  filter.size = size
  getList()
}
const handlePageChange = page => {
  filter.page = page
  getList()
}
</script>

<style lang="scss" scoped>
.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}
</style>
