<template>
  <div>
    <hr class="margin-bottom-12 mt-1" />
    <div class="paddingX-24 mb-4">
      <div class="px-3 py-3 bg-white">
        <el-table
          ref="tableRef"
          v-loading="listLoading"
          fit
          :data="listApp"
          :row-key="row => row.id"
          :tree-props="{ children: 'children', hasChildren: 'stations' }"
          :indent="20"
          class="table-custom"
        >
          <el-table-column
            type="index"
            width="40"
          >
            <template #default="{ row }">
              <span v-if="row.children">
                {{ getParentIndex(row) }}
              </span>
              <span v-else>{{ '' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            :label="t('monitoring.deviceETC.nameApp')"
          >
            <template #default="{ row }">
              <div
                class="flex items-center gap-2.5 pointer"
                @click="toggleRow(row)"
              >
                <el-avatar
                  v-if="row.fileVaults[0]"
                  shape="square"
                  :src="baseUrl + row.fileVaults[0].filePath"
                ></el-avatar>
                <el-avatar
                  v-else
                  shape="square"
                  :src="null"
                ></el-avatar>
                <span class="ms-2">{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.operation')"
            width="100"
          >
            <template #default="{ row }">
              <span
                v-if="roleData.canUpdate"
                @click.stop="editDeviceETC(row)"
                class="delete-member pointer ms-2 me-3"
              >
                <svg-icon
                  style="width: 24px; height: 24px"
                  icon-class="edit-administrative"
                  class="mr-2"
                />
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <Dialog
      :show="showDialog"
      :appendToBody="true"
      :width="'682'"
      :title="t('monitoring.deviceETC.infoApp')"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <ViewETCDevice
          @closeUpdate="handleCloseDialog"
          :deviceInfo="infoDeviceETC"
          :canEditLink="canEdit"
          :typeDialog="!typeDialog"
        >
        </ViewETCDevice>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import { useI18n } from '@/locale'
import Dialog from '@/components/Dialog/index.vue'
import ViewETCDevice from '@/views/monitoring/ETC-device/viewETCDevice.vue'
import { apiGetListDevice } from '@/api/deviceETC'
import { usePermissionStore } from '@/store'
import { useConfig } from '@/config'
import { ElMessage } from 'element-plus'

const config = useConfig()
const { t } = useI18n()
const baseUrl = ref(config.VITE_APP_UPLOAD_URL)
const { roleData } = usePermissionStore()
const listLoading = ref(false)
const infoDeviceETC = ref({})
const showDialog = ref(false)
const typeDialog = ref(true)
const canEdit = ref(false)
const tableRef = ref(null)
const listApp = ref([])

onMounted(() => {
  getList()
})

const getList = async () => {
  const rs = await apiGetListDevice()
  if (rs.status === 200) {
    listApp.value = rs.data
  }
}
const handleCloseDialog = () => {
  showDialog.value = false
  getList()
}
const editDeviceETC = data => {
  if (data.children.length > 0) {
    canEdit.value = true
  }
  typeDialog.value = checkShowEdit(data)
  infoDeviceETC.value = data
  showDialog.value = true
}
const toggleRow = row => {
  if (tableRef.value) {
    if (row.children.length < 1) {
      const url = row.link
      if (url === null || url === '') {
        ElMessage.info('Chưa có link thiết bị')
        return
      }
      window.open(url, '_blank')
    }
    row._expanded = !row._expanded
    tableRef.value.toggleRowExpansion(row)
  }
}
const getParentIndex = row => {
  const parentIndex = listApp.value.findIndex(item => item.id === row.id)
  if (parentIndex !== -1) {
    return parentIndex + 1
  }
  for (const item of listApp.value) {
    const childIndex = item.children.findIndex(child => child.id === row.id)
    if (childIndex !== -1) {
      return ''
    }
  }
  return null
}
const checkShowEdit = row => {
  const parentIndex = listApp.value.findIndex(child => child.id === row.id)
  if (parentIndex !== -1 && (parentIndex === 2 || parentIndex === 1)) {
    return false
  } else {
    console.log('')
    // const childIndex = listApp.value[1].children.findIndex(child => child.id === row.id)
    // const childIndex2 = listApp.value[2].children.findIndex(child => child.id === row.id)
    // return !(childIndex !== -1 || childIndex2 !== -1)
    return true
  }
}
</script>

<style scoped lang="scss">
.pointer {
  cursor: pointer;
}

.el-table--default {
  :deep(.cell) {
    padding: 0 6px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>
