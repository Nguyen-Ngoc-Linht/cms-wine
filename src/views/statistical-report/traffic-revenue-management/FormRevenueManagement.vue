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
          {{ infoTrafficRevenueManagement.name }}
        </div>
      </h5>
      <div>
        <el-button
          :loading="process"
          v-if="isCreate && roleData.canCreate"
          @click="handleCreateReport"
          class="el-button--main px-3"
          >{{ $t('omsSetting.save') }}
        </el-button>
        <el-button
          :loading="process"
          v-if="isEdit && roleData.canUpdate"
          @click="handleUpdateReport()"
          class="el-button--main"
          >{{ $t('omsSetting.update') }}
        </el-button>
      </div>
    </div>
    <div class="px-6 mt-4">
      <div
        v-if="roleData.canUpdate || roleData.canCreate"
        class="bg-white px-5 pt-6 pb-4 mb-4"
      >
        <el-form
          ref="formTrafficRevenueManagement"
          :rules="ruleEdit"
          :model="infoTrafficRevenueManagement"
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
                  v-model="infoTrafficRevenueManagement.name"
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
                  v-model="infoTrafficRevenueManagement.period"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  @change="
                    value => {
                      infoTrafficRevenueManagement.timeGetReport = null
                    }
                  "
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isEdit || isView"
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
                prop="route.id"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoTrafficRevenueManagement.route.id"
                  clearable
                  @change="setNameReport"
                  filterable
                  collapse-tags
                  style="width: 100%"
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
              v-if="infoTrafficRevenueManagement.period === 'QUARTERLY'"
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
                  @change="setNameReport"
                  filterable
                  collapse-tags
                  style="width: 100%"
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
                v-if="infoTrafficRevenueManagement.period === 'DAILY'"
                :label="t('monitoring.tollCollectionReport.forecastTime')"
                prop="timeGetReport"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-date-picker
                  v-model="infoTrafficRevenueManagement.timeGetReport"
                  type="date"
                  clearable
                  @change="setNameReport"
                  :placeholder="t('configUser.pleaseSelect')"
                  value-format="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  style="flex: 1"
                  :disabled="isEdit || isView"
                />
              </el-form-item>
              <el-form-item
                v-if="infoTrafficRevenueManagement.period === 'MONTHLY'"
                :label="t('monitoring.tollCollectionReport.forecastTime')"
                prop="timeGetReport"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-date-picker
                  v-model="infoTrafficRevenueManagement.timeGetReport"
                  type="month"
                  clearable
                  @change="setNameReport"
                  :placeholder="t('configUser.pleaseSelect')"
                  value-format="YYYY-MM"
                  format="MM/YYYY"
                  style="flex: 1"
                  :disabled="isEdit || isView"
                />
              </el-form-item>
              <el-form-item
                v-if="
                  infoTrafficRevenueManagement.period === 'YEARLY' ||
                  infoTrafficRevenueManagement.period === 'QUARTERLY'
                "
                :label="t('monitoring.tollCollectionReport.forecastTime')"
                prop="timeGetReport"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-date-picker
                  v-model="infoTrafficRevenueManagement.timeGetReport"
                  type="year"
                  clearable
                  @change="setNameReport"
                  :placeholder="t('configUser.pleaseSelect')"
                  value-format="YYYY"
                  format="YYYY"
                  style="flex: 1"
                  :disabled="isEdit || isView"
                />
              </el-form-item>
            </el-col>
            <el-col :md="24">
              <el-form-item
                :label="t('monitoring.tollCollectionReport.planContent')"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoTrafficRevenueManagement.reportContent"
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
              @click="showPreview"
              class="el-button--main"
              >{{ $t('statisticalReport.viewReport') }}
            </el-button>
          </div>
        </el-form>

        <div
          v-if="showReport"
          class="my-4"
        >
          <el-table
            v-loading="listLoading"
            :data="listForecastReport"
            border
            show-summary
            :summary-method="calculateSummaries"
          >
            <el-table-column
              :label="t('statisticalReport.reportTrafficRevenuePlan', [`${titleReport.nameRoute}`])"
              header-align="center"
              label-class-name="title-top"
            >
              <el-table-column
                :label="t('statisticalReport.forecast', [`${titleReport.timeReport}`])"
                header-align="center"
              >
                <el-table-column
                  :label="t('configUser.nameStation')"
                  header-align="center"
                >
                  <template #default="{ row }">
                    <span>{{ row['station']['name'] }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="t('statisticalReport.recordNbVehiclePass')" header-align="center">
                  <el-table-column prop="inTraffic" :label="t('statisticalReport.inputTraffic')" header-align="center">
                    <template #default="{ row }">
                      <p class="w-full text-center">{{ formatNumber(row.inTraffic, '.') }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="outTraffic" :label="t('statisticalReport.outputTraffic')" header-align="center">
                    <template #default="{ row }">
                      <p class="text-center w-full">{{ formatNumber(row.outTraffic, '.') }}</p>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column prop="revenue" :label="t('statisticalReport.revenue')" header-align="center">
                  <template #default="{ row }">
                    <p class="w-full text-center">{{ formatNumber(row.revenue, '.') }}</p>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from '@/locale'
import {getListRoute} from '@/api/expressway'
import {ElMessage} from 'element-plus'
import {usePermissionStore, useRouteUser} from '@/store'
import {apiSupervisionManageReport, apiSupervisionTrafficRevenueReport} from '@/api/statistical-report'
import {formatNumber, downloadFileBase64} from '@/utils'

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
  reportContent: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 5000, message: t('omsSetting.ruleMaxLengthText'), trigger: 'blur' },
  ],
})
const listRoute = ref([])
const listPeriodicReport = ref([
  {
    id: 1,
    name: t('el.datepicker.day'),
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
const titleReport = reactive({
  nameRoute: '',
  timeReport: '',
})

const formTrafficRevenueManagement = ref(false)
const infoTrafficRevenueManagement = ref({
  name: '',
  route: {
    id: '',
  },
  period: '',
})

const listForecastReport = ref([])
const listLoading = ref(false)
const showReport = ref(false)

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
    const rs = await apiSupervisionManageReport(params)
    if (rs.status === 200) {
      infoTrafficRevenueManagement.value = rs.data
      setTimeInit()
    }
  }
}
const handleCreateReport = async () => {
  try {
    await Promise.all([validFormData()])
    process.value = true
    setTimeGetReport()
    const params = {
      method: 'ADD',
      arguments: {
        name: infoTrafficRevenueManagement.value.name,
        routeId: infoTrafficRevenueManagement.value.route.id,
        period: infoTrafficRevenueManagement.value.period,
        reportContent: infoTrafficRevenueManagement.value.reportContent,
        date: {
          year: timeGetReport.year,
          monthOfYear: timeGetReport.month,
          dayOfMonth: timeGetReport.day,
          quarter: timeGetReport.quarter,
        },
      },
    }
    const rs = await apiSupervisionManageReport(params)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.addSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      backTrafficRevenue()
    }
    process.value = false
  } catch (e) {
    process.value = false
    console.log(e)
  }
}
const handleUpdateReport = async () => {
  try {
    await Promise.all([validFormData()])
    process.value = true
    const params = {
      method: 'UPDATE',
      arguments: {
        reportId: infoTrafficRevenueManagement.value.id,
        reportContent: infoTrafficRevenueManagement.value.reportContent,
      },
    }
    const rs = await apiSupervisionManageReport(params)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      backTrafficRevenue()
    }
    process.value = false
  } catch (e) {
    process.value = false
    console.log(e)
  }
}
const handlePreviewReport = async () => {
  try {
    await Promise.all([validFormData()])
    processingPreview.value = true
    setTimeGetReport()
    const params = {
      method: 'PREVIEW',
      arguments: {
        name: infoTrafficRevenueManagement.value.name,
        routeId: infoTrafficRevenueManagement.value.route.id,
        period: infoTrafficRevenueManagement.value.period,
        reportContent: infoTrafficRevenueManagement.value.reportContent,
        date: {
          year: timeGetReport.year,
          monthOfYear: timeGetReport.month,
          dayOfMonth: timeGetReport.day,
          quarter: timeGetReport.quarter,
        },
      },
    }
    const rs = await apiSupervisionManageReport(params)
    if (rs.status === 200) {
      listForecastReport.value = rs.data
      showReport.value = true
      const route = listRoute.value.find(
        item => item.id === infoTrafficRevenueManagement.value.route.id
      )
      if (route) {
        titleReport.nameRoute = route.name
      }
      if (infoTrafficRevenueManagement.value.period === 'DAILY') {
        titleReport.timeReport = `ngày ${timeGetReport.day}/${timeGetReport.month}/${timeGetReport.year}`
      } else if (infoTrafficRevenueManagement.value.period === 'MONTHLY') {
        titleReport.timeReport = `tháng ${timeGetReport.month}/${timeGetReport.year}`
      } else if (infoTrafficRevenueManagement.value.period === 'YEARLY') {
        titleReport.timeReport = `năm ${timeGetReport.year}`
      } else if (infoTrafficRevenueManagement.value.period === 'QUARTERLY') {
        titleReport.timeReport = `quý ${timeGetReport.quarter}/${timeGetReport.year}`
      }
    }
    processingPreview.value = false
  } catch (e) {
    processingPreview.value = false
    console.log(e)
  }
}

