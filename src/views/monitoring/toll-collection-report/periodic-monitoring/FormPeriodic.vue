<template>
  <div>
    <div class="w-full bg-white flex items-center justify-between px-4 py-3">
      <h5 class="flex items-center">
        <div
          class="back pointer"
          @click="backErrorHandling()"
        >
          <img
            src="@/assets/imgs/weightStation/back.png"
            alt=""
          />
        </div>
        <div
          v-if="!isEdit && !isView"
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('configUser.addNew') }}
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
          {{ infoPeriodicMonitoring.name }}
        </div>
      </h5>
      <div>
        <el-button
          :loading="process"
          v-if="!isEdit && roleData.canCreate && !isView"
          @click="handleCreatePeriodicMonitoring"
          class="el-button--main"
          >{{ $t('omsSetting.save') }}</el-button
        >
        <el-button
          :loading="process"
          v-if="isEdit && roleData.canUpdate && !isConfirm"
          @click="handleUpdatePeriodicMonitoring()"
          class="el-button--main"
          >{{ $t('omsSetting.update') }}</el-button
        >
        <el-button
          v-if="roleData.canUpdate && !isView"
          @click="handleConfirmPeriodicMonitoring()"
          class="el-button--main"
          >{{ $t('el.table.confirmFilter') }}</el-button
        >
      </div>
    </div>
    <!--  Content  -->
    <div class="px-6 mt-4">
      <div
        v-if="roleData.canCreate || roleData.canUpdate"
        class="bg-white px-5 pt-6 pb-4 mb-4"
      >
        <el-form
          ref="formPeriodicMonitoring"
          :rules="ruleEdit"
          :model="infoPeriodicMonitoring"
          class="custom-form"
        >
          <h4 class="text-black font-semibold text-2xl">
            {{ $t('monitoring.tollCollectionReport.info') }}
          </h4>
          <div class="flex justify-between gap-5 mt-4">
            <div style="width: 50%">
              <el-form-item
                :label="t('monitoring.tollCollectionReport.reportName')"
                prop="name"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoPeriodicMonitoring.name"
                  maxlength="50"
                  :placeholder="$t('configUser.pleaseEnter')"
                  :disabled="true"
                />
              </el-form-item>
            </div>
            <div style="width: 50%">
              <el-form-item
                :label="t('monitoring.tollCollectionReport.reportPeriod')"
                prop="periodicReport"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoPeriodicMonitoring.periodicReport"
                  clearable
                  filterable
                  collapse-tags
                  @change="
                    value => {
                      setPeriodType(value)
                    }
                  "
                  style="width: 100%"
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
            </div>
          </div>
          <el-row :gutter="18">
            <el-col
              v-if="infoPeriodicMonitoring.periodicReport === 'WEEKLY'"
              :sm="12"
            >
              <el-form-item
                :label="t('weightStation.week')"
                prop="week"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoPeriodicMonitoring.week"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  @change="setNameReport"
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isView"
                >
                  <el-option
                    v-for="item in listWeek"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="
                infoPeriodicMonitoring.periodicReport === 'WEEKLY' ||
                infoPeriodicMonitoring.periodicReport === 'MONTHLY'
              "
              :sm="12"
            >
              <el-form-item
                :label="t('weightStation.month')"
                prop="month"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoPeriodicMonitoring.month"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  @change="setNameReport"
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isView"
                >
                  <el-option
                    v-for="item in listMonth"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-if="infoPeriodicMonitoring.periodicReport === 'QUARTERLY'"
              :sm="12"
            >
              <el-form-item
                :label="t('el.datepicker.quarter')"
                prop="quarter"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoPeriodicMonitoring.quarter"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  @change="setNameReport"
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isView"
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
            <el-col :sm="12">
              <el-form-item
                :label="t('weightStation.year')"
                prop="year"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-date-picker
                  v-model="infoPeriodicMonitoring.year"
                  type="year"
                  @change="setNameReport"
                  :placeholder="$t('configUser.pleaseSelect')"
                  value-format="YYYY"
                  format="YYYY"
                  style="width: 100%"
                  :disabled="isView"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item
                :label="t('configUser.gland')"
                prop="route.id"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoPeriodicMonitoring.route.id"
                  clearable
                  filterable
                  collapse-tags
                  @change="
                    value => {
                      setSelectStation(value)
                    }
                  "
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
            <el-col :sm="12">
              <el-form-item
                :label="t('configUser.station')"
                prop="station"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoPeriodicMonitoring.station"
                  clearable
                  filterable
                  :multiple="infoPeriodicMonitoring.periodicReport !== 'WEEKLY'"
                  collapse-tags
                  @change="setNameReport"
                  style="width: 100%"
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isEdit || isView || infoPeriodicMonitoring.periodicReport !== 'WEEKLY'"
                >
                  <el-option
                    v-for="item in listStation"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="18">
            <el-col
              :sm="12"
              v-if="
                infoPeriodicMonitoring.periodicReport === 'WEEKLY' ||
                infoPeriodicMonitoring.periodicReport === 'MONTHLY'
              "
              style="width: 50%"
            >
              <el-form-item
                :label="t('monitoring.tollCollectionReport.generalAssessment')"
                prop="generalAssessment"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <div class="w-full">
                  <QuillEditor
                    v-model:content="infoPeriodicMonitoring.generalAssessment"
                    :options="quillOptions"
                    contentType="html"
                    @blur="onEditorChange('generalAssessment')"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :sm="12">
              <el-form-item
                :label="t('monitoring.tollCollectionReport.conclude')"
                prop="conclude"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <div class="w-full">
                  <QuillEditor
                    v-model:content="infoPeriodicMonitoring.conclude"
                    :options="quillOptions"
                    contentType="html"
                    @blur="onEditorChange('conclude')"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="flex justify-end mt-4">
            <el-button
              :loading="processingPreview"
              @click="showPdf"
              class="el-button--main"
              >{{ $t('monitoring.tollCollectionReport.viewData') }}</el-button
            >
          </div>
          <hr class="margin-bottom-12 mt-3 mb-4" />
        </el-form>
      </div>
      <div style="text-align: center">
        <iframe
          v-if="pdfUrl"
          :src="pdfUrl"
          width="100%"
          style="height: calc(100vh - 100px)"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { getListRoute, getListStation } from '@/api/expressway'
