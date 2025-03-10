<template>
  <div class="transaction-detail">
    <div class="relative">
      <div
        class="page-header z-[100] bg-[#fff] flex items-center sticky z-[1000] top-0 left-0 right-0 height-50 border-b border-[#CDCDCE]"
      >
        <div
          class="flex gap-px-8 items-center paddingX-12 paddingY-12"
          @click="backToList"
        >
          <svg-icon
            icon-class="back"
            class="color-[#525B73] cursor-pointer width-20 height-20"
          />
          <span class="text-[18px] text-[#525B73]">
            {{ t('el.pageHeader.title') }}
          </span>
        </div>
      </div>
    </div>
    <div class="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="el-card">
        <div class="el-card__header text-center bg-[#EDF1FA] font-bold text-lg">
          {{ t('configUser.passwordPolicy.timeSetting') }}
        </div>
        <div class="el-card__body p-8 flex-grow">
          <el-form
            :model="formEdit"
            :rules="rulesTime"
            ref="timeForm"
            label-position="top"
            v-loading="loadingTime"
            class="form-custom"
          >
            <el-form-item
              :label="$t('configUser.passwordPolicy.timeNotifyChangePass')"
              prop="passwordReminder"
              required
            >
              <InputInteger
                v-model="formEdit.passwordReminder"
                :append="true"
                :max-length="2"
              >
                <template #append>{{ t('el.datepicker.day')?.toLowerCase() }}</template>
              </InputInteger>
            </el-form-item>
            <el-form-item
              :label="$t('configUser.passwordPolicy.passValidTime')"
              prop="forceExpiredPasswordChange"
              required
            >
              <InputInteger
                v-model="formEdit.forceExpiredPasswordChange"
                :append="true"
                :max-length="2"
              >
                <template #append>{{ t('el.datepicker.day')?.toLowerCase() }}</template>
              </InputInteger>
            </el-form-item>
          </el-form>
        </div>
        <div class="el-card__body flex justify-end">
          <el-button
            style="background-color: #059efb; border: none"
            class="border-1px paddingX-30"
            @click="handleUpdateTime"
            :loading="loadingTime"
            type="success"
            >{{ $t('omsSetting.save') }}
          </el-button>
        </div>
      </div>
      <div class="el-card">
        <div class="el-card__header text-center bg-[#EDF1FA] font-bold text-lg">
          {{ t('configUser.passwordPolicy.passwordRule') }}
        </div>
        <div class="el-card__body p-8 flex-grow">
          <el-form
            :model="formEdit"
            :rules="rulesPass"
            ref="ruleForm"
            label-position="top"
            v-loading="loadingRule"
            class="form-custom"
          >
            <el-form-item
              :label="$t('configUser.passwordPolicy.minChar')"
              prop="minLength"
              required
            >
              <InputInteger
                v-model="formEdit.minLength"
                :max-length="2"
              />
            </el-form-item>
            <el-form-item
              :label="$t('configUser.passwordPolicy.maxChar')"
              prop="maxLength"
              required
            >
              <InputInteger
                v-model="formEdit.maxLength"
                :max-length="2"
              />
            </el-form-item>
            <el-form-item
              :label="$t('configUser.passwordPolicy.typeChar')"
              prop="type"
              class="required-label"
            >
              <el-checkbox
                :label="t('configUser.passwordPolicy.specialChar')"
                v-model.number="formEdit.specialCharacters"
                :true-label="1"
                :false-label="0"
              />
              <el-checkbox
                :label="t('configUser.passwordPolicy.upperCase')"
                v-model.number="formEdit.uppercase"
                :true-label="1"
                :false-label="0"
              />
              <el-checkbox
                :label="t('configUser.passwordPolicy.lowerCase')"
                v-model.number="formEdit.lowercase"
                :true-label="1"
                :false-label="0"
              />
              <el-checkbox
                :label="t('configUser.passwordPolicy.number')"
                v-model.number="formEdit.digits"
                :true-label="1"
                :false-label="0"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="el-card__body flex justify-end">
          <el-button
            style="background-color: #059efb; border: none"
            class="border-1px paddingX-30"
            @click="handleUpdateRule"
            :loading="loadingRule"
            type="success"
            >{{ $t('omsSetting.save') }}
          </el-button>
        </div>
      </div>
      <div class="el-card">
        <div class="el-card__header text-center bg-[#EDF1FA] font-bold text-lg">
          {{ t('configUser.passwordPolicy.limitFailedAttempt') }}
        </div>
        <div class="el-card__body p-8 flex-grow">
          <el-form
            :model="formEdit"
            :rules="rulesLimit"
            ref="attemptForm"
            label-position="top"
            v-loading="loadingLimit"
            class="form-custom"
          >
            <el-form-item
              :label="t('configUser.passwordPolicy.numberFailedAttemp')"
              prop="failureFactor"
              required
            >
              <InputInteger
                v-model="formEdit.failureFactor"
                :max-length="2"
              />
            </el-form-item>
            <el-form-item
              :label="
                t('configUser.passwordPolicy.timePeriod') +
                ' (' +
                t('el.datepicker.minute')?.toLowerCase() +
                ')'
              "
              prop="waitIncrementSeconds"
              required
            >
              <InputInteger
                v-model="formEdit.waitIncrementSeconds"
                :max-length="2"
              />
            </el-form-item>
            <el-form-item
              :label="
                t('configUser.passwordPolicy.lockTime') +
                ' (' +
                t('el.datepicker.minute')?.toLowerCase() +
                ')'
              "
              prop="quickLoginCheckMilliSeconds"
              required
            >
              <InputInteger
                v-model="formEdit.quickLoginCheckMilliSeconds"
                :max-length="2"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="el-card__body flex justify-end">
          <el-button
            style="background-color: #059efb; border: none"
            class="border-1px paddingX-30"
            @click="handleUpdateLimit"
            :loading="loadingLimit"
            type="success"
            >{{ $t('omsSetting.save') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useAppStore, useSearchStore } from '@/store'
import lang from '@/locale/getMessage.js'
import { useI18n } from '@/locale'
import InputInteger from '@/components/InputInteger'
import {
  setPasswordTimePolicy,
  setPasswordRulePolicy,
  setPasswordAttrPolicy,
  getPasswordTimePolicy,
  getPasswordRulePolicy,
  getPasswordAttrPolicy,
} from '@/api/user'

import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const locale = computed(() => lang[appStore.lang])

const loadingTime = ref(true)
const loadingRule = ref(true)
const loadingLimit = ref(true)
const backToList = () => {
  router.back()
}

const formEdit = reactive({
  forceExpiredPasswordChange: null,
  passwordReminder: null,
  minLength: null,
  maxLength: null,
  specialCharacters: 0,
  uppercase: 0,
  lowercase: 0,
  digits: 0,
  failureFactor: null,
  waitIncrementSeconds: null,
  quickLoginCheckMilliSeconds: null,
})

const validatePasswordReminder = (rule, value, callback) => {
  if (parseFloat(value) >= parseFloat(formEdit.forceExpiredPasswordChange)) {
    callback(
      new Error(
        t('configUser.validateMessage.aLessThanB', [
          t('configUser.passwordPolicy.timeNotifyChangePass'),
          t('configUser.passwordPolicy.passValidTime'),
        ])
      )
    )
  } else {
    callback()
  }
}
const validateMinLength = (rule, value, callback) => {
  if (parseFloat(value) >= parseFloat(formEdit.maxLength)) {
    callback(
      new Error(
        t('configUser.validateMessage.aLessThanB', [
          t('configUser.passwordPolicy.minChar'),
          t('configUser.passwordPolicy.maxChar'),
        ])
      )
    )
  } else {
    callback()
  }
}
const validatePassPolicy = (rule, value, callback) => {
  if (
    !formEdit.specialCharacters &&
    !formEdit.uppercase &&
    !formEdit.lowercase &&
    !formEdit.digits
  ) {
    callback(new Error(t('configUser.validateMessage.required')))
  } else {
    callback()
  }
}

const rulesTime = reactive({
  passwordReminder: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    {
      type: 'number',
      max: 99,
      min: 1,
      message: t('configUser.validateMessage.valueBetween', [1, 99]),
      trigger: 'blur',
    },
    { validator: validatePasswordReminder, trigger: 'blur' },
  ],
  forceExpiredPasswordChange: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    {
      type: 'number',
      max: 99,
      min: 1,
      message: t('configUser.validateMessage.valueBetween', [1, 99]),
      trigger: 'blur',
    },
  ],
})
const rulesPass = reactive({
  minLength: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    {
      type: 'number',
      max: 99,
      min: 1,
      message: t('configUser.validateMessage.valueBetween', [1, 99]),
      trigger: 'blur',
    },
    { validator: validateMinLength, trigger: 'blur' },
  ],
  maxLength: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    {
      type: 'number',
      max: 99,
      min: 1,
      message: t('configUser.validateMessage.valueBetween', [1, 99]),
      trigger: 'blur',
    },
  ],
  type: [{ required: false }, { validator: validatePassPolicy, trigger: 'change' }],
})
const rulesLimit = reactive({
  failureFactor: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    {
      type: 'number',
      max: 99,
      min: 1,
      message: t('configUser.validateMessage.valueBetween', [1, 99]),
      trigger: 'blur',
    },
  ],
  waitIncrementSeconds: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    {
      type: 'number',
      max: 99,
      min: 1,
      message: t('configUser.validateMessage.valueBetween', [1, 99]),
      trigger: 'blur',
    },
  ],
  quickLoginCheckMilliSeconds: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    {
      type: 'number',
      max: 99,
      min: 1,
      message: t('configUser.validateMessage.valueBetween', [1, 99]),
      trigger: 'blur',
    },
  ],
})

