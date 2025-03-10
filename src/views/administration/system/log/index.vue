<template>
  <div class="">
    <div class="flex flex-wrap gap-px-8 paddingX-24 padding-top-14 padding-bottom-10">
      <el-select
        v-model="filter.status"
        class="w-full md:max-w-[30%] lg:max-w-[250px] height-32"
        clearable
        :placeholder="t('configUser.status')"
      >
        <el-option
          v-for="item in listStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="filter.serviceName"
        class="w-full md:max-w-[30%] lg:max-w-[250px] height-32"
        placeholder="Module"
        clearable
      >
        <el-option
          v-for="item in listModule"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-model="filter.startEnd"
        type="daterange"
        :start-placeholder="t('el.datepicker.startTime')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.endTime')"
        clearable
        value-format="YYYY-MM-DD"
        format="DD/MM/YYYY"
        class="w-full md:max-w-[30%] lg:max-w-[300px] flex-grow-0 height-32"
      />
      <el-button
        class="fs-14 height-32 el-button--main rounded-[2px]"
        @click="search"
        >{{ t('placeholder.search') }}
      </el-button>
    </div>
    <hr class="margin-bottom-12" />
    <div class="paddingX-24">
      <div
        v-loading="loading"
        class="padding-12 bg-white"
      >
        <el-table
          id="data-table"
          :data="listData"
          style="width: 100%"
          :max-height="730"
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
            class-name="highlight"
          >
            <template #default="{ $index }">
              <span>{{ (filter.page - 1) * filter.size + $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('administration.backup.folder')"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span>{{ row.directory }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="t('administration.backup.fileName')"
            class-name="highlight"
          >
            <template #default="{ row }">
              <el-link
                type="primary"
                @click="handleView(row)"
                v-if="row.status === 'STORED'"
                >{{ row.name }}</el-link
              >
              <span v-else>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="IP"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span>{{ row.ipAddress }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Module">
            <template #default="{ row }">
              <span>{{ row.serviceName }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('administration.log.time')">
            <template #default="{ row }">
              <span>{{ formatDateTime(row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('omsSetting.status')">
            <template #default="{ row }">
              <el-tag
                type="success"
                v-if="row.status === 'STORED'"
                >{{ t('administration.backup.stored') }}</el-tag
              >
              <el-tag
                type="warning"
                v-if="row.status === 'DELETED'"
                >{{ t('administration.backup.tempDeleted') }}</el-tag
              >
              <el-tag
                type="danger"
                v-if="row.status === 'PERMANENTLY_DELETED'"
                >{{ t('administration.backup.permanentDeleted') }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.action')">
            <template #default="{ row }">
              <div class="flex flex-wrap items-center gap-px-8">
                <template v-if="row.status === 'STORED'">
                  <el-button
                    type="warning"
                    class="width-130"
                    @click="handleTempDelete(row)"
                    :loading="processing[row.id]"
                    >{{ t('administration.backup.tempDelete') }}</el-button
                  >
                  <el-button
                    type="danger"
                    class="width-130 !ml-0"
                    @click="handlePermanentDelete(row)"
                    :loading="processing[row.id]"
                    >{{ t('administration.backup.permanentDelete') }}</el-button
                  >
                  <el-button
                    type="primary"
                    class="width-130 !ml-0"
                    @click="handleDownload(row)"
                    :loading="processing[row.id]"
                    >{{ t('administration.log.download') }}</el-button
                  >
                </template>
                <template v-if="row.status === 'DELETED'">
                  <el-button
                    type="success"
                    class="width-130"
                    @click="handleRestore(row)"
                    :loading="processing[row.id]"
                    >{{ t('administration.backup.restore') }}</el-button
                  >
                  <el-button
                    type="danger"
                    class="width-130 !ml-0"
                    @click="handlePermanentDelete(row)"
                    :loading="processing[row.id]"
                    >{{ t('administration.backup.permanentDelete') }}</el-button
                  >
                </template>
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
    <ViewLog
      :loading="loadingView"
      :content="contentView"
      :dialog-visible="showView"
      @handle-close-view="handleCloseView"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useAppStore, useSearchStore } from '@/store'
import lang from '@/locale/getMessage.js'
import { useI18n } from '@/locale'

import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'
import { cloneDeep } from 'lodash-unified'
import { formatDateTime } from '@/utils/date'
import Pagination from '@/components/Pagination'
import { apiLogConfig, apiGetListService } from '@/api/systemconfig'
import { ElMessage, ElMessageBox } from 'element-plus'
import ViewLog from './components/ViewLog'

const { t } = useI18n()

const defaultFilter = {
  page: 1,
  size: 15,
  serviceName: null,
  status: null,
  startEnd: [moment().add(-7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
}

const filter = reactive(cloneDeep(defaultFilter))
const loading = ref(true)

const handleChangeType = vel => {}

const listStatus = ref([
  { label: t('administration.backup.stored'), value: 'STORED' },
  { label: t('administration.backup.tempDeleted'), value: 'DELETED' },
  { label: t('administration.backup.permanentDeleted'), value: 'PERMANENTLY_DELETED' },
])

const listModule = ref([])

const getListModule = () => {
  const data = {
    method: 'LIST',
  }
  apiGetListService(data).then(res => {
    listModule.value = res.data.data
  })
}

const listData = ref([])
const totalValue = ref(0)

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
onMounted(async () => {
  getListModule()
  getList()
})
const getList = async () => {
  loading.value = true
  const { serviceName, page, size, status, startEnd } = filter
  const params = {
    method: 'LIST',
    arguments: {
      page: page - 1,
      size,
      serviceName: serviceName?.length > 0 ? serviceName : null,
      status: status?.length > 0 ? status : null,
      createdAt: {
        from: startEnd[0],
        to: startEnd[1],
      },
    },
  }
  apiLogConfig(params)
    .then(res => {
      if (res.data) {
        listData.value = res.data.data
        totalValue.value = res.data.totalItems
      } else {
        listData.value = []
        totalValue.value = 0
      }
    })
    .catch(_ => {
      listData.value = []
      totalValue.value = 0
    })
    .finally(_ => {
      loading.value = false
    })
}

const processing = reactive({})
const handleTempDelete = row => {
  ElMessageBox.confirm(t('administration.backup.confirmTempDelete'), t('omsSetting.warning'), {
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
          id: row.id,
        },
      }
      processing[row.id] = true
      apiLogConfig(data)
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
          processing[row.id] = false
        })
    })
    .catch(() => {})
}
const handlePermanentDelete = row => {
  ElMessageBox.confirm(t('administration.backup.confirmPermanentDelete'), t('omsSetting.warning'), {
    confirmButtonText: t('omsSetting.confirm'),
    cancelButtonText: t('omsSetting.cancel'),
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  })
    .then(() => {
      const data = {
        method: 'DELETE_PERMANENTLY',
        arguments: {
          id: row.id,
        },
      }
      processing[row.id] = true
      apiLogConfig(data)
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
          processing[row.id] = false
        })
    })
    .catch(() => {})
}

const handleRestore = row => {
  ElMessageBox.confirm(t('administration.backup.confirmRestore'), t('omsSetting.warning'), {
    confirmButtonText: t('omsSetting.confirm'),
    cancelButtonText: t('omsSetting.cancel'),
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  })
    .then(() => {
      const data = {
        method: 'RESTORE',
        arguments: {
          id: row.id,
        },
      }
      processing[row.id] = true
      apiLogConfig(data)
        .then(res => {
          ElMessage({
            type: 'success',
            message: t('administration.log.restoreSuccess'),
          })
          getList()
        })
        .catch(_ => {
          ElMessage({
            type: 'error',
            message: t('omsSetting.failUpdate'),
          })
        })
        .finally(_ => {
          processing[row.id] = false
        })
    })
    .catch(() => {})
}

const handleDownload = row => {
  const data = {
    method: 'DOWNLOAD',
    arguments: {
      id: row.id,
    },
  }
  processing[row.id] = true
  apiLogConfig(data)
    .then(res => {
      const { name, data } = res.data
      downloadFileBase64(name, data)
    })
    .finally(_ => {
      processing[row.id] = false
    })
}

const showView = ref(false)
const loadingView = ref(false)
const contentView = reactive({
  content: null,
  fileName: '',
})

const handleCloseView = () => {
  showView.value = false
  loadingView.value = false
  contentView.content = null
  contentView.fileName = ''
}
const handleView = row => {
  if (row.status === 'STORED') {
    showView.value = true
    loadingView.value = true
    contentView.fileName = row.name

    const data = {
      method: 'READ',
      arguments: {
        id: row.id,
      },
    }
    apiLogConfig(data)
      .then(res => {
        contentView.content = res.data.content
      })
      .catch(_ => {
        showView.value = true
      })
      .finally(_ => {
        loadingView.value = false
      })
  }
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

defineOptions({
  name: 'LogManagement',
})
</script>

<style scoped lang="scss">
:deep(.el-tag) {
  border-radius: 3px;
  padding: 1px 9px;
}

//:deep(.el-tag.el-tag--success) {
//  color: #34C759;
//  border: 1px solid #AEE9BD;
//  background: #F5FCF6;
//}
//
//:deep(.el-tag.el-tag--warning) {
//  color: #FD8312;
//  border: 1px solid #FD8312;
//  background: #FFE7D1;
//}
//
//:deep(.el-tag.el-tag--danger) {
//  color: #FF3B49;
//  border: 1px solid #FCAEB3;
//  background: #FFECEF;
//}
:deep(td.el-table__cell .cell) {
  color: #76809b;
}

:deep(td.el-table__cell.highlight .cell) {
  color: #000000;
}
</style>
