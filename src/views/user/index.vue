<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5">
      <el-input
        v-model="filter.name"
        @keyup.enter="getList"
        placeholder="Tên người dùng"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
      </el-input>
      <el-input
        v-model="filter.email"
        @keyup.enter="getList"
        placeholder="Email"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
      </el-input>
      <el-input
        v-model="filter.phone"
        @keyup.enter="getList"
        placeholder="Số điện thoại"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
      </el-input>
      <el-select
          v-model="filter.roles"
          placeholder="Quyền"
          clearable
          filterable
          multiple
          collapse-tags
          collapse-tags-tooltip
          class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.label"
            :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        class="el-button--main"
        @click="getList()"
        >{{ t('configUser.search') }}
      </el-button>
    </div>
    <!--    <div class="flex items-center justify-between paddingX-24 mt-3">-->
    <!--      <div class="flex gap-px-8 items-center">-->
    <!--        <el-button-->
    <!--          text-->
    <!--          size="default"-->
    <!--          class="!p-0"-->
    <!--        >-->
    <!--          <div-->
    <!--            class="flex items-center pointer text-[#525B73]"-->
    <!--            style="line-height: 20px"-->
    <!--          >-->
    <!--            <svg-icon-->
    <!--              icon-class="el-icon-plus"-->
    <!--              class="width-20 height-20 margin-right-4"-->
    <!--            />-->
    <!--            Thêm tài khoản-->
    <!--          </div>-->
    <!--        </el-button>-->
    <!--      </div>-->
    <!--    </div>-->
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
          <template #name="{ row }">
            <span>{{ row.firstName + ' ' + row.lastName }}</span>
          </template>
          <template #roleList="{ row }">
            <span>{{ formatRoles(row.roleList) }}</span>
          </template>
          <template #status="{ row }">
            <span>{{ formatStatus(row.status) }}</span>
          </template>
          <template #action="{ row }">
            <span
              @click.stop="handleEditUser(row)"
              class="delete-member pointer ms-2 me-3"
            >
              <svg-icon
                style="width: 24px; height: 24px"
                icon-class="edit-administrative"
                class="mr-2"
              />
            </span>
            <span
              v-if="row.status !== 0"
              @click.stop="openPasswordDialog(row)"
              class="delete-member pointer ms-2 me-3"
            >
              <svg-icon
                style="width: 24px; height: 24px"
                icon-class="change-password-icon"
                class="mr-2"
              />
            </span>
            <span
              v-if="row.status === 1 && !row.roleList.includes('ROLE_ADMIN')"
              @click.stop="handleDeleteUser(row)"
              class="delete-member pointer"
            >
              <svg-icon
                style="width: 24px; height: 24px"
                icon-class="user-block"
              />
            </span>
            <span
              v-if="row.status === 2 && !row.roleList.includes('ROLE_ADMIN')"
              @click.stop="handleUnlockUser(row)"
              class="delete-member pointer"
            >
              <svg-icon
                style="width: 24px; height: 24px"
                icon-class="user-active"
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
    <!-- Popup form -->
    <el-dialog
      v-model="showPasswordDialog"
      title="Đặt lại mật khẩu"
      width="500px"
      @close="resetPasswordForm"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="120px"
        label-position="top"
      >
        <el-form-item
          label="Mật khẩu mới"
          prop="newPassword"
        >
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="Nhập mật khẩu mới"
          />
        </el-form-item>

        <el-form-item
          label="Nhập lại mật khẩu"
          prop="confirmPassword"
        >
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="Nhập lại mật khẩu"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showPasswordDialog = false">Hủy</el-button>
        <el-button
          type="primary"
          @click="submitPasswordReset"
          >Xác nhận
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import Pagination from '@/components/Pagination/index.vue'
import { cloneDeep } from 'lodash-unified'
import { useI18n } from '@/locale'
import TableViolation from '@/components/Table/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiLockUser, apiPasswordRecovery, apiUnlockUser, getUserList } from '@/api/user'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const fields = ref([
  {
    key: 'name',
    label: 'Tên người dùng',
    prop: 'name',
  },
  {
    key: 'phoneNumber',
    label: 'Số điện thoại',
    prop: 'phoneNumber',
  },
  {
    key: 'email',
    label: 'Email',
    prop: 'email',
  },
  {
    key: 'address',
    label: 'Địa chỉ',
    prop: 'address',
  },
  {
    key: 'linkIntroduce',
    label: 'Link giới thiệu',
    prop: 'linkIntroduce',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    prop: 'status',
  },
  {
    key: 'roleList',
    label: 'Quyền',
    prop: 'roleList',
  },
  {
    key: 'action',
    label: 'Thao tác',
    prop: 'action',
  },
])

