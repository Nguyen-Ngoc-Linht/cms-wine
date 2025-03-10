<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import moment from 'moment'
import { useI18n } from '@/locale'
import lang from '@/locale/getMessage'
import { useAppStore, useRouteUser, useStatisticalReportStore } from '@/store'
import { useRouter, useRoute } from 'vue-router'
import { cloneDeep } from 'lodash-unified'
import Pagination from '@/components/Pagination/index.vue'
import {
  apiGetAlertType,
  apiGetAlertInfo,
  apiUpdateAlertStatus,
  apiUpdateWarningStatus,
} from '@/api/toll'
import { ElMessage } from 'element-plus'
import { getListRoute } from '@/api/expressway'

defineOptions({
  name: 'list-warning',
})
const listRoute = ref([])
const appStore = useAppStore()
const statisticalReportStore = useStatisticalReportStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const locale = computed(() => lang[appStore.lang])
const routeUser = useRouteUser()
const showDialog = ref(false)

const formSearchDefault = {
  typeWarning: '',
  routerId: '',
  stationId: '',
  createTime: [],
  page: 1,
  size: 10,
  alertTypeId: '',
}
const objFindStationDefault = {
  keyword: '',
  page: 1,
  size: 1000,
  unitIds: [],
  routeIds: [],
}
const filter = reactive(cloneDeep(formSearchDefault))
const listLoading = ref(false)
const listStations = ref([])
const dataTable = ref([])
const maxHeight = computed(() => {
  const viewportHeight = window.innerHeight
  return viewportHeight - 270
})
const currentPage = ref(1)
const totalItem = ref(0)
const listTypeWarning = ref([])

const emits = defineEmits(['totalUnView'])

onMounted(() => {
  handleGetListTypeWarning()

  filter.routerId = Number(route.query.route) || ''
  onChangeRouteSearch(filter.routerId)
  filter.stationId = Number(route.query.station) || ''
  filter.typeWarning = Number(route.query.type) || ''

  getListWarning()
})

const onChangeRouteSearch = value => {
  objFindStationDefault.routeIds = []
  objFindStationDefault.routeIds = objFindStationDefault.routeIds.concat(value)
  const listStationUser = routeUser.GET_STATIONS(value)
  objFindStationDefault.stationIds = []
  // objFindStationDefault.stationIds = objFindStationDefault.stationIds.concat(listStationUser)
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
const handleFindExplanation = () => {
  getListWarning()
}
const getListWarning = async () => {
  listLoading.value = true

  filter.timeCreate = filter.timeCreate || []

  const params = {
    type: 1,
    alertTypeId: filter.alertTypeId || '',
    pageIndex: filter.page,
    pageSize: filter.size,
    startDate:
      filter.timeCreate && filter.timeCreate.length > 0
        ? moment(filter.timeCreate[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
        : null,
    endDate:
      filter.timeCreate && filter.timeCreate.length > 0
        ? moment(filter.timeCreate[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
        : null,
    routeId: filter.routerId,
    stationId: filter.stationId,
  }
  const res = await apiGetAlertInfo(params)
  if (res.status === 200) {
    listLoading.value = false
    dataTable.value = res.data.content
    totalItem.value = res.data.totalElements
    emits('totalUnView', res.data.unViewedCount)
  }
}
const handleGetListTypeWarning = async () => {
  const res = await apiGetAlertType(1)
  if (res.status === 200) {
    listTypeWarning.value = res.data
  }
  const params = {
    routeIds: routeUser.routes,
  }
  const rs = await getListRoute(params)
  if (rs.status === 200) {
    listRoute.value = rs.data.dataRows
  }
}
const indexMethod = index => {
  return (currentPage.value - 1) * filter.size + index + 1
}
const handleSizeChange = size => {
  filter.size = size
  getListWarning()
}
const handlePageChange = page => {
  filter.page = page
  getListWarning()
}
const onChangeUpdatePage = page => {
  currentPage.value = page
}
const handleViewDetail = async id => {
  const res = await apiUpdateAlertStatus(id)
  if (res.status === 200) {
    ElMessage.success(res.message)
    await getListWarning()
  }
}
const statusName = status => {
  let statusMessage = ''
  switch (status) {
    case 1:
      statusMessage = t('configUser.processed')
      break
    default:
      statusMessage = t('configUser.unprocessed')
  }
  return statusMessage
}
const getClassStatus = status => {
  let className = ''
  switch (status) {
    case 1:
      className = 'bg-outline-success text--success status-class'
      break
    default:
      className = 'bg-outline-warning text--warning status-class'
  }
  return className
}

const rules = ref({
  note: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})
const formEdit = ref(null)
const infoWarning = reactive({
  id: '',
  status: null,
  note: '',
})
const openDialog = data => {
  infoWarning.id = data.id
  infoWarning.note = data.note
  infoWarning.status = data.status
  showDialog.value = true
}
const handleCancelWarning = async () => {
  try {
    const params = {
      id: infoWarning.id,
      note: infoWarning.note,
      status: infoWarning.status,
    }
    const rs = await apiUpdateWarningStatus(params)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      showDialog.value = false
      await getListWarning()
    }
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <div class="padding-24">
    <div class="form-search flex flex-wrap gap-px-8 mb-4">
      <el-select
        v-model="filter.alertTypeId"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
        filterable
        collapse-tags
        clearable
        :placeholder="t('monitoring.toll.warningType')"
      >
        <el-option
          v-for="item in listTypeWarning"
          :key="item.id"
          :label="item.typeName"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="filter.routerId"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
        filterable
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
        v-model="filter.stationId"
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
    <div class="form-table">
      <div class="padding-12 bg-white">
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
          <el-table-column :label="$t('monitoring.toll.warningType')">
            <template #default="{ row }">
              <span>{{ row.alertType.typeName }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('administration.category.report.line')">
            <template #default="{ row }">
              <span>{{ row.route.name }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('administration.category.report.station')">
            <template #default="{ row }">
              <span>{{ row.station.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('monitoring.toll.contentWarning')">
            <template #default="{ row }">
              <span>{{ row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('monitoring.toll.warningTime')">
            <template #default="{ row }">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('configUser.note')">
            <template #default="{ row }">
              <span>{{ row.note }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('configUser.status')"
            width="150px"
          >
            <template #default="{ row }">
              <span
                class="paddingX-12"
                :class="getClassStatus(row.status)"
              >
                {{ statusName(row.status) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.action')"
            width="150px"
          >
            <template #default="{ row }">
              <el-button
                v-if="row.status === 0"
                @click="openDialog(row)"
                style="border: none; margin-left: 0 !important"
                class="border-1 paddingX-20 text-white bg--danger"
              >
                {{ $t('monitoring.toll.cancel') }}
              </el-button>
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
      </div>
    </div>

    <!--    -->
    <el-dialog
      v-model="showDialog"
      :title="$t('monitoring.toll.cancel')"
      width="682"
      align-center
    >
      <div class="w-full">
        <el-form
          ref="formEdit"
          :rules="rules"
          :model="infoWarning"
        >
          <el-form-item
            :label="t('configUser.note')"
            style="width: 100%; display: inline-block"
          >
            <el-input
              v-model="infoWarning.note"
              type="textarea"
              maxlength="1000"
              :rows="6"
              show-word-limit
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer pt-2 flex justify-end">
          <el-button
            class="bg-outline-secondary"
            @click="showDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleCancelWarning()"
          >
            {{ $t('omsSetting.save') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
