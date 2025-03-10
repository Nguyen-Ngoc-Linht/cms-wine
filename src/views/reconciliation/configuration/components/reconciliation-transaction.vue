<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage, ElMessageBox } from 'element-plus'
import InputInteger from '@/components/InputInteger/index.vue'
import { usePermissionStore } from '@/store'
import { cloneDeep } from 'lodash-unified'
import { apiCollectPropertySystem, apiUpdateConfigTransaction } from '@/api/reconciliation'

defineOptions({
  name: 'ReconciliationTransaction',
})
const { t } = useI18n()
const { roleData } = usePermissionStore()
const formData = ref(null)
const formParameterConfig = ref(null)
const parameterConfig = ref({})
const ruleEdit = ref({})
const rules = reactive({
  editTimeLimit: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  reconciliationHour: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  reconciliationMinute: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  isCheck: [
    {
      validator: (rule, value, callback) => {
        const checkboxes = [
          parameterConfig.value.isStationIn,
          parameterConfig.value.isStationOut,
          parameterConfig.value.isTicketPrice,
          parameterConfig.value.isVehicleType,
          parameterConfig.value.isStationOutTime,
          parameterConfig.value.isStationInTime,
          parameterConfig.value.isLaneOut,
          parameterConfig.value.isLaneIn,
        ]
        const anyChecked = Object.values(checkboxes).some(val => val)
        if (!anyChecked) {
          callback(t('configUser.validateMessage.required'))
        } else {
          callback()
        }
      },
      trigger: 'change', // Lắng nghe sự kiện thay đổi
    },
  ],
})
const listHour = ref(Array.from({ length: 23 }, (_, i) => i + 1))
const listMinute = ref(
  Array.from({ length: 6 }, (_, i) => {
    if (i === 0) {
      return '00'
    } else {
      return i * 10
    }
  })
)
const processing = ref(false)

onMounted(async () => {
  await initData()
})
const initData = async () => {
  const params = {
    name: 'Đối soát giao dịch',
  }
  await apiCollectPropertySystem(params)
    .then(res => {
      if (res.status === 200) {
        formData.value = res.data
        parameterConfig.value = cloneDeep(formData.value)
      }
    })
    .catch(err => console.error(err))
}
const updateTransaction = async () => {
  if (processing.value) {
    return
  }
  formParameterConfig.value.validate(async valid => {
    if (valid) {
      processing.value = true
      await apiUpdateConfigTransaction(parameterConfig.value, parameterConfig.value.id)
        .then(res => {
          if (res.status === 200) {
            ElMessage.success(t('configUser.message.updateSuccess'))
            processing.value = false
            initData()
          }
        })
        .catch(err => {
          console.error(err)
          processing.value = false
        })
    }
  })
}
</script>

<template>
  <div class="paddingX-24 py-4">
    <el-form
      ref="formParameterConfig"
      class="box-parameter-config"
      :rules="rules"
      :model="parameterConfig"
    >
      <el-row
        :gutter="20"
        class="mb-4 bg-white p-4"
        style="margin-left: 0 !important; margin-right: 0 !important"
      >
        <el-col
          class=""
          :lg="12"
          :sm="24"
          style="padding-left: 0 !important; padding-right: 0 !important"
        >
          <el-form-item
            :label="t('reconciliation.dataEditTime')"
            prop="editTimeLimit"
            class="custom mb-2"
            style="display: inline-block; width: 100%"
          >
            <InputInteger
              v-model="parameterConfig.editTimeLimit"
              :append="true"
              :max-length="3"
              :disabled="!roleData.canUpdate"
            >
              <template #append>{{ t('el.datepicker.day')?.toLowerCase() }}</template>
            </InputInteger>
          </el-form-item>
        </el-col>
        <el-col
          :lg="12"
          :sm="24"
        ></el-col>
      </el-row>
      <div class="p-4 bg-white">
        <el-row :gutter="20">
          <el-col
            :lg="4"
            :sm="4"
            :md="4"
            class="mb-2"
          >
            <el-form-item
              :label="t('reconciliation.reconciliationTime')"
              prop="reconciliationHour"
              class="custom mb-2"
              style="display: inline-block; width: 100%"
            >
              <el-select
                v-model="parameterConfig.reconciliationHour"
                class="w-full"
                filterable
                clearable
                collapse-tags
                :disabled="!roleData.canUpdate"
                :placeholder="t('el.datepicker.selectHour')"
              >
                <el-option
                  v-for="item in listHour"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :lg="4"
            :sm="4"
            :md="4"
            class="mb-2"
          >
            <el-form-item
              prop="reconciliationMinute"
              class="custom mb-2"
              style="display: inline-block; width: 100%"
            >
              <div>&nbsp;</div>
              <el-select
                v-model="parameterConfig.reconciliationMinute"
                class="w-full"
                clearable
                filterable
                collapse-tags
                :disabled="!roleData.canUpdate"
                :placeholder="t('el.datepicker.selectMinute')"
              >
                <el-option
                  v-for="item in listMinute"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col
            :sm="24"
            :lg="12"
          >
            <el-form-item
              prop="isCheck"
              class="required-label"
              style="display: inline-block; width: 100%"
            >
              <template #label>
                <span class="text--danger">*</span>
                <span class="fs-14 text-[#525b73] font-[600]">{{
                  t('reconciliation.compareData')
                }}</span>
              </template>
              <div class="flex-column flex gap-3 w-full">
                <el-checkbox
                  :label="t('reconciliation.stationIn')"
                  v-model.number="parameterConfig.isStationIn"
                  :disabled="!roleData.canUpdate"
                />
                <el-checkbox
                  :label="t('reconciliation.stationOut')"
                  v-model.number="parameterConfig.isStationOut"
                  :disabled="!roleData.canUpdate"
                />
                <el-checkbox
                  :label="t('reconciliation.amount')"
                  v-model.number="parameterConfig.isTicketPrice"
                  :disabled="!roleData.canUpdate"
                />
                <el-checkbox
                  :label="t('reconciliation.vehicleType')"
                  v-model.number="parameterConfig.isVehicleType"
                  :disabled="!roleData.canUpdate"
                />
                <el-checkbox
                  :label="t('reconciliation.stationExitTime')"
                  v-model.number="parameterConfig.isStationOutTime"
                  :disabled="!roleData.canUpdate"
                />
                <el-checkbox
                  :label="t('reconciliation.stationInTime')"
                  v-model.number="parameterConfig.isStationInTime"
                  :disabled="!roleData.canUpdate"
                />
                <el-checkbox
                  :label="t('reconciliation.laneOut')"
                  v-model.number="parameterConfig.isLaneOut"
                  :disabled="!roleData.canUpdate"
                />
                <el-checkbox
                  :label="t('reconciliation.laneIn')"
                  v-model.number="parameterConfig.isLaneIn"
                  :disabled="!roleData.canUpdate"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="flex justify-end pt-5 pb-3">
          <el-button
            v-if="roleData.canUpdate"
            @click="updateTransaction"
            :loading="processing"
            type="primary"
            class="el-button--main"
            style="min-width: 100px"
            >{{ $t('omsSetting.save') }}
          </el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<style scoped lang="scss"></style>
