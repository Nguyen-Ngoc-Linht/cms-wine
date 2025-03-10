<template>
  <div class="transaction-detail">
    <div class="relative">
      <div
        class="page-header z-[100] bg-[#fff] flex items-center justify-between sticky z-[1000] top-0 left-0 right-0 height-50 border-b border-[#CDCDCE]"
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
        <div class="action-head paddingX-12">
          <div class="flex justify-content-end">
            <el-button
              class="el-button--main"
              type="primary"
              @click="submitForm()"
              :loading="processing"
              >{{ t('omsSetting.save') }}</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div
      class="paddingX-24 padding-top-10"
      v-loading="loading"
    >
      <el-row class="bg-white padding-20">
        <el-col :md="12">
          <el-form
            :model="form"
            :rules="rules"
            ref="formRef"
            label-position="top"
            v-loading="loading"
            class="form-custom"
          >
            <el-form-item
              :label="
                $t('configUser.passwordPolicy.sessionTimeout') +
                ' (' +
                t('el.datepicker.minute')?.toLowerCase() +
                ') '
              "
              prop="timeout"
              required
            >
              <InputInteger
                v-model="form.timeout"
                :append="true"
                :max-length="2"
              >
                <template #append>{{ t('el.datepicker.minute')?.toLowerCase() }}</template>
              </InputInteger>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useAppStore, useSearchStore } from '@/store'
import lang from '@/locale/getMessage.js'
import { useI18n } from '@/locale'

import { useRoute, useRouter } from 'vue-router'
import { apiSessionConfig } from '@/api/systemconfig'
import InputInteger from '@/components/InputInteger'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const locale = computed(() => lang[appStore.lang])
const loading = ref(true)

const backToList = () => {
  router.back()
}

const form = reactive({
  timeout: 0,
})

const rules = reactive({
  timeout: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    {
      type: 'number',
      min: 5,
      max: 99,
      message: t('configUser.validateMessage.valueBetween', [5, 99]),
      trigger: 'blur',
    },
  ],
})

const getConfig = () => {
  const params = {
    method: 'GET',
  }
  apiSessionConfig(params)
    .then(res => {
      form.timeout = res.data
    })
    .catch(_ => {
      form.timeout = 0
    })
    .finally(_ => {
      loading.value = false
    })
}

const formRef = ref()
const processing = ref(false)
const submitForm = () => {
  const formEl = formRef
  if (processing.value) {
    return
  }

  formEl.value.validate(valid => {
    if (valid) {
      const { timeout } = form

      const data = {
        method: 'SET',
        arguments: {
          timeout,
        },
      }
      processing.value = true
      apiSessionConfig(data)
        .then(res => {
          appStore.SET_IDLE_TIME(timeout * 60 * 1000)
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

onMounted(() => {
  getConfig()
})

defineOptions({
  name: 'SessionPolicy',
})
</script>

<style scoped></style>
