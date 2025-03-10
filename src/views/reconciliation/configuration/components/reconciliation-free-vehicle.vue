<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage, ElMessageBox } from 'element-plus'
import InputInteger from '@/components/InputInteger/index.vue'
import { usePermissionStore } from '@/store'
import { cloneDeep } from 'lodash-unified'
import { apiCollectPropertySystem, apiUpdateConfigFreeVehicle } from '@/api/reconciliation'

defineOptions({
  name: 'ReconciliationFreeVehicle',
})
const { t } = useI18n()
const { roleData } = usePermissionStore()
const formData = ref(null)
const formParameterConfig = ref(null)
const parameterConfig = ref({})
const ruleEdit = ref({})
const rules = reactive({
  isCheckReconciliation: [
    {
      validator: (rule, value, callback) => {
        const checkboxes = [
          parameterConfig.value.autoIdentifyMP,
          parameterConfig.value.nonAutoIdentifyMP,
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
  isCheckWarningCondition: [
    {
      validator: (rule, value, callback) => {
        const checkboxes = [
          parameterConfig.value.invalidGSTPTransaction,
          parameterConfig.value.invalidFreeCarList,
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
const processing = ref(false)

onMounted(async () => {
  await initData()
})
const initData = async () => {
  const params = {
    name: 'Đối soát giao dịch xe miễn phí',
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
const updateTransactionFreeVehicle = async () => {
  if (processing.value) {
    return
  }
  formParameterConfig.value.validate(async valid => {
    if (valid) {
      processing.value = true
      await apiUpdateConfigFreeVehicle(parameterConfig.value, parameterConfig.value.id)
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
      <div class="p-4 bg-white">
        <el-row :gutter="20">
          <el-col
            :sm="24"
            :lg="12"
          >
            <el-form-item
              prop="isCheckReconciliation"
              class="required-label"
              style="display: inline-block; width: 100%"
            >
              <template #label>
                <span class="text--danger">*</span>
                <span class="fs-14 text-[#525b73] font-[600]">{{
                  t('route.configureReconciliation')
                }}</span>
              </template>
              <div class="flex-column flex gap-3 w-full">
                <el-checkbox
                  :label="t('reconciliation.autoIdentifyMP')"
                  v-model.number="parameterConfig.autoIdentifyMP"
                  :disabled="!roleData.canUpdate"
                />
                <el-checkbox
                  :label="t('reconciliation.nonAutoIdentifyMP')"
                  v-model.number="parameterConfig.nonAutoIdentifyMP"
                  :disabled="!roleData.canUpdate"
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col
            :sm="24"
            :lg="12"
          >
            <el-form-item
              prop="isCheckWarningCondition"
              class="required-label"
              style="display: inline-block; width: 100%"
            >
              <template #label>
                <span class="text--danger">*</span>
                <span class="fs-14 text-[#525b73] font-[600]">{{
                  t('reconciliation.warningConditions')
                }}</span>
              </template>
              <div class="flex-column flex gap-3 w-full">
                <el-checkbox
                  :label="t('reconciliation.invalidGSTPTransaction')"
                  v-model.number="parameterConfig.invalidGSTPTransaction"
                  :disabled="!roleData.canUpdate"
                />
                <el-checkbox
                  :label="t('reconciliation.invalidFreeCarList')"
                  v-model.number="parameterConfig.invalidFreeCarList"
                  :disabled="!roleData.canUpdate"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="flex justify-end pt-5 pb-3">
          <el-button
            v-if="roleData.canUpdate"
            @click="updateTransactionFreeVehicle"
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
