<template>
  <div ref="formParameterConfig">
    <div
      v-for="(item, index) in listParameterConfig"
      :key="item.id"
      class="mt-4 mb-4 mx-5 bg-white overflow-hidden box-parameter-config"
      style="border-radius: 8px"
    >
      <div
        class="header-title-config height-40 w-full flex text-white items-center px-5 mb-3 font-bold"
      >
        {{ item['routeAlertConfigDTO']['routeName'] }}
      </div>
      <el-row :gutter="0">
        <el-col :sm="8">
          <div class="px-5">
            <el-form
              :ref="el => registerFormRef(formRefName(index, 0), el)"
              :rules="ruleEdit"
              :model="item['revenueAlertConfigDTOS'][0]"
            >
              <h3 class="text-custom mb-2">{{ t('reconciliation.unusual.laneTurnover') }}</h3>
              <div class="item-mid">
                <el-form-item
                  class="custom mb-3"
                  :label="$t('el.datepicker.day')"
                  prop="revenueByDay"
                  style="display: inline-block; width: 100%"
                >
                  <el-input
                    v-model="item['revenueAlertConfigDTOS'][0]['revenueByDay']"
                    type="number"
                    :placeholder="$t('configUser.pleaseEnter')"
                  />
                </el-form-item>
              </div>
              <div class="item-mid">
                <el-form-item
                  class="custom mb-3"
                  :label="$t('el.datepicker.month')"
                  prop="revenueByMonth"
                  style="display: inline-block; width: 100%"
                >
                  <el-input
                    v-model="item['revenueAlertConfigDTOS'][0]['revenueByMonth']"
                    type="number"
                    :placeholder="$t('configUser.pleaseEnter')"
                  />
                </el-form-item>
              </div>
              <div class="item-mid">
                <el-form-item
                  class="custom"
                  :label="$t('el.datepicker.year')"
                  prop="revenueByYear"
                  style="display: inline-block; width: 100%"
                >
                  <el-input
                    v-model="item['revenueAlertConfigDTOS'][0]['revenueByYear']"
                    type="number"
                    :placeholder="$t('configUser.pleaseEnter')"
                  />
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-col>
        <el-col
          :sm="8"
          class="box-middle"
        >
          <div class="px-5">
            <el-form
              :ref="el => registerFormRef(formRefName(index, 1), el)"
              :rules="ruleEdit"
              :model="item['revenueAlertConfigDTOS'][1]"
            >
              <h3 class="text-custom mb-2">{{ t('reconciliation.unusual.stationTurnover') }}</h3>
              <div class="item-mid">
                <el-form-item
                  class="custom mb-3"
                  :label="$t('el.datepicker.day')"
                  prop="revenueByDay"
                  style="display: inline-block; width: 100%"
                >
                  <el-input
                    v-model="item['revenueAlertConfigDTOS'][1]['revenueByDay']"
                    type="number"
                    :placeholder="$t('configUser.pleaseEnter')"
                  />
                </el-form-item>
              </div>
              <div class="item-mid">
                <el-form-item
                  class="custom mb-3"
                  :label="$t('el.datepicker.month')"
                  prop="revenueByMonth"
                  style="display: inline-block; width: 100%"
                >
                  <el-input
                    v-model="item['revenueAlertConfigDTOS'][1]['revenueByMonth']"
                    type="number"
                    :placeholder="$t('configUser.pleaseEnter')"
                  />
                </el-form-item>
              </div>
              <div class="item-mid">
                <el-form-item
                  class="custom"
                  :label="$t('el.datepicker.year')"
                  prop="revenueByYear"
                  style="display: inline-block; width: 100%"
                >
                  <el-input
                    v-model="item['revenueAlertConfigDTOS'][1]['revenueByYear']"
                    type="number"
                    :placeholder="$t('configUser.pleaseEnter')"
                  />
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-col>
        <el-col :sm="8">
          <div class="px-5">
            <el-form
              :ref="el => registerFormRef(formRefName(index, 2), el)"
              :rules="ruleEdit"
              :model="item['revenueAlertConfigDTOS'][2]"
            >
              <h3 class="text-custom mb-2">{{ t('reconciliation.unusual.routeTurnover') }}</h3>
              <div class="item-mid">
                <el-form-item
                  class="custom mb-3"
                  :label="$t('el.datepicker.day')"
                  prop="revenueByDay"
                  style="display: inline-block; width: 100%"
                >
                  <el-input
                    v-model="item['revenueAlertConfigDTOS'][2]['revenueByDay']"
                    type="number"
                    :placeholder="$t('configUser.pleaseEnter')"
                  />
                </el-form-item>
              </div>
              <div class="item-mid">
                <el-form-item
                  class="custom mb-3"
                  :label="$t('el.datepicker.month')"
                  prop="revenueByMonth"
                  style="display: inline-block; width: 100%"
                >
                  <el-input
                    v-model="item['revenueAlertConfigDTOS'][2]['revenueByMonth']"
                    type="number"
                    :placeholder="$t('configUser.pleaseEnter')"
                  />
                </el-form-item>
              </div>
              <div class="item-mid">
                <el-form-item
                  class="custom"
                  :label="$t('el.datepicker.year')"
                  prop="revenueByYear"
                  style="display: inline-block; width: 100%"
                >
                  <el-input
                    v-model="item['revenueAlertConfigDTOS'][2]['revenueByYear']"
                    type="number"
                    :placeholder="$t('configUser.pleaseEnter')"
                  />
                </el-form-item>
              </div>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <div class="flex justify-end px-5 pt-8 pb-4">
        <el-button
          @click="handleSaveParameterConfig(index)"
          :loading="indexProcessing === index"
          class="el-button--main"
          style="min-width: 200px"
          >{{ $t('omsSetting.save') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiGetRevenueAlertConfig, apiUpdateAlertListConfig } from '@/api/toll'
import InputInteger from '@/components/InputInteger/index.vue'
import { usePermissionStore } from '@/store'

const { roleData } = usePermissionStore()
const { t } = useI18n()

const ruleEdit = ref({
  revenueByDay: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  revenueByMonth: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  revenueByYear: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})
const indexProcessing = ref(null)
const listParameterConfig = ref([])
const formParameterConfig = ref(null)

onMounted(async () => {
  await initData()
})

const initData = async () => {
  const rs = await apiGetRevenueAlertConfig()
  if (rs.status === 200) {
    listParameterConfig.value = rs.data
    const length = rs.data.length
    for (let i = 0; i < length; i++) {
      const sortItem = listParameterConfig.value[i].revenueAlertConfigDTOS
      sortItem.sort((a, b) => a.type - b.type)
      listParameterConfig.value[i].revenueAlertConfigDTOS = sortItem
    }
    console.log(listParameterConfig.value)
  }
}

const formRefs = ref({})
const formRefName = (index, formIndex) => `form-${index}-${formIndex}`
const registerFormRef = (name, el) => {
  if (el) {
    formRefs.value[name] = el
  } else {
    delete formRefs.value[name]
  }
}

const handleSaveParameterConfig = async index => {
  try {
    const formRefNames = [`form-${index}-0`, `form-${index}-1`, `form-${index}-2`]
    for (const refName of formRefNames) {
      const formRef = formRefs.value[refName]
      if (formRef) {
        await validFormData(formRef)
      } else {
        console.error(`Ref ${refName} không tồn tại`)
      }
    }
    indexProcessing.value = index
    const dataSend = listParameterConfig.value[index].revenueAlertConfigDTOS
    const params = {
      revenueAlertConfigDTOS: dataSend,
    }
    const rs = await apiUpdateAlertListConfig(params)
    if (rs.status === 200) {
      ElMessage({
        type: 'success',
        message: t('configUser.message.updateSuccess'),
      })
    } else {
      ElMessage({
        type: 'error',
        message: t('omsSetting.failUpdate'),
      })
    }
    indexProcessing.value = null
  } catch (e) {
    indexProcessing.value = null
    console.log(e)
  }
}
const validFormData = async formRef => {
  return new Promise((resolve, reject) => {
    formRef.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}
</script>

<style lang="scss">
.box-parameter-config {
  border-bottom: 1px solid #e4e7ed;

  .box-middle {
    border-left: 2px solid #e4e7ed;
    border-right: 2px solid #e4e7ed;
  }
}

.custom {
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

<style scoped lang="scss">
.header-title-config {
  background-color: #1d8bc7;
}

//.el-form-item--default {
//  --font-size: 14px;
//  --el-form-label-font-size: var(--font-size);
//  margin-bottom: 0;
//}
//
//.el-form-item {
//  display: flex;
//  --font-size: 14px;
//  margin-bottom: 0;
//}
</style>
