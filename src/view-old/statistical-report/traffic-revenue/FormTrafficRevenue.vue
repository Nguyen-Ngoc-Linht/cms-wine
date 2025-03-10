<template>
  <div>
    <div
      class="w-full bg-white flex items-center justify-between padding-right-20 padding-left-10 py-3"
    >
      <h5 class="flex items-center">
        <div
          class="back pointer"
          @click="backTrafficRevenue()"
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
          v-if="isEdit"
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('configUser.editUser') }}
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
        <el-button
          :loading="process"
          v-if="isEdit && roleData.canUpdate"
          @click="handleUpdateTrafficRevenue()"
          class="el-button--main"
          >{{ $t('omsSetting.update') }}
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
                  :disabled="true"
                />
              </el-form-item>
            </el-col>
            <el-col
              :md="12"
              :sm="24"
            >
              <el-form-item
                :label="t('monitoring.tollCollectionReport.reportPeriod')"
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
                  @change="
                    value => {
                      infoTrafficRevenue.timeGetReport = null
                    }
                  "
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
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoTrafficRevenue.route.id"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  @change="setNameReport"
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
              v-if="infoTrafficRevenue.period === 'QUARTERLY'"
              :md="12"
              :sm="24"
            >
              <el-form-item
                :label="t('el.datepicker.quarter')"
                prop="quarter"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="timeGetReport.quarter"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  @change="setNameReport"
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isView || isEdit"
                >
                  <el-option
                    v-for="item in listQuarter"
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
                v-if="infoTrafficRevenue.period === 'DAILY'"
                :label="t('monitoring.tollCollectionReport.timeGetReport')"
                prop="timeGetReport"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-date-picker
                  v-model="infoTrafficRevenue.timeGetReport"
                  type="date"
                  clearable
                  @change="setNameReport"
                  :placeholder="t('configUser.pleaseSelect')"
                  value-format="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  style="flex: 1"
                  :disabled="isView || isEdit"
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
              <el-form-item
                v-if="
                  infoTrafficRevenue.period === 'YEARLY' ||
                  infoTrafficRevenue.period === 'QUARTERLY'
                "
                :label="t('monitoring.tollCollectionReport.timeGetReport')"
                prop="timeGetReport"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-date-picker
                  v-model="infoTrafficRevenue.timeGetReport"
                  type="year"
                  clearable
                  @change="setNameReport"
                  :placeholder="t('configUser.pleaseSelect')"
                  value-format="YYYY"
                  format="YYYY"
                  style="flex: 1"
                  :disabled="isView || isEdit"
                />
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item
                :label="t('reconciliation.contentDifferent')"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoTrafficRevenue.otherContent"
                  type="textarea"
                  :autosize="{ minRows: 6, maxRows: 10 }"
                  maxlength="3000"
                  show-word-limit
                  :placeholder="$t('configUser.pleaseEnter')"
                  :disabled="isView"
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
import { getListRoute } from '@/api/expressway'
import { ElMessage } from 'element-plus'
import { usePermissionStore, useRouteUser } from '@/store'
import { apiSupervisionTrafficRevenueReport } from '@/api/statistical-report'

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
const listQuarter = ref([
  {
    id: 1,
    name: t('el.datepicker.quarter', ['1']),
  },
  {
    id: 2,
    name: t('el.datepicker.quarter', ['2']),
  },
  {
    id: 3,
    name: t('el.datepicker.quarter', ['3']),
  },
  {
    id: 4,
    name: t('el.datepicker.quarter', ['4']),
  },
])

