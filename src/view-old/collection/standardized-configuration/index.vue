<template>
  <div class="w-full px-6 mt-6">
    <div class="bg-white px-5 pt-6 pb-4">
      <h5 class="text-black font-semibold text-lg">{{ $t('monitoring.toll.infoConfig') }}</h5>
      <div class="w-1/3 mt-2">
        <h3 class="font-semibold mb-1">
          <span
            style="color: red"
            class="me-1"
            >*</span
          >Tuyến/Mã BE
        </h3>
        <el-select
          v-model="obSearch.id"
          :placeholder="t('monitoring.requestProcessingETC.typeError')"
          clearable
          filterable
          @change="setDataSearch"
          collapse-tags
          collapse-tags-tooltip
          class="w-full"
        >
          <el-option
            v-for="item in lstRoute"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>

      <div
        v-loading="loadingForm"
        class="w-100 mt-4"
      >
        <el-form
          ref="formVehicle"
          :model="obVehicle"
          :rules="ruleVehicle"
        >
          <el-row
            :gutter="10"
            class="items-center mb-3"
          >
            <el-col :sm="2">
              <span class="text-black font-semibold">{{ t('configUser.vehicleType') }}</span>
            </el-col>
            <el-col :sm="11">
              <span class="text-black font-semibold"
                ><span
                  style="color: red"
                  class="me-2"
                  >*</span
                >{{ t('configUser.vehicleTypeCodeGSTP') }}</span
              >
            </el-col>
            <el-col
              v-if="!obSearch.type"
              :sm="11"
            >
              <span class="text-black font-semibold"
                ><span
                  style="color: red"
                  class="me-2"
                  >*</span
                >{{ t('configUser.vehicleTypeCodeRoute', [`${obSearch.name}`]) }}</span
              >
            </el-col>
            <el-col
              v-if="obSearch.type"
              :sm="11"
            >
              <span class="text-black font-semibold"
                ><span
                  style="color: red"
                  class="me-2"
                  >*</span
                >{{ t('configUser.vehicleTypeCodeRouteBE', [`${obSearch.name}`]) }}</span
              >
            </el-col>
          </el-row>
          <div
            v-for="(vehicle, index) in infoConfig.vehicle_type"
            :key="index"
          >
            <el-row
              :gutter="10"
              class="items-center mb-5"
            >
              <el-col :sm="2">
                <span class="text-[#525B73] font-semibold">
                  {{ vehicle.vehicle_type_gstp ? vehicle.vehicle_type_gstp.name : '' }}
                </span>
              </el-col>
              <el-col :sm="11">
                <el-form-item>
                  <el-input
                    v-model="vehicle.vehicle_type_gstp.id"
                    :placeholder="t('configUser.pleaseEnter')"
                    :disabled="true"
                    type="number"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="11">
                <el-form-item :prop="`config${index}`">
                  <InputInteger
                    v-model="obVehicle[`config${index}`]"
                    :placeholder="t('configUser.pleaseEnter')"
                    :max-length="3"
                    type-input="number"
                  >
                  </InputInteger>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>

        <el-form
          ref="formTicket"
          :model="obTicket"
          :rules="ruleTicket"
          class="mt-4"
        >
          <el-row
            :gutter="10"
            class="items-center mb-3"
          >
            <el-col :sm="2">
              <span class="text-black font-semibold">{{ t('configUser.ticketCodeType') }}</span>
            </el-col>
            <el-col :sm="11">
              <span class="text-black font-semibold"
                ><span
                  style="color: red"
                  class="me-2"
                  >*</span
                >{{ t('configUser.ticketTypeCodeGSTP') }}</span
              >
            </el-col>
            <el-col
              v-if="!obSearch.type"
              :sm="11"
            >
              <span class="text-black font-semibold"
                ><span
                  style="color: red"
                  class="me-2"
                  >*</span
                >{{ t('configUser.ticketTypeCodeRoute', [`${obSearch.name}`]) }}</span
              >
            </el-col>
            <el-col
              v-if="obSearch.type"
              :sm="11"
            >
              <span class="text-black font-semibold"
                ><span
                  style="color: red"
                  class="me-2"
                  >*</span
                >{{ t('configUser.ticketTypeCodeRouteBE', [`${obSearch.name}`]) }}</span
              >
            </el-col>
          </el-row>
          <div
            v-for="(ticket, index) in infoConfig.ticket_type"
            :key="index"
          >
            <el-row
              :gutter="10"
              class="items-center mb-5"
            >
              <el-col :sm="2">
                <span class="text-[#525B73] font-semibold">
                  {{ ticket.ticket_type_gstp ? ticket.ticket_type_gstp.name : '' }}
                </span>
              </el-col>
              <el-col :sm="11">
                <el-form-item>
                  <el-input
                    v-model="ticket.ticket_type_gstp.id"
                    :placeholder="t('configUser.pleaseEnter')"
                    :disabled="true"
                    type="number"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="11">
                <el-form-item :prop="`config${index}`">
                  <InputInteger
                    v-model="obTicket[`config${index}`]"
                    :placeholder="t('configUser.pleaseEnter')"
                    :max-length="3"
                    type-input="number"
                  >
                  </InputInteger>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>

        <div class="flex justify-end items-center">
          <el-button
            style="background-color: #059efb; border: none"
            :loading="processing"
            class="border-1 paddingX-30"
            @click="handleUpdateConfig"
            type="success"
            >{{ $t('omsSetting.save') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import { useRouteUser, useUserStore } from '@/store'
import { getListRoute } from '@/api/expressway'
import { apiGetConfigStandard, apiUpdateConfigStandard } from '@/api/collect'
import InputInteger from '@/components/InputInteger/index.vue'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const userStore = useUserStore()

defineOptions({
  name: 'CollectionStandardizedConfiguration',
})

const routeUser = useRouteUser()
const obSearch = reactive({
  type: false,
  id: '',
  name: '',
  idData: '',
})
const processing = ref(false)
const loadingForm = ref(true)
const lstRoute = ref([])

const infoConfig = ref({})
const formVehicle = ref(null)
const formTicket = ref(null)
const ruleVehicle = ref({})
const obVehicle = ref({})
const ruleTicket = ref({})
const obTicket = ref({})

onMounted(async () => {
  await setDataDefault()
  await getDataFormConfig()
})

const setDataDefault = async () => {
  const params = {
    routeIds: routeUser.routes,
  }
  const rs = await getListRoute(params)
  if (rs.status === 200) {
    const listData = rs.data.dataRows
    lstRoute.value = []
    listData.forEach(item => {
      lstRoute.value.push({
        id: item.id,
        code: null,
        name: item.name,
        type: false,
      })
    })
    lstRoute.value.push({
      id: 999,
      code: 'BE-CODE',
      name: 'Mã BE',
      type: true,
    })
    console.log(lstRoute.value)
    obSearch.id = lstRoute.value[0].id
    obSearch.type = lstRoute.value[0].type
    obSearch.name = lstRoute.value[0].name
    obSearch.code = lstRoute.value[0].code
  }
}
const setDataSearch = id_search => {
  const objectSearch = lstRoute.value.find(item => item.id === id_search)
  obSearch.id = objectSearch.id
  obSearch.type = objectSearch.type
  obSearch.name = objectSearch.name
  obSearch.code = objectSearch.code
  getDataFormConfig()
}
const getDataFormConfig = async type => {
  try {
    loadingForm.value = true
    const params = {
      code: obSearch.code,
      routeId: obSearch.type ? null : obSearch.id,
    }
    const rs = await apiGetConfigStandard(params)
    if (rs.status === 200) {
      infoConfig.value = rs.data.value
      const vehicleType = infoConfig.value.vehicle_type
      vehicleType.forEach((item, index) => {
        if (obSearch.type) {
          obVehicle.value[`config${index}`] = item.vehicle_code_be
        } else {
          obVehicle.value[`config${index}`] = item.vehicle_code_fe
        }
        ruleVehicle.value[`config${index}`] = [
          { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
        ]
      })

      const ticketType = infoConfig.value.ticket_type
      ticketType.forEach((item, index) => {
        if (obSearch.type) {
          obTicket.value[`config${index}`] = item.ticket_code_be
        } else {
          obTicket.value[`config${index}`] = item.ticket_code_fe
        }
        ruleTicket.value[`config${index}`] = [
          { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
        ]
      })
      obSearch.idData = rs.data.id
    }
    loadingForm.value = false
  } catch (e) {
    console.log(e)
    loadingForm.value = false
  }
}

const generateCode = name => {
  const words = name.split(/\s*-\s*/)

  return words
    .map(word =>
      word
        .split(' ')
        .map(part => part[0]?.toUpperCase())
        .join('')
    )
    .join('-')
}

const handleUpdateConfig = async () => {
  try {
    await Promise.all([validFormVehicleData(), validFormTicketData()])
    processing.value = true
    const length1 = infoConfig.value.vehicle_type.length
    for (let i = 0; i < length1; i++) {
      if (obSearch.type) {
        infoConfig.value.vehicle_type[i].vehicle_code_be = obVehicle.value[`config${i}`]
      } else {
        infoConfig.value.vehicle_type[i].vehicle_code_fe = obVehicle.value[`config${i}`]
      }
    }
    const length2 = infoConfig.value.ticket_type.length
    for (let i = 0; i < length2; i++) {
      if (obSearch.type) {
        infoConfig.value.ticket_type[i].ticket_code_be = obTicket.value[`config${i}`]
      } else {
        infoConfig.value.ticket_type[i].ticket_code_fe = obTicket.value[`config${i}`]
      }
    }
    const params = {
      code: obSearch.code,
      value: infoConfig.value,
    }
    const rs = await apiUpdateConfigStandard(obSearch.idData, params)
    if (rs.status === 200) {
      ElMessage.success(t('configUser.message.updateSuccess'))
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const validFormVehicleData = () => {
  return new Promise((resolve, reject) => {
    formVehicle.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form Loại xe')
      }
    })
  })
}
const validFormTicketData = () => {
  return new Promise((resolve, reject) => {
    formTicket.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form Loại mã vé')
      }
    })
  })
}
</script>

<style scoped lang="scss">
:deep(.el-form-item--default) {
  --font-size: 14px;
  --el-form-label-font-size: var(--font-size);
  margin-bottom: 0px;
}
</style>
