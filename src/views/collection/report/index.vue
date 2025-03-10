<template>
  <div>
    <div class="paddingX-24 padding-top-14 search-group flex flex-wrap gap-px-8 margin-bottom-10">
      <el-select
        v-model="filter.typeReport"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
        filterable
        collapse-tags
        clearable
        :placeholder="t('collection.reportType')"
      >
        <el-option
          v-for="item in listTypeReport"
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
      <!--      <el-select-->
      <!--        v-model="filter.stationIds"-->
      <!--        class="w-full md:max-w-[30%] lg:max-w-[200px] short"-->
      <!--        filterable-->
      <!--        collapse-tags-->
      <!--        clearable-->
      <!--        :placeholder="t('configUser.station')"-->
      <!--        name="station"-->
      <!--      >-->
      <!--        <el-option-->
      <!--          v-for="item in listStations"-->
      <!--          :key="item.id"-->
      <!--          :label="item.name"-->
      <!--          :value="item.id"-->
      <!--        />-->
      <!--      </el-select>-->
      <el-config-provider :locale="locale">
        <el-date-picker
          v-model="filter.createTime"
          type="daterange"
          :start-placeholder="t('el.datepicker.startTime')"
          :range-separator="t('el.datepicker.to')"
          :end-placeholder="t('el.datepicker.endTime')"
          clearable
          value-format="YYYY-MM-DD"
          format="DD/MM/YYYY"
          class="w-full md:max-w-[30%] lg:max-w-[300px] height-32"
          name="timeCreate"
        />
      </el-config-provider>
      <el-button
        style="background-color: #059efb; border: none"
        class="border-1 paddingX-20"
        @click="handleSearchReport"
        type="primary"
        >{{ $t('configUser.search') }}
      </el-button>
    </div>
    <div
      class="paddingX-24 header-btn flex items-center padding-bottom-10"
      v-if="roleAction?.canCreate === 1"
    >
      <el-button
        text
        size="default"
        class="!p-0"
        @click="handleShowDialog()"
      >
        <div class="text-gray flex items-center">
          <svg-icon
            icon-class="import-file"
            class="width-20 height-20 margin-right-4"
          />
          {{ $t('configUser.importFile') }}
        </div>
      </el-button>
    </div>
    <hr class="margin-bottom-12" />
    <div class="paddingX-24 table-group">
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
            <el-table-column :label="$t('administration.backup.fileName')">
              <template #default="{ row }">
                <span>{{ row.fileName }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('collection.reportType')">
              <template #default="{ row }">
                <span>{{ getNameTypeReport(row.reportType) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('configUser.userManagement.route')">
              <template #default="{ row }">
                <span>{{ row.routeName }}</span>
              </template>
            </el-table-column>
            <!--            <el-table-column :label="$t('configUser.station')">-->
            <!--              <template #default="{ row }">-->
            <!--                <span>{{ row.stationName }}</span>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <el-table-column :label="$t('collection.time')">
              <template #default="{ row }">
                <span>{{ formatTime(row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('collection.numberOfRecords')">
              <template #default="{ row }">
                <span>{{ row.totalRecord }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('configUser.action')"
              v-if="roleAction?.canDelete === 1"
            >
              <template #default="{ row }">
                <svg-icon
                  icon-class="export-file"
                  class="width-18 height-18 text--info mr-2 pointer"
                  @click="handleExportDetail(row)"
                />
                <svg-icon
                  icon-class="edit-administrative"
                  class="width-18 height-18 mr-2 pointer"
                  @click="handleShowDialogUpdate(row)"
                />
                <svg-icon
                  icon-class="remove-administrative"
                  class="width-18 height-18 pointer"
                  @click="handleShowRemoveRowFile(row.id)"
                />
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
      width="700"
      :title="isUpdate ? $t('collection.editReport') : $t('collection.addReport')"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <FormReport
          :list-route="listRoutes"
          :is-update="isUpdate"
          :form-update="formUpdateReport"
          :id-update="idUpdate"
          :list-type-report="listTypeReport"
          @close-dialog="handleCloseDialog"
          @load-data="handleGetListReport"
        />
      </template>
    </Dialog>
    <Dialog
      :show="showDialogDelete"
      :appendToBody="true"
      width="500"
      :title="$t('omsSetting.confirm')"
      @closeDialog="handleCloseDialogDelete"
    >
      <template v-slot:content>
        <div class="bg-white">
          <div class="content mb-3">
            {{ $t('omsSetting.confirmDelete') }}
          </div>
          <hr class="margin-bottom-24" />
          <div class="action">
            <div class="flex justify-end">
              <el-button
                type="info"
                @click="handleCloseDialogDelete"
                class="bg--secondary"
                >{{ $t('configUser.cancel') }}</el-button
              >
              <el-button
                @click="handleDeleteRowFile"
                type="primary"
                class="bg--dark-purple"
                style="border: transparent"
                >{{ $t('omsSetting.confirm') }}
              </el-button>
            </div>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import moment from 'moment'
import { cloneDeep } from 'lodash-unified'
import { useRouter } from 'vue-router'

import { useI18n } from '@/locale'
import lang from '@/locale/getMessage'
import Pagination from '@/components/Pagination'
import {
  useAppStore,
  useStatisticalReportStore,
  useUserStore,
  useRouteUser,
  usePermissionStore,
} from '@/store'
import Dialog from '@/components/Dialog/index.vue'
import FormReport from '@/views/collection/report/components/form-report.vue'
import { apiGetCollect, apiDeleteCollect } from '@/api/collect'
import { ElMessage } from 'element-plus'
import { downloadFileCustom } from '@/utils/files'

defineOptions({
  name: 'CollectionReport',
})

const { t } = useI18n()
const router = useRouter()
const locale = computed(() => lang[appStore.lang])
const appStore = useAppStore()
const statisticalReportStore = useStatisticalReportStore()
const userStore = useUserStore()
const routeUser = useRouteUser()
const permissionStore = usePermissionStore()

const listLoading = ref(false)
const showDialogCreate = ref(false)
const showDialogDelete = ref(false)
const isUpdate = ref(false)
const idUpdate = ref(-1)
const formUpdateReport = ref({
  reportType: -1,
  routeId: '',
  fileVault: [],
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
const formSearchDefault = {
  typeReport: '',
  routerIds: '',
  createTime: [
    moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD'),
    moment().endOf('day').format('YYYY-MM-DD'),
  ],
  page: 1,
  size: 10,
}
const filter = reactive(cloneDeep(formSearchDefault))
const totalItem = ref(0)
const currentPage = ref(1)
const dataTable = ref([])
const maxHeight = computed(() => {
  const viewportHeight = window.innerHeight
  return viewportHeight - 270
})
const listRoutes = ref([])
const listStations = ref([])
const listRemove = ref([])
const listTypeReport = ref([
  {
    id: 2,
    name: 'Báo cáo doanh thu hàng ngày',
    code: 'BAO_CAO_DOANH_THU_HANG_NGAY',
  },
  {
    id: 3,
    name: 'Báo cáo lưu lượng xe qua trạm',
    code: 'BAO_CAO_LUU_LUONG_XE_QUA_TRAM',
  },
  {
    id: 4,
    name: 'Báo cáo danh sách giao dịch',
    code: 'BAO_CAO_DANH_SACH_GIAO_DICH',
  },
  {
    id: 7,
    name: 'Báo cáo giao dịch xe MP',
    code: 'BAO_CAO_XE_MIEN_PHI',
  },
])

const roleAction = ref(null)
const loadingExport = ref(false)

onMounted(() => {
  initData()
  roleAction.value = permissionStore.roleData
})

const initData = () => {
  handleGetListReport()
  getListRoute()
}
const handleSearchReport = () => {
  handleGetListReport()
}
const handleGetListReport = async () => {
  listLoading.value = true
  filter.createTime = filter.createTime || [
    moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD'),
    moment().endOf('day').format('YYYY-MM-DD'),
  ]
  const params = {
    type: 1,
    reportType: filter.typeReport || null,
    pageNumber: filter.page,
    pageSize: filter.size,
    startDate:
      filter.createTime && filter.createTime.length > 0
        ? moment(filter.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        : null,
    endDate:
      filter.createTime && filter.createTime.length > 0
        ? moment(filter.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
        : null,
    routeId: filter.routerIds || null,
  }
  const res = await apiGetCollect(params)
  if (res.status === 200) {
    listLoading.value = false
    dataTable.value = res.data
    totalItem.value = res.total
    showDialogCreate.value = false
  } else {
    listLoading.value = false
  }
}
const handleViewDetail = () => {}
const handleShowRemoveRowFile = id => {
  showDialogDelete.value = true
  listRemove.value = []
  listRemove.value.push(id)
}
const handleCloseDialogDelete = () => {
  showDialogDelete.value = false
}
const handleDeleteRowFile = async () => {
  const params = {
    ids: listRemove.value,
  }
  const res = await apiDeleteCollect(params)
  if (res.status === 200) {
    ElMessage.success(t('omsSetting.deleteSuccess'))
    await handleGetListReport()
    showDialogDelete.value = false
  }
}
const handleShowDialog = () => {
  showDialogCreate.value = true
  isUpdate.value = false
}
const handleCloseDialog = () => {
  showDialogCreate.value = false
  refresh()
}
const refresh = () => {
  isUpdate.value = false
  formUpdateReport.value.reportType = -1
  formUpdateReport.value.stationId = ''
  formUpdateReport.value.routeId = ''
  formUpdateReport.value.fileVault = []
}
const handleSizeChange = size => {
  filter.size = size
  handleGetListReport()
}
const handlePageChange = page => {
  filter.page = page
  handleGetListReport()
}
const onChangeUpdatePage = page => {
  currentPage.value = page
}
const indexMethod = index => {
  return (currentPage.value - 1) * filter.size + index + 1
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
const onChangeRouteSearch = async value => {
  objFindStationDefault.routeIds = []
  objFindStationDefault.routeIds = objFindStationDefault.routeIds.concat(value)
  const listStationUser = routeUser.GET_STATIONS(value)
  objFindStationDefault.stationIds = []
  // objFindStationDefault.stationIds = objFindStationDefault.stationIds.concat(listStationUser)
  await getListStation(objFindStationDefault)
}
const getListStation = async obj => {
  await statisticalReportStore
    .getListStationReport(obj)
    .then(res => {
      if (res.status === 200) {
        listStations.value = res.data.dataRows
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const getNameTypeReport = value => {
  return listTypeReport.value.find(item => item.id === value)?.name
}
const formatTime = time => {
  return moment(time).format('DD/MM/YYYY HH:mm:ss')
}
const handleExportDetail = async objFile => {
  if (loadingExport.value) return
  loadingExport.value = true
  console.log('handleExport: ', objFile)
  try {
    if (objFile) {
      const url = objFile.fileVaults.filePath.replace('/upload', '')
      await downloadFileCustom(url, objFile.fileName)
    }
    loadingExport.value = false
  } catch (error) {
    console.log('handleExport ~ error:', error)
    loadingExport.value = false
  }
}
const handleShowDialogUpdate = row => {
  if (row.fileVaults) {
    showDialogCreate.value = true
    isUpdate.value = true
    idUpdate.value = row.id
    formUpdateReport.value.reportType = row.reportType
    formUpdateReport.value.routeId = row.routeId
    formUpdateReport.value.fileVault.push(row.fileVaults)
  }
  console.log('handleShowDialogUpdate: ', row, showDialogCreate.value)
}
</script>

<style scoped></style>
