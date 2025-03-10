<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage, ElMessageBox } from 'element-plus'
import InputInteger from '@/components/InputInteger/index.vue'
import { usePermissionStore } from '@/store'
import { cloneDeep } from 'lodash-unified'
import { apiCollectPropertySystem, apiUpdateConfigWarning } from '@/api/reconciliation'
import moment from 'moment/moment'

defineOptions({
  name: 'ConfigAlert',
})
const { t } = useI18n()
const { roleData } = usePermissionStore()
const formData = ref(null)
const formParameterConfig = ref(null)
const parameterConfig = ref({})
const ruleEdit = ref({})
const valueDate = ref(null)
const rules = reactive({
  isCheckReconciliation: [
    {
      validator: (rule, value, callback) => {
        console.log('valueL ', value, isCheckDate.value)
        if (parameterConfig.value.listDay.length === 0) {
          callback(t('configUser.validateMessage.required'))
        } else {
          callback()
        }
      },
      trigger: 'change', // Lắng nghe sự kiện thay đổi
    },
  ],
})
const isCheckDate = ref(false)
const processing = ref(false)

onMounted(async () => {
  await initData()
})
const initData = async () => {
  const params = {
    name: 'Cấu hình cảnh báo',
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
      await apiUpdateConfigWarning(parameterConfig.value, parameterConfig.value.id)
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
const handleChangeDate = date => {
  if (date) {
    valueDate.value = date
    isCheckDate.value = parameterConfig.value.listDay.some(item => item === date)
    if (!isCheckDate.value) {
      parameterConfig.value.listDay.push(date)
    }
  }
}
const handleDeleteDate = date => {
  if (roleData.canUpdate) {
    if (date === valueDate.value) {
      valueDate.value = null
    }
    parameterConfig.value.listDay = parameterConfig.value.listDay.filter(item => item !== date)
  }
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
              class="required-label"
              style="display: inline-block; width: 100%"
            >
              <el-checkbox
                :label="t('reconciliation.warningOfDecline')"
                v-model.number="parameterConfig.isWarning"
                :disabled="!roleData.canUpdate"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
                  t('reconciliation.selectDateOfWarning')
                }}</span>
              </template>
              <el-date-picker
                v-model="valueDate"
                type="date"
                format="DD/MM"
                value-format="DD/MM"
                class="w-full height-32"
                :placeholder="t('el.datepicker.selectDay')"
                :disabled="!roleData.canUpdate"
                @change="handleChangeDate($event)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :sm="10"
            :lg="10"
          >
            <div class="form-list-date flex items-center gap-2 flex-wrap">
              <div
                v-for="(item, index) in parameterConfig.listDay"
                :key="index"
              >
                <div class="item-date flex items-center">
                  <span>{{ item }}</span>
                  <svg-icon
                    icon-class="item-close"
                    class="width-12 height-12 ml-2 cursor-pointer"
                    @click="handleDeleteDate(item)"
                  />
                </div>
              </div>
            </div>
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

<style scoped lang="scss">
.item-date {
  color: #0078d4;
  font-size: 14px;
  border: 1px solid #61b7f7;
  background-color: #e3f2fd;
  border-radius: 2px;
  padding: 2px 15px;
}
</style>
