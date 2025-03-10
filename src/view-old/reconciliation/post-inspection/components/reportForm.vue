<template>
  <div>
    <div class="relative">
      <div
        class="page-header bg-[#fff] flex items-center justify-between sticky z-[1000] top-0 left-0 right-0 height-50 border-b border-[#CDCDCE]"
      >
        <div
          class="flex gap-px-8 items-center paddingX-12 paddingY-12"
          @click="backToList"
        >
          <svg-icon
            icon-class="back"
            class="color-[#525B73] cursor-pointer width-20 height-20"
          />
          <span
            v-if="isCreate"
            class="text-[18px] text-[#525B73]"
          >
            {{ $t('monitoring.tollCollectionReport.makeReport') }}
          </span>
          <span
            v-if="isEdit"
            class="text-[18px] text-[#525B73]"
          >
            {{ t('configUser.editUser') }}
          </span>
          <span
            v-if="isView"
            class="text-[18px] text-[#525B73]"
          >
            {{ reportData.name }}
          </span>
        </div>
        <div class="action-head paddingX-24">
          <div class="flex justify-content-end">
            <el-button
              v-if="isCreate && roleData.canCreate"
              class="el-button--main"
              type="primary"
              @click="handleAddReport()"
              :loading="process"
            >
              {{ t('omsSetting.save') }}
            </el-button>
            <el-button
              v-if="isEdit && roleData.canUpdate"
              class="el-button--main"
              type="primary"
              @click="handleUpdateReport()"
              :loading="process"
            >
              {{ t('omsSetting.update') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="paddingX-24">
      <div class="marginY-16 bg-white padding-14">
        <el-form
          ref="formRef"
          :model="reportData"
          :rules="rules"
          label-position="top"
          label-width="100%"
        >
          <div class="group">
            <el-form-item
              :label="t('monitoring.tollCollectionReport.reportName')"
              prop="name"
            >
              <el-input
                class="height-32"
                v-model="reportData.name"
                :placeholder="t('configUser.pleaseEnter')"
                maxlength="250"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item
              :label="t('configUser.route')"
              prop="route.id"
              required
            >
              <el-select
                v-model="reportData.route.id"
                clearable
                class="w-full"
                @change="handleRouteChange"
                :placeholder="t('configUser.pleaseSelect')"
                :disabled="isView || isEdit"
              >
                <el-option
                  v-for="item in routeLst"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="group">
            <el-form-item
              :label="t('configUser.station')"
              prop="station"
              required
            >
              <el-select
                v-model="reportData.station"
                class="w-full"
                :placeholder="t('configUser.pleaseSelect')"
                clearable
                multiple
                @change="setNameReport"
                :filterable="false"
                collapse-tags-tooltip
                :disabled="isView || isEdit"
              >
                <el-option
                  v-for="item in stationLst"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="w-full"
              :label="t('configUser.time')"
              prop="reportDate"
              required
            >
              <el-date-picker
                v-model="reportData.reportDate"
                type="date"
                value-format="YYYY-MM-DD"
                format="DD/MM/YYYY"
                class="w-full height-32"
                :placeholder="t('dateTime.selectDate')"
                clearable
                @change="setNameReport"
                :disabled="isView || isEdit"
              />
            </el-form-item>
          </div>
          <el-form-item
            :label="t('reconciliation.contentDifferent')"
            prop="comment"
            required
          >
            <div class="w-full">
              <QuillEditor
                v-model:content="reportData.comment"
                :options="quillOptions"
                contentType="html"
                @blur="onEditorChange('comment')"
              />
            </div>
          </el-form-item>
        </el-form>
        <div class="flex justify-end">
          <el-button
            :loading="processPreview"
            class="el-button--main"
            type="primary"
            @click="showPdf()"
          >
            {{ $t('statisticalReport.viewReport') }}
          </el-button>
        </div>
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
import { useRoute, useRouter } from 'vue-router'
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import { useAppStore, usePermissionStore, useRouteUser } from '@/store'
import { getListRoute, getListStation } from '@/api/expressway'
import lang from '@/locale/getMessage.js'
import { QuillEditor } from '@vueup/vue-quill'
import {
  apiCreateReconciliationPostInspection,
  apiGetReconciliationPostInspection,
  apiPreviewReconciliationPostInspection,
  apiUpdateReconciliationPostInspection,
} from '@/api/reconciliation'
import { ElMessage } from 'element-plus'

const appStore = useAppStore()
const { roleData } = usePermissionStore()

const locale = computed(() => lang[appStore.lang])

const { t } = useI18n()
const routeUser = useRouteUser()

const route = useRoute()
const router = useRouter()

const props = defineProps({
  isCreate: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  isView: {
    type: Boolean,
    default: false,
  },
})
const quillOptions = {
  theme: 'snow',
  readOnly: props.isView,
  placeholder: !props.isView ? t('configUser.pleaseEnter') : '',
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
    ],
  },
}
const reportData = reactive({
  id: null,
  name: null,
  base64Response: '',
  route: {
    id: null,
  },
  station: [],
  reportDate: null,
  comment: null,
  recommendation: null,
  sourceDocument: null,
})
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
const rules = reactive({
  name: [{ required: true, message: t('configUser.validateMessage.required') }],
  route: {
    id: { required: true, message: t('configUser.validateMessage.required'), trigger: 'change' },
  },
  station: { required: true, message: t('configUser.validateMessage.required'), trigger: 'change' },
  reportDate: {
    required: true,
    message: t('configUser.validateMessage.required'),
    trigger: 'change',
  },
  comment: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    {
      validator: validQuillContent,
      message: t('configUser.validateMessage.required'),
      trigger: 'blur',
    },
  ],
})