import { ElMessage } from 'element-plus'
import { QuillEditor } from '@vueup/vue-quill'
import { usePermissionStore, useRouteUser } from '@/store'
import {
  apiCreatePeriodicMonitoring,
  apiGetPeriodicMonitoring,
  apiPreviewReportPeriodic,
  apiUpdatePeriodicMonitoring,
} from '@/api/toll-collection'

const props = defineProps({
  isView: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
const quillOptions = {
  theme: 'snow',
  readOnly: props.isView,
  placeholder: !props.isView ? t('configUser.pleaseEnter') : '',
  modules: {
    toolbar: [[{ header: [1, 2, 3, false] }], ['bold', 'italic', 'underline']],
    keyboard: {
      bindings: {
        'list autofill': {
          key: ' ',
          collapsed: true,
          prefix: /^\d+\.$|^[-*+]$/,
          handler: () => {
            return true
          },
        },
        list: null,
      },
    },
  },
}
const router = useRouter()
const route = useRoute()
const routeUser = useRouteUser()
const { roleData } = usePermissionStore()

const validQuillContent = (rule, value, callback) => {
  const regex = /(<([^>]+)>)/gi
  const hasText = !!value?.replace(regex, '').trim().length
  console.log(hasText)
  if (hasText) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}

const ruleEdit = ref({
  name: [
    { required: true, message: t('omsSetting.ruleEnter') },
    // { max: 50, message: t('omsSetting.ruleMaxLengthText'), trigger: 'blur' }
  ],
  route: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  station: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  periodicReport: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  week: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  month: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  quarter: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  year: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  generalAssessment: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { validator: validQuillContent, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
  ],
  conclude: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { validator: validQuillContent, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
  ],
})
const listRoute = ref([])
const listStation = ref([])
const listPeriodicReport = ref([
  {
    id: 1,
    name: t('weightStation.week'),
    value: 'WEEKLY',
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
])
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
const listMonth = ref([
  {
    id: 1,
    name: t('el.datepicker.month1'),
  },
  {
    id: 2,
    name: t('el.datepicker.month2'),
  },
  {
    id: 3,
    name: t('el.datepicker.month3'),
  },
  {
    id: 4,
    name: t('el.datepicker.month4'),
  },
  {
    id: 5,
    name: t('el.datepicker.month5'),
  },
  {
    id: 6,
    name: t('el.datepicker.month6'),
  },
  {
    id: 7,
    name: t('el.datepicker.month7'),
  },
  {
    id: 8,
    name: t('el.datepicker.month8'),
  },
  {
    id: 9,
    name: t('el.datepicker.month9'),
  },
  {
    id: 10,
    name: t('el.datepicker.month10'),
  },
  {
    id: 11,
    name: t('el.datepicker.month11'),
  },
  {
    id: 12,
    name: t('el.datepicker.month12'),
  },
])
const listWeek = ref([
  {
    id: 1,
    name: t('weightStation.weekNumber', ['1']),
  },
  {
    id: 2,
    name: t('weightStation.weekNumber', ['2']),
  },
  {
    id: 3,
    name: t('weightStation.weekNumber', ['3']),
  },
  {
    id: 4,
    name: t('weightStation.weekNumber', ['4']),
  },
])
const processingPreview = ref(false)
const process = ref(false)

const isConfirm = ref(false)
const formPeriodicMonitoring = ref(null)
const infoPeriodicMonitoring = ref({
  route: {
    id: '',
  },
})

const base64PdfReport = ref(null)
const pdfUrl = ref('')

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
  const periodic_id = route.params.id
  if (periodic_id) {
    const params = {
      method: 'GET',
      arguments: {
        reportId: parseInt(periodic_id, 10),
      },
    }
    const rs = await apiGetPeriodicMonitoring(params)
    if (rs.status === 200) {
      const data = rs.data
      infoPeriodicMonitoring.value.name = data.name || ''
      infoPeriodicMonitoring.value.id = data.id
      infoPeriodicMonitoring.value.periodicReport = data.periodType
      infoPeriodicMonitoring.value.year = data.period.year.toString()
      infoPeriodicMonitoring.value.quarter = data.period.quarter
      infoPeriodicMonitoring.value.month = data.period.monthOfYear
      infoPeriodicMonitoring.value.week = data.period.weekOfMonth
      infoPeriodicMonitoring.value.route = data.route
      await setSelectStation(data.route.id)
      if (infoPeriodicMonitoring.value.periodicReport === 'WEEKLY') {
        infoPeriodicMonitoring.value.station = data.station.id
      }
      infoPeriodicMonitoring.value.generalAssessment = data.generalAssessment
      infoPeriodicMonitoring.value.conclude = data.conclusion
      base64PdfReport.value = data.base64PdfReport
      isConfirm.value = data.isConfirmed
      if (props.isView) {
        // console.log('Hay Hay')
        await showPdf()
      }
    }
  }
}
const handleCreatePeriodicMonitoring = async () => {
  try {
    process.value = true
    await Promise.all([validFormData()])
    const params = {
      method: 'ADD',
      arguments: {
        name: infoPeriodicMonitoring.value.name,
        routeId: infoPeriodicMonitoring.value.route.id,
        stationId:
          infoPeriodicMonitoring.value.periodicReport === 'WEEKLY'
            ? infoPeriodicMonitoring.value.station
            : null,
        periodType: infoPeriodicMonitoring.value.periodicReport,
        period: {
          year: infoPeriodicMonitoring.value.year,
          quarter: infoPeriodicMonitoring.value.quarter,
          monthOfYear: infoPeriodicMonitoring.value.month,
          weekOfMonth: infoPeriodicMonitoring.value.week,
        },
        generalAssessment: infoPeriodicMonitoring.value.generalAssessment,
        conclusion: infoPeriodicMonitoring.value.conclude,
        isConfirmed: isConfirm.value,
      },
    }
    console.log('log', params)
    const rs = await apiCreatePeriodicMonitoring(params)
    if (rs.status === 200) {
      console.log(rs.data)
      ElMessage({
        message: t('configUser.message.addSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      backErrorHandling()
    }
    process.value = false
  } catch (e) {
    console.log(e)
    process.value = false
  }
}
const handleConfirmPeriodicMonitoring = () => {
  isConfirm.value = true
  const id = infoPeriodicMonitoring.value.id
  console.log('Id ở đây', id, infoPeriodicMonitoring.value)
  if (id !== undefined) {
    handleUpdatePeriodicMonitoring()
  } else {
    handleCreatePeriodicMonitoring()
  }
}
const handleUpdatePeriodicMonitoring = async () => {
  try {
    process.value = true
    await Promise.all([validFormData()])
    const params = {
      method: 'UPDATE',
      arguments: {
        reportId: infoPeriodicMonitoring.value.id,
        name: infoPeriodicMonitoring.value.name,
        routeId: infoPeriodicMonitoring.value.route.id,
        stationId:
          infoPeriodicMonitoring.value.periodicReport === 'WEEKLY'
            ? infoPeriodicMonitoring.value.station
            : null,
        periodType: infoPeriodicMonitoring.value.periodicReport,
        period: {
          year: infoPeriodicMonitoring.value.year,
          quarter: infoPeriodicMonitoring.value.quarter,
          monthOfYear: infoPeriodicMonitoring.value.month,
          weekOfMonth: infoPeriodicMonitoring.value.week,
        },
        generalAssessment: infoPeriodicMonitoring.value.generalAssessment,
        conclusion: infoPeriodicMonitoring.value.conclude,
        isConfirmed: isConfirm.value,
      },
    }
    const rs = await apiUpdatePeriodicMonitoring(params)
    if (rs.status === 200) {
      console.log(rs.data)
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      backErrorHandling()
    }
    process.value = false
  } catch (e) {
    console.log(e)
    process.value = false
  }
}
const handlePreviewReport = async () => {
  try {
    await Promise.all([validFormData()])
    processingPreview.value = true
    const params = {
      method: 'PREVIEW',
      arguments: {
        name: infoPeriodicMonitoring.value.name,
        routeId: infoPeriodicMonitoring.value.route.id,
        stationId:
          infoPeriodicMonitoring.value.periodicReport === 'WEEKLY'
            ? infoPeriodicMonitoring.value.station
            : null,
        periodType: infoPeriodicMonitoring.value.periodicReport, // WEEKLY, MONTHLY, QUARTERLY
        period: {
          year: infoPeriodicMonitoring.value.year,
          quarter: infoPeriodicMonitoring.value.quarter,
          monthOfYear: infoPeriodicMonitoring.value.month,
          weekOfMonth: infoPeriodicMonitoring.value.week,
        },
        generalAssessment: infoPeriodicMonitoring.value.generalAssessment,
        conclusion: infoPeriodicMonitoring.value.conclude,
        isConfirmed: isConfirm.value,
      },
    }
    const rs = await apiPreviewReportPeriodic(params)
    if (rs.status === 200) {
      base64PdfReport.value = rs.data.data
    }
    processingPreview.value = false
    return true
  } catch (e) {
    processingPreview.value = false
  }
}

const validFormData = async () => {
  return new Promise((resolve, reject) => {
    formPeriodicMonitoring.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}
const onEditorChange = field => {
  formPeriodicMonitoring.value.validateField(field)
}

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
    await handlePreviewReport()
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
  } else if (isConfirm.value || props.isView) {
    const blob = base64ToBlob(base64PdfReport.value)
    pdfUrl.value = URL.createObjectURL(blob)
  }
}

const setNameReport = () => {
  const checkRoute =
    infoPeriodicMonitoring.value.route.id && infoPeriodicMonitoring.value.route.id !== ''
  const checkType = infoPeriodicMonitoring.value.periodicReport
  const checkWeek = infoPeriodicMonitoring.value.week !== null && infoPeriodicMonitoring.value.week
  const checkMonth =
    infoPeriodicMonitoring.value.month !== null && infoPeriodicMonitoring.value.month
  const checkYear = infoPeriodicMonitoring.value.year !== null && infoPeriodicMonitoring.value.year
  const checkQuarter =
    infoPeriodicMonitoring.value.quarter !== null && infoPeriodicMonitoring.value.quarter
  let name = ''
  if (checkType === 'WEEKLY') {
    if (checkWeek && checkMonth && checkYear) {
      name = `Báo cáo tuần ${infoPeriodicMonitoring.value.week} tháng ${infoPeriodicMonitoring.value.month} năm ${infoPeriodicMonitoring.value.year}`
    }
  }
  if (checkType === 'MONTHLY') {
    if (checkMonth && checkYear) {
      name = `Báo cáo tháng ${infoPeriodicMonitoring.value.month} năm ${infoPeriodicMonitoring.value.year}`
    }
  }
  if (checkType === 'QUARTERLY') {
    if (checkQuarter && checkYear) {
      name = `Báo cáo quý ${infoPeriodicMonitoring.value.quarter} năm ${infoPeriodicMonitoring.value.year}`
    }
  }
  if (checkRoute) {
    const route = listRoute.value.find(item => item.id === infoPeriodicMonitoring.value.route.id)
    name = `${name} của tuyến ${route.name}`
    if (checkType === 'WEEKLY') {
      const checkStation = infoPeriodicMonitoring.value.station !== null
      if (checkStation) {
        const station = listStation.value.find(
          item => item.id === infoPeriodicMonitoring.value.station
        )
        name = `${name}, trạm ${station.name}`
      }
    }
  }
  infoPeriodicMonitoring.value.name = name
}
const setSelectStation = async id => {
  listStation.value = []
  infoPeriodicMonitoring.value.station = null
  const route_id = id
  if (route_id) {
    const params = {
      page: 1,
      size: 20,
      keyword: '',
      stationIds: [],
      routeIds: [route_id],
      unitIds: [],
    }
    const rs = await getListStation(params)
    if (rs.status === 200) {
      listStation.value = rs.data.dataRows
      setNameReport()
      if (
        infoPeriodicMonitoring.value.periodicReport === 'MONTHLY' ||
        infoPeriodicMonitoring.value.periodicReport === 'QUARTERLY'
      ) {
        infoPeriodicMonitoring.value.station = []
        for (const station of listStation.value) {
          infoPeriodicMonitoring.value.station.push(station.id)
        }
      }
    } else {
      listStation.value = []
    }
  }
}
const backErrorHandling = () => {
  router.push(`/monitoring/toll-collection-report/periodic-monitoring`)
}
const setPeriodType = periodType => {
  infoPeriodicMonitoring.value.station = null
  infoPeriodicMonitoring.value.route = {
    id: '',
  }
  if (periodType === 'MONTHLY') {
    infoPeriodicMonitoring.value.week = null
    infoPeriodicMonitoring.value.quarter = null
  } else if (periodType === 'QUARTERLY') {
    infoPeriodicMonitoring.value.week = null
    infoPeriodicMonitoring.value.month = null
  } else if (periodType === 'WEEKLY') {
    infoPeriodicMonitoring.value.quarter = null
  }
}
</script>

<style scoped>
.group {
  display: flex;
}

.group > div {
  flex: 1;
}

.group > div:first-child {
  margin-right: 5px;
}

.group > div:last-child {
  margin-left: 5px;
}

:deep(.is-error .ql-toolbar.ql-snow) {
  border-color: var(--el-color-danger) var(--el-color-danger) #99a2bc var(--el-color-danger);
}

:deep(.is-error .ql-container.ql-snow) {
  border-color: #99a2bc var(--el-color-danger) var(--el-color-danger) var(--el-color-danger);
}

:deep(.ql-editor) {
  height: 100px;
}
</style>

<style lang="scss">
.custom {
  color: #525b73;
  .el-form-item__label {
    color: #525b73;
    font-weight: 600 !important;
  }
}
.box-quill {
  border: 1px solid #99a2bc;
  border-radius: 4px;
  //overflow: hidden;
  position: relative;
  min-height: 200px;
  color: #606266;

  .ql-toolbar .ql-snow {
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    padding: 8px;
    border: none;
  }

  .ql-container.ql-snow {
    border: none !important;
  }

  .ql-toolbar {
    box-sizing: border-box;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    padding: 8px;
    background-color: white;
    border-bottom: 1px solid #99a2bc;
    border-top: none;
    border-left: none;
    border-right: none;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
}
</style>
