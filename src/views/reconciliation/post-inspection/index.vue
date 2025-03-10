<template>
  <div>
    <div class="flex flex-wrap gap-px-8 paddingX-24 padding-top-14">
      <el-select
        v-model="filter.route"
        class="w-full md:max-w-[30%] lg:max-w-[200px] height-32"
        @change="handleRouteChange"
        :placeholder="t('configUser.userManagement.route')"
        clearable
      >
        <el-option
          v-for="item in routeLst"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="filter.station"
        class="w-full md:max-w-[30%] lg:max-w-[200px] height-32"
        :placeholder="t('configUser.userManagement.station')"
        clearable
      >
        <el-option
          v-for="item in stationLst"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-model="filter.startEnd"
        type="daterange"
        :start-placeholder="t('el.datepicker.startTime')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.endTime')"
        value-format="YYYY-MM-DD"
        format="DD/MM/YYYY"
        class="w-full md:max-w-[30%] lg:max-w-[270px] flex-grow-0 height-32"
        clearable
      />
      <el-button
        :loading="processing"
        class="fs-14 height-32 el-button--main rounded-[2px]"
        @click="search"
        >{{ t('placeholder.search') }}
      </el-button>
    </div>
    <div class="flex items-center justify-between paddingX-24 paddingY-10">
      <div class="flex gap-px-16 items-center">
        <el-button
          text
          v-if="roleData.canCreate"
          size="default"
          class="!p-0"
          @click="handleAdd()"
        >
          <div class="text-gray flex items-center">
            <svg-icon
              icon-class="el-icon-plus"
              class="width-20 height-20 margin-right-4"
            />
            {{ t('monitoring.tollCollectionReport.makeReport') }}
          </div>
        </el-button>
      </div>
    </div>
    <hr class="margin-bottom-12" />
    <div
      v-if="roleData.canRead"
      class="paddingX-24"
    >
      <div
        v-loading="listLoading"
        class="padding-12 bg-white"
      >
        <el-table
          ref="multipleTable"
          :data="dataList"
          style="width: 100%"
          max-height="650"
        >
          <el-table-column
            :label="t('configUser.orderNumber')"
            width="60px"
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
          <el-table-column :label="t('monitoring.tollCollectionReport.timeGetReport')">
            <template #default="{ row }">
              <span>{{ setTimeFormat(row.reportDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.route')">
            <template #default="{ row }">
              <span>{{ row['route']['name'] }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.station')">
            <template #default="{ row }">
              <span>{{ setNameStation(row) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.action')">
            <template #default="{ row }">
              <div class="flex flex-wrap items-center gap-px-8">
                <div
                  v-if="roleData.canRead"
                  class="pointer"
                  @click.stop="handleView(row)"
                >
                  <svg-icon
                    icon-class="eyes"
                    class="width-24 height-24"
                  />
                </div>
                <div
                  v-if="roleData.canExport"
                  class="pointer"
                  @click.stop="handlePDF(row)"
                >
                  <svg-icon
                    icon-class="pdf-premium"
                    class="width-24 height-24"
                  />
                </div>
                <div
                  v-if="roleData.canExport"
                  class="pointer"
                  @click.stop="handleExcel(row)"
                >
                  <svg-icon
                    icon-class="excel-premium"
                    class="width-24 height-24"
                  />
                </div>
                <div
                  v-if="roleData.canUpdate"
                  class="pointer"
                  @click.stop="handleEdit(row)"
                >
                  <svg-icon
                    icon-class="edit-administrative"
                    class="width-24 height-24"
                  />
                </div>
                <div
                  v-if="roleData.canDelete"
                  class="pointer"
                  @click.stop="openDialogDelete(row)"
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
      <span>Bạn có chắc chắn muốn xóa báo cáo hậu kiểm này không?</span>
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
import { useRouter } from 'vue-router'
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue'
import moment from 'moment/moment'
import { useI18n } from '@/locale'
import { usePermissionStore, useRouteUser } from '@/store'
import { cloneDeep } from 'lodash-unified'
import { getListRoute, getListStation } from '@/api/expressway'
import { formatDateTime } from '@/utils/date'
import { formatNumber } from '@/utils'
import Pagination from '@/components/Pagination'
import {
  apiDeleteReconciliationPostInspection,
  apiExportFileReconciliationPostInspection,
  apiGetListReconciliationPostInspection,
} from '@/api/reconciliation'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()
const router = useRouter()
const defaultFilter = {
  page: 1,
  size: 10,
  route: null,
  station: null,
  startEnd: [moment().add(-7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
  total: 0,
}

const filter = reactive(cloneDeep(defaultFilter))
const loading = ref(true)
const processing = ref(false)
const showDialogDelete = ref(false)
const listType = ref([])
const routeLst = ref([])
const stationLst = ref([])

onMounted(() => {
  getRouteList()
  getList()
})
const getRouteList = async () => {
  const params = {
    routeIds: routeUser.routes,
  }

  await getListRoute(params).then(res => {
    routeLst.value = res?.data?.dataRows || []
  })
}
const getStationList = routeId => {
  filter.station = null
  if (routeId) {
    const params = {
      routeIds: [routeId],
      stationsIds: [],
    }
    getListStation(params).then(res => {
      stationLst.value = res?.data?.dataRows || []
    })
  } else {
    stationLst.value = []
  }
}
const handleRouteChange = routeId => {
  getStationList(routeId)
}

const dataList = ref([])
const infoReport = ref({})
const listLoading = ref(false)

const search = () => {
  getList()
}
const handleSizeChange = size => {
  filter.size = size
  getList()
}
const handlePageChange = page => {
  filter.page = page
  getList()
}
const getList = async () => {
  try {
    processing.value = true
    listLoading.value = true
    const params = {
      method: 'LIST',
      arguments: {
        routeId: filter.route,
        stationId: filter.station,
        startDate: filter.startEnd ? filter.startEnd[0] : null,
        endDate: filter.startEnd ? filter.startEnd[1] : null,
        page: filter.page - 1,
        size: filter.size,
      },
    }
    const rs = await apiGetListReconciliationPostInspection(params)
    if (rs.status === 200) {
      dataList.value = rs.data.data
      filter.total = rs.data.totalItems
    }
    listLoading.value = false
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
    listLoading.value = false
  }
}

const handlePDF = async data => {
  try {
    const params = {
      method: 'EXPORT',
      arguments: {
        reportId: data.id,
        fileType: 'PDF',
      },
    }
    const rs = await apiExportFileReconciliationPostInspection(params)
    if (rs.status === 200) {
      const base64Data = rs.data.data
      const typeDownload = 'application/pdf'
      const fileExtension = 'pdf'
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
const handleExcel = async data => {
  try {
    const params = {
      method: 'EXPORT',
      arguments: {
        reportId: data.id,
        fileType: 'EXCEL',
      },
    }
    const rs = await apiExportFileReconciliationPostInspection(params)
    if (rs.status === 200) {
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
const handleAdd = () => {
  router.push({
    name: 'addPostInspectionReconciliation',
  })
}
const handleEdit = data => {
  router.push(`/reconciliation/post-inspection/edit/${data.id}`)
}
const handleView = data => {
  router.push(`/reconciliation/post-inspection/view/${data.id}`)
}
const handleDeleteReport = async () => {
  try {
    const params = {
      method: 'DELETE',
      arguments: {
        reportId: infoReport.value.id,
      },
    }
    const rs = await apiDeleteReconciliationPostInspection(params)
    if (rs.status === 200) {
      ElMessage.success('Xóa báo cáo hậu kiểm thành công')
      await getList()
    }
    showDialogDelete.value = false
  } catch (e) {
    console.log(e)
  }
}
const openDialogDelete = data => {
  infoReport.value = data
  showDialogDelete.value = true
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
const setNameStation = data => {
  const stationLst = []
  data.stations.forEach(item => {
    stationLst.push(item.name)
  })
  return stationLst.join(', ')
}
const setTimeFormat = dateString => {
  const date = moment(dateString)
  return date.isValid() ? moment(dateString).format('DD/MM/YYYY') : ''
}

defineOptions({
  name: 'ReportPostInspection',
})
</script>

<style scoped lang="scss">
.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}
</style>