const showPreview = () => {
  handlePreviewReport()
}
const setNameReport = () => {
  const checkRoute =
    infoTrafficRevenueManagement.value.route.id !== undefined &&
    infoTrafficRevenueManagement.value.route.id !== ''
  const checkPeriod =
    infoTrafficRevenueManagement.value.period !== undefined &&
    infoTrafficRevenueManagement.value.period !== ''
  const checkTimeReport =
    infoTrafficRevenueManagement.value.timeGetReport !== undefined &&
    infoTrafficRevenueManagement.value.timeGetReport !== null
  let name = 'Báo cáo quản lý doanh thu, lưu lượng'
  if (!checkRoute && !checkPeriod && !checkTimeReport) {
    infoTrafficRevenueManagement.value.name = null
    return
  }
  if (checkPeriod && checkTimeReport) {
    setTimeGetReport()
    console.log(infoTrafficRevenueManagement.value.period)
    if (infoTrafficRevenueManagement.value.period === 'DAILY') {
      name = `${name} theo ngày ${timeGetReport.day}/${timeGetReport.month}/${timeGetReport.year}`
    } else if (infoTrafficRevenueManagement.value.period === 'MONTHLY') {
      name = `${name} theo tháng ${timeGetReport.month}/${timeGetReport.year}`
    } else if (infoTrafficRevenueManagement.value.period === 'YEARLY') {
      name = `${name} theo năm ${timeGetReport.year}`
    } else if (infoTrafficRevenueManagement.value.period === 'QUARTERLY') {
      name = `${name} theo qúy ${timeGetReport.quarter} năm ${timeGetReport.year}`
    }
  }
  if (checkRoute) {
    const route = listRoute.value.find(
      item => item.id === infoTrafficRevenueManagement.value.route.id
    )
    name = `${name} của tuyến ${route.name}`
  }
  infoTrafficRevenueManagement.value.name = name
}

