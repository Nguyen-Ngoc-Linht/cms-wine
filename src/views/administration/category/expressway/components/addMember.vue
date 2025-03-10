<template>
  <div class="bg-white">
    <div class="">
      <el-form
        ref="formInfoMember"
        :model="infoMember"
        :rules="ruleEdit"
        label-position="top"
        label-width="100%"
        class="custom-form"
      >
        <div class="item-mid">
          <el-form-item
            class="custom mb-5"
            :label="$t('administration.category.administrativeDepartment.nameOfTheResponsible')"
            prop="name"
            style="display: inline-block; width: 100%"
          >
            <el-input
              v-model="infoMember.name"
              maxlength="250"
              :placeholder="$t('configUser.pleaseEnter')"
            />
          </el-form-item>
        </div>
        <div class="item-mid">
          <el-form-item
            class="custom mb-5"
            :label="$t('configUser.phoneNumber1')"
            prop="contactNumber"
            style="display: inline-block; width: 100%"
          >
            <el-input
              v-model="infoMember.contactNumber"
              type="number"
              :placeholder="$t('configUser.pleaseEnter')"
            />
          </el-form-item>
        </div>
        <div class="item-mid">
          <el-form-item
            class="custom mb-5"
            label="Email"
            prop="email"
            style="display: inline-block; width: 100%"
          >
            <el-input
              v-model="infoMember.email"
              maxlength="100"
              :placeholder="$t('configUser.pleaseEnter')"
            />
          </el-form-item>
        </div>
      </el-form>
      <hr class="margin-bottom-24 mt-4" />
      <div class="action">
        <div class="flex justify-end">
          <el-button
            type="default"
            @click="closeDialog"
            class="bg-outline-secondary"
            >{{ $t('configUser.cancel') }}</el-button
          >
          <el-button
            v-if="!isEdit"
            @click="handleAddMember"
            type="primary"
            class="bg--dark-purple"
            style="border: transparent"
            >{{ $t('configUser.addNew') }}
          </el-button>
          <el-button
            v-if="isEdit"
            @click="handleUpdateMember"
            type="primary"
            class="bg--dark-purple"
            style="border: transparent"
            >{{ $t('configUser.updateUser') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage } from 'element-plus'
import { usePermissionStore } from '@/store'
const { t } = useI18n()

const { roleData } = usePermissionStore()
const props = defineProps({
  isEdit: {
    type: Boolean,
    required: true,
  },
  memberInfo: {
    type: Object,
    required: false,
  },
})
const ruleEdit = ref({
  name: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 250, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
  ],
  contactNumber: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    {
      pattern: /^[0-9]{10}$/,
      message: t('configUser.validateMessage.phoneFormat'),
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)$/,
      message: t('configUser.validateMessage.emailFormat'),
      trigger: 'blur',
    },
  ],
})
const infoMember = ref({})
const backupMemberInfo = reactive({
  id: '',
  name: '',
  contactNumber: '',
  email: '',
})
const formInfoMember = ref(null)
const emit = defineEmits(['closeUpdate', 'successAddMember', 'successUpdateMember', ['backupData']])

const closeDialog = async () => {
  try {
    if (props.isEdit) {
      await Promise.all([validFormData()])
    }
    emit('closeUpdate')
  } catch (e) {
    if (props.isEdit) {
      emit('backupData', backupMemberInfo)
    } else {
      emit('closeUpdate')
    }
  }
}

onMounted(async () => {
  initData()
})
const initData = () => {
  if (props.isEdit) {
    infoMember.value = props.memberInfo
    backupMemberInfo.id = infoMember.value.id
    backupMemberInfo.name = infoMember.value.name
    backupMemberInfo.contactNumber = infoMember.value.contactNumber
    backupMemberInfo.email = infoMember.value.email
  } else {
    infoMember.value = {}
  }
}
const handleAddMember = async () => {
  try {
    await Promise.all([validFormData()])
    emit('successAddMember', infoMember.value)
  } catch (e) {
    console.log(e)
  }
}
const handleUpdateMember = async () => {
  try {
    await Promise.all([validFormData()])
    emit('successUpdateMember', infoMember.value)
  } catch (e) {
    console.log(e)
  }
}
const validFormData = () => {
  return new Promise((resolve, reject) => {
    formInfoMember.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}
</script>

<style scoped lang="scss">
.el-form-item__label {
  color: #525b73;
  font-weight: 600 !important;
}
</style>

<style lang="scss">
.custom {
  .el-form-item__label {
    color: #525b73;
    font-weight: 600 !important;
  }
}

.custom-form {
  .el-form-item {
    //display: flex;
    --font-size: 14px;
    margin-bottom: 8px;
    margin-top: 8px;
  }
  .el-form-item--default {
    --font-size: 14px;
    --el-form-label-font-size: var(--font-size);
    margin-bottom: 8px;
    margin-top: 8px;
  }
}
</style>
