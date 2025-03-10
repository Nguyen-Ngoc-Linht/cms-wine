<template>
  <div>
    <div class="page-header">
      <div class="flex gap-x-3 items-center justify-start mb-5 mt-5 paddingX-24">
        <el-input
          v-model="filter.text"
          @keyup.enter="getList"
          :placeholder="t('el.transfer.filterPlaceholder')"
          class="width-200"
        >
        </el-input>
        <el-select
          v-model="filter.routeId"
          :placeholder="t('configUser.gland')"
          clearable
          filterable
          collapse-tags
          collapse-tags-tooltip
          class="width-200 height-32"
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
          @click="searchData()"
          class="el-button--main"
          >{{ t('configUser.search') }}</el-button
        >
      </div>
    </div>
    <div class="flex items-center justify-between paddingX-24 mt-4">
      <div class="flex gap-px-8 items-center">
        <el-button
          v-if="roleData.canCreate"
          text
          size="default"
          class="!p-0"
          @click="handleAddFareTable"
        >
          <div
            class="flex items-center pointer text-[#525B73]"
            style="line-height: 20px"
          >
            <svg-icon
              icon-class="el-icon-plus"
              class="width-20 height-20 margin-right-4"
            />
            {{ $t('configUser.addFareTable') }}
          </div>
        </el-button>
      </div>
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <div class="paddingX-24">
      <div class="px-3 py-3 bg-white">
        <el-table
          v-loading="listLoading"
          :data="listFareTable"
          row-key="id"
          fit
          highlight-current-row
          style="width: 100%"
          class="cell-main-3"
          @row-click="handleShowFareTableDetail"
        >
          <el-table-column
            class="padding-table"
            label="STT"
            width="60"
          >
            <template #default="{ $index }">
              <span class="text-black bold py-4">{{
                (filter.page - 1) * filter.size + $index + 1
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.nameFareTable')"
            width="200"
          >
            <template #default="{ row }">
              <span class="text-black bold">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.gland')">
            <template #default="{ row }">
              <span
                :title="row.route.name"
                class="text-black bold"
                >{{ row.route.name }}</span
              >
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.codeFare')">
            <template #default="{ row }">
              <span
                :title="row.code"
                class="text-black bold"
                >{{ row.code }}</span
              >
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.regulatoryName')">
            <template #default="{ row }">
              <span
                :title="row.regulation"
                class="text-black bold"
                >{{ row.regulation }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.status')"
            width="200"
          >
            <template #default="{ row }">
              <span
                v-if="row.status === 'OPEN'"
                class="bg-outline-info text--info box-action"
                >{{ $t('configUser.open') }}</span
              >
              <span
                v-if="row.status === 'CLOSED'"
                class="bg-outline-secondary text--secondary box-action"
                >{{ $t('configUser.closed') }}</span
              >
              <span
                v-if="row.status === 'ACTIVE'"
                class="bg-outline-success text--success box-action"
                >{{ $t('configUser.activate') }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.operation')"
            width="300"
          >
            <template #default="{ row }">
              <el-tooltip
                :content="$t('administration.category.report.editReport')"
                v-if="row.status === 'OPEN' && roleData.canUpdate"
                placement="bottom"
                effect="light"
              >
                <span
                  @click.stop="handleEditFareTable(row)"
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
                :content="$t('configUser.activeFare')"
                v-if="row.status === 'OPEN' && roleData.canUpdate"
                placement="bottom"
                effect="light"
              >
                <span
                  @click.stop="openDialogActive(row)"
                  class="delete-member pointer ms-2 me-3"
                >
                  <svg-icon
                    style="width: 24px; height: 24px"
                    icon-class="done_plus"
                    class="mr-2"
                  />
                </span>
              </el-tooltip>
              <el-tooltip
                :content="$t('configUser.delete')"
                v-if="row.status === 'OPEN' && roleData.canDelete"
                placement="bottom"
                effect="light"
              >
                <span
                  @click.stop="openDialogDelete(row)"
                  class="delete-member pointer ms-2 me-3"
                >
                  <svg-icon
                    style="width: 24px; height: 24px"
                    icon-class="remove-administrative"
                    class="mr-2"
                  />
                </span>
              </el-tooltip>
              <el-tooltip
                :content="$t('configUser.closed')"
                v-if="row.status === 'ACTIVE' && roleData.canDelete"
                placement="bottom"
                effect="light"
              >
                <span
                  @click.stop="openDialogClose(row)"
                  class="delete-member pointer ms-2 me-3"
                >
                  <svg-icon
                    style="width: 24px; height: 24px"
                    icon-class="pause"
                    class="mr-2"
                  />
                </span>
              </el-tooltip>
              <!--              <el-button-->
              <!--                v-if="row.status === 'OPEN' && roleData.canUpdate"-->
              <!--                @click="handleEditFareTable(row)"-->
              <!--                class="bg&#45;&#45;dark-blue text-white btn-default"-->
              <!--                >{{ $t('administration.category.report.editReport') }}</el-button-->
              <!--              >-->
              <!--              <el-button-->
              <!--                v-if="row.status === 'OPEN' && roleData.canConfirm"-->
              <!--                @click="openDialogActive(row)"-->
              <!--                class="bg&#45;&#45;success text-white btn-default"-->
              <!--                >{{ t('configUser.activeFare') }}</el-button-->
              <!--              >-->
              <!--              <el-button-->
              <!--                @click="openDialogDelete(row)"-->
              <!--                v-if="row.status === 'OPEN' && roleData.canDelete"-->
              <!--                class="bg&#45;&#45;danger text-white btn-default"-->
              <!--                >{{ $t('configUser.delete') }}</el-button-->
              <!--              >-->
              <!--              <el-button-->
              <!--                v-if="row.status === 'ACTIVE' && roleData.canConfirm"-->
              <!--                @click="openDialogClose(row)"-->
              <!--                class="bg&#45;&#45;warning text-white btn-default"-->
              <!--                >{{ $t('configUser.closed') }}</el-button-->
              <!--              >-->
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
    <!--    -->
    <el-dialog
      v-model="deleteFareTableDialog"
      :title="$t('configUser.deleteFareTable')"
      width="500"
      align-center
    >
      <span>{{ $t('omsSetting.confirmDelete') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="deleteFareTableDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleDeleteFareTable()"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="activeFareTableDialog"
      :title="titleDialogStatus"
      width="500"
      align-center
    >
      <span v-if="typeStatus === 'active'">{{ $t('configUser.textConfirmFareTable') }}</span>
      <span v-if="typeStatus === 'closed'">{{ $t('configUser.textClosedFareTable') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="activeFareTableDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            v-if="typeStatus === 'active'"
            class="el-button--main"
            @click="handleActiveFareTable('ACTIVE')"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
          <el-button
            v-if="typeStatus === 'closed'"
            class="el-button--main"
            @click="handleActiveFareTable('CLOSED')"
          >
            {{ $t('configUser.closed') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiDeleteFareTable, apiStatusFareTable, getListFareTable } from '@/api/fare-table'
import Pagination from '@/components/Pagination/index.vue'
import { useI18n } from '@/locale'
import { cloneDeep } from 'lodash-unified'
import { ElMessage } from 'element-plus'
import { getListRoute } from '@/api/expressway'
import { usePermissionStore } from '@/store'
const { t } = useI18n()

const { roleData } = usePermissionStore()
const defaultFilter = reactive({
  page: 1,
  size: 10,
  text: '',
  routeId: '',
  total: 0,
})
const filter = reactive(cloneDeep(defaultFilter))
const deleteFareTableDialog = ref(false)
const activeFareTableDialog = ref(false)
const fareTableInfo = ref({})
const router = useRouter()
const listLoading = ref(true)
const listFareTable = ref([])
const listRoute = ref([])

const typeStatus = ref('')
const titleDialogStatus = ref('')

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
    pageSize: filter.size,
    pageIndex: filter.page,
    text: filter.text,
    routeId: filter.routeId,
  }
  const rs = await getListFareTable(params)
  if (rs.status === 200) {
    listFareTable.value = rs.data.content
    filter.total = rs.data.totalElements
  }
  listLoading.value = false
}
const searchData = () => {
  getList()
}
const handleAddFareTable = () => {
  console.log(listFareTable.value)
  router.push(`/administration/category/fare-table/add`)
}
const handleShowFareTableDetail = data => {
  if (roleData.canRead) {
    router.push(`/administration/category/fare-table/view/${data.id}`)
  }
}
const handleDeleteFareTable = async () => {
  console.log(fareTableInfo.value.id)
  const rs = await apiDeleteFareTable(fareTableInfo.value.id)
  if (rs.status === 200) {
    ElMessage({
      message: t('omsSetting.deleteSuccess'),
      type: 'success',
      duration: 3 * 1000,
    })
    getList()
    deleteFareTableDialog.value = false
  } else {
    ElMessage({
      message: t('el.image.error'),
      type: 'error',
      duration: 3 * 1000,
    })
  }
  deleteFareTableDialog.value = false
}
const openDialogDelete = row => {
  fareTableInfo.value = row
  deleteFareTableDialog.value = true
}
const openDialogActive = row => {
  titleDialogStatus.value = t('configUser.activeFareTable')
  typeStatus.value = 'active'
  fareTableInfo.value = row
  activeFareTableDialog.value = true
}
const openDialogClose = row => {
  titleDialogStatus.value = t('configUser.closedFareTable')
  typeStatus.value = 'closed'
  fareTableInfo.value = row
  activeFareTableDialog.value = true
}
const handleEditFareTable = data => {
  router.push(`/administration/category/fare-table/edit/${data.id}`)
}
const handleActiveFareTable = async statusFare => {
  const params = {
    id: fareTableInfo.value.id,
    status: statusFare,
  }
  const rs = await apiStatusFareTable(params)
  if (rs.status === 200) {
    ElMessage({
      message: t('omsSetting.successUpdate'),
      type: 'success',
      duration: 3 * 1000,
    })
    getList()
    activeFareTableDialog.value = false
  } else {
    ElMessage({
      message: t('el.image.error'),
      type: 'error',
      duration: 3 * 1000,
    })
  }
  activeFareTableDialog.value = false
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

<style lang="scss">
.padding-table .el-table__cell {
  padding: 16px 0;
}

.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}
</style>
