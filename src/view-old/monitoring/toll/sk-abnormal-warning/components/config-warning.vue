<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import moment from 'moment'
import { useI18n } from '@/locale'
import lang from '@/locale/getMessage'
import { useAppStore, usePermissionStore } from '@/store'
import { useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-unified'
import { apiGetAlertConfig, apiUpdateAlertConfig } from '@/api/toll'
import { ElMessage } from 'element-plus'
import InputInteger from '@/components/InputInteger/index.vue'

defineOptions({
  name: 'config-warning',
})

const props = defineProps({})

const permissionStore = usePermissionStore()
const appStore = useAppStore()
const { t } = useI18n()
const router = useRouter()
const locale = computed(() => lang[appStore.lang])
const processing = ref(false)

const ruleFormRef = ref()
const rules = reactive({
  distanceTime2Trans: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  kpiByStation: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  kpiByLane: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  kpiByRoute: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  signalInterval: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  // etagWarningWithoutTransaction: [{required: true, message: t('configUser.validateMessage.required'), trigger: 'blur'}],
})
const rulesAlert = ref({})
const rulesAlertNoEntry = ref({})
const formConfigWarning = ref({
  id: '',
  distanceTime2Trans: '',
  kpiByStation: '',
  kpiByLane: '',
  kpiByRoute: '',
  routeAlertConfigs: [],
  listRouteAlertConfigs: [],
  listRouteAlertConfigsNoEntry: [],
  objRouteAlertConfigs: {},
  objRouteAlertConfigsNoEntry: {},
})
const dataConfig = ref(null)
const roleAction = ref(null)

onMounted(() => {
  roleAction.value = permissionStore.roleData
})

const handleGetConfigAlert = async () => {
  const res = await apiGetAlertConfig()
  if (res.status === 200) {
    // console.log('handleGetConfigAlert: ', res)
    dataConfig.value = res.data[0]
    const {
      distanceTime2Trans,
      kpiByLane,
      kpiByRoute,
      kpiByStation,
      routeAlertConfigs,
      id,
      signalInterval,
      etagWarningWithoutTransaction,
    } = dataConfig.value
    // console.log({ distanceTime2Trans, kpiByLane, kpiByRoute, kpiByStation, routeAlertConfigs, id })
    formConfigWarning.value.distanceTime2Trans = distanceTime2Trans || ''
    formConfigWarning.value.kpiByLane = kpiByLane || ''
    formConfigWarning.value.kpiByRoute = kpiByRoute || ''
    formConfigWarning.value.kpiByStation = kpiByStation || ''
    formConfigWarning.value.signalInterval = signalInterval || ''
    formConfigWarning.value.etagWarningWithoutTransaction = etagWarningWithoutTransaction || ''
    formConfigWarning.value.routeAlertConfigs = routeAlertConfigs || []
    formConfigWarning.value.id = id
    if (formConfigWarning.value.routeAlertConfigs.length > 0) {
      formConfigWarning.value.routeAlertConfigs.forEach((item, index) => {
        if (item.type === 1) {
          formConfigWarning.value.listRouteAlertConfigs.push(item)
          const length = formConfigWarning.value.listRouteAlertConfigs.length
          formConfigWarning.value.objRouteAlertConfigs[`config${length - 1}`] = item.threshold
          rulesAlert.value[`config${length - 1}`] = [
            { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
          ]
        } else if (item.type === 2) {
          formConfigWarning.value.listRouteAlertConfigsNoEntry.push(item)
          const length = formConfigWarning.value.listRouteAlertConfigsNoEntry.length
          formConfigWarning.value.objRouteAlertConfigsNoEntry[`config${length - 1}`] =
            item.threshold
          rulesAlertNoEntry.value[`config${length - 1}`] = [
            { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
          ]
        }
      })
    }
  }
}
handleGetConfigAlert()
const handleConfigWarning = async () => {
  try {
    await Promise.all([validFormData(), validFormAlert(), validFormAlertNoEntry()])
    processing.value = true

    const length1 = formConfigWarning.value.listRouteAlertConfigs.length
    for (let i = 0; i < length1; i++) {
      formConfigWarning.value.listRouteAlertConfigs[i].threshold =
        formConfigWarning.value.objRouteAlertConfigs[`config${i}`]
      // console.log(formConfigWarning.value.objRouteAlertConfigs[`config${i}`], i)
    }
    const length2 = formConfigWarning.value.listRouteAlertConfigsNoEntry.length
    for (let i = 1; i < length2; i++) {
      formConfigWarning.value.listRouteAlertConfigsNoEntry[i].threshold =
        formConfigWarning.value.objRouteAlertConfigsNoEntry[`config${i}`]
    }
    const arrConfigRoute = []
    for (const item of formConfigWarning.value.listRouteAlertConfigs) {
      arrConfigRoute.push(item)
    }
    for (const item of formConfigWarning.value.listRouteAlertConfigsNoEntry) {
      arrConfigRoute.push(item)
    }
    console.log(formConfigWarning.value)
    const params = {
      distanceTime2Trans: parseInt(formConfigWarning.value.distanceTime2Trans),
      kpiByLane: parseInt(formConfigWarning.value.kpiByLane),
      kpiByStation: parseInt(formConfigWarning.value.kpiByStation),
      kpiByRoute: parseInt(formConfigWarning.value.kpiByRoute),
      signalInterval: parseInt(formConfigWarning.value.signalInterval),
      etagWarningWithoutTransaction: formConfigWarning.value.etagWarningWithoutTransaction,
      routeAlertConfigs: arrConfigRoute,
    }
    const res = await apiUpdateAlertConfig(formConfigWarning.value.id, params)
    if (res.status === 200) {
      ElMessage.success(t('configUser.message.updateSuccess'))
    }
    processing.value = false
  } catch (e) {
    console.log(e)
    processing.value = false
  }
}
const validFormData = () => {
  return new Promise((resolve, reject) => {
    ruleFormRef.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form lanes thoát')
      }
    })
  })
}
const formListAlertConfigs = ref(null)
const validFormAlert = () => {
  return new Promise((resolve, reject) => {
    formListAlertConfigs.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form lanes thoát')
      }
    })
  })
}
const formListAlertConfigsNoEntry = ref(null)
const validFormAlertNoEntry = () => {
  return new Promise((resolve, reject) => {
    formListAlertConfigsNoEntry.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form lanes thoát')
      }
    })
  })
}
const handleInputNumber = (key, value) => {
  // Giới hạn độ dài của giá trị tối đa 5 ký tự
  let processedValue = value.slice(0, 5)

  // Kiểm tra và giới hạn 2 chữ số sau dấu phẩy
  const regex = /^\d+(\.\d{0,2})?$/
  if (!regex.test(processedValue)) {
    processedValue = processedValue.slice(0, -1)
  }
  console.log(key, processedValue)
  console.log(!regex.test(processedValue))

  formConfigWarning.value[key] = processedValue
}
const getCurrentLocalTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const date = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
}
const currentDateTime = ref(getCurrentLocalTime())
</script>

