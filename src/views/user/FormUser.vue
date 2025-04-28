<template>
  <div class="padding-20">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <h5 class="text-2xl font-semibold">Thông tin chi tiết</h5>
          <div class="flex mt-4">
            <div class="">
              <el-avatar
                :size="160"
                :src="infoUser.avatar ? infoUser.avatar : avatarDefault"
              />
            </div>
            <div
              class="ml-3 flex flex-column justify-center gap-2"
              style="flex: 1"
            >
              <h5 class="text-3xl font-medium">
                {{ `${infoUser.firstName} ${infoUser.lastName}` }}
              </h5>
              <h6 class="text-xl">{{ infoUser.email }}</h6>
            </div>
          </div>
          <div class="mt-5">
            <label class="text-lg">Thông tin giới thiệu</label>
            <el-input
              v-model="infoUser.description"
              type="textarea"
              :rows="5"
              class="my-2 custom-input"
              placeholder="Vui lòng nhập"
            ></el-input>
          </div>
          <el-form
            :model="infoUser"
            :rules="ruleEdit"
            class="flex flex-column"
          >
            <el-row
              class="mt-2"
              :gutter="10"
            >
              <el-col :span="12">
                <el-form-item
                  label="Họ"
                  prop="firstName"
                >
                  <el-input
                    v-model="infoUser.firstName"
                    placeholder="Vui lòng nhập"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="Tên"
                  prop="lastName"
                >
                  <el-input
                    v-model="infoUser.lastName"
                    placeholder="Vui lòng nhập"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="Địa chỉ"
                  prop="address"
                >
                  <el-input
                    v-model="infoUser.address"
                    type="textarea"
                    show-word-limit
                    maxlength="1000"
                    :autosize="{ minRows: 3, maxRows: 5 }"
                    placeholder="Vui lòng nhập"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="Email"
                  prop="email"
                >
                  <el-input
                    v-model="infoUser.email"
                    disabled
                    placeholder="Vui lòng nhập"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="Số điện thoại"
                  prop="phone"
                >
                  <el-input
                    v-model="infoUser.phoneNumber"
                    placeholder="Vui lòng nhập"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="Link giới thiệu">
                  <el-input
                    v-model="infoUser.linkIntroduce"
                    placeholder="Vui lòng nhập"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="Quyền">
                  <el-select
                      v-model="infoUser.roleList"
                      multiple
                      placeholder="Vui lòng chọn quyền"
                      style="width: 100%"
                  >
                    <el-option
                        v-for="role in roleOptions"
                        :key="role.value"
                        :label="role.label"
                        :value="role.value"
                        disabled
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-button
              @click="handleUpdateUser(infoUser)"
              type="primary"
              class="bg--dark-purple"
              style="border: transparent; margin-left: auto"
              >Xác nhận
            </el-button>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import {getUserDetail, updateUser} from '@/api/user'
import {ElMessage, ElMessageBox} from 'element-plus'

const router = useRouter()
const route = useRoute()
const props = defineProps({
  isView: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})
const { t } = useI18n()
const avatarDefault = ref(
  'https://greekherald.com.au/wp-content/uploads/2020/07/default-avatar.png'
)

const ruleEdit = ref({
  username: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 250, message: t('omsSetting.ruleMaxLengthText'), trigger: 'blur' },
  ],
  firstName: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  lastName: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  address: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  phoneNumber: [
    {
      pattern: /^[0-9]{10}$/,
      message: t('configUser.validateMessage.phoneFormat'),
      trigger: 'blur',
    },
  ],
  email: [
    {
      pattern: /^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)$/,
      message: t('configUser.validateMessage.emailFormat'),
      trigger: 'blur',
    },
  ],
})
const infoUser = ref({})

onMounted(() => {
  initData()
})

const initData = async () => {
  try {
    const id_user = route.params.id
    if (id_user) {
      const rs = await getUserDetail(id_user)
      infoUser.value = rs.data
    }
  } catch (e) {
    console.log(e)
  }
}

const roleOptions = [
  { value: 'ROLE_ADMIN', label: 'Admin' },
  { value: 'ROLE_USER', label: 'User' },
]

const handleUpdateUser = data => {
  ElMessageBox.confirm('Xác nhận cập nhật thông tin người dùng', 'Cảnh báo', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  })
    .then(() => {
      successUpdateUser(data)
    })
    .catch(() => {})
}
const successUpdateUser = async data => {
  console.log('data', data)
  const params = {
    firstName: data.firstName,
    lastName: data.lastName,
    identityCardNumber: null,
    phoneNumber: data.phoneNumber,
    linkIntroduce: data.linkIntroduce,
    description: data.description,
    address: data.address,
  }
  const rs = await updateUser(params, data.id)
  if (rs.code === 200) {
    await router.push('/user')
    ElMessage({
      type: 'success',
      message: 'Cập nhật user thành công!',
    })
  } else {
    ElMessage({
      type: 'error',
      message: rs.message,
    })
  }
}

</script>

<style lang="scss" scoped>
:deep(.custom-input .el-textarea__inner) {
  border: 1px dashed #409eff !important;
}

:deep(.custom-input .el-input__wrapper) {
  border: 1px dashed #409eff !important;
}
</style>
