<template>
  <div class="bg-white">
    <el-form
      ref="formReport"
      :model="infoReport"
      :rules="ruleEdit"
      label-position="top"
      label-width="100%"
      class="custom-form"
    >
      <el-row :gutter="10">
        <el-col
          :xl="8"
          :md="12"
          :sm="24"
        >
          <el-form-item
            :label="t('configUser.gland')"
            prop="route.id"
            class="custom mb-2"
            style="display: inline-block; width: 100%"
          >
            <el-select
              v-model="infoReport.route.id"
              clearable
              filterable
              collapse-tags
              style="width: 100%"
              @change="getStationList"
              :placeholder="$t('configUser.pleaseSelect')"
            >
              <el-option
                v-for="item in listRoute"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :xl="8"
          :md="12"
          :sm="24"
        >
          <el-form-item
            :label="t('configUser.station')"
            class="custom mb-2"
            prop="station.id"
            style="display: inline-block; width: 100%"
          >
            <el-select
              v-model="infoReport.station.id"
              clearable
              filterable
              collapse-tags
              style="width: 100%"
              :placeholder="$t('configUser.pleaseSelect')"
            >
              <el-option
                v-for="item in stationLst"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :xl="8"
          :md="12"
          :sm="24"
        >
          <el-form-item
            :label="t('configUser.typeLane')"
            prop="directionStatus"
            class="custom mb-2"
            style="display: inline-block; width: 100%"
          >
            <el-select
              v-model="infoReport.directionStatus"
              clearable
              filterable
              collapse-tags
              style="width: 100%"
              :placeholder="$t('configUser.pleaseSelect')"
            >
              <el-option
                v-for="item in listLaneType"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :xl="12"
          :md="24"
        >
          <el-form-item
            :label="t('monitoring.tollCollectionReport.timeGetReport')"
            prop="date"
            class="custom mb-2"
            style="display: inline-block; width: 100%"
          >
            <el-date-picker
              v-model="infoReport.date"
              type="date"
              clearable
              :placeholder="t('configUser.pleaseSelect')"
              value-format="YYYY-MM-DD"
              format="DD/MM/YYYY"
              style="flex: 1"
            />
          </el-form-item>
        </el-col>
        <el-col
          :xl="12"
          :md="24"
        >
          <el-form-item
            :label="t('statisticalReport.nvBarrierError')"
            prop="etcBarrierErrors"
            class="custom mb-2"
            style="display: inline-block; width: 100%"
          >
            <InputInteger
              v-model="infoReport.etcBarrierErrors"
              :placeholder="t('configUser.pleaseEnter')"
            ></InputInteger>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <hr class="margin-bottom-24 mt-3" />
    <div class="action">
      <div class="flex justify-end">
        <el-button
          type="default"
          @click="closeDialog"
          class="bg-outline-secondary"
          >{{ $t('configUser.cancel') }}
        </el-button>
        <el-button
          v-if="roleData.canUpdate"
          :loading="processing"
          @click="handleUpdateData"
          type="primary"
          class="bg--dark-purple"
          style="border: transparent"
          >{{ $t('omsSetting.update') }}
        </el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage } from 'element-plus'
import { getListRoute, getListStation } from '@/api/expressway'
import InputInteger from '@/components/InputInteger/index.vue'
import { usePermissionStore, useRouteUser } from '@/store'
import { apiGetReportKPIDetail } from '@/api/statistical-report'

const { t } = useI18n()

const routeUser = useRouteUser()
const { roleData } = usePermissionStore()
const ruleEdit = ref({
  route: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  station: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  directionStatus: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  etcBarrierErrors: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  date: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})
const formReport = ref(null)
const infoReport = ref({
  route: {
    id: '',
  },
  station: {
    id: '',
  },
})

const processing = ref(false)
const listRoute = ref([])
const stationLst = ref([])
const listLaneType = ref([
  {
    id: 1,
    label: t('reconciliation.laneIn'),
    value: 1,
  },
  {
    id: 2,
    label: t('reconciliation.laneOut'),
    value: 0,
  },
])
const emit = defineEmits(['closeUpdate'])

const closeDialog = () => {
  emit('closeUpdate')
}

onMounted(async () => {
  await setDataDefault()
})

const setDataDefault = async () => {
  const params = {
    routeIds: routeUser.routes,
  }
  const rs = await getListRoute(params)
  if (rs.status === 200) {
    listRoute.value = rs.data.dataRows
  }
}
const getStationList = routeId => {
  if (routeId) {
    const params = {
      routeIds: [routeId],
      stationsIds: routeUser.GET_STATIONS(routeId),
    }
    getListStation(params).then(res => {
      stationLst.value = res?.data?.dataRows || []
    })
  } else {
    stationLst.value = []
  }
}
const handleUpdateData = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const params = {
      method: 'UPDATE',
      arguments: {
        stationId: infoReport.value.station.id,
        directionStatus: infoReport.value.directionStatus,
        data: [
          {
            date: infoReport.value.date,
            etcBarrierErrors: infoReport.value.etcBarrierErrors,
          },
        ],
      },
    }
    const rs = await apiGetReportKPIDetail(params)
    if (rs.status === 200) {
      console.log(rs.data)
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      closeDialog()
    }
  } catch (e) {
    console.log(e)
    processing.value = false
  }
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    formReport.value.validate(valid => {
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
