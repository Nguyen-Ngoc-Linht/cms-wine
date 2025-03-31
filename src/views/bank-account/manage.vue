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
          @click="showBankDialog = true"
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
            Thêm tài khoản
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
          :data="list"
          :page="filter.page"
          :size="filter.size"
        >
          <template #STT="{ row }">
            <span>{{ row.stt }}</span>
          </template>
          <template #category="{ row }">
            <span>{{ row.category.name }}</span>
          </template>
          <template #viewCount="{ row }">
            <p class="text-center">{{ row.viewCount }}</p>
          </template>
          <template #action="{ row }">
            <span
              @click.stop="openEditBankAccount(row)"
              class="delete-member pointer ms-2 me-3"
            >
              <svg-icon
                style="width: 24px; height: 24px"
                icon-class="edit-administrative"
                class="mr-2"
              />
            </span>
            <span
              @click.stop="openDialogDelete(row)"
              class="delete-member pointer"
            >
              <svg-icon
                style="width: 24px; height: 24px"
                icon-class="remove-administrative"
              />
            </span>
          </template>
          <template #defaultAction="{ row }">
            <el-radio
                v-model="defaultMethod"
                :label="row.id"
                @change="handleDefaultMethodChange(row.id)"
            >
              &nbsp;
            </el-radio>
          </template>
        </TableViolation>
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
        <form-category
          :type-dialog="typeDialog"
          :category-info="infoBankAccount"
          @closeUpdate="handleCloseDialog"
        ></form-category>
      </template>
    </Dialog>
    <el-dialog
      v-model="deleteBankAccountDialog"
      title="Xóa tài khoản"
      width="500"
      align-center
    >
      <span>Bạn có chắc chắn muốn xóa tài khoản đã chọn</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="deleteBankAccountDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleDeleteBankAccount()"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="showBankDialog"
      :title="dialogTitle"
      width="500px"
      @close="resetBankAccount"
    >
      <el-form
        ref="formRef"
        :model="bankAccount"
        :rules="rules"
        label-width="120px"
        label-position="top"
      >
        <el-form-item
          label="Tên ngân hàng"
          prop="bankName"
        >
          <el-input v-model="bankAccount.bankName" />
        </el-form-item>

        <el-form-item
          label="Số tài khoản"
          prop="accountNumber"
        >
          <el-input v-model="bankAccount.accountNumber" />
        </el-form-item>

        <el-form-item
          label="Tên chủ sở hữu"
          prop="accountName"
        >
          <el-input v-model="bankAccount.accountName" />
        </el-form-item>

        <el-form-item
          label="Chi nhánh"
          prop="branch"
        >
          <el-input v-model="bankAccount.branch" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showBankDialog = false">Hủy</el-button>
        <el-button
          type="primary"
          @click="handleSaveBankAccount"
          >Lưu
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-unified'
import { useI18n } from '@/locale'
import TableViolation from '@/components/Table/index.vue'
import { apiDeleteProduct } from '@/api/product'
import {
  apiCreateBankAccount, apiDeleteBankAccount,
  apiGetAllBankAccount,
  apiSetDefaultBankAccount,
  apiUpdateBankAccount,
} from '@/api/bank-account'
import Dialog from '@/components/Dialog/index.vue'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import FormCategory from '@/views/category/FormCategory.vue'

const { t } = useI18n()

