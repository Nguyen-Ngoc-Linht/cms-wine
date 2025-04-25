<template>
  <div>
    <div class="px-6 mt-4">
      <div class="bg-white px-5 pt-6 pb-4 mb-4">
        <el-form
          ref="formTrafficRevenue"
          :rules="ruleEdit"
          :model="infoTimeReport"
          class="custom-form"
        >
          <h4 class="text-black font-semibold text-2xl">Báo cáo thống kê</h4>
          <el-row
            :gutter="18"
            class="mt-2"
          >
            <el-col
              :md="12"
              :sm="24"
            >
              <el-form-item
                label="Loại"
                prop="period"
                class="custom mb-2"
                style="width: 100%"
              >
                <el-select
                  v-model="infoTimeReport.period"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  @change="changePeriod"
                  placeholder="Vui lòng chọn"
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
                label="Tên loại báo cáo"
                prop="name"
                class="custom mb-2"
                style="width: 100%"
              >
                <el-input
                  v-model="infoTimeReport.name"
                  maxlength="250"
                  disabled
                />
              </el-form-item>
            </el-col>

            <!-- DAILY -->
            <el-col
              :md="12"
              :sm="24"
            >
              <el-form-item
                v-if="infoTimeReport.period === 'DAILY'"
                label="Thời gian lấy báo cáo"
                prop="timeGetReportDay"
                class="custom mb-2"
                style="width: 100%"
              >
                <el-date-picker
                  v-model="infoTimeReport.timeGetReportDay"
                  type="daterange"
                  @change="setNameReport"
                  :start-placeholder="t('el.datepicker.startTime')"
                  :end-placeholder="t('el.datepicker.endTime')"
                  clearable
                  value-format="YYYY-MM-DD"
                  format="DD/MM/YYYY"
                  style="width: 100%"
                />
              </el-form-item>

              <!-- MONTHLY -->
              <el-form-item
                v-if="infoTimeReport.period === 'MONTHLY'"
                label="Thời gian lấy báo cáo"
                prop="timeGetReportMonth"
                class="custom mb-2"
                style="width: 100%"
              >
                <el-date-picker
                  v-model="infoTimeReport.timeGetReportMonth"
                  type="month"
                  @change="setNameReport"
                  clearable
                  placeholder="Vui lòng chọn"
                  value-format="YYYY-MM"
                  format="MM/YYYY"
                  style="width: 100%"
                />
              </el-form-item>

              <!-- YEARLY -->
              <el-form-item
                v-if="infoTimeReport.period === 'YEARLY'"
                label="Thời gian lấy báo cáo"
                prop="timeGetReportYear"
                class="custom mb-2"
                style="width: 100%"
              >
                <el-date-picker
                  v-model="infoTimeReport.timeGetReportYear"
                  type="year"
                  @change="setNameReport"
                  clearable
                  placeholder="Vui lòng chọn"
                  value-format="YYYY"
                  format="YYYY"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="flex justify-end mt-2">
            <el-button
              v-if="showDownload"
              @click.stop="handleExport()"
              download="bao_cao.pdf"
              type="success"
              class="ml-2"
            >
              Tải xuống
            </el-button>
            <el-button
              :loading="processingPreview"
              @click="showPdf"
              class="el-button--main"
            >
              Xem báo cáo
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
import { onMounted, ref } from 'vue'
import { useI18n } from '@/locale'
import { apiExportReport } from '@/api/report'
import { ElMessage } from 'element-plus'

const props = defineProps({
  isView: Boolean,
  isCreate: Boolean,
  isEdit: Boolean,
})

const { t } = useI18n()

const formTrafficRevenue = ref(null)
const ruleEdit = ref({})
const processingPreview = ref(false)
const pdfUrl = ref('')

const listPeriodicReport = ref([
  { id: 1, name: 'Ngày', value: 'DAILY' },
  { id: 2, name: 'Tháng', value: 'MONTHLY' },
  { id: 3, name: 'Năm', value: 'YEARLY' },
])

const infoTimeReport = ref({
  name: '',
  period: '',
  timeGetReportDay: [],
  timeGetReportMonth: '',
  timeGetReportYear: '',
})

