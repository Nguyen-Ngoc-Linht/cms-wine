<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiCollectPropertySystem, apiUpdateConfigTimeDelete } from '@/api/reconciliation'
import InputInteger from '@/components/InputInteger/index.vue'
import { usePermissionStore, useRouteUser, useStatisticalReportStore, useUserStore } from '@/store'

const { t } = useI18n()

const { roleData } = usePermissionStore()
const statisticalReportStore = useStatisticalReportStore()
const userStore = useUserStore()
const routeUser = useRouteUser()
const processing = ref(false)
const rules = reactive({
  unitOfTime: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
})
const refParameterConfig = ref(null)
const parameterConfig = ref({
  unitOfTime: 0,
})
onMounted(async () => {
  await initData()
})
const initData = async () => {
  const params = {
    name: 'TimeDelete',
  }
  await apiCollectPropertySystem(params)
    .then(res => {
      if (res.status === 200) {
        parameterConfig.value = { ...res.data }
      }
    })
    .catch(err => console.error(err))
}
const updateTransaction = async () => {
  if (processing.value) {
    return
  }
  refParameterConfig.value.validate(async valid => {
    if (valid) {
      processing.value = true
      await apiUpdateConfigTimeDelete(parameterConfig.value, parameterConfig.value.id)
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
      ref="refParameterConfig"
      class="box-parameter-config"
      :rules="rules"
      :model="parameterConfig"
    >
      <div class="p-4 bg-white">
        <el-row gutter="20">
          <el-col
            :lg="12"
            :sm="24"
          >
            <el-form-item
              :label="t('collection.periodicallyDeleteFiles')"
              prop="unitOfTime"
              class="custom mb-2"
              style="display: inline-block; width: 100%"
            >
              <InputInteger
                v-model="parameterConfig.unitOfTime"
                :append="true"
                :max-length="4"
                :disabled="!roleData.canUpdate"
              >
                <template #append>{{ t('el.datepicker.day')?.toLowerCase() }}</template>
              </InputInteger>
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

<style scoped lang="scss">
.custom {
  color: #525b73;

  .el-form-item__label {
    color: #525b73;
    font-weight: 600 !important;
  }
}

.text-custom {
  color: #525b73;
  font-weight: 600;
  font-size: 18px;
}
</style>