const ruleEdit = ref({
  name: [
    { required: true, message: '' },
    // {max: 250, message: t('omsSetting.ruleMaxLengthText')}
  ],
  period: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  route: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
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
  {
    id: 3,
    name: t('el.datepicker.quarter'),
    value: 'QUARTERLY',
  },
  {
    id: 4,
    name: t('el.datepicker.year'),
    value: 'YEARLY',
  },
])
const processingPreview = ref(false)
const process = ref(false)
const timeGetReport = reactive({
  day: null,
  month: null,
  quarter: null,
  year: null,
})
const formTrafficRevenue = ref(null)
const infoTrafficRevenue = ref({
  name: '',
  route: {
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
    const rs = await apiSupervisionTrafficRevenueReport(params)
    if (rs.status === 200) {
      infoTrafficRevenue.value = rs.data
      if (infoTrafficRevenue.value.route === null) {
        infoTrafficRevenue.value.route = {
          id: null,
        }
      }
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
        routeId: infoTrafficRevenue.value.route.id,
        period: infoTrafficRevenue.value.period,
        date: {
          year: timeGetReport.year,
          month: timeGetReport.month,
          quarter: timeGetReport.quarter,
          day: timeGetReport.day,
        },
        otherContent: infoTrafficRevenue.value.otherContent,
      },
    }
    const rs = await apiSupervisionTrafficRevenueReport(params)
    if (rs.status === 200) {
      console.log(rs.data)
      ElMessage({
        message: t('configUser.message.addSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      backTrafficRevenue()
    }
    process.value = false
  } catch (e) {
    console.error(e)
    process.value = false
  }
}
const handleUpdateTrafficRevenue = async () => {
  try {
    await Promise.all([validFormData()])
    process.value = true
    const params = {
      method: 'UPDATE',
      arguments: {
        reportId: infoTrafficRevenue.value.id,
        name: infoTrafficRevenue.value.name,
        otherContent: infoTrafficRevenue.value.otherContent,
      },
    }
    const rs = await apiSupervisionTrafficRevenueReport(params)
    if (rs.status === 200) {
      console.log(rs.data)
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      backTrafficRevenue()
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
        routeId: infoTrafficRevenue.value.route.id,
        period: infoTrafficRevenue.value.period,
        date: {
          year: timeGetReport.year,
          month: timeGetReport.month,
          quarter: timeGetReport.quarter,
          day: timeGetReport.day,
        },
        otherContent: infoTrafficRevenue.value.otherContent,
      },
    }
    const rs = await apiSupervisionTrafficRevenueReport(params)
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
}

const setNameReport = () => {
  const checkRoute =
    infoTrafficRevenue.value.route.id !== undefined && infoTrafficRevenue.value.route.id !== null
  const checkPeriod =
    infoTrafficRevenue.value.period !== undefined && infoTrafficRevenue.value.period !== ''
  const checkTimeReport =
    infoTrafficRevenue.value.timeGetReport !== undefined &&
    infoTrafficRevenue.value.timeGetReport !== null
  let name = 'Báo cáo tổng hợp lưu lượng, doanh thu'
  if (!checkRoute && !checkPeriod && !checkTimeReport) {
    infoTrafficRevenue.value.name = null
    return
  }
  if (checkPeriod && checkTimeReport) {
    setTimeGetReport()
    if (infoTrafficRevenue.value.period === 'DAILY') {
      name = `${name} theo ngày ${timeGetReport.day}/${timeGetReport.month}/${timeGetReport.year}`
    } else if (infoTrafficRevenue.value.period === 'MONTHLY') {
      name = `${name} theo tháng ${timeGetReport.month}/${timeGetReport.year}`
    } else if (infoTrafficRevenue.value.period === 'YEARLY') {
      name = `${name} theo năm ${timeGetReport.year}`
    } else if (infoTrafficRevenue.value.period === 'QUARTERLY') {
      name = `${name} theo qúy ${timeGetReport.quarter} năm ${timeGetReport.year}`
    }
  }
  if (checkRoute) {
    const route = listRoute.value.find(item => item.id === infoTrafficRevenue.value.route.id)
    name = `${name} của tuyến ${route.name}`
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
    const [year, month, day] = infoTrafficRevenue.value.timeGetReport.split('-').map(Number)
    timeGetReport.day = day
    timeGetReport.month = month
    timeGetReport.year = year
    timeGetReport.quarter = null
  } else if (infoTrafficRevenue.value.period === 'MONTHLY') {
    const [year, month] = infoTrafficRevenue.value.timeGetReport.split('-').map(Number)
    timeGetReport.day = null
    timeGetReport.month = month
    timeGetReport.year = year
    timeGetReport.quarter = null
  } else if (infoTrafficRevenue.value.period === 'QUARTERLY') {
    const [year] = infoTrafficRevenue.value.timeGetReport.split('-').map(Number)
    timeGetReport.day = null
    timeGetReport.month = null
    timeGetReport.year = year
  } else if (infoTrafficRevenue.value.period === 'YEARLY') {
    const [year] = infoTrafficRevenue.value.timeGetReport.split('-').map(Number)
    timeGetReport.day = null
    timeGetReport.month = null
    timeGetReport.year = year
    timeGetReport.quarter = null
  }
}
const setTimeInit = () => {
  const date = infoTrafficRevenue.value.date
  if (infoTrafficRevenue.value.period === 'DAILY') {
    infoTrafficRevenue.value.timeGetReport = `${date.year}-${String(date.monthOfYear).padStart(
      2,
      '0'
    )}-${String(date.dayOfMonth).padStart(2, '0')}`
  } else if (infoTrafficRevenue.value.period === 'MONTHLY') {
    infoTrafficRevenue.value.timeGetReport = `${date.year}-${String(date.monthOfYear).padStart(
      2,
      '0'
    )}`
  } else if (infoTrafficRevenue.value.period === 'YEARLY') {
    infoTrafficRevenue.value.timeGetReport = `${date.year}`
  } else if (infoTrafficRevenue.value.period === 'QUARTERLY') {
    infoTrafficRevenue.value.timeGetReport = `${date.year}`
    timeGetReport.quarter = parseInt(date.quarter)
  }
}
const backTrafficRevenue = () => {
  router.push(`/statistical-report/traffic-revenue`)
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
