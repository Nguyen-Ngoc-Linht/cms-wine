<template>
  <div class="bg-white">
    <el-form
      ref="formChangePass"
      :model="userPass"
      :rules="rulePass"
      label-position="top"
      label-width="100%"
      :validate-on-rule-change="false"
    >
      <div class="block-item">
        <el-form-item
          :label="t('configUser.userManagement.currentPass')"
          prop="curentPassword"
        >
          <el-input
            v-model="userPass.curentPassword"
            type="password"
          />
        </el-form-item>
        <el-form-item
          :label="t('configUser.userManagement.newPass')"
          prop="newPassword"
          required
        >
          <el-input
            v-model="userPass.newPassword"
            type="password"
          />
        </el-form-item>
        <el-form-item
          :label="t('configUser.retypePassword')"
          prop="rePassword"
        >
          <el-input
            v-model="userPass.rePassword"
            type="password"
          />
        </el-form-item>
      </div>
    </el-form>
    <div class="d-flex justify-content-end pt-1">
      <el-button @click="closeDialog">{{ t('configUser.cancel') }}</el-button>
      <el-button
        type="primary"
        :loading="processing"
        @click="updatePassword()"
        >{{ t('omsSetting.confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useUserStore } from '@/store'
import { useI18n } from '@/locale'
import { trimData } from '@/utils'
import { getPasswordRulePolicy, updatePass } from '@/api/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const { t } = useI18n()
const userPass = reactive({
  curentPassword: null,
  newPassword: null,
  rePassword: null,
})
const processing = ref(false)

const getPasswordRule = () => {
  getPasswordRulePolicy().then(res => {
    const specChar = []
    const rule = [
      { min: res.data.minLength, max: res.data.maxLength, message: '', trigger: 'blur' },
    ]
    if (res.data.specialCharacters) {
      specChar.push(t('configUser.passwordPolicy.specialChar').toLowerCase())
      rule.push({ validator: validSpecialChar, message: '', trigger: 'blur' })
    }
    if (res.data.digits) {
      specChar.push(t('configUser.passwordPolicy.number').toLowerCase())
      rule.push({ validator: validDigit, message: '', trigger: 'blur' })
    }
    if (res.data.uppercase) {
      specChar.push(t('configUser.passwordPolicy.upperCase').toLowerCase())
      rule.push({ validator: validUpperChar, message: '', trigger: 'blur' })
    }
    if (res.data.lowercase) {
      specChar.push(t('configUser.passwordPolicy.lowerCase').toLowerCase())
      rule.push({ validator: validLowerChar, message: '', trigger: 'blur' })
    }
    const message = t('configUser.validateMessage.passwordFormat', [
      res.data.minLength,
      res.data.maxLength,
      specChar.join(', '),
    ])
    rule.forEach(i => {
      i.message = message
    })

    rule.push({
      required: true,
      message: t('configUser.validateMessage.required'),
      trigger: 'blur',
    })

    rulePass.newPassword = rule
  })
}
const validSpecialChar = (rule, value, callback) => {
  const regex = /[!@#$%^&*(),.?":{}|<>`\[\]\\\/\-=_+~;']/
  if (!value || regex.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}
const validUpperChar = (rule, value, callback, message) => {
  const regex = /[A-Z]/
  if (!value || regex.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}
const validLowerChar = (rule, value, callback) => {
  const regex = /[a-z]/
  if (!value || regex.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}
const validDigit = (rule, value, callback) => {
  const regex = /\d/
  if (!value || regex.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}
const validConfirmPass = (rule, value, callback) => {
  if (value !== userPass.newPassword) {
    callback(new Error(t('configUser.validateMessage.passwordMismatch')))
  } else {
    callback()
  }
}
const rulePass = reactive({
  curentPassword: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  rePassword: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    { validator: validConfirmPass, trigger: 'blur' },
  ],
})
const resetDialog = () => {
  Object.assign(userPass, {
    curentPassword: null,
    newPassword: null,
    rePassword: null,
  })
}

onMounted(() => {
  formChangePass.value.resetFields()
  getPasswordRule()
})

const formChangePass = ref()
const updatePassword = () => {
  const formEl = formChangePass
  const data = trimData(userPass)
  if (processing.value) {
    return
  }
  formEl.value.validate(valid => {
    if (valid) {
      processing.value = true
      updatePass(data)
        .then(res => {
          closeDialog()
          resetDialog()
          ElMessage({
            type: 'success',
            message: t('configUser.message.updateSuccess'),
          })
        })
        .catch(err => {
          console.log(err)
        })
        .finally(_ => {
          processing.value = false
        })
    }
  })
}

const emit = defineEmits(['closeChangePassword'])
const closeDialog = () => {
  emit('closeChangePassword')
}
</script>

<style scoped lang="scss">
.update-password .el-dialog__body {
  padding: 16px;
}

.update-password .el-dialog__body button {
  height: 32px;
  width: 110px;
}

.update-password .el-dialog__body button:last-child {
  width: 140px;
}

:deep(.el-form-item--default) {
  --font-size: 14px;
  --el-form-label-font-size: var(--font-size);
  margin-bottom: 16px;
}
</style>