const loading = ref(true)
const routeLst = ref([])
const stationLst = ref([])

const backToList = () => {
  router.push('/reconciliation/post-inspection')
}
const getRouteList = async () => {
  const params = {
    routeIds: routeUser.routes,
  }

  await getListRoute(params)
    .then(res => {
      routeLst.value = res?.data?.dataRows || []
    })
    .finally(_ => {
      loading.value = false
    })
}
const getStationList = async routeId => {
  if (routeId) {
    const params = {
      routeIds: [routeId],
      stationsIds: routeUser.GET_STATIONS(routeId),
    }
    await getListStation(params).then(res => {
      stationLst.value = res?.data?.dataRows || []
      const listStation = []
      stationLst.value.forEach(station => {
        listStation.push(station.id)
      })
      reportData.station = listStation
    })
  } else {
    stationLst.value = []
  }
}
const handleRouteChange = routeId => {
  stationLst.value = []
  reportData.station = {
    id: '',
  }
  getStationList(routeId)
  setNameReport()
}
const setNameReport = () => {
  const checkRoute = reportData.route.id && reportData.route.id !== ''
  const checkStation = reportData.station && reportData.station !== ''
  const checkTime = reportData.reportDate !== null
  reportData.name = ''
  let name = 'Báo cáo'
  if (checkStation) {
    const listStationName = []
    for (let i = 0; i < reportData.station.length; i++) {
      const station = stationLst.value.find(item => item.id === reportData.station[i])
      listStationName.push(station.name)
    }
    name = `${name} trạm ${listStationName}`
  }
  if (checkRoute) {
    const route = routeLst.value.find(item => item.id === reportData.route.id)
    name = `${name} của tuyến ${route.name}`
  }
  if (checkTime) {
    const originalDate = reportData.reportDate
    const [year, month, day] = originalDate.split('-')
    const formattedDate = `${day}-${month}-${year}`
    name = `${name} ngày ${formattedDate}`
  }
  reportData.name = name
}

const formRef = ref(null)
const onEditorChange = field => {
  formRef.value.validateField(field)
  // console.log(reportData)
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    formRef.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}

onMounted(() => {
  getRouteList()
  initData()
})

const processPreview = ref(false)
const process = ref(false)
const initData = async () => {
  try {
    if (props.isEdit || props.isView) {
      const report_id = route.params.id
      const params = {
        method: 'GET',
        arguments: {
          reportId: report_id,
        },
      }
      const rs = await apiGetReconciliationPostInspection(params)
      if (rs.status === 200) {
        Object.assign(reportData, rs.data)
        reportData.reportDate = formatDateString(reportData.reportDate)
        reportData.station = []
        const stations = rs.data.stations
        for (const station of stations) {
          reportData.station.push(station.id)
        }
        base64PdfReport.value = reportData.base64Response
        await getStationList(reportData.route.id)
        if (props.isView) {
          await showPdf()
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
}
const handleAddReport = async () => {
  try {
    process.value = true
    await Promise.all([validFormData()])
    const params = {
      method: 'ADD',
      arguments: {
        name: reportData.name,
        routeId: reportData.route.id,
        stationIds: reportData.station,
        reportDate: reportData.reportDate,
        comment: reportData.comment,
      },
    }
    console.log(params)
    const rs = await apiCreateReconciliationPostInspection(params)
    if (rs.status === 200) {
      console.log(rs.data)
      ElMessage({
        message: t('configUser.message.addSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      backToList()
    }
    process.value = false
  } catch (e) {
    console.log(e)
    process.value = false
  }
}
const handleUpdateReport = async () => {
  try {
    process.value = true
    await Promise.all([validFormData()])
    const params = {
      method: 'UPDATE',
      arguments: {
        reportId: reportData.id,
        name: reportData.name,
        routeId: reportData.route.id,
        stationIds: reportData.station,
        reportDate: reportData.reportDate,
        comment: reportData.comment,
      },
    }
    console.log(params)
    const rs = await apiUpdateReconciliationPostInspection(params)
    if (rs.status === 200) {
      console.log(rs.data)
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      backToList()
    }
    process.value = false
  } catch (e) {
    console.log(e)
    process.value = false
  }
}
const handlePreview = async () => {
  try {
    processPreview.value = true
    await Promise.all([validFormData()])
    const params = {
      method: 'PREVIEW',
      arguments: {
        name: reportData.name,
        routeId: reportData.route.id,
        stationIds: reportData.station,
        reportDate: reportData.reportDate,
        comment: reportData.comment,
      },
    }
    const rs = await apiPreviewReconciliationPostInspection(params)
    if (rs.status === 200) {
      base64PdfReport.value = rs.data.data
      console.log(base64PdfReport.value)
    }
    processPreview.value = false
    return true
  } catch (e) {
    console.log(e)
    processPreview.value = false
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
    await handlePreview()
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
  } else if (props.isView) {
    const blob = base64ToBlob(base64PdfReport.value)
    pdfUrl.value = URL.createObjectURL(blob)
  }
}
const formatDateString = dateString => {
  if (!dateString) return ''
  const isoDateString = dateString.replace(' ', 'T')

  const date = new Date(isoDateString)
  if (isNaN(date)) return 'Invalid Date'

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}

defineOptions({
  name: 'ReportPostInspectionForm',
})
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
