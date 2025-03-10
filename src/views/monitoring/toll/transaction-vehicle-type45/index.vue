<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5">
      <el-select
        :placeholder="t('configUser.vehicleType')"
        v-model="filter.vehicle_type"
        clearable
        filterable
        multiple
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listVehicleType"
          :key="item.id"
          :label="item.name"
          :value="item.id"
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
      <el-select
        v-model="filter.station"
        :placeholder="t('configUser.station')"
        clearable
        filterable
        multiple
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listStation"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-model="filter.timeSearch"
        type="daterange"
        :start-placeholder="t('el.datepicker.startTime')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.endTime')"
        clearable
        value-format="DD/MM/YYYY"
        format="DD/MM/YYYY"
        class="w-full md:max-w-[30%] flex-grow-0"
      />
      <el-checkbox
        :label="t('monitoring.toll.suspect')"
        v-model.number="filter.suspect"
      />
      <el-button
        @click="getList"
        class="el-button--main"
        >{{ t('configUser.search') }}</el-button
      >
    </div>
    <hr class="margin-bottom-12 mt-3" />
    <div class="paddingX-24 mb-4">
      <div class="px-3 py-3 bg-white">
        <el-table
          v-loading="listLoading"
          :data="listCar45Vehicle"
          row-key="id"
          fit
          style="width: 100%"
          class="cell-main-3"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            :label="t('monitoring.toll.suspect')"
            width="75"
          >
            <template #default="{ row }">
              <el-checkbox
                v-model.number="row.is_suspect"
                @change="handleUpdateSuspect(row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="STT"
            width="50"
          >
            <template #default="{ $index }">
              <span>{{ (filter.page - 1) * filter.size + $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Etag">
            <template #default="{ row }">
              <span>{{ row.e_tag }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.entryStation')">
            <template #default="{ row }">
              <span>{{ row.station_in ? row.station_in.name : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.timeIn')">
            <template #default="{ row }">
              <span>{{ row.checkin_date_in }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.laneIn')">
            <template #default="{ row }">
              <span>{{ row.laneInNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.exitStation')">
            <template #default="{ row }">
              <span>{{ row.station_out ? row.station_out.name : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.laneOut')">
            <template #default="{ row }">
              <span>{{ row.laneOutNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('reconciliation.timeOut')">
            <template #default="{ row }">
              <span>{{ row.checkin_date_out }}</span>
            </template>
          </el-table-column>
          <el-table-column label="BKSND">
            <template #default="{ row }">
              <span>{{ row.bksnd }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.vehicleType')">
            <template #default="{ row }">
              <span>{{ row.vehicle_type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="BKSDK">
            <template #default="{ row }">
              <span>{{ row.bksdk }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.toll.faceValue')">
            <template #default="{ row }">
              <span>{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.action')"
            width="120"
          >
            <template #default="{ row }">
              <el-tooltip
                :content="t('monitoring.rating.editRating')"
                placement="bottom"
                effect="light"
              >
                <span
                  @click.stop="handleOpenDialogEdit(row)"
                  class="delete-member pointer ms-2 me-3"
                >
                  <svg-icon
                    style="width: 24px; height: 24px"
                    icon-class="edit-administrative"
                    class="mr-2"
                  />
                </span>
              </el-tooltip>
              <el-tooltip
                :content="t('administration.role.delete')"
                placement="bottom"
                effect="light"
              >
                <span
                  @click.stop="openDialogDelete(row)"
                  class="delete-member pointer mx-2"
                >
                  <svg-icon
                    style="width: 24px; height: 24px"
                    icon-class="remove-administrative"
                    class="mr-2"
                  />
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          class="margin-top-12"
          v-model:page.sync="filter.page"
          v-model:size.sync="filter.size"
          :total="filter.total"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <Dialog
      :show="showDialog"
      :appendToBody="true"
      :width="'682'"
      :title="'Sửa giao dịch'"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <EditFreeCarDeals
          :freeCarInfo="infoTransaction"
          :is-vehicle45="true"
          @closeUpdate="handleCloseDialog"
        ></EditFreeCarDeals>
      </template>
    </Dialog>
    <el-dialog
      v-model="showDialogDelete"
      :title="$t('monitoring.toll.deleteTransaction')"
      width="500"
      align-center
    >
      <span>{{ $t('monitoring.toll.confirmDelete') }}</span>
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
            @click="handleDeleteTransaction()"
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
import Pagination from '@/components/Pagination/index.vue'
import { dayjs, ElMessage } from 'element-plus'
import { useI18n } from '@/locale'
import { cloneDeep } from 'lodash-unified'
import { getListRoute, getListStation } from '@/api/expressway'
import { usePermissionStore, useRouteUser } from '@/store'
import {
  apiDeleteTransaction,
  apiGetListAbnormal,
  apiGetListCar45Transaction,
  apiGetTypeVehicleAll,
  apiMarkDoubtTransaction,
} from '@/api/toll'
import Dialog from '@/components/Dialog/index.vue'
import EditFreeCarDeals from '@/views/monitoring/toll/free-car-deals/EditFreeCarDeals.vue'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()
const showDialog = ref(false)
const showDialogDelete = ref(false)

const listLoading = ref(false)
const defaultFilter = {
  page: 1,
  size: 10,
  total: 0,
  vehicle_type: null,
  routeId: null,
  station: null,
  timeSearch: [],
  suspect: 0,
}
const filter = reactive(cloneDeep(defaultFilter))
const listRoute = ref([])
const listStation = ref([])
const listVehicleType = ref([])

const listCar45Vehicle = ref([])
const infoTransaction = ref({})

onMounted(() => {
  setDataDefault()
  getList()
})

const setDataDefault = async () => {
  const today = dayjs().format('DD/MM/YYYY')
  const sevenDaysAgo = dayjs().subtract(7, 'day').format('DD/MM/YYYY')
  filter.timeSearch = [sevenDaysAgo, today]

  const params = {
    routeIds: routeUser.routes,
  }
  const rs = await getListRoute(params)
  if (rs.status === 200) {
    listRoute.value = rs.data.dataRows
  }
  const list = await apiGetTypeVehicleAll()
  if (list.status === 200) {
    listVehicleType.value = list.data.filter(item => item.id > 3).sort((a, b) => a.id - b.id)
  }
}
const getList = async () => {
  listLoading.value = true
  const params = {
    abnormal_type: filter.type,
    route_id: filter.routeId,
    station_id: filter.station,
    from_time: filter.timeSearch ? filter.timeSearch[0] : null,
    to_time: filter.timeSearch ? filter.timeSearch[1] : null,
    vehicle_type: filter.vehicle_type,
    susspect: filter.suspect ? 2 : null,
    page: filter.page,
    size: filter.size,
    monitor_type: 3,
  }
  const rs = await apiGetListAbnormal(params)
  if (rs.status === 200) {
    listCar45Vehicle.value = rs.data.data
    filter.total = rs.data.total
    listLoading.value = false
  }
}

const openDialogDelete = data => {
  showDialogDelete.value = true
  infoTransaction.value = data
}
const handleDeleteTransaction = async () => {
  try {
    const params = {
      id: infoTransaction.value.id,
    }
    const rs = await apiDeleteTransaction(params)
    if (rs.status === 200) {
      ElMessage({
        message: t('omsSetting.deleteSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      showDialogDelete.value = false
      await getList()
    }
  } catch (e) {
    console.log(e)
    showDialogDelete.value = false
  }
}

const setListStation = async routeId => {
  listStation.value = []
  filter.station = null
  const params = {
    page: 1,
    size: 20,
    keywords: '',
    routeIds: [routeId],
    stationIds: [],
    unitIds: [],
  }
  const rs = await getListStation(params)
  if (rs.status === 200) {
    listStation.value = rs.data.dataRows
  } else {
    listStation.value = []
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
const selectedRows = ref([])
const handleUpdateSuspect = async data => {
  try {
    const params = {
      list: [
        {
          id: data.id,
          reviewStatus: data.is_suspect ? 1 : 0,
        },
      ],
    }
    const rs = await apiMarkDoubtTransaction(params)
    if (rs.status === 200) {
      console.log(listCar45Vehicle.value)
    }
  } catch (e) {
    console.log(e)
  }
}
const tableRowClassName = ({ row }) => {
  if (row.is_suspect) {
    return 'selected-rows'
  }
  return selectedRows.value.includes(row) ? 'selected-rows' : ''
}

const handleOpenDialogEdit = data => {
  infoTransaction.value = data
  showDialog.value = true
}
const handleCloseDialog = () => {
  showDialog.value = false
  getList()
}
</script>

<style scoped lang="scss">
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  border-color: #059efb;
}

:deep(.el-table .selected-rows) {
  --el-table-tr-bg-color: #fcecaa !important;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #059efb;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #059efb;
  font-weight: 700;
}
</style>
