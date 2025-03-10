<script setup>
import { ref, reactive, onMounted, watch, computed, inject } from 'vue'
import moment from 'moment'
import { cloneDeep } from 'lodash-unified'
import { useRouter } from 'vue-router'

import { useI18n } from '@/locale'
import lang from '@/locale/getMessage'
import {
  useAppStore,
  useExplanationSupportStore,
  useStatisticalReportStore,
  useUserStore,
  usePermissionStore,
  useRouteUser,
} from '@/store'
import Dialog from '@/components/Dialog/index.vue'
import Pagination from '@/components/Pagination'
import { ElMessage } from 'element-plus'
import Export from '@/components/Export/index.vue'
import SendNotifyExplanation from '@/views/explanation-support/components/sendNotifyExplanation.vue'
import DeleteNotifyExplanation from '@/views/explanation-support/components/deleteNotifyExplanation.vue'
import { downloadFileCustom } from '@/utils/files'
import http from '@/utils/request'
import { useConfig } from '@/config'

defineOptions({
  name: 'explanation-support',
})

const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()
const explanationSupportStore = useExplanationSupportStore()
const statisticalReportStore = useStatisticalReportStore()
const userStore = useUserStore()
const routeUser = useRouteUser()
const permissionStore = usePermissionStore()
const locale = computed(() => lang[appStore.lang])

const listLoading = ref(false)
const showDialogCreate = ref(false)
const showDialogSendNotify = ref(false)
const showDialogDeleteNotify = ref(false)
const showDialogConfirmExplanation = ref(false)
const showDialogNotConfirmExplanation = ref(false)
const loadingExport = ref(false)

const listTypeExplanation = ref([])
const listRoutes = ref([])
const listStations = ref([])
const listStatus = ref([])
const currentPage = ref(1)

const listStationsCreate = ref([])
const idExplanation = ref('')
const stationId = ref('')
const routeId = ref('')

const formSearchDefault = {
  explanationTypeIds: '',
  routerIds: '',
  stationIds: '',
  statusIds: '',
  createTime: [
    moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD'),
    moment().endOf('day').format('YYYY-MM-DD'),
  ],
  page: 1,
  size: 10,
}

const filter = reactive(cloneDeep(formSearchDefault))
const totalItem = ref(0)
const dataTable = ref([])
const maxHeight = computed(() => {
  const viewportHeight = window.innerHeight
  return viewportHeight - 270
})

const ruleFormRef = ref()
const rules = reactive({
  title: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
  content: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
  route_id: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  station_id: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  // type: [{required: true, message: t('configUser.validateMessage.required'), trigger: 'blur'}],
})
const ruleFormRefNotApprove = ref()
const rulesNotApprove = reactive({
  reason: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
})

const formCreateExplanation = ref({
  title: '',
  content: '',
  created_at: moment().format('DD/MM/YYYY HH:mm:ss'),
  route_id: '',
  station_id: '',
  explanation_type: 1,
  reconciliation_type: 'VEHICLE',
  transaction_ids: [20, 21, 22],
})
const objFindStationDefault = {
  keyword: '',
  page: 1,
  size: 1000,
  unitIds: [],
  routeIds: [],
  stationIds: [],
}
const formNotApprove = ref({
  explanation_id: '',
  status: '',
  reason: null,
})

const roleAction = ref(null)

const config = useConfig()
const urlDeleteUpload = ref(config.VITE_APP_UPLOAD_URL)
const urlUpload = ref(config.VITE_APP_UPLOAD_URL + '/upload')
const loadingComfirm = ref(false)

onMounted(() => {
  initData()
  roleAction.value = permissionStore.roleData
})

const initData = () => {
  getListRoute()
  handleGetListExplanation()
  handleGetListTypeExplanation()
  handleGetListStatusExplanation()
}

