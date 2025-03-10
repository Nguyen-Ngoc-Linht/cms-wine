<template>
  <div>
    <div
      class="w-full bg-white flex items-center justify-between padding-right-20 padding-left-10 py-3"
    >
      <h5 class="flex items-center">
        <div
          class="back pointer"
          @click="backKPIDetail()"
        >
          <img
            src="@/assets/imgs/weightStation/back.png"
            alt=""
          />
        </div>
        <div
          v-if="isCreate"
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('monitoring.tollCollectionReport.makeReport') }}
        </div>
        <div
          v-if="isView"
          class="ms-2 text-2xl font-bold"
        >
          {{ infoTrafficRevenue.name }}
        </div>
      </h5>
      <div>
        <el-button
          :loading="process"
          v-if="isCreate && roleData.canCreate"
          @click="handleCreateTrafficRevenue"
          class="el-button--main"
          >{{ $t('omsSetting.save') }}
        </el-button>
      </div>
    </div>
    <!--  Content  -->
    <div class="px-6 mt-4">
      <div
        v-if="roleData.canCreate || roleData.canUpdate"
        class="bg-white px-5 pt-6 pb-4 mb-4"
      >
        <el-form
          ref="formTrafficRevenue"
          :rules="ruleEdit"
          :model="infoTrafficRevenue"
          class="custom-form"
        >
          <h4 class="text-black font-semibold text-2xl">
            {{ $t('monitoring.tollCollectionReport.info') }}
          </h4>
          <el-row
            :gutter="18"
            class="mt-2"
          >
            <el-col
              :md="12"
              :sm="24"
            >
              <el-form-item
                :label="t('monitoring.tollCollectionReport.reportName')"
                prop="name"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoTrafficRevenue.name"
                  maxlength="250"
                  :placeholder="$t('configUser.pleaseEnter')"
                  :disabled="true"
                />
              </el-form-item>
            </el-col>
            <el-col
              :md="12"
              :sm="24"
            >
              <el-form-item
                :label="t('collection.reportType')"
                prop="period"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoTrafficRevenue.period"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  @change="changePeriod"
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isView || isEdit"
                >
                  <el-option
                    v-for="item in listPeriodicReport"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :md="12"
              :sm="24"
            >
              <el-form-item
                :label="t('configUser.gland')"
                prop="routeResponse.id"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoTrafficRevenue.routeResponse.id"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  @change="getStationList"
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isView || isEdit"
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
              :md="12"
              :sm="24"
            >
              <el-form-item
                :label="t('configUser.station')"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoTrafficRevenue.stationResponse.id"
                  clearable
                  filterable
                  collapse-tags
                  @change="setNameReport"
                  style="width: 100%"
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isView || isEdit"
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
                  v-model="infoTrafficRevenue.directionStatus"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isView || isEdit"
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
              :md="12"
              :sm="24"
            >
              <el-form-item
                v-if="infoTrafficRevenue.period === 'DAILY'"
                :label="t('monitoring.tollCollectionReport.timeGetReport')"
                prop="timeGetReportDay"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-date-picker
                  v-model="infoTrafficRevenue.timeGetReportDay"
                  type="daterange"
                  :start-placeholder="t('el.datepicker.startTime')"
                  :range-separator="t('el.datepicker.to')"
                  :end-placeholder="t('el.datepicker.endTime')"
                  clearable
                  value-format="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  :disabled="isView"
                />
              </el-form-item>
              <el-form-item
                v-if="infoTrafficRevenue.period === 'MONTHLY'"
                :label="t('monitoring.tollCollectionReport.timeGetReport')"
                prop="timeGetReport"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-date-picker
                  v-model="infoTrafficRevenue.timeGetReport"
                  type="month"
                  @change="setNameReport"
                  clearable
                  :placeholder="t('configUser.pleaseSelect')"
                  value-format="YYYY-MM"
                  format="MM/YYYY"
                  style="flex: 1"
                  :disabled="isView || isEdit"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="flex justify-end mt-2">
            <el-button
              :loading="processingPreview"
              @click="showPdf"
              class="el-button--main"
              >{{ $t('statisticalReport.viewReport') }}
            </el-button>
          </div>
          <hr class="margin-bottom-12 mt-3 mb-4" />
        </el-form>
        <div
          style="text-align: center"
          class="mt-3"
        >
          <iframe
            v-if="pdfUrl"
            :src="pdfUrl"
            width="100%"
            style="height: calc(100vh - 100px)"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { getListRoute, getListStation } from '@/api/expressway'
