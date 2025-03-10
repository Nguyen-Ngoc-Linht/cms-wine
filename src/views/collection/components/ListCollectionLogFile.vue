<template>
  <div>
    <div class="flex flex-wrap gap-px-8 paddingX-24 padding-top-14">
      <el-select
        v-model="filter.type"
        @change="
          value => {
            setListStation(value)
          }
        "
        :placeholder="t('collection.typeFile')"
        clearable
        filterable
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listTypeFile"
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
        v-model="filter.stationId"
        :placeholder="t('configUser.station')"
        clearable
        filterable
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
        value-format="YYYY-MM-DD"
        format="DD/MM/YYYY"
        class="w-full md:max-w-[30%] lg:max-w-[360px] height-32"
      />
      <el-button
        v-if="roleData.canRead"
        class="el-button--main"
        @click="getList()"
        >{{ t('configUser.search') }}</el-button
      >
      <div
        v-if="listSelect.length > 0 && roleData.canDelete"
        class="ml-auto flex-shrink-0 flex justify-end items-center"
      >
        <span
          @click.stop="openDialogDelete"
          class="delete-member pointer mx-1"
        >
          <svg-icon
            style="width: 24px; height: 24px"
            icon-class="remove-administrative"
          />
        </span>
        <h4 class="mb-0">{{ t('configUser.selected') }}: {{ listSelect.length }}</h4>
      </div>
    </div>
    <hr class="margin-bottom-12 mt-4" />
    <div class="paddingX-24">
      <div class="p-3 bg-white">
        <TableViolation
          :listLoading="listLoading"
          :data="listCollectionLogFile"
          :fields="fields"
          :STT="true"
          :selectRow="false"
          :size="filter.size"
          :page="filter.page"
          @listRowSelect="listDataSelect"
        >
          <template #createTime="{ row }">
            <span>{{ formatDate(row.createTime) }}</span>
          </template>
          <template #action="{ row }">
            <svg-icon
              icon-class="remove-administrative"
              class="pointer width-18 height-18"
              @click="handleShowRemoveRow(row)"
            />
          </template>
        </TableViolation>
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

    <el-dialog
      v-model="showDialogDelete"
      :title="$t('collection.deleteLogFile')"
      width="500"
    >
      <span>{{ $t('omsSetting.confirmDelete') }}</span>
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
            @click="handleDeleteListCollectionBE()"
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
import TableViolation from '@/components/Table/index.vue'
import { cloneDeep } from 'lodash-unified'
import { useI18n } from '@/locale'
import { useRouteUser, usePermissionStore } from '@/store'
import { getListRoute, getListStation } from '@/api/expressway'
import { dayjs, ElMessage } from 'element-plus'
import { apiDeleteCollect, apiGetCollect } from '@/api/collect'
import moment from 'moment/moment'

const props = defineProps({
  typeFileLog: {
    type: Number,
    required: true,
  },
})

const { t } = useI18n()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()
const defaultFilter = {
  page: 1,
  size: 10,
  routeId: null,
  stationId: null,
  type: 2,
  timeSearch: [
    moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  ],
  startTime: null,
  endTime: null,
  total: 0,
}
const filter = reactive(cloneDeep(defaultFilter))
const fields = ref([
  {
    key: 'fileName',
    label: t('administration.backup.fileName'),
    prop: 'fileName',
  },
  {
    key: 'dataType',
    label: t('collection.typeFile'),
    prop: 'dataType',
  },
  {
    key: 'pathFolder',
    label: t('administration.backup.folder'),
    prop: 'pathFolder',
  },
  {
    key: 'routeName',
    label: t('configUser.gland'),
    prop: 'routeName',
  },
  {
    key: 'stationName',
    label: t('configUser.station'),
    prop: 'stationName',
  },
  {
    key: 'createTime',
    label: t('report.time'),
    prop: 'createTime',
  },
  {
    key: 'action',
    label: t('configUser.action'),
    prop: 'action',
  },
])

const showDialogDelete = ref(false)
const listRoute = ref([])
const listStation = ref([])
const listLoading = ref(false)
const listCollectionLogFile = ref([])
const listSelect = ref([])
const listTypeFile = ref([
  {
    id: 2,
    name: 'Thu thập Logfile thiết bị',
  },
  {
    id: 3,
    name: 'Thu thập Logfile tín hiệu',
  },
  {
    id: 4,
    name: 'Thu thập dữ liệu từ hệ thống Back-End các trạm',
  },
  {
    id: 5,
    name: 'Thu thập dữ liệu FE qua API của đơn vị thu phí',
  },
])
const idDelete = ref(-1)

onMounted(async () => {
  await setDataDefault()
  await getList()
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
  listLoading.value = true
  filter.timeSearch = filter.timeSearch || [
    moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  ]
  const params = {
    type: filter.type,
    pageNumber: filter.page,
    pageSize: filter.size,
    routeId: filter.routeId,
    stationId: filter.stationId,
    startDate:
      filter.timeSearch && filter.timeSearch.length > 0
        ? moment(filter.timeSearch[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        : null,
    endDate:
      filter.timeSearch && filter.timeSearch.length > 0
        ? moment(filter.timeSearch[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
        : null,
  }
  const rs = await apiGetCollect(params)
  if (rs.status === 200) {
    listCollectionLogFile.value = rs.data
    filter.total = rs.total
    listLoading.value = false
  }
}

const handleDeleteListCollectionBE = async () => {
  // const length = listSelect.value.length
  const ids = [idDelete.value]
  // for (let i = 0; i < length; i++) {
  //   ids.push(listSelect.value[i].id)
  // }
  const params = {
    ids,
  }
  const rs = await apiDeleteCollect(params)
  if (rs.status === 200) {
    ElMessage({
      message: t('omsSetting.deleteSuccess'),
      type: 'success',
      duration: 3 * 1000,
    })
    await getList()
    showDialogDelete.value = false
  }
  showDialogDelete.value = false
}
const listDataSelect = data => {
  console.log(data)
  if (Array.isArray(data)) {
    listSelect.value = data
  } else {
    listSelect.value = []
  }
}
const openDialogDelete = () => {
  showDialogDelete.value = true
}

const handleSizeChange = size => {
  filter.size = size
  getList()
}
const handlePageChange = page => {
  filter.page = page
  getList()
}
const setListStation = async routeId => {
  listStation.value = []
  filter.stationId = null
  const params = {
    page: 1,
    size: 20,
    keywords: '',
    routeIds: [routeId],
    stationIds: [],
    unitIds: [],
  }
  const listStationUser = routeUser.GET_STATIONS(routeId)
  if (listStationUser.length > 0) {
    params.stationIds = listStationUser
  }
  const rs = await getListStation(params)
  if (rs.status === 200) {
    listStation.value = rs.data.dataRows
  } else {
    listStation.value = []
  }
}
const formatDate = dateTime => {
  if (dateTime && dateTime !== '') {
    return dayjs(dateTime).format('DD/MM/YYYY - H:m:s')
  } else {
    return ''
  }
}
const handleDateChange = dates => {
  if (dates && dates.length === 2) {
    const [startTime, endTime] = dates
    const formattedStartTime = `${startTime} 00:00:00`
    const formattedEndTime = `${endTime} 23:59:59`

    filter.startTime = formattedStartTime
    filter.endTime = formattedEndTime
  } else {
    filter.startTime = null
    filter.endTime = null
  }
}
const handleShowRemoveRow = row => {
  idDelete.value = row.id
  showDialogDelete.value = true
}
</script>