<template>
  <div class="padding-24">
    <div class="bg-white padding-12">
      <el-form
        :model="formConfigWarning"
        :rules="rules"
        ref="ruleFormRef"
        label-position="top"
        class="form-custom"
      >
        <el-row :gutter="16">
          <el-col :span="24">
            <p class="fs-16 font-[600] mb-2 text-[#525B73]">
              {{ t('monitoring.toll.infoConfig') }}
            </p>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('monitoring.toll.distanceBetweenToTransaction')"
              prop="distanceTime2Trans"
            >
              <!--              <el-input-->
              <!--                :placeholder="t('configUser.pleaseEnter')"-->
              <!--                type="number"-->
              <!--                v-model="formConfigWarning.distanceTime2Trans"-->
              <!--                maxlength="3"-->
              <!--              />-->
              <InputInteger
                v-model="formConfigWarning.distanceTime2Trans"
                :placeholder="t('configUser.pleaseEnter')"
                :append="true"
                :max-length="3"
                type-input="number"
              >
                <template #append>{{ t('dateTime.minute') }}</template>
              </InputInteger>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('monitoring.toll.KPIThresholdLane')"
              prop="kpiByLane"
            >
              <el-input
                :placeholder="t('configUser.pleaseEnter')"
                type="number"
                v-model="formConfigWarning.kpiByLane"
                @input="handleInputNumber('kpiByLane', $event)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('monitoring.toll.KPIThresholdStation')"
              prop="kpiByStation"
            >
              <el-input
                :placeholder="t('configUser.pleaseEnter')"
                type="number"
                v-model="formConfigWarning.kpiByStation"
                @input="handleInputNumber('kpiByStation', $event)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('monitoring.toll.KPIThresholdGland')"
              prop="kpiByRoute"
            >
              <el-input
                :placeholder="t('configUser.pleaseEnter')"
                type="number"
                v-model="formConfigWarning.kpiByRoute"
                @input="handleInputNumber('kpiByRoute', $event)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('monitoring.toll.signalInterval')"
              prop="signalInterval"
            >
              <InputInteger
                v-model="formConfigWarning.signalInterval"
                :placeholder="t('configUser.pleaseEnter')"
                :append="true"
                :max-length="3"
                type-input="number"
              >
                <template #append>{{ t('dateTime.minute') }}</template>
              </InputInteger>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('monitoring.toll.etagWarningWithoutTransaction')"
              prop="etagWarningWithoutTransaction"
            >
              <el-checkbox v-model="formConfigWarning.etagWarningWithoutTransaction"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form
        :model="formConfigWarning.objRouteAlertConfigs"
        ref="formListAlertConfigs"
        :rules="rulesAlert"
        v-if="
          formConfigWarning.listRouteAlertConfigs &&
          formConfigWarning.listRouteAlertConfigs.length > 0
        "
      >
        <el-row :gutter="16">
          <el-col :span="24">
            <p class="fs-16 font-[600] mb-2 text-[#525B73]">
              {{ t('monitoring.toll.timeTakenExit') }}
            </p>
          </el-col>
          <el-col
            :span="12"
            v-for="(route, index) in formConfigWarning.listRouteAlertConfigs"
            :key="index"
          >
            <el-form-item
              :label="route.routeName"
              :prop="`config${index}`"
              style="width: 100%; display: inline-block"
            >
              <InputInteger
                v-model="formConfigWarning.objRouteAlertConfigs[`config${index}`]"
                :placeholder="t('configUser.pleaseEnter')"
                :append="true"
                :max-length="3"
                type-input="number"
              >
                <template #append>{{ t('dateTime.hours') }}</template>
              </InputInteger>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form
        ref="formListAlertConfigsNoEntry"
        :rules="rulesAlertNoEntry"
        :model="formConfigWarning.objRouteAlertConfigsNoEntry"
        v-if="
          formConfigWarning.listRouteAlertConfigsNoEntry &&
          formConfigWarning.listRouteAlertConfigsNoEntry.length > 0
        "
      >
        <el-row :gutter="16">
          <el-col :span="24">
            <p class="fs-16 font-[600] mb-2 text-[#525B73]">
              {{ t('monitoring.toll.timeTakenExitNoEntry') }}
            </p>
          </el-col>
          <el-col
            :span="12"
            v-for="(route, index) in formConfigWarning.listRouteAlertConfigsNoEntry"
            :key="index"
          >
            <el-form-item
              :label="route.routeName"
              :prop="`config${index}`"
              style="width: 100%; display: inline-block"
            >
              <InputInteger
                v-model="formConfigWarning.objRouteAlertConfigsNoEntry[`config${index}`]"
                :placeholder="t('configUser.pleaseEnter')"
                :append="true"
                :max-length="3"
                type-input="number"
              >
                <template #append>{{ t('dateTime.hours') }}</template>
              </InputInteger>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="w-full">
        <div class="w-1/2">
          <h5 class="text-[#525B73] font-semibold text-lg mb-2">
            {{ $t('weightVehicle.updateTime') }}
          </h5>
          <el-date-picker
            type="date"
            v-model="currentDateTime"
            :placeholder="t('configUser.pleaseSelect')"
            clearable
            value-format="YYYY-MM-DD HH:mm:ss"
            format="DD/MM/YYYY HH:mm:ss"
            style="width: 100%"
            disabled
          />
        </div>
      </div>
      <div
        class="foot flex justify-end"
        v-if="roleAction?.canUpdate === 1"
      >
        <el-button
          style="background-color: #059efb; border: none"
          :loading="processing"
          class="border-1 paddingX-30"
          @click="handleConfigWarning"
          type="success"
          >{{ $t('omsSetting.save') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
