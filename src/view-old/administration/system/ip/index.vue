<template>
  <div>
    <!--    <div class="page-header z-[100] bg-[#fff] flex items-center justify-between sticky z-[1000] top-0 left-0 right-0 height-50 border-b border-[#CDCDCE]">-->
    <!--      <div-->
    <!--          class="flex gap-px-8 items-center paddingX-12 paddingY-12"-->
    <!--          @click="backToList"-->
    <!--      >-->
    <!--        <svg-icon-->
    <!--            icon-class="back"-->
    <!--            class="color-[#525B73] cursor-pointer width-20 height-20"-->
    <!--        />-->
    <!--        <span class="text-[18px] text-[#525B73]">-->
    <!--            {{ t('el.pageHeader.title') }}-->
    <!--          </span>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="flex items-center justify-between paddingX-24 paddingY-10">
      <div class="flex gap-px-16 items-center">
        <el-button
          text
          size="default"
          class="!p-0"
          @click="handleAdd"
          v-if="roleData.canCreate"
        >
          <div class="text-gray flex items-center pointer text-[#525B73]">
            <svg-icon
              icon-class="el-icon-plus"
              class="width-20 height-20 margin-right-4"
            />
            {{ $t('configUser.addNew') }}
          </div>
        </el-button>
        <ImportExcel
          :button-text="t('administration.ip.import')"
          :dialog-title="t('administration.ip.import')"
          :dialog-text="t('administration.ip.importText')"
          :max-size="5000000"
          @on-success="getList"
          v-if="roleData.canCreate"
        />
        <Export
          :file-name="t('configUser.userManagement.userList')"
          :data="dataExport"
          class="p-0"
          @export="handleExport"
          :button-text="t('administration.ip.export')"
          v-if="roleData.canExport"
        />
      </div>
    </div>
    <hr class="margin-bottom-12" />
    <div class="paddingX-24">
      <div
        v-loading="loading"
        class="padding-12 bg-white"
      >
        <el-table
          ref="multipleTable"
          :data="listData"
          style="width: 100%"
          row-class-name="active-row"
          @sort-change="handleSortChange"
          max-height="730"
        >
          <!--        <el-table-column-->
          <!--            type="selection"-->
          <!--            width="55"-->
          <!--            label="#"-->
          <!--            :selectable="canSelectRow"-->
          <!--        />-->
          <el-table-column
            :label="t('configUser.orderNumber')"
            width="75px"
          >
            <template #default="{ $index }">
              <span>{{ (filter.page - 1) * filter.size + $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="IP">
            <template #default="{ row }">
              <span>{{ row.ipAddress }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.action')"
            v-if="roleData.canUpdate || roleData.canDelete"
          >
            <template #default="{ row }">
              <div class="flex flex-wrap items-center gap-px-8">
                <div
                  class="pointer"
                  @click="showEdit(row.ipAddress)"
                  v-if="roleData.canUpdate"
                >
                  <svg-icon
                    icon-class="edit-administrative"
                    class="width-24 height-24"
                  />
                </div>
                <div
                  class="pointer"
                  @click="handleDelete(row)"
                  v-if="roleData.canDelete"
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
            :total="totalValue"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
    <AddIp
      v-model:dialogVisible="showAdd"
      :select-value="editValue"
      @handle-close="closeDialog"
      @handle-add-success="handleAddSuccess"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useAppStore, usePermissionStore } from '@/store'
import lang from '@/locale/getMessage.js'
import { useI18n } from '@/locale'

import { useRoute, useRouter } from 'vue-router'
import Export from '@/components/Export'
import AddIp from './components/add-ip.vue'
import Pagination from '@/components/Pagination'
import ImportExcel from './components/import-excel.vue'
import { apiIpConfig } from '@/api/systemconfig'
import { ElMessage, ElMessageBox } from 'element-plus'

const { roleData } = usePermissionStore()
const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const locale = computed(() => lang[appStore.lang])
const loading = ref(true)

const listData = ref([])
const dataExport = ref(null)
const totalValue = ref(0)

const filter = reactive({
  page: 1,
  size: 15,
  sort: {
    properties: 'createdAt',
    direction: 'DESC',
  },
})

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

const handleSortChange = ({ column, prop, order }) => {
  console.log(`Sorted by ${prop}, order: ${order}`)
  // prop: the sorted column
  // order: 'ascending' or 'descending'
}

onMounted(() => {
  getList()
})

const getList = async () => {
  loading.value = true
  const { page, size, sort } = filter
  const params = {
    method: 'LIST',
    arguments: {
      page: page - 1,
      size,
      sort: {
        direction: sort.direction,
        properties: [sort.properties],
      },
    },
  }
  apiIpConfig(params)
    .then(res => {
      listData.value = res.data.data
      totalValue.value = res.data.totalItems
    })
    .catch(_ => {
      listData.value = []
      totalValue.value = 0
    })
    .finally(_ => {
      loading.value = false
    })
}
const processing = ref(false)
const handleDelete = row => {
  ElMessageBox.confirm(t('administration.ip.confirmDelete'), t('omsSetting.warning'), {
    confirmButtonText: t('omsSetting.confirm'),
    cancelButtonText: t('omsSetting.cancel'),
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  })
    .then(() => {
      const data = {
        method: 'DELETE',
        arguments: {
          id: row.ipAddress,
        },
      }
      processing.value = true
      apiIpConfig(data)
        .then(res => {
          ElMessage({
            type: 'success',
            message: t('omsSetting.deleteSuccess'),
          })
          getList()
        })
        .catch(_ => {
          ElMessage({
            type: 'error',
            message: t('omsSetting.failDelete'),
          })
        })
        .finally(_ => {
          processing.value = false
        })
    })
    .catch(() => {})
}
const handleExport = () => {
  const data = {
    method: 'EXPORT',
    arguments: {
      type: 'EXCEL',
    },
  }
  processing.value = true
  apiIpConfig(data)
    .then(res => {
      const { name, data } = res.data
      downloadFileBase64(name, data)
    })
    .finally(_ => {
      processing.value = false
    })
}

const editValue = ref(null)

const handleAdd = () => {
  editValue.value = null
  showAdd.value = true
}

const showEdit = ip => {
  editValue.value = ip
  showAdd.value = true
}

const downloadFileBase64 = (fileName, data) => {
  // Decode base64 data
  const byteCharacters = atob(data)
  const byteNumbers = new Uint8Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const blob = new Blob([byteNumbers])
  const url = URL.createObjectURL(blob)

  // Create a link and trigger the download
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()

  // Clean up
  URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

const showAdd = ref(false)
const showAddDialog = () => {
  showAdd.value = true
}
const closeDialog = () => {
  showAdd.value = false
}
const handleAddSuccess = () => {
  showAdd.value = false
  getList()
}

const backToList = () => {
  router.back()
}

defineOptions({
  name: 'IPManager',
})
</script>

<style scoped></style>
