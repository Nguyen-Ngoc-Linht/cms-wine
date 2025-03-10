<template>
  <div>
    <div class="page-header">
      <div class="flex flex-wrap gap-px-8 items-center justify-start mb-5 mt-0 paddingX-24">
        <el-input
          v-model="filter.keyword"
          @keyup.enter="getList"
          :placeholder="t('el.transfer.filterPlaceholder')"
          class="w-full md:max-w-[30%] lg:max-w-[200px] short"
        >
        </el-input>
        <el-select
          v-model="filter.routeIds"
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
          />
        </el-select>
        <el-button
          @click="searchData()"
          class="el-button--main mb-0"
          >{{ t('configUser.search') }}</el-button
        >
      </div>
    </div>
    <div class="flex items-center justify-between paddingX-24 mt-2">
      <div class="flex gap-px-8 items-center">
        <el-button
          v-if="roleData.canCreate"
          text
          size="default"
          class="!p-0"
          @click="handleAddForces"
        >
          <div
            class="flex items-center pointer text-[#525B73]"
            style="line-height: 20px"
          >
            <svg-icon
              icon-class="el-icon-plus"
              class="width-20 height-20 margin-right-4"
            />
            {{ $t('configUser.addStation') }}
          </div>
        </el-button>
      </div>
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <div class="paddingX-24">
      <div class="px-3 py-3 bg-white">
        <el-table
          v-loading="listLoading"
          :data="listStation"
          row-key="id"
          fit
          highlight-current-row
          style="width: 100%"
          @row-click="handleShowStationDetail"
          class="cell-main-3"
        >
          <el-table-column
            class="padding-table"
            label="STT"
            width="60"
          >
            <template #default="{ $index }">
              <span>{{ (filter.page - 1) * filter.size + $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.nameStation')"
            width="200"
          >
            <template #default="{ row }">
              <span class="text-black bold">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.gland')">
            <template #default="{ row }">
              <span class="text-black bold">{{ row.route ? row.route.name : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('omsSetting.stationCode')">
            <template #default="{ row }">
              <span class="text-black bold">{{ row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.serviceProviderFe')">
            <template #default="{ row }">
              <span class="text-black bold">{{ getNameServiceProvider(row, 1) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.serviceProviderBE')">
            <template #default="{ row }">
              <span class="text-black bold">{{ getNameServiceProvider(row, 2) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.miningOperatingUnit')">
            <template #default="{ row }">
              <span class="text-black bold">{{ getNameServiceProvider(row, 3) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.managementUnit')">
            <template #default="{ row }">
              <span class="text-black bold">{{ getNameServiceProvider(row, 4) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.operation')"
            width="150"
          >
            <template #default="{ row }">
              <span
                v-if="roleData.canUpdate"
                @click.stop="handleEditStations(row)"
                class="delete-member pointer ms-2 me-3"
              >
                <svg-icon
                  style="width: 24px; height: 24px"
                  icon-class="edit-administrative"
                  class="mr-2"
                />
              </span>
              <span
                v-if="roleData.canDelete"
                @click.stop="openDeleteDialog(row)"
                class="delete-member pointer"
              >
                <svg-icon
                  style="width: 24px; height: 24px"
                  icon-class="remove-administrative"
                />
              </span>
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

    <el-dialog
      v-model="deleteStationDialog"
      :title="$t('configUser.deleteStation')"
      width="500"
      align-center
    >
      <span>{{ $t('omsSetting.confirmDelete') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="deleteStationDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            v-if="roleData.canDelete"
            class="el-button--main"
            @click="handleDeleteStation()"
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
import { useRouter } from 'vue-router'
import Pagination from '@/components/Pagination/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import { ElMessage } from 'element-plus'
import { getListStation, deleteStation, getListRoute } from '@/api/expressway'
import { useI18n } from '@/locale'
import { cloneDeep } from 'lodash-unified'
import { usePermissionStore } from '@/store'
const { t } = useI18n()
const { roleData } = usePermissionStore()
const defaultFilter = {
  page: 1,
  size: 10,
  keyword: '',
  unitIds: [],
  routeIds: null,
  total: 0,
}
const filter = reactive(cloneDeep(defaultFilter))
const router = useRouter()
const listLoading = ref(false)
const infoStationDetail = ref({})
const deleteStationDialog = ref(false)
const listRoute = ref([])

const listStation = ref([])

onMounted(async () => {
  const rs = await getListRoute()
  if (rs.status === 200) {
    listRoute.value = rs.data.dataRows
  }
  await getList()
})

const getList = async () => {
  listLoading.value = true
  const params = {
    keyword: filter.keyword,
    page: filter.page,
    size: filter.size,
    routeIds: filter.routeIds ? [filter.routeIds] : [],
    unitIds: filter.unitIds,
  }
  const rs = await getListStation(params)
  if (rs.status === 200) {
    listStation.value = rs.data.dataRows
    filter.total = rs.data.totalCount
  }
  listLoading.value = false
}

const searchData = async () => {
  await getList()
}

const handleAddForces = data => {
  router.push(`/administration/category/station/`)
}
const handleEditStations = data => {
  router.push(`/administration/category/station/${data.id}`)
}
const handleShowStationDetail = data => {
  router.push(`/administration/category/station-details-view/${data.id}`)
}
const handleDeleteStation = async () => {
  console.log(infoStationDetail.value.id)
  const rs = await deleteStation(infoStationDetail.value.id)
  if (rs.status === 200) {
    await getList()
    ElMessage({
      message: t('omsSetting.deleteSuccess'),
      type: 'success',
      duration: 3 * 1000,
    })
    deleteStationDialog.value = false
  } else {
    ElMessage({
      message: t('el.image.error'),
      type: 'error',
      duration: 3 * 1000,
    })
    deleteStationDialog.value = false
  }
  deleteStationDialog.value = false
}

const getNameServiceProvider = (data, typeProvider) => {
  const providers = data.serviceProviders
  if (!providers) {
    return ''
  }
  const service = providers.find(service => service.type === typeProvider)
  if (service) {
    return service.name
  } else {
    return ''
  }
}
const openDeleteDialog = data => {
  deleteStationDialog.value = true
  infoStationDetail.value = data
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

<style lang="scss" scoped>
.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}
</style>
