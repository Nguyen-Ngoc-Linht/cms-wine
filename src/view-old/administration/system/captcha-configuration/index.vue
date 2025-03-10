<template>
  <div class="transaction-detail">
    <div class="relative">
      <div
        class="page-header bg-[#fff] flex items-center justify-between sticky z-[1000] top-0 left-0 right-0 height-50 border-b border-[#CDCDCE]"
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
        <div
          v-if="roleData.canUpdate"
          class="action-head paddingX-24"
        >
          <div class="flex justify-content-end">
            <el-button
              class="el-button--main"
              type="primary"
              @click="handleSaveConfiguration()"
              :loading="processing"
            >
              {{ t('omsSetting.save') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4 paddingX-24">
      <div class="p-4 bg-white">
        <h5 class="text-black font-semibold text-lg">{{ $t('monitoring.toll.infoConfig') }}</h5>
        <el-form
          ref="ruleForm"
          :rules="ruleEdit"
          :model="formEdit"
          label-position="top"
          v-loading="loadingRule"
          class="form-custom mt-4"
        >
          <el-row :gutter="20">
            <el-col
              :lg="6"
              :sm="12"
            >
              <el-form-item
                :label="t('configUser.passwordPolicy.numberChar')"
                prop="length"
              >
                <InputInteger
                  v-model="formEdit.length"
                  :max-length="2"
                  :disabled="!roleData.canUpdate"
                ></InputInteger>
              </el-form-item>
            </el-col>
            <el-col
              :lg="6"
              :sm="12"
            >
              <el-form-item
                :label="$t('configUser.passwordPolicy.typeChar')"
                prop="type"
                class="required-label"
              >
                <div class="flex-column flex gap-3">
                  <el-checkbox
                    :label="t('configUser.passwordPolicy.upperCase')"
                    v-model.number="formEdit.useUppercase"
                    :disabled="!roleData.canUpdate"
                  />
                  <el-checkbox
                    :label="t('configUser.passwordPolicy.number')"
                    v-model.number="formEdit.useNumbers"
                    :disabled="!roleData.canUpdate"
                  />
                  <el-checkbox
                    :label="t('configUser.passwordPolicy.lowerCase')"
                    v-model.number="formEdit.useLowercase"
                    :disabled="!roleData.canUpdate"
                  />
                  <el-checkbox
                    :label="t('configUser.passwordPolicy.specialChar')"
                    v-model.number="formEdit.useSpecialChars"
                    :disabled="!roleData.canUpdate"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useAppStore, usePermissionStore, useSearchStore } from '@/store'
import lang from '@/locale/getMessage.js'
import { useI18n } from '@/locale'
import InputInteger from '@/components/InputInteger'

import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { apiGetConfigCaptcha, apiUpdateConfigCaptcha } from '@/api/systemconfig'

const { t } = useI18n()
const router = useRouter()
const { roleData } = usePermissionStore()

const processing = ref(false)
const loadingRule = ref(false)
const ruleForm = ref(null)
const formEdit = reactive({
  id: 1,
  length: null,
  useUppercase: false,
  useLowercase: false,
  useNumbers: false,
  useSpecialChars: false,
})
const validatePassPolicy = (rule, value, callback) => {
  if (
    !formEdit.useUppercase &&
    !formEdit.useLowercase &&
    !formEdit.useNumbers &&
    !formEdit.useSpecialChars
  ) {
    callback(new Error(t('configUser.validateMessage.required')))
  } else {
    callback()
  }
}
const ruleEdit = reactive({
  length: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    {
      type: 'number',
      max: 8,
      min: 4,
      message: t('configUser.validateMessage.valueBetween', [4, 8]),
      trigger: 'blur',
    },
  ],
  type: [{ required: false }, { validator: validatePassPolicy, trigger: 'change' }],
})

onMounted(() => {
  initData()
})
const initData = async () => {
  try {
    loadingRule.value = true
    apiGetConfigCaptcha().then(response => {
      formEdit.id = response.data.id
      formEdit.length = response.data.length
      formEdit.useUppercase = response.data.useUppercase
      formEdit.useLowercase = response.data.useLowercase
      formEdit.useNumbers = response.data.useNumbers
      formEdit.useSpecialChars = response.data.useSpecialChars
    })
    loadingRule.value = false
  } catch (e) {
    console.log(e)
  }
}

const handleSaveConfiguration = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const params = {
      id: formEdit.id,
      length: formEdit.length,
      useUppercase: formEdit.useUppercase,
      useLowercase: formEdit.useLowercase,
      useNumbers: formEdit.useNumbers,
      useSpecialChars: formEdit.useSpecialChars,
    }
    console.log('log', params)
    apiUpdateConfigCaptcha(params).then(res => {
      ElMessage.success(t('configUser.message.updateSuccess'))
    })
    processing.value = false
  } catch (e) {
    console.log(e)
    processing.value = false
  }
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    ruleForm.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}

const backToList = () => {
  router.back()
}
</script>

<style scoped lang="scss">
:deep(.required-label .el-form-item__label:before) {
  content: '*';
  color: var(--el-color-danger);
  margin-right: 4px;
}
</style>
