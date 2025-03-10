<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5">
      <el-select
        v-model="filter.periodicReport"
        :placeholder="t('monitoring.tollCollectionReport.reportPeriod')"
        clearable
        filterable
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listPeriodicReport"
          :key="item.id"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="filter.routeId"
        @change="
          value => {
            setListStation(value)
          }
        "
        :placeholder="t('configUser.gland')"
        clearable
        filterable
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listRoute"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-button
        class="el-button--main"
        @click="getList()"
        >{{ t('placeholder.search') }}</el-button
      >
    </div>
    <div class="flex items-center paddingX-24 mt-4">
      <el-button
        text
        size="default"
        class="!p-0"
        v-if="roleData.canCreate"
        @click="handleCreateReport()"
      >
        <div
          class="flex items-center pointer text-[#525B73]"
          style="line-height: 20px"
        >
          <svg-icon
            icon-class="el-icon-plus"
            class="width-20 height-20 margin-right-4"
          />
          {{ t('monitoring.tollCollectionReport.makeReport') }}
        </div>
      </el-button>
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <div class="paddingX-24 mb-4">
      <div
        v-if="roleData.canRead"
        class="bg-white p-3"
      >
        <el-table
          v-loading="listLoading"
          :data="dataReport"
          row-key="id"
          fit
          style="width: 100%"
          class="cell-main-3"
          @row-click="handleView"
        >
          <el-table-column
            :label="'STT'"
            width="50"
          >
            <template #default="{ $index }">
              <span>{{ (filter.page - 1) * filter.size + $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.tollCollectionReport.reportName')">
            <template #default="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.tollCollectionReport.reportPeriod')">
            <template #default="{ row }">
              <span>{{ setPeriod(row.period) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.tollCollectionReport.timeGetReport')">
            <template #default="{ row }">
              <span>{{ setTimeGetReport(row) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.gland')">
            <template #default="{ row }">
              <span>{{ row['route']['name'] }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.action')">
            <template #default="{ row }">
              <div class="flex flex-wrap items-center gap-px-8">
                <div
                  v-if="roleData.canExport"
                  class="pointer"
                  @click.stop="handleExportFile(row, 'PDF')"
                >
                  <svg-icon
                    icon-class="pdf-premium"
                    class="width-24 height-24"
                  />
                </div>
                <!--                <div v-if="roleData.canExport" class="pointer" @click.stop="handleExportFile(row, 'EXCEL')">-->
                <!--                  <svg-icon-->
                <!--                    icon-class="excel-premium"-->
                <!--                    class="width-24 height-24"-->
                <!--                  />-->
                <!--                </div>-->
                <div
                  v-if="roleData.canUpdate"
                  class="pointer"
                  @click.stop="handleEditReport(row)"
                >
                  <svg-icon
                    icon-class="edit-administrative"
                    class="width-24 height-24"
                  />
                </div>
                <div
                  v-if="roleData.canDelete"
                  class="pointer"
                  @click.stop="openDeleteReport(row)"
                >
                  <svg-icon
                    icon-class="remove-administrative"
                    class="width-24 height-24"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="margin-top-12">
          <Pagination
            v-model:page="filter.page"
            v-model:size="filter.size"
            :total="filter.total"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showDialogDelete"
      :title="$t('monitoring.tollCollectionReport.deleteReport')"
      width="500"
      align-center
    >
      <span>Bạn có chắc chắn muốn xóa báo cáo này không?</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="showDialogDelete = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleDeleteReport()"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-unified'
import { useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { usePermissionStore, useRouteUser } from '@/store'
import Pagination from '@/components/Pagination/index.vue'
import { dayjs, ElMessage } from 'element-plus'
import { getListRoute, getListStation } from '@/api/expressway'
import { apiSupervisionManageReport } from '@/api/statistical-report'

const { t } = useI18n()
const router = useRouter()
const routeUser = useRouteUser()
const { roleData } = usePermissionStore()
const showDialogDelete = ref(false)

const defaultFilter = {
  page: 1,
  size: 10,
  periodicReport: null,
  routeId: null,
  total: 0,
}
const filter = reactive(cloneDeep(defaultFilter))
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
    name: t('weightStation.year'),
    value: 'YEARLY',
  },
])
const listRoute = ref([])
const listStation = ref([])
const listLoading = ref(false)
const dataReport = ref([])
const infoReport = ref({})

onMounted(() => {
  setDataDefault()
  getList()
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
const getList = async () => {
  try {
    const params = {
      method: 'LIST',
      arguments: {
        page: filter.page - 1,
        size: filter.size,
        routeId: filter.routeId,
        periodType: filter.periodicReport,
      },
    }
    const rs = await apiSupervisionManageReport(params)
    if (rs.status === 200) {
      dataReport.value = rs.data.data
      filter.total = rs.data.totalItems
    }
  } catch (e) {
    console.log(e)
  }
}
const handleCreateReport = () => {
  router.push(`/statistical-report/traffic-revenue-management/add`)
}
const handleEditReport = data => {
  router.push(`/statistical-report/traffic-revenue-management/edit/${data.id}`)
}
const handleView = data => {
  router.push(`/statistical-report/traffic-revenue-management/view/${data.id}`)
}
const handleDeleteReport = async () => {
  try {
    const params = {
      method: 'DELETE',
      arguments: {
        reportId: infoReport.value.id,
      },
    }
    const rs = await apiSupervisionManageReport(params)
    if (rs.status === 200) {
      ElMessage.success('Xóa báo cáo thành công')
      await getList()
    }
    showDialogDelete.value = false
  } catch (e) {
    console.log(e)
    showDialogDelete.value = false
  }
}
const handleExportFile = async (data, typeFile) => {
  try {
    const params = {
      method: 'EXPORT',
      arguments: {
        reportId: data.id,
        fileType: typeFile,
      },
    }
    const rs = await apiSupervisionManageReport(params)
    if (rs.status === 200) {
      const base64Data = rs.data.data
      let typeDownload = 'application/pdf'
      let fileExtension = 'pdf'

      if (typeFile === 'EXCEL') {
        typeDownload = 'application/excel'
        fileExtension = 'xlsx'
      }
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
const base64ToBlob = (base64, mimeType = 'application/octet-stream') => {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}
const openDeleteReport = data => {
  infoReport.value = data
  showDialogDelete.value = true
}

const setListStation = async routeId => {
  listStation.value = []
  filter.stationIds = []
  const params = {
    page: 1,
    size: 20,
    keyword: '',
    stationIds: [],
    routeIds: [routeId],
    unitIds: [],
  }
  // const listStationUser = routeUser.GET_STATIONS(routeId)
  // if (listStationUser.length > 0) {
  //   params.stationIds = listStationUser
  // }
  const rs = await getListStation(params)
  if (rs.status === 200) {
    listStation.value = rs.data.dataRows
  } else {
    listStation.value = []
  }
}
const setPeriod = typePeriod => {
  switch (typePeriod) {
    case 'DAILY':
      return t('el.datepicker.day')
    case 'MONTHLY':
      return t('el.datepicker.month')
    case 'YEARLY':
      return t('el.datepicker.year')
    case 'QUARTERLY':
      return t('el.datepicker.quarter')
    default:
      return ''
  }
}
const setTimeGetReport = data => {
  const time = data.date
  const period = data.period
  switch (period) {
    case 'DAILY':
      return `${t('el.datepicker.day')} ${time.dayOfMonth}/${time.monthOfYear}/${time.year}`
    case 'MONTHLY':
      return `${t('el.datepicker.month')} ${time.monthOfYear}/${time.year}`
    case 'YEARLY':
      return `${t('el.datepicker.year')} ${time.year}`
    case 'QUARTERLY':
      return `${t('el.datepicker.quarter')}${time.quarter}/${time.year}`
    default:
      return ''
  }
}
const handleSizeChange = size => {
  filter.size = size
  getList()
}
const handlePageChange = page => {
  filter.page = page
  getList()
}
</script>

<style scoped lang="scss">
:deep(.el-table thead.is-group th.el-table__cell) {
  background: white;
}
.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}
</style>
