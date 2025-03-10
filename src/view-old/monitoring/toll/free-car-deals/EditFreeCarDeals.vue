<template>
  <div class="bg-white">
    <div class="">
      <el-form
        ref="formFreeCar"
        :model="infoTransaction"
        :rules="ruleEdit"
        label-position="top"
        label-width="100%"
        class="custom-form"
      >
        <div class="item-mid">
          <el-form-item
            class="custom mb-5"
            :label="$t('configUser.vehicleType')"
            prop="vehicle_type"
            style="display: inline-block; width: 100%"
          >
            <el-select
              :placeholder="t('configUser.pleaseSelect')"
              v-model="infoTransaction.vehicle_type"
              clearable
              filterable
              collapse-tags
              collapse-tags-tooltip
              class="w-full"
            >
              <el-option
                v-for="item in listVehicleType"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item-mid">
          <el-form-item
            class="custom mb-5"
            :label="$t('monitoring.toll.faceValue')"
            prop="price"
            style="display: inline-block; width: 100%"
          >
            <el-input
              v-model="infoTransaction.price"
              maxlength="250"
              :placeholder="$t('configUser.pleaseEnter')"
            />
          </el-form-item>
        </div>
        <div class="item-mid">
          <el-form-item
            class="custom mb-5"
            prop="station_in.id"
            :label="$t('configUser.entryStation')"
            style="font-weight: 600 !important; width: 100%; display: inline-block"
          >
            <el-select
              :placeholder="t('configUser.pleaseSelect')"
              v-model="infoTransaction['station_in']['id']"
              clearable
              filterable
              collapse-tags
              collapse-tags-tooltip
              class="w-full short"
            >
              <el-option
                v-for="item in listStation"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item-mid">
          <el-form-item
            class="custom mb-5"
            prop="station_out.id"
            :label="$t('configUser.exitStation')"
            style="font-weight: 600 !important; width: 100%; display: inline-block"
          >
            <el-select
              :placeholder="t('configUser.pleaseSelect')"
              v-model="infoTransaction['station_out']['id']"
              clearable
              filterable
              collapse-tags
              collapse-tags-tooltip
              class="w-full short"
            >
              <el-option
                v-for="item in listStation"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item-mid">
          <el-form-item
            class="custom mb-5"
            :label="$t('monitoring.toll.transactionType')"
            style="font-weight: 600 !important; width: 100%; display: inline-block"
          >
            <el-select
              :placeholder="t('configUser.pleaseSelect')"
              v-model="infoTransaction.trans_type"
              clearable
              filterable
              collapse-tags
              collapse-tags-tooltip
              class="w-full short"
            >
              <el-option
                v-for="item in listTypeTransaction"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item-mid">
          <el-form-item
            class="custom mb-5"
            :label="$t('monitoring.toll.typeTicket')"
            style="font-weight: 600 !important; width: 100%; display: inline-block"
          >
            <el-select
              :placeholder="t('configUser.pleaseSelect')"
              v-model="infoTransaction.ticket_type"
              clearable
              filterable
              collapse-tags
              collapse-tags-tooltip
              class="w-full short"
            >
              <el-option
                v-for="item in listTypeTicket"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <hr class="margin-bottom-24 mt-3" />
      <div class="action">
        <div class="flex justify-end">
          <el-button
            type="default"
            @click="closeDialog"
            class="bg-outline-secondary"
            >{{ $t('configUser.cancel') }}</el-button
          >
          <el-button
            v-if="roleData.canUpdate"
            :loading="processing"
            @click="handleUpdateFreeCar"
            type="primary"
            class="bg--dark-purple"
            style="border: transparent"
            >{{ $t('omsSetting.update') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage } from 'element-plus'
import { getListStation } from '@/api/expressway'
import { usePermissionStore } from '@/store'
import { apiGetTypeVehicleAll, apiUpdateTransaction } from '@/api/toll'
const { t } = useI18n()

const { roleData } = usePermissionStore()
const props = defineProps({
  freeCarInfo: {
    type: Object,
    required: true,
  },
  isVehicle45: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const ruleEdit = ref({
  vehicle_type: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  price: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  station_in: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  station_out: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
})

const listTypeTransaction = ref([
  {
    id: 'ETC',
    name: 'ETC',
    value: 1,
  },
  {
    id: 'MTC',
    name: 'MTC',
    value: 2,
  },
  {
    id: 'OTC',
    name: 'OTC',
    value: 3,
  },
])
const listTypeTicket = ref([
  {
    id: 'ticket',
    name: 'Vé lượt',
    value: 1,
  },
  {
    id: 'ticketMonth',
    name: 'Vé tháng',
    value: 0,
  },
  {
    id: 'ticketQuarter',
    name: 'Vé quý',
    value: 2,
  },
  {
    id: 'freeTicket',
    name: 'Miễn phí',
    value: 4,
  },
])
const listVehicleType = ref([])
const listStation = ref([])
const processing = ref(false)

const infoTransaction = ref({
  station_in: {
    id: '',
  },
  station_out: {
    id: '',
  },
})
const formFreeCar = ref(null)
const emit = defineEmits(['closeUpdate'])

const closeDialog = () => {
  console.log('close')
  emit('closeUpdate')
}

onMounted(async () => {
  await setDataDefault()
  infoTransaction.value = props.freeCarInfo
  console.log(infoTransaction.value)
  if (!infoTransaction.value.station_in) {
    infoTransaction.value.station_in = {
      id: '',
    }
  }
  if (!infoTransaction.value.station_out) {
    infoTransaction.value.station_out = {
      id: '',
    }
  }
  if (infoTransaction.value.station_out.id !== '') {
    const is_route = infoTransaction.value.station_out.route
      ? infoTransaction.value.station_out.route.id
      : ''
    const params = {
      keyword: '',
      routeIds: [is_route],
      stationIds: [],
      unitIds: [],
    }
    const rs = await getListStation(params)
    if (rs.status === 200) {
      listStation.value = rs.data.dataRows
    }
  }
  if (infoTransaction.value.station_in.id !== '') {
    if (listStation.value.length > 0) return
    const is_route = infoTransaction.value.station_in.route
      ? infoTransaction.value.station_in.route.id
      : ''
    const params = {
      keyword: '',
      routeIds: [is_route],
      stationIds: [],
      unitIds: [],
    }
    const rs = await getListStation(params)
    if (rs.status === 200) {
      listStation.value = rs.data.dataRows
    }
  }
})
const setDataDefault = async () => {
  const list = await apiGetTypeVehicleAll()
  if (list.status === 200) {
    if (props.isVehicle45) {
      listVehicleType.value = list.data.filter(item => item.id > 3).sort((a, b) => a.id - b.id)
    } else {
      listVehicleType.value = list.data.sort((a, b) => a.id - b.id)
    }
  }
}

const handleUpdateFreeCar = async () => {
  if (formFreeCar.value) {
    formFreeCar.value.validate(async valid => {
      if (valid) {
        const vehicle_type = listVehicleType.value.find(
          item => item.name === infoTransaction.value.vehicle_type
        )
        const params = {
          id: infoTransaction.value.id,
          vehicle_type: vehicle_type.id,
          price: infoTransaction.value.price,
          station_in: infoTransaction.value.station_in.id,
          station_out: infoTransaction.value.station_out.id,
          ticket_type: infoTransaction.value.ticket_type,
          trans_type: infoTransaction.value.trans_type,
        }
        const rs = await apiUpdateTransaction(params)
        if (rs.status === 200) {
          ElMessage({
            message: t('configUser.message.updateSuccess'),
            type: 'success',
            duration: 3 * 1000,
          })
          emit('closeUpdate')
        } else {
          ElMessage({
            message: t('el.image.error'),
            type: 'error',
            duration: 3 * 1000,
          })
        }
        processing.value = false
      } else {
        processing.value = false
        console.log('Lỗi validate form')
        return false
      }
    })
  } else {
    console.log('Form chưa được gán hoặc không tồn tại')
  }
}
</script>

<style scoped lang="scss">
.el-form-item__label {
  color: #525b73;
  font-weight: 600 !important;
}
</style>

<style lang="scss">
.custom {
  .el-form-item__label {
    color: #525b73;
    font-weight: 600 !important;
  }
}

.custom-form {
  .el-form-item {
    //display: flex;
    --font-size: 14px;
    margin-bottom: 8px;
    margin-top: 8px;
  }
  .el-form-item--default {
    --font-size: 14px;
    --el-form-label-font-size: var(--font-size);
    margin-bottom: 8px;
    margin-top: 8px;
  }
}
</style>
