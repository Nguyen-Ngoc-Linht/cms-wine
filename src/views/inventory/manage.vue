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
      <el-button
        class="el-button--main"
        @click="getList()"
        >{{ t('configUser.search') }}
      </el-button>
    </div>
    <div class="flex items-center justify-between paddingX-24 mt-3">
      <div class="flex gap-px-8 items-center">
        <el-button
            @click="showImportGoods = true"
            text
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
            Nhập hàng
          </div>
        </el-button>
      </div>
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
          <template #price="{ row }">
            <span>{{ formatNumber(row.price, '.') + ' VND' }}</span>
          </template>
          <template #active="{ row }">
            <span>{{ row.active === true ? 'Hoạt động' : 'Ngừng hoạt động'}}</span>
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
            <span @click.stop="openImportGoods(row)"
              class="delete-member pointer"
            >
              <svg-icon
                style="width: 24px; height: 24px"
                icon-class="el-icon-plus"
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
      v-model="showImportGoods"
      :title="dialogTitle"
      width="500px"
      @close="resetImportGoods"
    >
      <el-form
          ref="formRef"
          :model="importGoods"
          :rules="rules"
          label-width="180px"
          label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Chọn biến thể" prop="variantId">
              <el-select
                  v-model="importGoods.variantId"
                  placeholder="Chọn biến thể"
                  filterable
                  style="width: 100%"
                  :disabled="isEditing"
              >
                <el-option
                    v-for="item in list"
                    :key="item.id"
                    :label="item.variantCode + ' - ' + item.variantName"
                    :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Số lượng muốn nhập" prop="quantity">
              <el-input v-model="importGoods.quantity" type="number" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Giá nhập" prop="costPrice">
              <el-input
                v-model="importGoods.costPrice"
                type="number"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="Ghi chú cho lần nhập hàng" prop="note">
              <el-input v-model="importGoods.note" type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="showImportGoods = false">Hủy</el-button>
        <el-button
          type="primary"
          @click="handleImportGoods"
          >Lưu
        </el-button>
      </template>
    </el-dialog>
    <el-dialog
        v-model="showEditInventoryDialog"
        :title="dialogTitle"
        width="500px"
        @close="resetImportGoods"
    >
      <el-form
          ref="formRefUpdateVariant"
          :model="variant"
          :rules="updateVariantRules"
          label-width="180px"
          label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Mã biến thể" prop="variantCode">
              <el-input v-model="variant.variantCode" disabled/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Tên biến thể" prop="variantName">
              <el-input v-model="variant.variantName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Số lượng còn" prop="quantity">
              <el-input v-model="variant.quantity" type="number" disabled/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Giá bán" prop="price">
              <el-input v-model="variant.price" type="number"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Trạng thái hoạt động" prop="active">
              <el-switch
                  v-model="variant.active"
                  active-text="Hoạt động"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="showEditInventoryDialog = false">Hủy</el-button>
        <el-button type="primary" @click="handleUpdateVariant(variant.id)">Lưu</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-unified'