const getListRoute = async () => {
  await statisticalReportStore
    .getListRoute()
    .then(res => {
      if (res.status === 200) {
        const data = res.data.dataRows
        if (userStore.positionUnitId === null) {
          listRoutes.value = data
        } else {
          data.forEach(item => {
            if (routeUser.routes.includes(item.id)) {
              listRoutes.value.push(item)
            }
          })
        }
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const getListStation = async obj => {
  await statisticalReportStore
    .getListStationReport(obj)
    .then(res => {
      if (res.status === 200) {
        if (showDialogCreate.value) {
          listStationsCreate.value = res.data.dataRows
        } else {
          listStations.value = res.data.dataRows
        }
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const onChangeRouteSearch = value => {
  objFindStationDefault.routeIds = []
  objFindStationDefault.routeIds = objFindStationDefault.routeIds.concat(value)
  const listStationUser = routeUser.GET_STATIONS(value)
  objFindStationDefault.stationIds = []
  // objFindStationDefault.stationIds = objFindStationDefault.stationIds.concat(listStationUser)
  getListStation(objFindStationDefault)
}
const handleGetListExplanation = () => {
  listLoading.value = true

  filter.timeCreate = filter.timeCreate || [
    moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  ]

  const params = {
    type: filter.explanationTypeIds || '',
    page: filter.page,
    size: filter.size,
    from_time:
      filter.timeCreate && filter.timeCreate.length > 0
        ? moment(filter.timeCreate[0]).startOf('day').format('DD/MM/YYYY')
        : null,
    to_time:
      filter.timeCreate && filter.timeCreate.length > 0
        ? moment(filter.timeCreate[1]).endOf('day').format('DD/MM/YYYY')
        : null,
    status: filter.statusIds || '',
    route_id: filter.routerIds || '',
    station_id: filter.stationIds || '',
  }
  explanationSupportStore
    .apiGetListExplanation(params)
    .then(res => {
      if (res.status === 200) {
        dataTable.value = res.data.data
        totalItem.value = res.data.total
      }
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      listLoading.value = false
    })
}
const handleFindExplanation = () => {
  handleGetListExplanation()
}
const handleExport = () => {
  loadingExport.value = true
  filter.timeCreate = filter.timeCreate || [
    moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  ]

  const params = {
    type: filter.explanationTypeIds || '',
    page: filter.page,
    size: filter.size,
    from_time:
      filter.timeCreate && filter.timeCreate.length > 0
        ? moment(filter.timeCreate[0]).startOf('day').format('DD/MM/YYYY')
        : null,
    to_time:
      filter.timeCreate && filter.timeCreate.length > 0
        ? moment(filter.timeCreate[1]).endOf('day').format('DD/MM/YYYY')
        : null,
    status: filter.statusIds || '',
    route_id: filter.routerIds || '',
    station_id: filter.stationIds || '',
  }
  explanationSupportStore.apiExportExplanation(params).then(res => {
    if (res.status === 200) {
      const filePath = res.data
      const url = filePath.replace('/upload', '')
      downloadFileCustom(url, '')
      loadingExport.value = false
    }
  })
}
const handleSizeChange = size => {
  filter.size = size
  handleGetListExplanation()
}
const handlePageChange = page => {
  filter.page = page
  handleGetListExplanation()
}
const onChangeUpdatePage = page => {
  currentPage.value = page
}
const indexMethod = index => {
  return (currentPage.value - 1) * filter.size + index + 1
}
const handleCloseDialog = () => {
  showDialogCreate.value = false
  refresh()
}
const refresh = () => {
  formCreateExplanation.value.title = ''
  formCreateExplanation.value.content = ''
  formCreateExplanation.value.route_id = ''
  formCreateExplanation.value.station_id = ''
  formCreateExplanation.value.type = ''
  listStationsCreate.value = []
}
const handleOpenDialogExplanation = () => {
  showDialogCreate.value = true
}
const handleCreateExplanation = () => {
  ruleFormRef.value.validate(valid => {
    if (valid) {
      explanationSupportStore
        .apiCreateExplanation(formCreateExplanation.value)
        .then(res => {
          if (res.status === 200) {
            ElMessage({
              message: t('configUser.message.addSuccess'),
              type: 'success',
            })
            showDialogCreate.value = false
            handleGetListExplanation()
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  })
}
const handleExplanationReport = id => {
  router.push(`/explanation-support/create-report/${id}`)
}
const handleQuickExplanation = id => {
  router.push(`/explanation-support/create-quick/${id}`)
}
const handleUpdateQuickExplanation = id => {
  router.push(`/explanation-support/edit-explanation-quick/${id}`)
}
const handleEditNotify = obj => {
  router.push(`/explanation-support/detail/${obj.id}?type=editNotify`)
}
const handleShowConfirmExplanation = (id, status) => {
  formNotApprove.value.explanation_id = id
  formNotApprove.value.status = status
  showDialogConfirmExplanation.value = true
}
const handleShowNotConfirmExplanation = (id, status) => {
  formNotApprove.value.explanation_id = id
  formNotApprove.value.status = status
  formNotApprove.value.reason = null
  showDialogNotConfirmExplanation.value = true
}
const handleConfirmExplanation = () => {
  if (formNotApprove.value.status === 'FILE') {
    handleRemoveRowFile()
  } else {
    ruleFormRefNotApprove.value.validate(valid => {
      if (valid) {
        loadingComfirm.value = true
        explanationSupportStore.apiUpdateStatusExplanation(formNotApprove.value).then(res => {
          if (res.status === 200) {
            ElMessage({
              message: t('configUser.message.updateSuccess'),
              type: 'success',
            })
            handleGetListExplanation()
            loadingComfirm.value = false
            showDialogConfirmExplanation.value = false
          } else {
            loadingComfirm.value = false
          }
        })
      }
    })
  }
}
const handleNotConfirmExplanation = () => {
  ruleFormRefNotApprove.value.validate(valid => {
    if (valid) {
      explanationSupportStore.apiUpdateStatusExplanation(formNotApprove.value).then(res => {
        if (res.status === 200) {
          ElMessage({
            message: t('configUser.message.updateSuccess'),
            type: 'success',
          })
          handleGetListExplanation()
          showDialogNotConfirmExplanation.value = false
        }
      })
    }
  })
}
const handleSendNotify = row => {
  idExplanation.value = row.id
  routeId.value = row.route.id
  showDialogSendNotify.value = true
}
const handleCloseDialogSendNotify = () => {
  showDialogSendNotify.value = false
}
const handleShowDeleteNotify = value => {
  showDialogDeleteNotify.value = true
  idExplanation.value = value
}
const handleCloseDialogDelete = () => {
  showDialogDeleteNotify.value = false
}
const handleCloseDialogConfirmExplanation = () => {
  showDialogConfirmExplanation.value = false
  formNotApprove.value.reason = null
}
const handleCloseDialogNotConfirmExplanation = () => {
  showDialogNotConfirmExplanation.value = false
  formNotApprove.value.reason = null
}
const handleViewDetail = id => {
  router.push(`/explanation-support/detail/${id}`)
}
const handleExportDetail = async dataFile => {
  if (loadingExport.value) return
  let objFile
  dataFile.forEach(item => {
    if (item.file_name.endsWith('pdf')) {
      objFile = item
    }
  })
  loadingExport.value = true
  console.log('handleExport: ', objFile)
  try {
    if (objFile) {
      const url = objFile.file_path.replace('/upload', '')
      await downloadFileCustom(url, objFile.file_name)
    }
    loadingExport.value = false
  } catch (error) {
    console.log('handleExport ~ error:', error)
    loadingExport.value = false
  }
}
const handleExportCustom = dataFile => {
  let objFile
  dataFile.forEach(item => {
    if (item.file_name.endsWith('xlsx')) {
      objFile = item
    }
  })
  const url = urlUpload.value + objFile.file_path.replace('/upload', '')
  fetch(url)
    .then(res => res.blob())
    .then(blob => {
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.href = url
      link.download = objFile.file_name || url.split('/').pop()
      link.click()
      URL.revokeObjectURL(url) // Giải phóng bộ nhớ
    })
    .catch(err => {
      console.log('Có lỗi xảy ra khi tải file:', err)
    })
}
const requestDeleteFile = data => {
  return http.request({
    url: urlDeleteUpload.value + `/${data}`,
    method: 'delete',
  })
}
const dataFile = ref([])
const handleShowRemoveRowFile = listFile => {
  showDialogConfirmExplanation.value = true
  formNotApprove.value.status = 'FILE'
  dataFile.value = []
  dataFile.value = listFile
  // formNotApprove.value.explanation_id = id
}
const handleRemoveRowFile = () => {
  dataFile.value.forEach(item => {
    requestDeleteFile(item.id)
      .then(response => {
        if (response.status === 200) {
          handleGetListExplanation()
          showDialogConfirmExplanation.value = false
          formNotApprove.value.status = ''
          formNotApprove.value.explanation_id = ''
          loadingComfirm.value = false
        } else {
          loadingComfirm.value = false
        }
      })
      .catch(err => {
        console.log(err)
      })
  })
}
const statusName = status => {
  let statusMessage = ''
  switch (status) {
    case 'Chờ giải trình':
      statusMessage = t('explanationSupport.waitingForExplanation')
      break
    case 'Đã giải trình':
      statusMessage = t('explanationSupport.Explained')
      break
    case 'Bị từ chối':
      statusMessage = t('explanationSupport.Rejected')
      break
    case 'Đã duyệt':
      statusMessage = t('explanationSupport.Approved')
      break
    case 'Đã xác nhận':
      statusMessage = t('explanationSupport.Confirmed')
      break
    case 'Mới tạo':
      statusMessage = t('explanationSupport.newCreate')
      break
    default:
      statusMessage = t('explanationSupport.notConfirmed')
  }
  return statusMessage
}
const getClassStatus = status => {
  let className = ''
  switch (status) {
    case 'Chờ giải trình':
      className = 'bg-outline-warning text--warning status-class'
      break
    case 'Đã giải trình':
      className = 'bg-outline-info text--info status-class'
      break
    case 'Bị từ chối':
      className = 'bg-outline-danger text--danger status-class'
      break
    case 'Đã duyệt':
      className = 'bg-outline-success text--success status-class'
      break
    case 'Đã xác nhận':
      className = 'bg-outline-dark-purple text--dark-purple status-class'
      break
    case 'Mới tạo':
      className = 'bg-outline-light-blue text--light-blue status-class'
      break
    default:
      className = 'bg-outline-secondary text--secondary status-class'
  }
  return className
}
const onChangeRouteCreate = value => {
  console.log('onChangeRouteCreate: ', value)
  const listStationUser = routeUser.GET_STATIONS(value)
  objFindStationDefault.routeIds = []
  objFindStationDefault.routeIds = objFindStationDefault.routeIds.concat(value)
  objFindStationDefault.stationIds = []
  objFindStationDefault.stationIds = objFindStationDefault.stationIds.concat(listStationUser)
  getListStation(objFindStationDefault)
}
const handleGetListTypeExplanation = () => {
  explanationSupportStore
    .apiGetListTypeExplanation()
    .then(res => {
      if (res.status === 200) {
        listTypeExplanation.value = res.data
        listTypeExplanation.value.unshift({
          name: 'Tất cả',
          id: '',
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const handleGetListStatusExplanation = () => {
  explanationSupportStore
    .apiGetListStatusExplanation()
    .then(res => {
      if (res.status === 200) {
        listStatus.value = res.data
        listStatus.value.unshift({
          name: 'Tất cả',
          id: '',
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const customRowClass = ({ row }) => {
  let className = 'cursor-pointer'
  if (row.statusView === 0) {
    className += 'not-viewed'
  }
  return className
}
</script>

<template>
  <div class="paddingX-24 paddingY-14">
    <div class="form-search flex flex-wrap gap-px-8">
      <el-select
        v-model="filter.explanationTypeIds"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
        filterable
        collapse-tags
        clearable
        :placeholder="t('explanationSupport.typeExplanation')"
      >
        <el-option
          v-for="item in listTypeExplanation"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="filter.routerIds"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
        filterable
        collapse-tags
        clearable
        @change="onChangeRouteSearch"
        :placeholder="t('configUser.userManagement.route')"
      >
        <el-option
          v-for="item in listRoutes"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="filter.stationIds"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
        filterable
        collapse-tags
        clearable
        :placeholder="t('configUser.station')"
        name="station"
      >
        <el-option
          v-for="item in listStations"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="filter.statusIds"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
        filterable
        collapse-tags
        clearable
        :placeholder="t('configUser.status')"
        name="station"
      >
        <el-option
          v-for="item in listStatus"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-config-provider :locale="locale">
        <el-date-picker
          v-model="filter.timeCreate"
          type="daterange"
          :start-placeholder="t('el.datepicker.startTime')"
          :range-separator="t('el.datepicker.to')"
          :end-placeholder="t('el.datepicker.endTime')"
          clearable
          value-format="YYYY-MM-DD"
          format="DD/MM/YYYY"
          class="w-full md:max-w-[30%] lg:max-w-[300px]"
          name="timeCreate"
        />
      </el-config-provider>
      <el-button
        style="background-color: #059efb; border: none"
        class="border-1 paddingX-20"
        @click="handleFindExplanation"
        type="primary"
        >{{ $t('configUser.search') }}
      </el-button>
    </div>
    <div class="form-export">
      <Export
        v-loading="loadingExport"
        :file-name="t('explanationSupport.dataList') + 'HTGT'"
        class="p-0"
        @export="handleExport"
      />
    </div>
    <div class="form-table">
      <div class="padding-12 bg-white">
        <el-config-provider :locale="locale">
          <el-table
            v-loading="listLoading"
            :data="dataTable"
            fit
            highlight-current-row
            style="width: 100%"
            class="cell-main-3"
            :max-height="maxHeight"
          >
            <el-table-column
              type="index"
              :index="indexMethod"
              width="50"
              label="STT"
            />
            <el-table-column :label="$t('explanationSupport.typeExplanation')">
              <template #default="{ row }">
                <span
                  class="pointer"
                  @click="handleViewDetail(row.id)"
                  >{{ row.type }}</span
                >
              </template>
            </el-table-column>
            <el-table-column :label="$t('configUser.userManagement.route')">
              <template #default="{ row }">
                <span
                  class="pointer"
                  @click="handleViewDetail(row.id)"
                  >{{ row.route.name }}</span
                >
              </template>
            </el-table-column>

            <el-table-column :label="$t('administration.category.report.station')">
              <template #default="{ row }">
                <span
                  class="pointer"
                  @click="handleViewDetail(row.id)"
                  >{{ row.station.name }}</span
                >
              </template>
            </el-table-column>
            <el-table-column :label="$t('explanationSupport.explanationName')">
              <template #default="{ row }">
                <span
                  class="pointer"
                  @click="handleViewDetail(row.id)"
                  >{{ row.title }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('configUser.status')"
              width="180px"
            >
              <template #default="{ row }">
                <span
                  class="pointer"
                  @click="handleViewDetail(row.id)"
                  :class="getClassStatus(row.status)"
                >
                  {{ statusName(row.status) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('administration.category.administrativeDepartment.action')"
              width="250px"
            >
              <template #default="{ row }">
                <div
                  class="flex items-center flex-wrap gap-1"
                  v-if="
                    ((row.status === 'Đã duyệt' && userStore.positionUnitId === '4') ||
                      (row.status === 'Đã xác nhận' && userStore.positionUnitId === '1')) &&
                    roleAction.canConfirm === 1
                  "
                >
                  <el-button
                    style="border: none"
                    class="border-1 paddingX-10 text-white bg--dark-purple"
                    @click="handleShowConfirmExplanation(row.id, 'CONFIRMED')"
                    >{{ $t('explanationSupport.confirmExplanation') }}
                  </el-button>
                  <el-button
                    style="border: none; margin-left: 0 !important"
                    class="border-1 paddingX-10 text-white bg--secondary"
                    @click="handleShowNotConfirmExplanation(row.id, 'UNCONFIRMED')"
                    >{{ $t('explanationSupport.notConfirmed') }}
                  </el-button>
                </div>
                <div
                  class="flex items-center flex-wrap gap-1"
                  style="z-index: 9999"
                  v-if="
                    (row.status === 'Chờ giải trình' ||
                      row.status === 'Bị từ chối' ||
                      row.status === 'Đã giải trình' ||
                      (row.is_first_unconfirmed === 1 && row.status === 'Không được xác nhận')) &&
                    roleAction.canExplain === 1
                  "
                >
                  <el-button
                    v-if="!row.quick_explanation"
                    type="info"
                    style="border: none"
                    class="border-1 paddingX-10 text-white bg--purple"
                    @click="handleQuickExplanation(row.id)"
                    >{{ $t('explanationSupport.quickExplanation') }}
                  </el-button>
                  <el-button
                    v-if="row.quick_explanation"
                    type="info"
                    style="border: none; margin-left: 0 !important"
                    class="border-1 paddingX-10 text-white bg--info"
                    @click="handleUpdateQuickExplanation(row.id)"
                    >{{ $t('explanationSupport.editExplanation') }}
                  </el-button>
                  <el-button
                    v-if="!row.file_report"
                    type="info"
                    style="border: none; margin-left: 0 !important"
                    class="border-1 paddingX-10 text-white bg--dark-blue"
                    @click="handleExplanationReport(row.id)"
                    >{{ $t('explanationSupport.explanationReport') }}
                  </el-button>
                </div>
                <div class="flex items-center flex-wrap gap-1">
                  <el-button
                    v-if="roleAction.canNotify === 1 && row.status === 'Mới tạo'"
                    style="border: none"
                    class="border-1 paddingX-10 text-white bg--info"
                    @click="handleEditNotify(row)"
                    >{{ $t('explanationSupport.editNotify') }}
                  </el-button>
                  <el-button
                    v-if="roleAction.canNotify === 1 && row.status === 'Mới tạo'"
                    style="border: none; margin-left: 0 !important"
                    class="border-1 paddingX-10 text-white bg--warning"
                    @click="handleSendNotify(row)"
                    >{{ $t('explanationSupport.sendNotify') }}
                  </el-button>
                  <el-button
                    v-if="
                      roleAction.canNotify === 1 &&
                      (row.status === 'Mới tạo' || row.status === 'Chờ giải trình')
                    "
                    style="border: none; margin-left: 0 !important"
                    class="border-1 paddingX-10 text-white bg--danger"
                    @click="handleShowDeleteNotify(row.id)"
                    >{{ $t('explanationSupport.deleteNotify') }}
                  </el-button>
                </div>
                <div
                  class="flex items-center flex-wrap gap-1 mt-1"
                  v-if="row.status === 'Đã giải trình' && roleAction.canApprove === 1"
                >
                  <el-button
                    type="info"
                    style="border: none; margin-left: 0 !important"
                    class="border-1 paddingX-10 text-white bg--success"
                    @click="handleShowConfirmExplanation(row.id, 'APPROVED')"
                    >{{ $t('explanationSupport.Approve') }}
                  </el-button>
                  <el-button
                    type="info"
                    style="border: none; margin-left: 0 !important"
                    class="border-1 paddingX-10 text-white bg--danger"
                    @click="handleShowNotConfirmExplanation(row.id, 'REJECTED')"
                    >{{ $t('explanationSupport.Reject') }}
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('explanationSupport.explanationReport')">
              <template #default="{ row }">
                <div
                  class="flex items-center flex-wrap gap-1"
                  style="z-index: 9999"
                  v-if="row.file_report"
                >
                  <svg-icon icon-class="eye"
                            v-if="row.file_report"
                            class="width-18 height-18 mr-2 pointer"
                            @click="handleExportDetail(row.file_report)"
                  />
                  <svg-icon
                    icon-class="export-file"
                    v-loading="loadingExport"
                    v-if="roleAction.canExport === 1 && row.file_report"
                    class="width-18 height-18 text--info mr-2 pointer"
                    @click="handleExportCustom(row.file_report)"
                  />
                  <svg-icon
                    icon-class="remove-administrative"
                    v-if="
                      userStore.positionUnitId === '1' &&
                      (row.status === 'Đã giải trình' ||
                        row.status === 'Bị từ chối' ||
                        (row.status === 'Không được xác nhận' && row.is_first_unconfirmed === 1))
                    "
                    class="width-18 height-18 pointer"
                    @click="handleShowRemoveRowFile(row.file_report)"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="overflow-x-auto">
            <Pagination
              class="margin-top-12"
              v-model:page.sync="filter.page"
              v-model:size.sync="filter.size"
              :total="totalItem"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
              @update:page="onChangeUpdatePage"
            />
          </div>
        </el-config-provider>
      </div>
    </div>
    <Dialog
      :show="showDialogCreate"
      :appendToBody="true"
      width="750"
      :title="$t('monitoring.toll.explanationNotice')"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <el-form
          :model="formCreateExplanation"
          :rules="rules"
          ref="ruleFormRef"
          label-position="top"
          class="form-custom"
        >
          <el-row :gutter="16">
            <el-col :span="24">
              <el-form-item
                :label="$t('monitoring.toll.nameExplanationNotice')"
                prop="title"
                required
              >
                <el-input
                  :placeholder="t('configUser.pleaseEnter')"
                  type="text"
                  v-model="formCreateExplanation.title"
                  maxlength="300"
                />
              </el-form-item>
            </el-col>
            <!--            <el-col :span="24">-->
            <!--              <el-form-item-->
            <!--                :label="$t('explanationSupport.typeExplanation')"-->
            <!--                prop="type"-->
            <!--                required-->
            <!--              >-->
            <!--                <el-select-->
            <!--                  v-model="formCreateExplanation.type"-->
            <!--                  class="w-full short"-->
            <!--                  filterable-->
            <!--                  collapse-tags-->
            <!--                  :placeholder="t('configUser.pleaseEnter')"-->
            <!--                >-->
            <!--                  <el-option-->
            <!--                    v-for="item in listTypeExplanation"-->
            <!--                    :key="item.id"-->
            <!--                    :label="item.name"-->
            <!--                    :value="item.id"-->
            <!--                  />-->
            <!--                </el-select>-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
            <el-col :span="24">
              <el-form-item
                :label="$t('monitoring.toll.contentExplanationNotice')"
                prop="content"
                required
              >
                <el-input
                  :placeholder="t('configUser.pleaseEnter')"
                  type="textarea"
                  v-model="formCreateExplanation.content"
                  show-word-limit
                  maxlength="3000"
                  rows="4"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                :label="$t('configUser.time')"
                required
              >
                <el-config-provider :locale="locale">
                  <el-date-picker
                    style="width: 100%"
                    v-model="formCreateExplanation.created_at"
                    disabled
                    :placeholder="t('configUser.pleaseEnter')"
                    type="datetime"
                    clearable
                    value-format="DD/MM/YYYY HH:mm:ss"
                    format="DD/MM/YYYY HH:mm:ss"
                    name="timeCreate"
                  />
                </el-config-provider>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('configUser.userManagement.route')"
                prop="route_id"
                required
              >
                <el-select
                  v-model="formCreateExplanation.route_id"
                  class="w-full short"
                  filterable
                  collapse-tags
                  :placeholder="t('configUser.pleaseEnter')"
                  @change="onChangeRouteCreate"
                >
                  <el-option
                    v-for="item in listRoutes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="$t('administration.category.report.station')"
                prop="station_id"
                required
              >
                <el-select
                  v-model="formCreateExplanation.station_id"
                  class="w-full short"
                  filterable
                  collapse-tags
                  :placeholder="t('configUser.pleaseEnter')"
                >
                  <el-option
                    v-for="item in listStationsCreate"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="foot flex justify-end">
            <el-button
              style="background-color: #fff; border-color: #7c7e81; color: #7c7e81"
              class="border-1 paddingX-10"
              @click="handleCloseDialog"
              type="info"
              >{{ $t('configUser.cancel') }}
            </el-button>
            <el-button
              style="background-color: #059efb; border: none"
              class="border-1 paddingX-30"
              @click="handleCreateExplanation"
              type="success"
              >{{ $t('omsSetting.confirm') }}
            </el-button>
          </div>
        </el-form>
      </template>
    </Dialog>
    <Dialog
      :show="showDialogSendNotify"
      :appendToBody="true"
      :width="'720'"
      :title="t('explanationSupport.sendNotify')"
      @closeDialog="handleCloseDialogSendNotify"
    >
      <template v-slot:content>
        <SendNotifyExplanation
          :explanation-id="idExplanation"
          :station-id="stationId"
          :route-id="routeId"
          @close-send-notify="handleCloseDialogSendNotify"
          @load-data="handleGetListExplanation"
        />
      </template>
    </Dialog>
    <Dialog
      :show="showDialogDeleteNotify"
      :appendToBody="true"
      width="500"
      :title="$t('explanationSupport.deleteNotify')"
      @closeDialog="handleCloseDialogDelete"
    >
      <template v-slot:content>
        <DeleteNotifyExplanation
          :explanation-id="idExplanation"
          @close-delete-notify="handleCloseDialogDelete"
          @load-data="handleGetListExplanation"
        />
      </template>
    </Dialog>
    <Dialog
      :show="showDialogConfirmExplanation"
      :appendToBody="true"
      width="500"
      :title="$t('omsSetting.confirm')"
      @closeDialog="handleCloseDialogConfirmExplanation"
    >
      <template v-slot:content>
        <div class="bg-white">
          <div class="content mb-3">
            <!--            <span>-->
            <!--              {{-->
            <!--                formNotApprove.status === 'CONFIRMED'-->
            <!--                  ? $t('explanationSupport.confirmDialogExplanation')-->
            <!--                  : formNotApprove.status === 'APPROVED'-->
            <!--                    ? $t('explanationSupport.approveExplanation')-->
            <!--                    : $t('explanationSupport.confirmDialogFile')-->
            <!--              }}-->
            <!--            </span>-->
            <el-form
              :model="formNotApprove"
              :rules="rulesNotApprove"
              ref="ruleFormRefNotApprove"
              label-position="top"
              class="form-custom"
            >
              <el-row :gutter="16" v-if="formNotApprove.status !== 'FILE'">
                <el-col :span="24">
                  <el-form-item
                    :label="
                      formNotApprove.status === 'APPROVED'
                        ? $t('explanationSupport.opinion')
                        : $t('explanationSupport.opinion')
                    "
                    prop="reason"
                    required
                  >
                    <el-input
                      :placeholder="t('configUser.pleaseEnter')"
                      type="textarea"
                      v-model="formNotApprove.reason"
                      show-word-limit
                      maxlength="3000"
                      rows="4"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="form-accept" v-else>
                <div class="content mb-3">{{ $t('administration.ip.confirmDeleteFile') }}</div>
              </div>
              <hr class="margin-bottom-12" />
              <div class="foot flex justify-end">
                <el-button
                  style="background-color: #fff; border-color: #7c7e81; color: #7c7e81"
                  class="border-1 paddingX-10"
                  @click="handleCloseDialogConfirmExplanation"
                  type="info"
                  >{{ $t('configUser.cancel') }}
                </el-button>
                <el-button
                  :loading="loadingComfirm"
                  style="background-color: #059efb; border: none"
                  class="border-1 paddingX-30"
                  @click="handleConfirmExplanation"
                  type="success"
                  >{{ $t('omsSetting.confirm') }}
                </el-button>
              </div>
            </el-form>
          </div>
          <!--          <hr class="margin-bottom-24"/>-->
          <!--          <div-->
          <!--            class="action"-->
          <!--          >-->
          <!--            <div class="flex justify-end">-->
          <!--              <el-button-->
          <!--                type="info"-->
          <!--                @click="handleCloseDialogConfirmExplanation"-->
          <!--                class="bg&#45;&#45;secondary"-->
          <!--              >{{ $t('configUser.cancel')}}</el-button-->
          <!--              >-->
          <!--              <el-button-->
          <!--                @click="handleConfirmExplanation"-->
          <!--                type="primary"-->
          <!--                class="bg&#45;&#45;dark-purple"-->
          <!--                style="border: transparent"-->
          <!--              >{{ $t('omsSetting.confirm')}}-->
          <!--              </el-button>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </template>
    </Dialog>
    <Dialog
      :show="showDialogNotConfirmExplanation"
      :appendToBody="true"
      width="500"
      :title="$t('omsSetting.confirm')"
      @closeDialog="handleCloseDialogNotConfirmExplanation"
    >
      <template v-slot:content>
        <div class="bg-white">
          <div class="content mb-3">
            <el-form
              :model="formNotApprove"
              :rules="rulesNotApprove"
              ref="ruleFormRefNotApprove"
              label-position="top"
              class="form-custom"
            >
              <el-row :gutter="16">
                <el-col :span="24">
                  <el-form-item
                    :label="
                      formNotApprove.status === 'UNCONFIRMED'
                        ? $t('explanationSupport.reasonNotConfirm')
                        : $t('explanationSupport.reasonReject')
                    "
                    prop="reason"
                    required
                  >
                    <el-input
                      :placeholder="t('configUser.pleaseEnter')"
                      type="textarea"
                      v-model="formNotApprove.reason"
                      show-word-limit
                      maxlength="3000"
                      rows="4"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="foot flex justify-end">
                <el-button
                  style="background-color: #fff; border-color: #7c7e81; color: #7c7e81"
                  class="border-1 paddingX-10"
                  @click="handleCloseDialogNotConfirmExplanation"
                  type="info"
                  >{{ $t('configUser.cancel') }}
                </el-button>
                <el-button
                  style="background-color: #059efb; border: none"
                  class="border-1 paddingX-30"
                  @click="handleNotConfirmExplanation"
                  type="success"
                  >{{ $t('omsSetting.confirm') }}
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.status-class {
  //color: #FD8312;
  //border: 1px solid #FD8312;
  //background-color: #FFE7D1;
  padding: 2px 8px;
}
</style>
