<template>
  <div>
    <div class="flex items-center justify-between paddingX-24 mt-0">
      <div class="flex gap-px-8 items-center">
        <el-button
          text
          v-if="roleData.canCreate"
          size="default"
          class="!p-0"
          @click="handleAddExpressways"
        >
          <div
            class="flex items-center pointer text-[#525B73]"
            style="line-height: 20px"
          >
            <svg-icon
              icon-class="el-icon-plus"
              class="width-20 height-20 margin-right-4"
            />
            {{ $t('configUser.addExpressway') }}
          </div>
        </el-button>
      </div>
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <div class="paddingX-24">
      <div class="px-3 py-3 bg-white">
        <el-table
          v-loading="listLoading"
          :data="listExpressway"
          row-key="id"
          fit
          highlight-current-row
          style="width: 100%"
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
            :label="t('configUser.routeName')"
            width="200"
          >
            <template #default="{ row }">
              <span class="text-black bold">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.routeCode')"
            width="200"
          >
            <template #default="{ row }">
              <span class="text-black bold">{{ row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.routeDescription')">
            <template #default="{ row }">
              <span class="text-black bold">{{ row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.timePutsIntoOperation')"
            width="250"
          >
            <template #default="{ row }">
              <span
                :title="row.inaugurationDay"
                class="text-black bold text-center"
                >{{ row.inaugurationDay ? formatDate(row.inaugurationDay) : '' }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.operation')"
            width="250"
          >
            <template #default="{ row }">
              <span
                v-if="roleData.canUpdate"
                @click.stop="handleEditExpressways(row)"
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
                @click.stop="openDialogDelete(row)"
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

    <Dialog
      :show="showDialog"
      :appendToBody="true"
      :width="'682'"
      :title="titleDialog"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <ViewExpressway
          :typeDialog="typeShow"
          :expresswayInfo="infoExpresswayDetail"
          @closeUpdate="handleCloseDialog"
        />
      </template>
    </Dialog>
    <el-dialog
      v-model="deleteExpressDialog"
      :title="$t('configUser.deleteExpressway')"
      width="500"
      align-center
    >
      <span>{{ $t('omsSetting.confirmDelete') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="deleteExpressDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            v-if="roleData.canDelete"
            class="el-button--main"
            @click="handleDeleteExpressways()"
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
import ViewExpressway from './components/viewExpressway.vue'
import { dayjs, ElMessage } from 'element-plus'
import { apiDeleteRoute, getListRoute } from '@/api/expressway'
import { useI18n } from '@/locale'
import { cloneDeep } from 'lodash-unified'
import { usePermissionStore } from '@/store'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const defaultFilter = reactive({
  page: 1,
  size: 10,
  total: 0,
})
const filter = reactive(cloneDeep(defaultFilter))
const listLoading = ref(false)
const showDialog = ref(false)
const deleteExpressDialog = ref(false)
const typeShow = ref('add')
const titleDialog = ref(t('configUser.addExpressway'))
const infoExpresswayDetail = ref({})
const listExpressway = ref([])

onMounted(() => {
  getList()
})

const getList = async () => {
  listLoading.value = true
  const params = {
    page: filter.page,
    size: filter.size,
  }
  const rs = await getListRoute(params)
  if (rs.status === 200) {
    listExpressway.value = rs.data.dataRows
    listLoading.value = false
    filter.total = rs.data.totalCount
  }
  listLoading.value = false
}

const handleAddExpressways = () => {
  titleDialog.value = t('configUser.addExpressway')
  typeShow.value = 'add'
  infoExpresswayDetail.value = {}
  showDialog.value = true
}
const handleEditExpressways = async data => {
  titleDialog.value = t('configUser.editExpressway')
  typeShow.value = 'edit'
  infoExpresswayDetail.value = data
  showDialog.value = true
}
const handleDeleteExpressways = async () => {
  const rs = await apiDeleteRoute(infoExpresswayDetail.value.id)
  if (rs.status === 200) {
    ElMessage({
      message: t('omsSetting.deleteSuccess'),
      type: 'success',
      duration: 3 * 1000,
    })
    deleteExpressDialog.value = false
  } else {
    ElMessage({
      message: t('el.image.error'),
      type: 'error',
      duration: 3 * 1000,
    })
  }
  deleteExpressDialog.value = false
  getList()
}
const handleCloseDialog = () => {
  showDialog.value = false
  getList()
}
const openDialogDelete = data => {
  infoExpresswayDetail.value = data
  deleteExpressDialog.value = true
}
const handleSizeChange = size => {
  filter.size = size
  getList()
}
const handlePageChange = page => {
  filter.page = page
  getList()
}
const formatDate = dateStr => {
  return dayjs(dateStr).format('DD/MM/YYYY')
}
</script>
