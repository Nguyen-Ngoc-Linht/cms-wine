<template>
  <div class="padding-20">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card>
          <h5 class="text-2xl font-semibold">Thông tin chung</h5>
          <div class="flex mt-4">
            <div class="">
              <el-avatar
                :size="160"
                :src="infoUser.avatar ? infoUser.avatar : avatarDefault"
              />
            </div>
            <div class="ml-3 flex flex-column justify-center gap-2" style="flex: 1">
              <h5 class="text-3xl font-medium">{{ `${infoUser.firstName} ${infoUser.lastName}` }}</h5>
              <h6 class="text-xl">{{ infoUser.email }}</h6>
            </div>
          </div>
          <div class="mt-5">
            <label class="text-lg">Bio</label>
            <el-input
              type="textarea"
              :rows="5"
              class="my-2 custom-input"
              placeholder="Vui lòng nhập"
            ></el-input>
            <label class="text-lg">Địa chỉ mail</label>
            <el-input
              v-model="infoUser.email"
              disabled
              class="my-2 custom-input"
              placeholder="Vui lòng nhập"
            ></el-input>
            <label class="text-lg">Liên kết mạng xã hội</label>
            <el-input
              disabled
              class="my-2 custom-input"
              placeholder="Vui lòng nhập"
            ></el-input>
            <label class="text-lg">Bio</label>
            <el-input
              type="textarea"
              :rows="5"
              class="mt-2 custom-input"
              placeholder="Vui lòng nhập"
            ></el-input>
          </div>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card>
          <h5 class="text-2xl font-semibold">Thông tin chi tiết</h5>
          <el-form :model="infoUser" :rules="ruleEdit">
            <el-row class="mt-2" :gutter="10">
              <el-col :span="12">
                <el-form-item label="Họ" prop="firstName">
                  <el-input v-model="infoUser.firstName" placeholder="Vui lòng nhập"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Tên" prop="lastName">
                  <el-input v-model="infoUser.lastName" placeholder="Vui lòng nhập"/>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="Địa chỉ" prop="address">
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
              <el-col :span="8">
                <el-form-item label="Email" prop="email">
                  <el-input v-model="infoUser.email" placeholder="Vui lòng nhập"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Số điện thoại" prop="phone">
                  <el-input v-model="infoUser.phone" placeholder="Vui lòng nhập"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Số thẻ thanh toán">
                  <el-input v-model="infoUser.identityCardNumber" placeholder="Vui lòng nhập"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { useConfig } from '@/config'
import {getUserDetail} from '@/api/user'

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
const avatarDefault = ref('https://greekherald.com.au/wp-content/uploads/2020/07/default-avatar.png')

const loading = ref(false)
const processing = ref(false)
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
</script>

<style lang="scss" scoped>
:deep(.custom-input .el-textarea__inner) {
  border: 1px dashed #409EFF !important;
}
:deep(.custom-input .el-input__wrapper) {
  border: 1px dashed #409EFF !important;
}
</style>