import { useI18n } from '@/locale'
import TableViolation from '@/components/Table/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import FormCategory from '@/views/category/FormCategory.vue'
import {apiGetVariants, apiImportGoods, apiUpdateVariant} from '@/api/inventory'
import Pagination from '@/components/Pagination/index.vue'
import {formatNumber} from '@/utils'
import ElInputInteger from '@/components/InputInteger/index.vue'

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
    key: 'variantName',
    label: 'Tên loại biến thể',
    prop: 'variantName',
  },
  {
    key: 'price',
    label: 'Giá bán',
    prop: 'price',
  },
  {
    key: 'quantity',
    label: 'Số lượng',
    prop: 'quantity',
  },
  {
    key: 'productName',
    label: 'Họ sản phẩm',
    prop: 'productName',
  },
  {
    key: 'createdAt',
    label: 'Thời gian tạo',
    prop: 'createdAt',
  },
  {
    key: 'active',
    label: 'Trạng thái',
    prop: 'active',
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
const showImportGoods = ref(false)
const showEditInventoryDialog = ref(false)
const dialogTitle = ref('Thêm tài khoản ngân hàng')
const isEditing = ref(false)
const defaultFilter = {
  page: 1,
  size: 10,
  total: 0,
  keyword: null,
  timeSearch: null,
}
const importGoods = reactive({
  quantity: '',
  costPrice: '',
  note: '',
})
const variant = reactive({
  variantCode: '',
  variantName: '',
  price: '',
  quantity: '',
  active: '',
})
const openImportGoods = row => {
  dialogTitle.value = 'Thêm thông tin Lô hàng muốn nhập'
  importGoods.variantId = row.id
  showImportGoods.value = true
  isEditing.value = true
}
const resetImportGoods = () => {
  importGoods.quantity = ''
  importGoods.costPrice = ''
  importGoods.note = ''
  dialogTitle.value = 'Thêm thông tin lô hàng muốn nhập'
}
const openEditInventory = row => {
  dialogTitle.value = 'Cập nhật'
  variant.id = row.id
  variant.variantCode = row.variantCode
  variant.variantName = row.variantName
  variant.quantity = row.quantity
  variant.price = row.price
  variant.active = row.active
  showEditInventoryDialog.value = true
}
const formRef = ref(null)
const formRefUpdateVariant = ref(null)

const rules = reactive({
  quantity: [
    { required: true, message: 'Số lượng không được để trống', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value < 0) {
          callback(new Error('Số lượng không được nhỏ hơn 0'))
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
  note: [{ required: false }],
  variantId: [{ required: true, message: 'Vui lòng chọn biến thể', trigger: 'change' }]
})
const updateVariantRules = reactive({
  price: [
    { required: true, message: 'Giá bán không được để trống', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value < 0) {
          callback(new Error('Giá bán không được nhỏ hơn 0'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  variantName: [
    { required: true, message: 'Tên biến thể không được để trống', trigger: 'blur' }
  ],
})
const filter = reactive(cloneDeep(defaultFilter))
const showDialog = ref(false)

onMounted(() => {
  getList()
})

const getList = async () => {
  listLoading.value = true
  const fromDate = filter.timeSearch?.[0] || null
  const toDate = filter.timeSearch?.[1] || null
  const params = {
    keyword: filter.keyword || null,
    fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
    toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
    paged: {
      page: filter.page,
      size: filter.size
    }
  }
  const rs = await apiGetVariants(params)
  if (rs.code === 200) {
    list.value = rs.data.content
    filter.total = rs.data.totalElements
  }
  listLoading.value = false
}

const handleImportGoods = async () => {
  if (!formRef.value) {
    console.error('⚠ formRef.value is null')
    return
  }

  try {
    const isValid = await formRef.value.validate().catch(() => false)
    if (!isValid) return ElMessage.warning('Vui lòng kiểm tra lại thông tin!')

    await ElMessageBox.confirm(
        'Bạn có chắc chắn muốn lưu thông tin nhập hàng này?',
        'Xác nhận',
        {
          confirmButtonText: 'Lưu',
          cancelButtonText: 'Hủy',
          type: 'warning',
        }
    )

    const { code } = await apiImportGoods(importGoods)

    if ([200, 201].includes(code)) {
      ElMessage.success('Thêm thành công!')
      showImportGoods.value = false
      await getList()
    } else {
      ElMessage.error('Có lỗi xảy ra!')
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Lỗi kết nối đến server!')
  }
}

const handleUpdateVariant = async (variant_id) => {
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

    const { code } = await apiUpdateVariant(variant, variant_id)

    if ([200, 201].includes(code)) {
      ElMessage.success('Cập nhật thành công!')
      showEditInventoryDialog.value = false
      await getList()
    } else {
      ElMessage.error('Có lỗi xảy ra!')
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Lỗi kết nối đến server!')
  }
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
