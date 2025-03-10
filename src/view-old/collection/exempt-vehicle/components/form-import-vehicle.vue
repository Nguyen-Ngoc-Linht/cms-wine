<script setup>
import { useI18n } from '@/locale'
import { useRouter } from 'vue-router'
import { computed, reactive, ref, inject } from 'vue'
import lang from '@/locale/getMessage'
import { useAppStore, useRouteUser, useStatisticalReportStore } from '@/store'
import ImportExcel from '@/components/ImportExcel/index.vue'
import { downloadFileCustom, FILE_CATEGORY } from '@/utils/files'
import { apiUploadCollect } from '@/api/collect'
import { ElMessage } from 'element-plus'
import { useConfig } from '@/config'

defineOptions({
  name: 'form-import-vehicle',
})
const props = defineProps({
  listRoute: {
    type: Array,
    default: () => [],
    required: true,
  },
})
const emit = defineEmits(['closeDialog', 'loadData'])

const { t } = useI18n()
const router = useRouter()
const locale = computed(() => lang[appStore.lang])
const appStore = useAppStore()
const statisticalReportStore = useStatisticalReportStore()
const routeUser = useRouteUser()

const loadingFile = ref(false)

const ruleFormRef = ref()
const rules = reactive({})

const formImportReport = ref({
  fileVaultIds: [],
  // routeId: 'default',
  // stationId: 'default',
  dataType: 6,
  reportType: 8,
})
const objFindStationDefault = {
  keyword: '',
  page: 1,
  size: 1000,
  unitIds: [],
  routeIds: [],
  stationIds: [],
}
const listStation = ref([])
const fileVaults = ref([])
const fileContent = ref('')

const config = useConfig()
const urlUpload = ref(config.VITE_APP_UPLOAD_URL + '/upload2')
const isSubmitted = ref(false)

const handleImportReport = () => {
  ruleFormRef.value.validate(async valid => {
    isSubmitted.value = formImportReport.value.fileVaultIds.length === 0
    if (valid && !isSubmitted.value) {
      const res = await apiUploadCollect(formImportReport.value)
      if (res.status === 200) {
        ElMessage.success(t('configUser.message.addSuccess'))
        emit('loadData')
      }
    }
  })
}
const handleCloseDialog = () => {
  emit('closeDialog')
}
const refresh = () => {}
const handleSuccessFile = data => {
  console.log('handleSuccessFile: ', data)
  formImportReport.value.fileVaultIds.push(data[0].id)
  isSubmitted.value = false
}
const handleRemoveFile = data => {
  console.log('handleRemoveFile: ', data)
  formImportReport.value.fileVaultIds = []
}
const handleChangeRoute = async value => {
  objFindStationDefault.routeIds = []
  objFindStationDefault.routeIds = objFindStationDefault.routeIds.concat(value)
  const listStationUser = routeUser.GET_STATIONS(value)
  objFindStationDefault.stationIds = []
  objFindStationDefault.stationIds = objFindStationDefault.stationIds.concat(listStationUser)
  await getListStation(objFindStationDefault)
}
const getListStation = async obj => {
  await statisticalReportStore
    .getListStationReport(obj)
    .then(res => {
      if (res.status === 200) {
        listStation.value = res.data.dataRows
      }
    })
    .catch(err => {
      console.log(err)
    })
}
</script>

<template>
  <div class="bg-white">
    <el-form
      ref="ruleFormRef"
      :model="formImportReport"
      :rules="rules"
      label-position="top"
      label-width="100%"
    >
      <el-row :gutter="16">
        <el-col :span="24">
          <p class="mb-2">
            <span class="text--danger">*</span> {{ t('administration.category.report.fileReport') }}
          </p>
          <ImportExcel
            limit="1"
            main-entity-name="reportVehicle"
            :file-category="FILE_CATEGORY.VECM_REPORT_VEHICLE"
            :keep-file-name="true"
            :files="fileVaults"
            :action-url="urlUpload"
            :report-type="'BAO_CAO_DANH_SACH_XE_MIEN_PHI'"
            file-type=".xlsx"
            @upload-success="handleSuccessFile"
            @remove-success="handleRemoveFile"
          />
          <span
            class="text--danger fs-12"
            v-if="isSubmitted"
            >{{ t('configUser.validateMessage.required') }}</span
          >
        </el-col>
      </el-row>
    </el-form>
    <hr class="margin-bottom-24" />
    <div class="action">
      <div class="flex justify-end">
        <el-button
          @click="handleCloseDialog"
          class="bg-outline-secondary"
          >{{ $t('configUser.cancel') }}</el-button
        >
        <el-button
          @click="handleImportReport"
          type="primary"
          class="bg--dark-purple"
          style="border: transparent"
          >{{ $t('omsSetting.confirm') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
