<script setup>
import { useI18n } from '@/locale'
import { useRouter } from 'vue-router'
import { computed, reactive, ref, onMounted, inject } from 'vue'
import lang from '@/locale/getMessage'
import { useAppStore, useRouteUser, useStatisticalReportStore, useUserStore } from '@/store'
import ImportExcel from '@/components/ImportExcel/index.vue'
import { downloadFileCustom, FILE_CATEGORY, requestDeleteFile } from '@/utils/files'
import { apiUpdateCollect, apiUploadCollect } from '@/api/collect'
import { ElMessage } from 'element-plus'
import { useConfig } from '@/config'

defineOptions({
  name: 'form-report',
})
const props = defineProps({
  listTypeReport: {
    type: Array,
    default: () => [],
    required: true,
  },
  listRoute: {
    type: Array,
    default: () => [],
    required: true,
  },
  isUpdate: {
    type: Boolean,
    default: false,
    required: true,
  },
  formUpdate: {
    type: Object,
    default: null,
    required: false,
  },
  idUpdate: {
    type: Number,
    default: -1,
    required: true,
  },
})
const emit = defineEmits(['closeDialog', 'loadData'])

const { t } = useI18n()
const router = useRouter()
const locale = computed(() => lang[appStore.lang])
const appStore = useAppStore()
const statisticalReportStore = useStatisticalReportStore()
const userStore = useUserStore()
const routeUser = useRouteUser()
// const listTypeReport = ref([
//   {
//     id: 'BAO_CAO_DANH_SACH_GIAO_DICH',
//     name: 'Báo cáo danh sách giao dịch'
//   },
//   {
//     id: 'BAO_CAO_DOANH_THU_HANG_NGAY',
//     name: 'Báo cáo doanh thu hàng ngày'
//   },
//   {
//     id: 'BAO_CAO_LUU_LUONG_XE_QUA_TRAM',
//     name: 'Báo cáo lưu lượng xe qua trạm'
//   },
// ])

const ruleFormRef = ref()
const rules = reactive({
  reportType: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  routeId: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
  // stationId: [{required: true, message: t('configUser.validateMessage.required'), trigger: 'blur'}],
  fileVaultIds: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
})

const formImportReport = ref({
  reportType: '',
  routeId: '',
  fileVaultIds: [],
  dataType: 1,
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
const urlUpload = ref(config?.VITE_APP_UPLOAD_URL + '/upload2')
const isSubmitted = ref(false)
const isLoadingStation = ref(false)
const nameReportType = ref('')
const loading = ref(false)

onMounted(() => {
  console.log(props.isUpdate)
  if (props.isUpdate) {
    formImportReport.value.reportType = props.formUpdate.reportType
    formImportReport.value.routeId = props.formUpdate.routeId
    formImportReport.value.stationId = props.formUpdate.stationId
    formImportReport.value.fileVaultIds.push(props.formUpdate.fileVault[0].id)
    fileVaults.value = props.formUpdate.fileVault
    nameReportType.value = props.listTypeReport.find(
      item => item.id === parseInt(formImportReport.value.reportType)
    )?.code
    handleChangeRoute(formImportReport.value.routeId)
  }
})
const handleImportReport = async () => {
  isSubmitted.value = formImportReport.value.fileVaultIds.length <= 0
  loading.value = true
  if (props.isUpdate) {
    ruleFormRef.value.validate(async valid => {
      if (valid && !isSubmitted.value) {
        await handleUpdateReport()
      }
    })
  } else {
    ruleFormRef.value.validate(async valid => {
      isSubmitted.value = formImportReport.value.fileVaultIds.length === 0
      if (valid && !isSubmitted.value) {
        const res = await apiUploadCollect(formImportReport.value)
        if (res.status === 200) {
          if (idFileDelete.value) {
            await handleDeleteFileSave()
          }
          if (props.isUpdate) {
            ElMessage.success(t('configUser.message.updateSuccess'))
          } else {
            ElMessage.success(t('configUser.message.addSuccess'))
          }
          loading.value = false
          emit('loadData')
        }
      }
    })
  }
}
const handleCloseDialog = () => {
  emit('closeDialog')
}
const refresh = () => {}
const handleSuccessFile = data => {
  formImportReport.value.fileVaultIds.push(data[0].id)
  isSubmitted.value = false
}
const idFileDelete = ref(null)
const handleRemoveFile = data => {
  formImportReport.value.fileVaultIds = []
  idFileDelete.value = data
  console.log('idFileDelete: ', idFileDelete.value)
}
const handleDeleteFileSave = async () => {
  await requestDeleteFile(idFileDelete.value.idFile)
    .then(response => {
      if (response.status === 200) {
        console.log('response: ', response)
      }
    })
    .catch(err => {
      console.log(err)
    })
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
  isLoadingStation.value = true
  await statisticalReportStore
    .getListStationReport(obj)
    .then(res => {
      if (res.status === 200) {
        listStation.value = res.data.dataRows
        isLoadingStation.value = false
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const handleChangeReportType = value => {
  nameReportType.value = props.listTypeReport.find(item => item.id === parseInt(value))?.code
  console.log('handleChangeReportType: ', nameReportType.value)
}
const handleUpdateReport = async () => {
  await apiUpdateCollect(formImportReport.value, props.idUpdate)
    .then(res => {
      if (res.status === 200) {
        if (idFileDelete.value) {
          handleDeleteFileSave()
        }
        loading.value = false
        ElMessage.success(t('configUser.message.updateSuccess'))
        emit('loadData')
      }
    })
    .catch(err => console.log(err))
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
          <el-form-item
            prop="reportType"
            class="custom"
            :label="$t('collection.reportType')"
          >
            <el-select
              class="w-full"
              v-model="formImportReport.reportType"
              clearable
              filterable
              collapse-tags
              :disabled="isUpdate"
              :placeholder="$t('configUser.pleaseSelect')"
              @change="handleChangeReportType"
            >
              <el-option
                v-for="item in listTypeReport"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            prop="routeId"
            class="custom"
            :label="$t('configUser.userManagement.route')"
          >
            <el-select
              class="w-full"
              v-model="formImportReport.routeId"
              clearable
              filterable
              collapse-tags
              :disabled="isUpdate"
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
        <!--        <el-col :span="24">-->
        <!--          <el-form-item prop="stationId" class="custom" :label="$t('configUser.station')">-->
        <!--            <el-select-->
        <!--              v-loading="isLoadingStation"-->
        <!--              class="w-full"-->
        <!--              v-model="formImportReport.stationId"-->
        <!--              clearable-->
        <!--              filterable-->
        <!--              :disabled="isUpdate"-->
        <!--              collapse-tags-->
        <!--              :placeholder="$t('configUser.pleaseSelect')"-->
        <!--            >-->
        <!--              <el-option-->
        <!--                v-for="item in listStation"-->
        <!--                :key="item.id"-->
        <!--                :label="item.name"-->
        <!--                :value="item.id"-->
        <!--              />-->
        <!--            </el-select>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <el-col :span="24">
          <p class="mb-2">
            <span class="text--danger">*</span> {{ t('administration.category.report.fileReport') }}
          </p>
          <ImportExcel
            limit="1"
            main-entity-name="reportControl"
            :file-category="FILE_CATEGORY.VECM_REPORT_CONTROL"
            :keep-file-name="true"
            :files="fileVaults"
            :action-url="urlUpload"
            :is-check-upload="!nameReportType"
            :report-type="nameReportType"
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
          :loading="loading"
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
