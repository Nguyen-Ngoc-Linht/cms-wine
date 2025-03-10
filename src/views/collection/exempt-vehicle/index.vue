<template>
  <div class="">
    <div class="search-group flex flex-wrap gap-px-8 paddingX-24 padding-top-14 margin-bottom-10">
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
          class="w-full md:max-w-[40%] lg:max-w-[400px] height-32"
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
    <div class="header-btn flex items-center justify-between paddingX-24 padding-bottom-10">
      <div v-if="roleAction?.canCreate === 1">
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
      <div v-if="roleAction?.canDelete === 1">
        <svg-icon
          icon-class="remove-administrative"
          class="pointer width-18 height-18 mr-2"
          @click="handleShowRemoveRowFile"
        />
        <span class="text-[#525B73]">{{ t('omsSetting.selected') }}: {{ listSelect.length }}</span>
      </div>
    </div>
    <hr class="margin-bottom-12" />
    <div class="paddingX-24 table-group">
      <div class="padding-12 bg-white">
        <TableViolation
          :listLoading="listLoading"
          :data="dataTable"
          :fields="fields"
          :STT="true"
          :selectRow="roleAction?.canDelete === 1"
          :size="filter.size"
          :page="filter.page"
          @listRowSelect="listDataSelect"
        >
          <template #createTime="{ row }">
            <span>{{ formatTime(row.createTime) }}</span>
          </template>
        </TableViolation>
        <div class="overflow-x-auto">
          <Pagination
            class="margin-top-12"
            v-model:page.sync="filter.page"
            v-model:size.sync="filter.size"
            :total="totalItem"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
    <Dialog
      :show="showDialogCreate"
      :appendToBody="true"
      width="700"
      :title="$t('collection.addReport')"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <FormImportVehicle
          :list-route="listRoutes"
          @close-dialog="handleCloseDialog"
          @load-data="handleGetListReportVehicle"
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
  useRouteUser,
  useStatisticalReportStore,
  useUserStore,
  usePermissionStore,
} from '@/store'
import Dialog from '@/components/Dialog/index.vue'
import FormImportVehicle from '@/views/collection/exempt-vehicle/components/form-import-vehicle.vue'
import TableViolation from '@/components/Table/index.vue'
import { apiDeleteCollect, apiGetCollect } from '@/api/collect'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'CollectionExemptVehicle',
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

const formSearchDefault = {
  createTime: [
    moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD'),
    moment().endOf('day').format('YYYY-MM-DD'),
  ],
  page: 1,
  size: 10,
}
const objFindStationDefault = {
  keyword: '',
  page: 1,
  size: 1000,
  unitIds: [],
  routeIds: [],
  stationIds: [],
}
const filter = reactive(cloneDeep(formSearchDefault))
const fields = ref([
  {
    key: 'fileName',
    label: t('administration.backup.fileName'),
    prop: 'fileName',
  },
  {
    key: 'pathFolder',
    label: t('administration.backup.folder'),
    prop: 'pathFolder',
  },
  {
    key: 'createTime',
    label: t('report.time'),
    prop: 'createTime',
  },
  {
    key: 'totalRecord',
    label: t('collection.numberOfRecords'),
    prop: 'totalRecord',
  },
])
const totalItem = ref(0)
const currentPage = ref(1)
const dataTable = ref([])
const maxHeight = computed(() => {
  const viewportHeight = window.innerHeight
  return viewportHeight - 270
})
const listRoutes = ref([])
const listStations = ref([])
const listSelect = ref([])
const totalSelected = ref(0)
const listRemove = ref([])
const roleAction = ref(null)

onMounted(() => {
  initData()
  roleAction.value = permissionStore.roleData
})

const initData = () => {
  handleGetListReportVehicle()
  getListRoute()
}
const handleSearchReport = () => {
  handleGetListReportVehicle()
}
const handleGetListReportVehicle = async () => {
  listLoading.value = true
  filter.createTime = filter.createTime || [
    moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  ]
  const params = {
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
    type: 6,
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
const handleShowRemoveRowFile = () => {
  showDialogDelete.value = true
}
const handleCloseDialogDelete = () => {
  showDialogDelete.value = false
}
const handleDeleteRowFile = async () => {
  const listIdDelete = listSelect.value.map(item => item.id)
  const params = {
    ids: listIdDelete,
  }
  const res = await apiDeleteCollect(params)
  if (res.status === 200) {
    ElMessage.success(t('omsSetting.deleteSuccess'))
    await handleGetListReportVehicle()
    showDialogDelete.value = false
  }
}
const handleShowDialog = () => {
  showDialogCreate.value = true
  console.log(showDialogCreate.value)
}
const handleCloseDialog = () => {
  showDialogCreate.value = false
}
const handleSizeChange = size => {
  filter.size = size
  handleGetListReportVehicle()
}
const handlePageChange = page => {
  filter.page = page
  handleGetListReportVehicle()
}
const onChangeUpdatePage = page => {
  currentPage.value = page
}
const indexMethod = index => {
  return (currentPage.value - 1) * filter.size + index + 1
}
const listDataSelect = data => {
  console.log(data)
  if (Array.isArray(data)) {
    listSelect.value = data
  } else {
    listSelect.value = []
  }
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
const onChangeRouteSearch = value => {
  objFindStationDefault.routeIds = []
  objFindStationDefault.routeIds = objFindStationDefault.routeIds.concat(value)
  const listStationUser = routeUser.GET_STATIONS(value)
  objFindStationDefault.stationIds = []
  objFindStationDefault.stationIds = objFindStationDefault.stationIds.concat(listStationUser)
  getListStation(objFindStationDefault)
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
const formatTime = time => {
  return moment(time).format('DD/MM/YYYY HH:mm:ss')
}
</script>

<style scoped></style>
