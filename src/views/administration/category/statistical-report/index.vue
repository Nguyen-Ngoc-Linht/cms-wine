<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import moment from 'moment'
import { cloneDeep } from 'lodash-unified'
import { useRouter } from 'vue-router'

import { useI18n } from '@/locale'
import lang from '@/locale/getMessage'
import {
  useAppStore,
  useStatisticalReportStore,
  useUserStore,
  useRouteUser,
  usePermissionStore,
} from '@/store'
import Dialog from '@/components/Dialog/index.vue'
import ImportExcel from '@/components/ImportExcel/index.vue'
import Pagination from '@/components/Pagination'
import { ElMessage } from 'element-plus'
import { FILE_CATEGORY, downloadFileCustom, requestDeleteFile } from '@/utils/files'

const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()
const statisticalReportStore = useStatisticalReportStore()
const userStore = useUserStore()
const routeUser = useRouteUser()
const permissionStore = usePermissionStore()
const locale = computed(() => lang[appStore.lang])

defineOptions({
  name: 'category-statistical-report',
})

const listLoading = ref(false)
const showDialog = ref(false)
const showDialogDelete = ref(false)

const ruleFormRef = ref()
const rules = reactive({
  name: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
  'station.id': [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  'route.id': [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
})

const formSearch = {
  keyWord: '',
  routeIds: [],
  stationIds: [],
  timeCreate: [
    moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD'),
    moment().endOf('day').format('YYYY-MM-DD'),
  ],
  page: 1,
  size: 10,
}

const filter = reactive(cloneDeep(formSearch))

const formImport = ref({
  name: '',
  station: {
    id: '',
  },
  route: {
    id: '',
  },
  pathFile: '',
  fileVaults: [],
})

const formEditReport = reactive(cloneDeep(formImport))

const objFindStationDefault = {
  keyword: '',
  page: 1,
  size: 1000,
  unitIds: [],
  routeIds: [],
}

const objStationCreate = reactive(cloneDeep(objFindStationDefault))
const listLineKey = ref(1)

const dataTable = ref([])
const totalItem = ref(0)

const maxHeight = computed(() => {
  const viewportHeight = window.innerHeight
  return viewportHeight - 270
})

const listRoute = ref([])
const listStation = ref([])
const listStationSearch = ref([])
const typeAction = ref('')
const idReport = ref('')
const loadingExport = ref(false)
const fileVaultsDetail = ref([])
const currentPage = ref(1)
const roleAction = ref(null)

onMounted(() => {
  initData()
  roleAction.value = permissionStore.roleData
})

const initData = () => {
  getListDataReport()
  getListRoute()
}

const getListRoute = async () => {
  await statisticalReportStore
    .getListRoute()
    .then(res => {
      if (res.status === 200) {
        const data = res.data.dataRows
        if (userStore.positionUnitId === null) {
          listRoute.value = data
        } else {
          data.forEach(item => {
            if (routeUser.routes.includes(item.id)) {
              listRoute.value.push(item)
            }
          })
        }
        formImport.value.route.id = listRoute.value.length > 0 ? listRoute.value[0].id : ''
        objFindStationDefault.routeIds = []
        objFindStationDefault.routeIds.push(listRoute.value[0].id)
        getListStation(objFindStationDefault)
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
        listStation.value = res.data.dataRows
        if (typeAction.value !== 'update') {
          formImport.value.station.id = listStation.value.length > 0 ? listStation.value[0].id : ''
        }
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const getListStationSearch = async obj => {
  await statisticalReportStore
    .getListStationReport(obj)
    .then(res => {
      if (res.status === 200) {
        listStationSearch.value = res.data.dataRows
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const onChangeRoute = event => {
  console.log('onChangeRoute: ', event)
  objStationCreate.routeIds = []
  objStationCreate.routeIds.push(event)
  const listStationUser = routeUser.GET_STATIONS(event)
  objStationCreate.stationIds = []
  objStationCreate.stationIds = objStationCreate.stationIds.concat(listStationUser)
  getListStation(objStationCreate)
}

const getListDataReport = async () => {
  listLoading.value = true

  filter.timeCreate = filter.timeCreate || [
    moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  ]

  const params = {
    keyWord: filter.keyWord.trim(),
    page: filter.page,
    size: filter.size,
    startTime:
      filter.timeCreate && filter.timeCreate.length > 0
        ? moment(filter.timeCreate[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        : null,
    endTime:
      filter.timeCreate && filter.timeCreate.length > 0
        ? moment(filter.timeCreate[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
        : null,
    routeIds: filter.routeIds,
    stationIds: filter.stationIds,
  }

  await statisticalReportStore
    .apiGetListReport(params)
    .then(res => {
      if (res.status === 200) {
        dataTable.value = res.data.dataRows
        totalItem.value = res.data.totalCount
      }
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      listLoading.value = false
    })
}

const handleShowDialog = () => {
  showDialog.value = true
  typeAction.value = 'create'
  console.log(showDialog.value)
}

const handleCloseDialog = () => {
  refresh()
}
const handleCloseDialogDelete = () => {
  showDialogDelete.value = false
}
const handleDeleteReport = () => {
  statisticalReportStore
    .apiRemoveReport(idReport.value)
    .then(res => {
      if (res.status === 200) {
        ElMessage({
          message: 'Xóa báo cáo thành công',
          type: 'success',
        })
        getListDataReport()
        showDialogDelete.value = false
      } else {
        ElMessage({
          message: res.message,
          type: 'error',
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const refresh = () => {
  console.log('refresh')
  getListRoute()
  showDialog.value = false
  formImport.value.name = ''
  formImport.value.pathFile = ''
  fileVaultsDetail.value = []
  formImport.value.fileVaults = []
  typeAction.value = ''
}

// const tableRowClassName = ({ row }) => {
//   if (row.violationLevel > 2) {
//     return 'penalize-row pointer'
//   } else if (row.violationLevel === 2) {
//     return 'warning-row pointer'
//   } else {
//     return 'pointer'
//   }
// }
const handleDeleteRow = id => {
  showDialogDelete.value = true
  idReport.value = id
}
const handleEditRow = data => {
  statisticalReportStore
    .apiGetDetailReport(data.id)
    .then(res => {
      if (res.status === 200) {
        console.log('handleEditRow: ', res.data)
        const objDetail = res.data
        typeAction.value = 'update'
        formImport.value.name = objDetail.name
        formImport.value.pathFile =
          objDetail.fileVaults.length > 0 ? objDetail.fileVaults[0].filePath : ''
        formImport.value.route.id = objDetail.route.id
        formImport.value.fileVaults = objDetail.fileVaults
        fileVaultsDetail.value = objDetail.fileVaults
        formImport.value.station.id = objDetail.station.id
        idReport.value = objDetail.id
        objFindStationDefault.routeIds = []
        objFindStationDefault.routeIds.push(formImport.value.route.id)
        getListStation(objFindStationDefault)
        showDialog.value = true
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const handleSuccessFile = data => {
  console.log('handleSuccessFile: ', data)
  formImport.value.pathFile = data[0].filePath
  formImport.value.fileVaults = []
  formImport.value.fileVaults.push(data[0])
}
const idFileDelete = ref(null)
const handleRemoveFile = data => {
  console.log('handleRemoveFile: ', data)
  idFileDelete.value = data
  formImport.value.pathFile = ''
  formImport.value.fileVaults = []
  fileVaultsDetail.value = []
}
const handleImportReport = () => {
  console.log('handleAddAdministrative: ', ruleFormRef.value.validate())
  ruleFormRef.value.validate(valid => {
    console.log(valid)
    if (valid) {
      if (typeAction.value === 'create') {
        createReport(formImport.value)
      } else {
        updateReport(formImport.value, idReport.value)
      }
    }
  })
  // showDialog.value = false
}

const createReport = obj => {
  statisticalReportStore
    .apiImportReport(obj)
    .then(res => {
      if (res.status === 200) {
        getListDataReport()
        if (idFileDelete.value) {
          handleDeleteFileSave()
        }
        showDialog.value = false
      } else {
        ElMessage({
          message: res.message,
          type: 'error',
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const updateReport = (obj, id) => {
  statisticalReportStore
    .apiEditReport(obj, id)
    .then(res => {
      if (res.status === 200) {
        getListDataReport()
        if (idFileDelete.value) {
          handleDeleteFileSave()
        }
        showDialog.value = false
      } else {
        ElMessage({
          message: res.message,
          type: 'error',
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const handleFindReport = () => {
  getListDataReport()
}

const onChangeRouteSearch = event => {
  console.log('onChangeRouteSearch: ', event)
  objFindStationDefault.routeIds = []
  objFindStationDefault.routeIds = objFindStationDefault.routeIds.concat(event)
  const listStationUser = routeUser.GET_STATIONS(event)
  objFindStationDefault.stationIds = []
  // objFindStationDefault.stationIds = objFindStationDefault.stationIds.concat(listStationUser)
  if (event.length > 0) {
    getListStationSearch(objFindStationDefault)
  } else {
    listStationSearch.value = []
  }
}
const handleSizeChange = size => {
  filter.size = size
  getListDataReport()
}
const handlePageChange = page => {
  filter.page = page
  getListDataReport()
}
const handleExport = async data => {
  if (loadingExport.value) return
  loadingExport.value = true
  console.log('handleExport: ', data[0])
  const url = data[0].filePath.replace('/upload', '')
  try {
    if (data) {
      await downloadFileCustom(url, data[0].fileName)
    }
    loadingExport.value = false
  } catch (error) {
    console.log('handleExport ~ error:', error)
    loadingExport.value = false
  }
}
const indexMethod = index => {
  return (currentPage.value - 1) * filter.size + index + 1
}
const onChangeUpdatePage = page => {
  currentPage.value = page
}
const formatTime = time => {
  return moment(time).format('DD/MM/YYYY')
}
const handleDeleteFileSave = async () => {
  await requestDeleteFile(idFileDelete.value.idFile)
    .then(response => {
      if (response.status === 200) {
        idFileDelete.value = null
        console.log('response: ', response)
      }
    })
    .catch(err => {
      console.log(err)
    })
}
</script>

<template>
  <div class="paddingX-24 paddingY-14">
    <div class="form-search flex flex-wrap gap-px-8 mb-4">
      <el-input
        :placeholder="t('el.transfer.filterPlaceholder')"
        type="text"
        v-model="filter.keyWord"
        name="keyWord"
        class="w-full md:max-w-[30%] lg:max-w-[200px]"
      />
      <el-select
        v-model="filter.routeIds"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
        filterable
        multiple
        collapse-tags
        clearable
        @change="onChangeRouteSearch"
        :placeholder="t('configUser.userManagement.route')"
      >
        <el-option
          v-for="item in listRoute"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="filter.stationIds"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
        filterable
        multiple
        collapse-tags
        clearable
        :placeholder="t('configUser.station')"
        name="station"
      >
        <el-option
          v-for="item in listStationSearch"
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
        @click="handleFindReport"
        type="primary"
        >{{ $t('configUser.search') }}
      </el-button>
    </div>
    <div
      class="header-btn flex items-center"
      v-if="roleAction?.canCreate"
    >
      <svg-icon
        icon-class="import-file"
        class="mr-2"
      />
      <button
        class="btn text-[#525B73] ml-1"
        @click="handleShowDialog()"
      >
        {{ $t('administration.category.report.importReport') }}
      </button>
    </div>
    <div class="form-table mt-4">
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
            <el-table-column
              :label="$t('administration.category.report.line')"
              width="300px"
            >
              <template #default="{ row }">
                <span>{{ row.route.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('administration.category.report.station')"
              width="250px"
            >
              <template #default="{ row }">
                <span>{{ row.station.name }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('administration.category.report.reportName')"
              width="250px"
            >
              <template #default="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('administration.category.report.timeCreate')"
              width="250px"
            >
              <template #default="{ row }">
                <span>{{ formatTime(row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('administration.category.administrativeDepartment.action')"
              width="300px"
            >
              <template #default="{ row }">
                <div class="flex items-center flex-wrap gap-1">
                  <svg-icon
                    icon-class="edit-administrative"
                    class="mr-2 width-24 height-24 pointer"
                    @click="handleEditRow(row)"
                  />
                  <svg-icon
                    icon-class="export-file"
                    class="width-24 height-24 pointer mr-2"
                    @click="handleExport(row.fileVaults)"
                  />
                  <svg-icon
                    icon-class="remove-administrative"
                    class="width-24 height-24 pointer"
                    @click="handleDeleteRow(row.id)"
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
      :show="showDialog"
      :appendToBody="true"
      :width="1000"
      :title="$t('administration.category.report.importReport')"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <el-form
          :model="formImport"
          :rules="rules"
          ref="ruleFormRef"
          label-position="top"
          class="form-custom"
        >
          <el-row :gutter="16">
            <el-col
              :span="12"
              class="border-custom"
            >
              <el-row :gutter="8">
                <el-col :span="24">
                  <el-form-item
                    :label="$t('administration.category.report.reportName')"
                    prop="name"
                    required
                  >
                    <el-input
                      :placeholder="t('configUser.pleaseEnter')"
                      type="text"
                      v-model="formImport.name"
                      maxlength="250"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    :label="$t('configUser.userManagement.route')"
                    prop="route.id"
                    required
                  >
                    <el-select
                      v-model="formImport.route.id"
                      class="w-full short height-32"
                      filterable
                      collapse-tags
                      :placeholder="t('configUser.userManagement.route')"
                      @change="onChangeRoute"
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
                <el-col :span="24">
                  <el-form-item
                    :label="$t('configUser.station')"
                    prop="station.id"
                    required
                  >
                    <el-select
                      v-model="formImport.station.id"
                      class="w-full short height-32"
                      filterable
                      collapse-tags
                      :placeholder="t('configUser.station')"
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
            </el-col>
            <el-col
              :span="12"
              class="pl-3"
            >
              <p class="fs-20 text--primary font-[500] mb-2">
                {{ $t('administration.category.report.fileReport') }}
              </p>
              <ImportExcel
                :file-category="FILE_CATEGORY.VECM_REPORT"
                :keep-file-name="true"
                :files="fileVaultsDetail"
                limit="1"
                main-entity-name="report"
                file-content="Định dạng .xlsx có kích thước nhỏ hơn 5 MB."
                file-type=".xlsx"
                @upload-success="handleSuccessFile"
                @remove-success="handleRemoveFile"
              />
            </el-col>
          </el-row>
          <div class="foot flex justify-end">
            <el-button
              style="background-color: #fff; border-color: #7c7e81; color: #7c7e81"
              class="border-1 paddingX-10"
              @click="handleCloseDialog"
              type="info"
              >{{ $t('configUser.cancel') }}</el-button
            >
            <el-button
              style="background-color: #059efb; border: none"
              class="border-1 paddingX-30"
              @click="handleImportReport()"
              type="success"
              >{{
                typeAction === 'create'
                  ? $t('administration.category.report.import')
                  : $t('configUser.updateUser')
              }}
            </el-button>
          </div>
        </el-form>
      </template>
    </Dialog>
    <Dialog
      :show="showDialogDelete"
      :appendToBody="true"
      width="500"
      :title="$t('administration.category.report.titleDelete')"
      @closeDialog="handleCloseDialogDelete"
    >
      <template v-slot:content>
        <div class="form-delete">
          <div class="content">{{ $t('administration.category.report.contentDelete') }}</div>
          <div class="foot flex justify-end">
            <el-button
              style="background-color: #fff; border-color: #7c7e81; color: #7c7e81"
              class="border-1 paddingX-10"
              @click="handleCloseDialogDelete"
              type="info"
              >{{ $t('configUser.cancel') }}</el-button
            >
            <el-button
              style="background-color: #059efb; border: none"
              class="border-1 paddingX-30"
              @click="handleDeleteReport"
              type="success"
              >{{ $t('omsSetting.confirm') }}
            </el-button>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
svg.svg-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

i {
  font-weight: bold;
  margin-left: 8px;
}
.border-custom {
  border-right: 1px solid #ebebec;
}
</style>