import { ElMessage } from 'element-plus'
import { usePermissionStore, useRouteUser } from '@/store'
import { apiGetReportKPIDetail, apiSupervisionTrafficRevenueReport } from '@/api/statistical-report'

const props = defineProps({
  isView: {
    type: Boolean,
    default: false,
  },
  isCreate: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const routeUser = useRouteUser()
const { roleData } = usePermissionStore()

const ruleEdit = ref({
  name: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 250, message: t('omsSetting.ruleMaxLengthText'), trigger: 'blur' },
  ],
  period: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  directionStatus: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  routeResponse: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  timeGetReportDay: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value && value.length === 2) {
          const [start, end] = value.map(date => new Date(date))
          const diffDays = (end - start) / (1000 * 60 * 60 * 24)
          if (diffDays > 34) {
            callback(new Error(t('Khoảng thời gian nhỏ hơn 35 ngày')))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
  timeGetReport: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})
const listRoute = ref([])
const listPeriodicReport = ref([
  {
    id: 1,
    name: t('weightStation.day'),
    value: 'DAILY',
  },
  {
    id: 2,
    name: t('el.datepicker.month'),
    value: 'MONTHLY',
  },
])
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
const processingPreview = ref(false)
const process = ref(false)
const timeGetReport = reactive({
  day: null,
  month: null,
  quarter: null,
  year: null,
  startDate: null,
  endDate: null,
})
const formTrafficRevenue = ref(null)
const infoTrafficRevenue = ref({
  name: '',
  routeResponse: {
    id: '',
  },
  stationResponse: {
    id: null,
  },
  period: '',
})

onMounted(() => {
  setDataDefault()
  initData()
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
const initData = async () => {
  const traffic_revenue_id = route.params.id
  if (traffic_revenue_id) {
    const params = {
      method: 'GET',
      arguments: {
        reportId: parseInt(traffic_revenue_id, 10),
      },
    }
    const rs = await apiGetReportKPIDetail(params)
    if (rs.status === 200) {
      infoTrafficRevenue.value = rs.data
      getStationList(infoTrafficRevenue.value.routeResponse.id)
      base64PdfReport.value = rs.data.base64Response
      await showPdf()
      setTimeInit()
    }
  }
}
const handleCreateTrafficRevenue = async () => {
  try {
    await Promise.all([validFormData()])
    process.value = true
    setTimeGetReport()
    const params = {
      method: 'ADD',
      arguments: {
        name: infoTrafficRevenue.value.name,
        routeId: infoTrafficRevenue.value.routeResponse.id,
        stationId: infoTrafficRevenue.value.stationResponse.id,
        directionStatus: infoTrafficRevenue.value.directionStatus,
        periodType: infoTrafficRevenue.value.period,
        dateFilter: {
          startDate: timeGetReport.startDate,
          endDate: timeGetReport.endDate,
        },
        monthYearFilter: {
          monthRequest: timeGetReport.month,
          yearRequest: timeGetReport.year,
        },
      },
    }
    const rs = await apiGetReportKPIDetail(params)
    if (rs.status === 200) {
      console.log(rs.data)
      ElMessage({
        message: t('configUser.message.addSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      backKPIDetail()
    }
    process.value = false
  } catch (e) {
    console.error(e)
    process.value = false
  }
}
const handlePreviewTrafficRevenue = async () => {
  try {
    await Promise.all([validFormData()])
    processingPreview.value = true
    setTimeGetReport()
    const params = {
      method: 'PREVIEW',
      arguments: {
        name: infoTrafficRevenue.value.name,
        routeId: infoTrafficRevenue.value.routeResponse.id,
        stationId: infoTrafficRevenue.value.stationResponse.id,
        directionStatus: infoTrafficRevenue.value.directionStatus,
        dateFilter: {
          startDate: timeGetReport.startDate,
          endDate: timeGetReport.endDate,
        },
        monthYearFilter: {
          monthRequest: timeGetReport.month,
          yearRequest: timeGetReport.year,
        },
      },
    }
    const rs = await apiGetReportKPIDetail(params)
    if (rs.status === 200) {
      base64PdfReport.value = rs.data.data
    }
    processingPreview.value = false
    return true
  } catch (e) {
    console.error(e)
    processingPreview.value = false
  }
}

const base64PdfReport = ref(null)
const pdfUrl = ref('')
const base64ToBlob = (base64, type = 'application/pdf') => {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type })
}
const showPdf = async () => {
  if (!props.isView) {
    await handlePreviewTrafficRevenue()
      .then(response => {
        console.log(response)
        if (response !== undefined) {
          const blob = base64ToBlob(base64PdfReport.value)
          pdfUrl.value = URL.createObjectURL(blob)
        }
      })
      .catch(e => {
        console.log(e)
      })
  } else {
    const blob = base64ToBlob(base64PdfReport.value)
    pdfUrl.value = URL.createObjectURL(blob)
  }
}

const changePeriod = () => {
  infoTrafficRevenue.value.timeReport = null
  setNameReport()
}
const setNameReport = () => {
  const checkRoute =
    infoTrafficRevenue.value.routeResponse.id !== undefined &&
    infoTrafficRevenue.value.routeResponse.id !== ''
  const checkStation =
    infoTrafficRevenue.value.stationResponse.id !== null &&
    infoTrafficRevenue.value.stationResponse.id !== undefined
  const checkPeriod =
    infoTrafficRevenue.value.period !== undefined && infoTrafficRevenue.value.period !== ''
  let name = 'Báo cáo KPI'
  if (!checkRoute && !checkPeriod) {
    infoTrafficRevenue.value.name = null
    return
  }
  if (checkPeriod) {
    if (infoTrafficRevenue.value.period === 'DAILY') {
      name = `${name} ngày`
    } else if (infoTrafficRevenue.value.period === 'MONTHLY') {
      name = `${name} tháng`
    }
  }
  if (checkRoute) {
    const route = listRoute.value.find(
      item => item.id === infoTrafficRevenue.value.routeResponse.id
    )
    name = `${name} của tuyến ${route.name}`
  }
  if (checkStation) {
    const station = stationLst.value.find(
      item => item.id === infoTrafficRevenue.value.stationResponse.id
    )
    name = `${name} - trạm ${station.name}`
  }
  infoTrafficRevenue.value.name = name
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    formTrafficRevenue.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}
const setTimeGetReport = () => {
  if (infoTrafficRevenue.value.period === 'DAILY') {
    timeGetReport.startDate = infoTrafficRevenue.value.timeGetReportDay[0]
    timeGetReport.endDate = infoTrafficRevenue.value.timeGetReportDay[1]
    timeGetReport.month = null
    timeGetReport.year = null
  } else if (infoTrafficRevenue.value.period === 'MONTHLY') {
    const [year, month] = infoTrafficRevenue.value.timeGetReport.split('-').map(Number)
    timeGetReport.day = null
    timeGetReport.month = month
    timeGetReport.year = year
    timeGetReport.quarter = null
  }
}
const setTimeInit = () => {
  const date = infoTrafficRevenue.value.date
  if (infoTrafficRevenue.value.period === 'DAILY') {
    infoTrafficRevenue.value.timeGetReport = `${date.year}-${date.monthOfYear}-${date.dayOfMonth}`
  } else if (infoTrafficRevenue.value.period === 'MONTHLY') {
    infoTrafficRevenue.value.timeGetReport = `${date.year}-${date.monthOfYear}`
  }
}

const stationLst = ref([])
const getStationList = routeId => {
  if (routeId) {
    const params = {
      routeIds: [routeId],
      stationsIds: routeUser.GET_STATIONS(routeId),
    }
    getListStation(params).then(res => {
      stationLst.value = res?.data?.dataRows || []
    })
    if (!props.isView) {
      setNameReport()
    }
  } else {
    stationLst.value = []
  }
}
const backKPIDetail = () => {
  router.push(`/statistical-report/KPI-detail`)
}
</script>

<style scoped lang="scss"></style>

<style lang="scss">
.custom {
  color: #525b73;

  .el-form-item__label {
    color: #525b73;
    font-weight: 600 !important;
  }
}
</style>