const listLoading = ref(true)
const list = ref([])
const defaultFilter = {
  page: 1,
  size: 10,
  total: 0,
  name: null,
  email: null,
  phone: null,
  roles: [],
}
const filter = reactive(cloneDeep(defaultFilter))

onMounted(() => {
  getList()
})

const getList = async () => {
  listLoading.value = true
  const params = {
    name: filter.name,
    email: filter.email,
    phone: filter.phone,
    roles: filter.roles,
    paged: {
      page: filter.page,
      size: filter.size,
    },
  }
  const rs = await getUserList(params)
  if (rs.code === 200) {
    list.value = rs.data.content
    filter.total = rs.data.totalElements
  }
  listLoading.value = false
}

const handleEditUser = data => {
  router.push(`/user/edit/${data.id}`)
}

const handleSizeChange = size => {
  filter.size = size
  getList()
}
const handlePageChange = page => {
  filter.page = page
  getList()
}
const formatRoles = roles => {
  if (!roles || !Array.isArray(roles)) return ''

  if (roles.includes('ROLE_ADMIN')) {
    return 'Admin'
  }

  return roles
    .map(role => role.replace('ROLE_', '').toLowerCase())
    .map(role => role.charAt(0).toUpperCase() + role.slice(1))
    .join(', ')
}
const formatStatus = status => {
  if (status == 1) return 'Hoạt động'
  if (status == 0) return 'Chưa xác thực'
  if (status == 2) return 'Đã bị xóa'
  return 'Không xác định'
}
const handleDeleteUser = data => {
  ElMessageBox.confirm('Xác nhận khóa tài khoản này', 'Cảnh báo', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  })
    .then(() => {
      successDeleteUser(data)
    })
    .catch(() => {})
}
const successDeleteUser = async data => {
  const rs = await apiLockUser(data.id)
  if (rs.code === 200) {
    await getList()
    ElMessage({
      type: 'success',
      message: 'Khóa thành công!',
    })
  } else {
    ElMessage({
      type: 'error',
      message: rs.message,
    })
  }
}

const handleUnlockUser = data => {
  ElMessageBox.confirm('Xác nhận khôi phục tài khoản này', 'Cảnh báo', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  })
    .then(() => {
      successUnlockUser(data)
    })
    .catch(() => {})
}
const successUnlockUser = async data => {
  const rs = await apiUnlockUser(data.id)
  if (rs.code === 200) {
    await getList()
    ElMessage({
      type: 'success',
      message: 'Khôi phục thành công!',
    })
  } else {
    ElMessage({
      type: 'error',
      message: rs.message,
    })
  }
}

const showPasswordDialog = ref(false)
const passwordFormRef = ref(null)
const passwordForm = ref({
  newPassword: '',
  confirmPassword: '',
})

const passwordRules = {
  newPassword: [
    { required: true, message: 'Vui lòng nhập mật khẩu mới', trigger: 'blur' },
    { min: 8, message: 'Mật khẩu phải từ 8 ký tự trở lên', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/,
      message: 'Mật khẩu phải chứa chữ hoa, chữ thường và ký tự đặc biệt',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: 'Vui lòng nhập lại mật khẩu', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('Mật khẩu nhập lại không khớp'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

const selectedUser = ref(null)

const openPasswordDialog = user => {
  selectedUser.value = user
  showPasswordDialog.value = true
  resetPasswordForm()
}

const resetPasswordForm = () => {
  passwordForm.value = {
    newPassword: '',
    confirmPassword: '',
  }
}

const submitPasswordReset = () => {
  passwordFormRef.value.validate(async valid => {
    if (valid) {
      try {
        await resetPasswordApi(
          selectedUser.value.id,
          passwordForm.value.newPassword,
          passwordForm.value.confirmPassword
        )
      } catch (error) {
        console.error(error)
      }
    }
  })
}

const resetPasswordApi = async (userId, newPassword, confirmPassword) => {
  const params = {
    userId,
    newPassword,
    confirmPassword,
  }
  const rs = await apiPasswordRecovery(params)
  if (rs.code === 200) {
    showPasswordDialog.value = false
    await getList()
    ElMessage({
      type: 'success',
      message: 'khôi phục mật khẩu thành công!',
    })
  } else {
    ElMessage({
      type: 'error',
      message: rs.message,
    })
  }
}
const roleOptions = [
  { value: 'ROLE_ADMIN', label: 'Admin' },
  { value: 'ROLE_USER', label: 'User' },
]
</script>

<style lang="scss" scoped>
.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}
</style>
