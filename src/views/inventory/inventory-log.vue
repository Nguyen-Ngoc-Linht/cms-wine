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
      <el-select
          v-model="filter.variants"
          placeholder="Chọn biến thể"
          clearable
          filterable
          multiple
          collapse-tags
          collapse-tags-tooltip
          class="w-full md:max-w-[30%] lg:max-w-[200px] short"
          @change="updateVariantFilter"
      >
        <el-option
            v-for="variant in variants"
            :key="variant.value"
            :label="variant.label"
            :value="variant.value"
        />
      </el-select>
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
          <template #costPrice="{ row }">
            <span>{{ formatNumber(row.costPrice, '.') + ' VND' }}</span>
          </template>
          <template #variantCode="{ row }">
            <span>{{ row.productVariant.variantCode}}</span>
          </template>
          <template #action="{ row }">
            <span
                @click.stop="openEditInventory(row)"
                class="delete-member pointer ms-2 me-3"
            >
              <svg-icon
                  style="width: 24px; height: 24px"
                  icon-class="edit-administrative"
                  class="mr-2"
              />
            </span>
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
    <el-dialog
        v-model="showEditInventoryDialog"
        :title="dialogTitle"
        width="500px"
    >
      <el-form
          ref="formRefUpdateVariant"
          :model="inventoryLog"
          :rules="updateImportGoodsRules"
          label-width="180px"
          label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Mã biến thể" prop="variantCode">
              <el-input v-model="inventoryLog.variantCode" disabled/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Số lượng nhập" prop="variantName">
              <el-input v-model="inventoryLog.quantity" type="number"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Số lượng còn" prop="quantity">
              <el-input v-model="inventoryLog.remainingQuantity" type="number" disabled/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Giá nhập" prop="price">
              <el-input v-model="inventoryLog.costPrice" type="number"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Ghi chú nhập hàng" prop="active">
              <el-input v-model="inventoryLog.note" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="showEditInventoryDialog = false">Hủy</el-button>
        <el-button type="primary" @click="handleUpdateImportGoods(inventoryLog.id)">Lưu</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-unified'
import { useI18n } from '@/locale'
import TableViolation from '@/components/Table/index.vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import {
  apiGetAllVariants,
  apiImportGoods,
  apiInventoryLogs,
  apiUpdateImportGoods,
  apiUpdateVariant
} from '@/api/inventory'
import Pagination from '@/components/Pagination/index.vue'
import {formatNumber} from '@/utils'

const { t } = useI18n()

const fields = ref([
  {
    key: 'id',
    label: 'ID',
    width: 80,
    prop: 'id',
  },
  {
    key: 'variantCode',
    label: 'Mã loại biến thể',
    prop: 'variantCode',
  },
  {
    key: 'quantity',
    label: 'Số lượng nhập',
    prop: 'quantity',
  },
  {
    key: 'remainingQuantity',
    label: 'Số lượng còn lại',
    prop: 'remainingQuantity',
  },
  {
    key: 'costPrice',
    label: 'Giá nhập',
    prop: 'costPrice',
  },
  {
    key: 'note',
    label: 'Ghi chú nhập hàng',
    prop: 'note',
  },
  {
    key: 'createdAt',
    label: 'Thời gian tạo',
    prop: 'createdAt',
  },
  {
    key: 'updatedAt',
    label: 'Thời gian cập nhật',
    prop: 'updatedAt',
  },
  {
    key: 'action',
    label: 'Thao tác',
    width: 120,
    prop: 'action',
  },
])

const listLoading = ref(true)
const list = ref([])
const showEditInventoryDialog = ref(false)
const dialogTitle = ref('Cập nhật')
const defaultFilter = {
  page: 1,
  size: 10,
  total: 0,
  keyword: null,
  variantId: null,
  variants: [],
  timeSearch: null,
}
const inventoryLog = reactive({
  id: '',
  variantId: '',
  variantCode: '',
  quantity: '',
  remainingQuantity: '',
  costPrice: '',
  note: '',
})
const variants = ref([])
const openEditInventory = row => {
  dialogTitle.value = 'Cập nhật'
  inventoryLog.id = row.id
  inventoryLog.variantId = row.productVariant.id
  inventoryLog.variantCode = row.productVariant.variantCode
  inventoryLog.quantity = row.quantity
  inventoryLog.remainingQuantity = row.remainingQuantity
  inventoryLog.costPrice = row.costPrice
  inventoryLog.note = row.note
  showEditInventoryDialog.value = true
}
const formRefUpdateVariant = ref(null)

const updateImportGoodsRules = reactive({
  quantity: [
    { required: true, message: 'Số luợng nhập không được để trống', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value < 0) {
          callback(new Error('Số luợng nhập không được nhỏ hơn 0'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  costPrice: [
    { required: true, message: 'Giá nhập không được để trống', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value < 0) {
          callback(new Error('Giá nhập không được nhỏ hơn 0'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
})
const filter = reactive(cloneDeep(defaultFilter))

onMounted(() => {
  getList()
  getVariants()
})

const getList = async () => {
  listLoading.value = true
  const fromDate = filter.timeSearch?.[0] || null
  const toDate = filter.timeSearch?.[1] || null
  const params = {
    note: filter.keyword || null,
    variantIds: filter.variants.length > 0 ? filter.variants : null,
    fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
    toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
    paged: {
      page: filter.page,
      size: filter.size
    }
  }
  const rs = await apiInventoryLogs(params)
  if (rs.code === 200) {
    list.value = rs.data.content
    filter.total = rs.data.totalElements
  }
  listLoading.value = false
}
const handleUpdateImportGoods = async (inventory_log_id) => {
  if (!formRefUpdateVariant.value) {
    console.error('⚠ formRefUpdateVariant.value is null')
    return
  }

  try {
    const isValid = await formRefUpdateVariant.value.validate().catch(() => false)
    if (!isValid) return ElMessage.warning('Vui lòng kiểm tra lại thông tin!')

    await ElMessageBox.confirm(
        'Bạn có chắc chắn muốn cập nhật?',
        'Xác nhận',
        {
          confirmButtonText: 'Lưu',
          cancelButtonText: 'Hủy',
          type: 'warning',
        }
    )

    const { code, message } = await apiUpdateImportGoods(inventoryLog, inventory_log_id)
    console.log('eeeeeeeeeeeeeeeeeeeee', message)
    if ([200, 201].includes(code)) {
      ElMessage.success('Cập nhật thành công!')
      showEditInventoryDialog.value = false
      await getList()
    } else {
      console.log('aaaaaaaaaaaaaaaaaaaaaaaa')
      ElMessage.error('Có lỗi xảy ra!')
    }
  } catch (error) {
    console.log('bbbbbbbbbbbbbbbbbbbbbbb', error)
    ElMessage.error(error.response?.data?.message || 'Lỗi kết nối đến server!')
  }
}
const getVariants = async () => {
  try {
    const res = await apiGetAllVariants()
    if (res.code === 200) {
      variants.value = res.data.map(item => ({
        label: item.variantCode + ' - ' + item.variantName,
        value: item.id
      }))
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tài khoản:', error)
  }
}
const updateVariantFilter = () => {
  filter.variantId = filter.variants
}
</script>

<style lang="scss" scoped>
.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}
</style>