const validFormData = async () => {
  return new Promise((resolve, reject) => {
    formTrafficRevenueManagement.value.validate(valid => {
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
  if (infoTrafficRevenueManagement.value.period === 'DAILY') {
    const [year, month, day] = infoTrafficRevenueManagement.value.timeGetReport
      .split('-')
      .map(Number)
    timeGetReport.day = day
    timeGetReport.month = month
    timeGetReport.year = year
    timeGetReport.quarter = null
  } else if (infoTrafficRevenueManagement.value.period === 'MONTHLY') {
    const [year, month] = infoTrafficRevenueManagement.value.timeGetReport.split('-').map(Number)
    timeGetReport.day = null
    timeGetReport.month = month
    timeGetReport.year = year
    timeGetReport.quarter = null
  } else if (infoTrafficRevenueManagement.value.period === 'QUARTERLY') {
    const [year] = infoTrafficRevenueManagement.value.timeGetReport.split('-').map(Number)
    timeGetReport.day = null
    timeGetReport.month = null
    timeGetReport.year = year
  } else if (infoTrafficRevenueManagement.value.period === 'YEARLY') {
    const [year] = infoTrafficRevenueManagement.value.timeGetReport.split('-').map(Number)
    timeGetReport.day = null
    timeGetReport.month = null
    timeGetReport.year = year
    timeGetReport.quarter = null
  }
}
const setTimeInit = () => {
  const date = infoTrafficRevenueManagement.value.date
  if (infoTrafficRevenueManagement.value.period === 'DAILY') {
    infoTrafficRevenueManagement.value.timeGetReport = `${date.year}-${String(
      date.monthOfYear
    ).padStart(2, '0')}-${String(date.dayOfMonth).padStart(2, '0')}`
  } else if (infoTrafficRevenueManagement.value.period === 'MONTHLY') {
    infoTrafficRevenueManagement.value.timeGetReport = `${date.year}-${String(
      date.monthOfYear
    ).padStart(2, '0')}`
  } else if (infoTrafficRevenueManagement.value.period === 'YEARLY') {
    infoTrafficRevenueManagement.value.timeGetReport = `${date.year}`
  } else if (infoTrafficRevenueManagement.value.period === 'QUARTERLY') {
    infoTrafficRevenueManagement.value.timeGetReport = `${date.year}`
    timeGetReport.quarter = parseInt(date.quarter)
  }
}
const backTrafficRevenue = () => {
  router.push(`/statistical-report/traffic-revenue-management`)
}
const calculateSummaries = ({ columns, data }) => {
  const summaries = []
  columns.forEach((column, index) => {
    if (index === 0) {
      summaries[index] = t('report.total')
      return
    }

    const values = data.map((item) => Number(item[column.property]) || 0)

    if (values.length) {
      const total = values.reduce((prev, curr) => prev + curr, 0)
      summaries[index] = formatNumber(total, '.')
    } else {
      summaries[index] = ''
    }
  })

  return summaries
}
</script>

<style scoped lang="scss">
:deep(.title-top > .cell) {
  font-size: 16px !important;
  text-transform: uppercase;
}
:deep(.el-table__footer-wrapper tfoot td.el-table__cell) {
  background-color: var(--el-table-row-hover-bg-color);
  color: var(--el-table-text-color);
  text-align: center;
}

</style>
