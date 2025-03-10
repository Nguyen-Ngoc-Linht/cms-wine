<template>
  <div class="paddingX-24 padding-top-14">
    <el-form
      :model="form"
      :rules="rules"
      ref="configForm"
      label-position="top"
      v-loading="loading"
      class="form-custom bg-white paddingY-20"
    >
      <el-row
        class="paddingX-20"
        :gutter="20"
      >
        <el-col :md="12">
          <el-form-item
            :label="t('administration.backup.schedule')"
            prop="schedule"
            required
          >
            <el-select
              v-model="form.schedule"
              @change="handleChangeType"
              class="w-full"
              :placeholder="t('el.datepicker.selectTime')"
            >
              <el-option
                v-for="item in scheduleType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                @change="handleChangeType"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item
            :label="t('administration.backup.backupTime')"
            prop="time"
            required
          >
            <el-select
              v-model="form.time"
              class="w-full"
              :placeholder="
                form.schedule === 1 ? t('el.datepicker.selectHour') : t('el.datepicker.selectDay')
              "
            >
              <el-option
                v-for="item in timeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="paddingX-20">
        <el-button
          class="el-button--main"
          type="primary"
          @click="submitForm()"
          >{{ t('administration.backup.saveConfig') }}</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useAppStore, useSearchStore } from '@/store'
import lang from '@/locale/getMessage.js'
import { useI18n } from '@/locale'

import { useRoute, useRouter } from 'vue-router'
import { apiBackupConfig } from '@/api/systemconfig'
import { ElMessage, ElMessageBox } from 'element-plus'

const { t } = useI18n()

const scheduleType = reactive([
  {
    label: t('administration.backup.everyDay'),
    value: 1,
  },
  {
    label: t('administration.backup.everyMonth'),
    value: 2,
  },
])

const timeList = ref([])

const handleChangeType = scheduleType => {
  initTimeSelect(scheduleType)
}

const initTimeSelect = scheduleType => {
  if (scheduleType === 1) {
    timeList.value = [...Array(24).keys()].map(i => ({
      label: ('0' + i).slice(-2) + ':00',
      value: i,
    }))
  } else {
    timeList.value = Array.from({ length: 31 }, (_, i) => ({ label: i + 1, value: i + 1 }))
  }
  form.time = null
}

const loading = ref(true)

const form = reactive({
  schedule: 1,
  time: null,
})

const rules = reactive({
  schedule: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'change' },
  ],
  time: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
})

const configForm = ref()
const processing = ref(false)
const submitForm = () => {
  const formEl = configForm

  if (processing.value) {
    return
  }
  formEl.value.validate(valid => {
    if (valid) {
      ElMessageBox.confirm(t('administration.backup.confirmSaveConfig'), t('omsSetting.warning'), {
        confirmButtonText: t('omsSetting.confirm'),
        cancelButtonText: t('omsSetting.cancel'),
        confirmButtonClass: 'el-button--main',
        cancelButtonClass: 'el-button--secondary',
        buttonSize: 'default',
      })
        .then(() => {
          saveConfig()
        })
        .catch(() => {})
    }
  })
}

const loadConfig = () => {
  const params = {
    method: 'GET',
  }
  apiBackupConfig(params)
    .then(res => {
      if (res.data) {
        if (res.data.hourOfDay != null) {
          form.schedule = 1
          initTimeSelect(1)
          form.time = res.data.hourOfDay
        } else if (res.data.dayOfMonth != null) {
          form.schedule = 2
          initTimeSelect(2)
          form.time = res.data.dayOfMonth
        }
      }
    })
    .finally(_ => {
      loading.value = false
    })
}

const saveConfig = () => {
  const { schedule, time } = form

  const data = {
    method: 'SET',
    arguments: schedule === 1 ? { hourOfDay: time } : { dayOfMonth: time },
  }

  processing.value = true
  apiBackupConfig(data)
    .then(res => {
      ElMessage({
        type: 'success',
        message: t('omsSetting.successUpdate'),
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

onMounted(() => {
  loadConfig()
})

defineOptions({
  name: 'BackupConfig',
})
</script>

<style scoped></style>
