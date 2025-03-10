<template>
  <div>
    <div class="relative">
      <div
        class="page-header z-[100] bg-[#fff] flex items-center justify-end sticky z-[1000] top-0 left-0 right-0 height-50 border-b border-[#CDCDCE] margin-top-2"
      >
        <div
          class="action-head paddingX-12"
          v-if="roleData.canUpdate"
        >
          <el-button
            class="el-button--main"
            type="primary"
            @click="submitForm()"
            :loading="processing"
          >
            {{ t('omsSetting.save') }}
          </el-button>
        </div>
      </div>
    </div>
    <div class="paddingX-24">
      <el-form
        class="py-4"
        ref="formRef"
        :model="config"
        :rules="rules"
        label-position="top"
        label-width="200px"
        v-loading="loading"
      >
        <div
          class="mb-4 w-full bg-white paddingX-12 padding-top-10"
          v-for="(item, idx) in config"
          :key="item.id"
        >
          <h2 class="title-block">{{ item.name }}</h2>
          <el-row :gutter="10">
            <el-col :sm="12">
              <el-form-item
                :label="t('configUser.account')"
                :prop="'[' + idx + '].user'"
                required
              >
                <el-input
                  v-model="item.user"
                  :disabled="!roleData.canUpdate"
                  maxlength="250"
                />
              </el-form-item>
              <el-form-item
                :label="t('omsSetting.password')"
                :prop="'[' + idx + '].password'"
                required
              >
                <el-input
                  v-model="item.password"
                  :type="item.showPass ? 'text' : 'password'"
                  autocomplete="new-password"
                  maxlength="250"
                  :disabled="!roleData.canUpdate"
                >
                  <template #suffix>
                    <svg-icon
                      icon-class="eyeClose"
                      class="width-18 height-18 pointer"
                      @click="handleShowPass(idx)"
                      v-if="item.showPass"
                    />
                    <svg-icon
                      icon-class="eye"
                      class="width-18 height-18 pointer"
                      @click="handleShowPass(idx)"
                      v-else
                    />
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item
                label="Link API"
                :prop="'[' + idx + '].linkApi'"
                required
              >
                <el-input
                  v-model="item.linkApi"
                  maxlength="2000"
                  :disabled="!roleData.canUpdate"
                />
              </el-form-item>
              <el-form-item
                :label="t('collection.apiCallPeriod')"
                :prop="'[' + idx + '].unitOfTime'"
                required
              >
                <InputInteger
                  v-model="item.unitOfTime"
                  :append="true"
                  :max-length="3"
                  :disabled="!roleData.canUpdate"
                >
                  <template #append>{{ t('el.datepicker.minute')?.toLowerCase() }}</template>
                </InputInteger>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from '@/locale'
import { usePermissionStore } from '@/store'
import { apiGetConfigFE, apiUpdateConfigFE } from '@/api/collect'
import InputInteger from '@/components/InputInteger'
import { ElMessage } from 'element-plus'
import { validURL } from '@/utils/validate'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const loading = ref(true)
const backToList = () => {}

const config = ref([])

const rules = ref({})

const validLink = (rule, value, callback) => {
  const strLength = value.trim().length
  if (strLength > 0 && !validURL(value)) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}

watch(config, value => {
  const newRules = {}
  value.forEach((val, idx) => {
    newRules[`[${idx}].user`] = [
      { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    ]
    newRules[`[${idx}].password`] = [
      { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    ]
    newRules[`[${idx}].linkApi`] = [
      { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
      {
        validator: validLink,
        message: t('configUser.validateMessage.invalid', { data: 'Link API' }),
        trigger: 'blur',
      },
    ]
    newRules[`[${idx}].unitOfTime`] = [
      { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
      {
        type: 'number',
        max: 999,
        min: 1,
        message: t('configUser.validateMessage.valueBetween', [1, 999]),
        trigger: 'blur',
      },
    ]
  })
  rules.value = newRules
})

const getConfig = () => {
  apiGetConfigFE().then(res => {
    config.value = res.data
    loading.value = false
  })
}

const processing = ref(false)
const formRef = ref()
const submitForm = () => {
  const formEl = formRef
  if (processing.value) {
    return
  }
  formEl.value.validate(valid => {
    if (valid) {
      const data = {
        data: config.value,
      }
      processing.value = true
      apiUpdateConfigFE(data)
        .then(res => {
          ElMessage({
            type: 'success',
            message: t('configUser.message.updateSuccess'),
          })
        })
        .catch(_ => {
          ElMessage({
            type: 'error',
            message: t('omsSetting.failUpdate'),
          })
        })
        .finally(_ => {
          processing.value = false
        })
    }
  })
}

const handleShowPass = idx => {
  const showPass = !!config.value[idx].showPass
  config.value[idx].showPass = !showPass
}

onBeforeMount(() => {
  getConfig()
})

defineOptions({
  name: 'FELogfileConfig',
})
</script>

<style scoped>
h2.title-block {
  font-weight: 600;
  color: #525b73;
  font-size: 14px;
  margin-bottom: 5px;
}

:deep(.user-form .action-head button) {
  height: 32px;
}
</style>