watch(
  () => formEdit.maxLength,
  () => {
    ruleForm.value.validateField('minLength')
  }
)

watch(
  () => formEdit.forceExpiredPasswordChange,
  () => {
    timeForm.value.validateField('passwordReminder')
  }
)

onMounted(() => {
  getTime()
  getRule()
  getLimit()
})

const getTime = () => {
  getPasswordTimePolicy()
    .then(res => {
      if (res.data) {
        Object.assign(formEdit, res.data)
      }
    })
    .finally(_ => {
      loadingTime.value = false
    })
}
const getRule = () => {
  getPasswordRulePolicy()
    .then(res => {
      if (res.data) {
        Object.assign(formEdit, res.data)
      }
    })
    .finally(_ => {
      loadingRule.value = false
    })
}
const getLimit = () => {
  getPasswordAttrPolicy()
    .then(res => {
      if (res.data) {
        Object.assign(formEdit, res.data)
      }
    })
    .finally(_ => {
      loadingLimit.value = false
    })
}

const timeForm = ref()
const handleUpdateTime = () => {
  const formEl = timeForm
  if (loadingTime.value) {
    return
  }

  formEl.value.validate(valid => {
    if (valid) {
      const { forceExpiredPasswordChange, passwordReminder } = formEdit

      const data = {
        forceExpiredPasswordChange,
        passwordReminder,
      }
      loadingTime.value = true
      setPasswordTimePolicy(data)
        .then(res => {
          ElMessage({
            type: 'success',
            message: t('configUser.passwordPolicy.saveTimeSettingSuccess'),
          })
        })
        .catch(_ => {
          ElMessage({
            type: 'error',
            message: t('omsSetting.failUpdate'),
          })
        })
        .finally(_ => {
          loadingTime.value = false
        })
    }
  })
}
const ruleForm = ref()
const handleUpdateRule = () => {
  const formEl = ruleForm

  if (loadingRule.value) {
    return
  }

  formEl.value.validate(valid => {
    if (valid) {
      const { minLength, maxLength, specialCharacters, uppercase, lowercase, digits } = formEdit

      const data = {
        minLength,
        maxLength,
        specialCharacters,
        uppercase,
        lowercase,
        digits,
      }

      loadingRule.value = true
      setPasswordRulePolicy(data)
        .then(res => {
          ElMessage({
            type: 'success',
            message: t('configUser.passwordPolicy.savePasswordRuleSuccess'),
          })
        })
        .catch(_ => {
          ElMessage({
            type: 'error',
            message: t('omsSetting.failUpdate'),
          })
        })
        .finally(_ => {
          loadingRule.value = false
        })
    }
  })
}
const attemptForm = ref()
const handleUpdateLimit = () => {
  const formEl = attemptForm

  if (loadingLimit.value) {
    return
  }
  formEl.value.validate(valid => {
    if (valid) {
      const { failureFactor, waitIncrementSeconds, quickLoginCheckMilliSeconds } = formEdit

      const data = {
        failureFactor,
        waitIncrementSeconds,
        quickLoginCheckMilliSeconds,
      }

      loadingLimit.value = true
      setPasswordAttrPolicy(data)
        .then(res => {
          ElMessage({
            type: 'success',
            message: t('configUser.passwordPolicy.saveLimitAttemptSuccess'),
          })
        })
        .catch(_ => {
          ElMessage({
            type: 'error',
            message: t('omsSetting.failUpdate'),
          })
        })
        .finally(_ => {
          loadingLimit.value = false
        })
    }
  })
}

defineOptions({
  name: 'PasswordPolicy',
})
</script>

<style scoped lang="scss">
.el-card {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

:deep(.required-label .el-form-item__label:before) {
  content: '*';
  color: var(--el-color-danger);
  margin-right: 4px;
}
</style>