onMounted(() => {
  setDataDefault()
  initData()
})

const setDataDefault = async () => {
  infoTimeReport.value = {
    name: '',
    period: '',
    timeGetReportDay: [],
    timeGetReportMonth: '',
    timeGetReportYear: '',
  }
}

const initData = async () => {
  // Fetch API nếu cần load dữ liệu ban đầu
}

const changePeriod = () => {
  infoTimeReport.value.timeGetReportDay = []
  infoTimeReport.value.timeGetReportMonth = ''
  infoTimeReport.value.timeGetReportYear = ''
  infoTimeReport.value.name = ''
  showDownload.value = false
}

const setNameReport = () => {
  const { period, timeGetReportMonth, timeGetReportYear, timeGetReportDay } = infoTimeReport.value

  if (period === 'DAILY' && Array.isArray(timeGetReportDay) && timeGetReportDay.length === 2) {
    const [startDate, endDate] = timeGetReportDay
    infoTimeReport.value.name = `Báo cáo từ ${formatDate(startDate)} đến ${formatDate(endDate)}`
  } else if (period === 'MONTHLY' && timeGetReportMonth) {
    const [year, month] = timeGetReportMonth.split('-')
    infoTimeReport.value.name = `Báo cáo tháng ${month}/${year}`
  } else if (period === 'YEARLY' && timeGetReportYear) {
    infoTimeReport.value.name = `Báo cáo năm ${timeGetReportYear}`
  }
}
const formatDate = dateStr => {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
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

const showDownload = ref(false)
const showPdf = async () => {
  processingPreview.value = true

  const payload = buildReportPayload('PDF')
  if (!payload) {
    processingPreview.value = false
    return
  }

  let base64 = null
  const rs = await apiExportReport(payload)
  if (rs.code === 200) {
    base64 = rs.data.data
  }

  console.log('Payload gửi về backend:', payload)

  try {
    const blob = base64ToBlob(base64)
    pdfUrl.value = URL.createObjectURL(blob)
    showDownload.value = true
  } catch (err) {
    console.error('Lỗi khi xem báo cáo:', err)
  } finally {
    processingPreview.value = false
  }
}
const buildReportPayload = (type) => {
  const { period, timeGetReportDay, timeGetReportMonth, timeGetReportYear } = infoTimeReport.value

  if (period === 'DAILY') {
    if (
      !Array.isArray(timeGetReportDay) ||
      timeGetReportDay.length !== 2 ||
      !timeGetReportDay[0] ||
      !timeGetReportDay[1]
    ) {
      ElMessage({
        type: 'warning',
        message: 'Chọn đầy đủ từ ngày và đến ngày.',
      })
      return null
    }
    return {
      type: 'DAILY',
      fromDate: timeGetReportDay[0],
      toDate: timeGetReportDay[1],
      fileType: type,
    }
  }

  if (period === 'MONTHLY') {
    if (!timeGetReportMonth || !timeGetReportMonth.includes('-')) {
      ElMessage({
        type: 'warning',
        message: 'Chọn tháng hợp lệ (yyyy-MM).',
      })
      return null
    }
    const [year, month] = timeGetReportMonth.split('-')
    return {
      type: 'MONTHLY',
      month,
      year,
      fileType: type,
    }
  }

  if (period === 'YEARLY') {
    if (!timeGetReportYear) {
      ElMessage({
        type: 'warning',
        message: 'Chọn năm báo cáo.',
      })
      return null
    }
    return {
      type: 'YEARLY',
      year: timeGetReportYear,
      fileType: type,
    }
  }

  console.error('Không xác định loại báo cáo.')
  return null
}

const handleExport = async () => {
  try {
    const params = buildReportPayload('EXCEL')
    const rs = await apiExportReport(params)
    if (rs.code === 200) {
      const base64Data = rs.data.data
      const typeDownload = 'application/excel'
      const fileExtension = 'xlsx'

      const blob = base64ToBlob(base64Data, typeDownload)
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `${rs.data.name}`
      document.body.appendChild(a)
      a.click()

      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  } catch (e) {
    console.log(e)
  }
}
</script>

<style lang="scss" scoped>
.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}
</style>