const fields = ref([
  {
    key: 'STT',
    label: 'STT',
    width: 80,
    prop: 'STT',
  },
  {
    key: 'bankName',
    label: 'Tên ngân hàng',
    prop: 'bankName',
  },
  {
    key: 'accountNumber',
    label: 'Số tài khoản',
    prop: 'accountNumber',
  },
  {
    key: 'accountName',
    label: 'Tên chủ sở hữu',
    prop: 'accountName',
  },
  {
    key: 'branch',
    label: 'Chi nhánh',
    prop: 'branch',
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
    // width: 150,
    align: 'center',
  },
  {
    key: 'defaultAction',
    label: 'Mặc định',
    width: 100,
    prop: 'defaultAction',
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
const deleteBankAccountDialog = ref(false)
const showBankDialog = ref(false)
const dialogTitle = ref('Thêm tài khoản ngân hàng')
const isEditing = ref(false)
const defaultFilter = {
  keyword: null,
  timeSearch: null,
}
const bankAccount = reactive({
  bankName: '',
  accountNumber: '',
  accountName: '',
  branch: '',
})
const openEditBankAccount = row => {
  isEditing.value = true
  dialogTitle.value = 'Chỉnh sửa tài khoản ngân hàng'
  bankAccount.id = row.id
  bankAccount.bankName = row.bankName
  bankAccount.accountNumber = row.accountNumber
  bankAccount.accountName = row.accountName
  bankAccount.branch = row.branch
  showBankDialog.value = true
}
const resetBankAccount = () => {
  bankAccount.bankName = ''
  bankAccount.accountNumber = ''
  bankAccount.accountName = ''
  bankAccount.branch = ''
  isEditing.value = false
  dialogTitle.value = 'Thêm tài khoản ngân hàng'
}
const formRef = ref(null)

const rules = reactive({
  bankName: [{ required: true, message: 'Tên ngân hàng không được để trống', trigger: 'blur' }],
  accountNumber: [{ required: true, message: 'Số tài khoản không được để trống', trigger: 'blur' }],
  accountName: [{ required: true, message: 'Tên chủ sở hữu không được để trống', trigger: 'blur' }],
  branch: [{ required: false }],
})
const filter = reactive(cloneDeep(defaultFilter))
const showDialog = ref(false)
const titleDialog = ref('')
const typeDialog = ref('add')
const infoBankAccount = ref({})

const defaultMethod = computed({
  get: () => list.value.find(i => i.isDefault === true).id,
  set: newValue => {
    // const defaultId = list.value.find(i => i.isDefault === 1).id
    list.value.forEach(i => (i.isDefault = i.id === newValue))
  },
})

const handleDefaultMethodChange = async id => {
  try {
    await ElMessageBox.confirm(
      'Bạn có chắc chắn muốn đặt tài khoản này làm mặc định?',
      'Xác nhận',
      {
        confirmButtonText: 'Có',
        cancelButtonText: 'Hủy',
        type: 'warning',
      }
    )

    const rs = await apiSetDefaultBankAccount(id)
    if (rs.code === 200) {
      console.log('set defaultMethod', rs)
      ElMessage.success('Cài mặc định thành công')
    } else {
      ElMessage.error('Cài mặc định thất bại')
    }
  } catch (error) {
    console.log('Người dùng đã hủy xác nhận.')
  }
  await getList()
}

onMounted(() => {
  getList()
})

const getList = async () => {
  listLoading.value = true
  const fromDate = filter.timeSearch?.[0] || null
  const toDate = filter.timeSearch?.[1] || null

  const params = {
    name: filter.keyword || null,
    fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
    toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
  }
  const rs = await apiGetAllBankAccount(params)
  if (rs.code === 200) {
    list.value = rs.data.map((item, index) => ({
      ...item,
      stt: index + 1,
    }))
    filter.total = rs.data.totalElements
  }
  listLoading.value = false
}
const handleSaveBankAccount = async () => {
  if (!formRef.value) return console.error('⚠ formRef.value is null')

  try {
    const isValid = await formRef.value.validate().catch(() => false)
    if (!isValid) return ElMessage.warning('Vui lòng kiểm tra lại thông tin!')

    let response
    if (isEditing.value) {
      response = await apiUpdateBankAccount(bankAccount.id, bankAccount)
    } else {
      response = await apiCreateBankAccount(bankAccount)
    }
    if (response.code === 200 || response.code === 201) {
      ElMessage.success(isEditing.value ? 'Cập nhật thành công!' : 'Thêm thành công!')
      showBankDialog.value = false
      await getList()
    } else {
      ElMessage.error('Có lỗi xảy ra!')
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Lỗi kết nối đến server!')
  }
}

const openDialogDelete = data => {
  infoBankAccount.value = data
  deleteBankAccountDialog.value = true
}
const handleDeleteBankAccount = async () => {
  try {
    const rs = await apiDeleteBankAccount(infoBankAccount.value.id)
    if (rs.code === 200) {
      ElMessage.success('Xóa tài khoản thành công')
    } else {
      ElMessage.error('Xóa tài khoản thất bại')
    }
    deleteBankAccountDialog.value = false
    await getList()
  } catch (e) {
    console.log(e)
  }
}

const handleCloseDialog = () => {
  showDialog.value = false
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
