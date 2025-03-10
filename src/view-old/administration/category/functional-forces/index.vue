<template>
  <div>
    <div class="flex items-center justify-between paddingX-24 mt-5">
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
            {{ $t('configUser.addFunctionalForces') }}
          </div>
        </el-button>
      </div>
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <!--  Table  -->
    <div
      v-if="roleData.canRead"
      class="paddingX-24 mt-3"
    >
      <div class="padding-12 bg-white">
        <el-table
          v-loading="listLoading"
          :data="list"
          row-key="id"
          fit
          highlight-current-row
          style="width: 100%"
          class="cell-main-3"
          @row-click="handleShowForcesDetail"
        >
          <el-table-column
            prop="STT"
            label="STT"
            class="py-2"
            width="50"
          >
            <template #default="{ $index }">
              <span>{{ (filter.page - 1) * filter.size + $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            :label="$t('configUser.forceName')"
            width="200"
          >
            <template #default="{ row }">
              <span>{{ row.functionalForceName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            :label="$t('configUser.forceCode')"
            width="200"
          >
            <template #default="{ row }">
              <span
                :title="row.code"
                class="text-hover"
                >{{ row.code }}</span
              >
            </template>
          </el-table-column>
          <el-table-column :label="$t('configUser.nbHotlineForce')">
            <template #default="{ row }">
              <span :title="row.name">{{ row.hotlineNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('configUser.nbPhoneForce')">
            <template #default="{ row }">
              <span :title="row.name">{{ row.contactPersonPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('configUser.nameOfficerForce')">
            <template #default="{ row }">
              <span :title="row.name">{{ row.contactPersonName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Email"
            width="200"
          >
            <template #default="{ row }">
              <span :title="row.name">{{ row.contactPersonEmail }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('configUser.operation')"
            width="160"
          >
            <template #default="{ row }">
              <span
                v-if="roleData.canUpdate"
                @click.stop="handleEditForces(row)"
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
        <AddForces
          :typeDialog="typeShow"
          :forcesInfo="infoForces"
          @closeUpdate="handleCloseDialog"
        />
      </template>
    </Dialog>
    <el-dialog
      v-model="deleteForcesDialog"
      :title="$t('configUser.deleteFunctionalForces')"
      width="500"
      align-center
    >
      <span>{{ $t('omsSetting.confirmDelete') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="deleteForcesDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            v-if="roleData.canDelete"
            class="el-button--main"
            @click="handleDeleteForces()"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { deleteForces, getListForces } from '@/api/functional-forces'
import { useRouter } from 'vue-router'
import Dialog from '@/components/Dialog'
import Pagination from '@/components/Pagination/index.vue'
import AddForces from './components/add.vue'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-unified'
import { useI18n } from '@/locale'
import { usePermissionStore } from '@/store'
const { t } = useI18n()

const router = useRouter()
const { roleData } = usePermissionStore()
const listLoading = ref(true)
const list = ref([])
const showDialog = ref(false)
const typeShow = ref('add')
const infoForces = ref({
  route: {
    id: '',
  },
})
const titleDialog = ref(t('configUser.addFunctionalForces'))
const deleteForcesDialog = ref(false)
const defaultFilter = {
  page: 1,
  size: 10,
  total: 0,
}
const filter = reactive(cloneDeep(defaultFilter))

onMounted(() => {
  getList()
})

const getList = async () => {
  listLoading.value = true
  const params = {
    pageIndex: filter.page,
    pageSize: filter.size,
  }
  const rs = await getListForces(params)
  if (rs.status === 200) {
    list.value = rs.data.content
    filter.total = rs.data.totalElements
    listLoading.value = false
  }
  listLoading.value = false
}

const handleAddForces = () => {
  typeShow.value = 'add'
  infoForces.value = {
    functionalForceName: '',
    route: {
      id: '',
    },
    functionalForceDescription: '',
    hotlineNumber: '',
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
  }
  showDialog.value = true
}

const handleCloseDialog = () => {
  showDialog.value = false
  getList()
}
const handleEditForces = data => {
  titleDialog.value = t('configUser.editFunctionalForces')
  typeShow.value = 'edit'
  infoForces.value = data
  showDialog.value = true
}
const handleShowForcesDetail = data => {
  if (roleData.canRead) {
    titleDialog.value = t('configUser.detailsInfo')
    typeShow.value = 'view'
    infoForces.value = data
    showDialog.value = true
  }
}
const handleDeleteForces = async () => {
  console.log(infoForces.value.id)
  const rs = await deleteForces(infoForces.value.id)
  if (rs.status === 200) {
    ElMessage({
      message: t('omsSetting.deleteSuccess'),
      type: 'success',
      duration: 3 * 1000,
    })
    await getList()
    deleteForcesDialog.value = false
  } else {
    ElMessage({
      message: t('el.image.error'),
      type: 'error',
      duration: 3 * 1000,
    })
  }
  deleteForcesDialog.value = false
}

const openDialogDelete = data => {
  infoForces.value = data
  deleteForcesDialog.value = true
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
