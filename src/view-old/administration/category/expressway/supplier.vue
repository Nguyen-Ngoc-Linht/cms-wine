<template>
  <div>
    <div class="flex items-center justify-between paddingX-24 mt-0">
      <div class="flex gap-px-8 items-center">
        <el-button
          text
          v-if="roleData.canCreate"
          size="default"
          class="!p-0"
          @click="handleAddSupplier"
        >
          <div
            class="flex items-center pointer text-[#525B73]"
            style="line-height: 20px"
          >
            <svg-icon
              icon-class="el-icon-plus"
              class="width-20 height-20 margin-right-4"
            />
            {{ $t('configUser.addSupplier') }}
          </div>
        </el-button>
      </div>
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <div class="paddingX-24">
      <div class="p-3 bg-white">
        <el-table
          v-loading="listLoading"
          :data="listSupplier"
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
            :label="t('configUser.codeSupplier')"
            width="200"
          >
            <template #default="{ row }">
              <span class="text-black bold">{{ row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.nameSupplier')">
            <template #default="{ row }">
              <span class="text-black bold">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.address')">
            <template #default="{ row }">
              <span class="text-black bold">{{ row.address }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.phoneNumber1')"
            width="250"
          >
            <template #default="{ row }">
              <span class="text-black bold text-center">{{ row.contactNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.servicePeriod')"
            width="250"
          >
            <template #default="{ row }">
              <span class="text-black bold text-center">{{
                row.duration && row.duration > 0 ? `${row.duration} ${t('el.datepicker.year')}` : ''
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.operation')"
            width="250"
          >
            <template #default="{ row }">
              <span
                v-if="roleData.canUpdate"
                @click.stop="handleEditSupplier(row)"
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

    <el-dialog
      v-model="deleteSupplierDialog"
      :title="$t('configUser.deleteSupplier')"
      width="500"
      align-center
    >
      <span>{{ $t('configUser.confirmDeleteSupplier') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="deleteSupplierDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            v-if="roleData.canDelete"
            class="el-button--main"
            @click="handleDeleteSupplier()"
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
import { dayjs, ElMessage } from 'element-plus'
import { useI18n } from '@/locale'
import { cloneDeep } from 'lodash-unified'
import { usePermissionStore } from '@/store'
import { apiDeleteSupplier, apiGetListSupplier } from '@/api/expressway'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const router = useRouter()
const defaultFilter = reactive({
  page: 1,
  size: 10,
  total: 0,
})
const filter = reactive(cloneDeep(defaultFilter))
const listLoading = ref(false)
const deleteSupplierDialog = ref(false)

const listSupplier = ref([])
const infoSupplier = ref({})

onMounted(() => {
  getList()
})

const getList = async () => {
  try {
    listLoading.value = true
    const params = {
      size: filter.size,
      page: filter.page,
    }
    const rs = await apiGetListSupplier(params)
    if (rs.status === 200) {
      listSupplier.value = rs.data.content
      filter.total = rs.data.totalElements
      listLoading.value = false
    }
  } catch (e) {
    listLoading.value = false
    console.log(e)
  }
}
const handleAddSupplier = () => {
  router.push(`/administration/category/supplier/`)
}
const handleEditSupplier = data => {
  router.push(`/administration/category/supplier/${data.id}`)
}
const handleDeleteSupplier = async () => {
  try {
    const rs = await apiDeleteSupplier(infoSupplier.value.id)
    if (rs.status === 200) {
      await getList()
      ElMessage({
        message: t('omsSetting.deleteSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      deleteSupplierDialog.value = false
    }
  } catch (e) {
    deleteSupplierDialog.value = false
    console.log(e)
  }
}
const openDialogDelete = data => {
  infoSupplier.value = data
  deleteSupplierDialog.value = true
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
