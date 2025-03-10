<template>
  <div class="">
    <div class="flex flex-wrap gap-px-8 paddingX-24 padding-top-14 padding-bottom-10">
      <!--      <el-input-->
      <!--          v-model="filter.username"-->
      <!--          class="w-full md:max-w-[30%] lg:max-w-[250px]"-->
      <!--          :placeholder="$t('configUser.userManagement.username')"-->
      <!--          @keyup.enter="getList"-->
      <!--      />-->
      <!--      <el-select-->
      <!--          v-model="filter.type"-->
      <!--          class="w-full md:max-w-[30%] lg:max-w-[250px]"-->
      <!--          @change="handleChangeType"-->
      <!--      >-->
      <!--        <el-option-->
      <!--            v-for="item in listType"-->
      <!--            :key="item.value"-->
      <!--            :label="t(item.label)"-->
      <!--            :value="item.value"-->
      <!--        >-->
      <!--        </el-option>-->
      <!--      </el-select>-->
      <el-date-picker
        v-model="filter.startEnd"
        type="daterange"
        :start-placeholder="t('el.datepicker.startTime')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.endTime')"
        value-format="YYYY-MM-DD"
        format="DD/MM/YYYY"
        class="w-full md:max-w-[30%] lg:max-w-[300px] flex-grow-0 height-32"
        clearable
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
          ref="multipleTable"
          :data="listData"
          style="width: 100%"
          max-height="670"
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
          <el-table-column :label="t('administration.backup.folder')">
            <template #default="{ row }">
              <span>{{ row.directory }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="t('administration.backup.fileName')">
            <template #default="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('administration.backup.time')">
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
                    >{{ t('administration.backup.tempDelete') }}</el-button
                  >
                  <el-button
                    type="danger"
                    class="width-130 !ml-0"
                    @click="handlePermanentDelete(row)"
                    >{{ t('administration.backup.permanentDelete') }}</el-button
                  >
                </template>
                <template v-if="row.status === 'DELETED'">
                  <el-button
                    type="success"
                    class="width-130"
                    @click="handleRestore(row)"
                    >{{ t('administration.backup.restore') }}</el-button
                  >
                  <el-button
                    type="danger"
                    class="width-130 !ml-0"
                    @click="handlePermanentDelete(row)"
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
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useAppStore, useSearchStore } from '@/store'
import lang from '@/locale/getMessage.js'
import { useI18n } from '@/locale'

import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'
import { cloneDeep } from 'lodash-unified'
import { formatDateTime } from '@/utils/date'
import Pagination from '@/components/Pagination'
import { apiBackupHistory } from '@/api/systemconfig'
import { ElMessage, ElMessageBox } from 'element-plus'

const { t } = useI18n()

const defaultFilter = {
  page: 1,
  size: 15,
  username: null,
  type: null,
  startEnd: [moment().add(-7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
}

const filter = reactive(cloneDeep(defaultFilter))
const loading = ref(true)

const handleChangeType = vel => {}

const listType = ref([])

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
onMounted(() => {
  getList()
})
const getList = async () => {
  loading.value = true
  const { startEnd, page, size } = filter
  const params = {
    method: 'LIST',
    arguments: {
      page: page - 1,
      size,
      createdAt: {
        from: startEnd[0],
        to: startEnd[1],
      },
    },
  }
  apiBackupHistory(params)
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
  loading.value = false
}

const processing = ref(false)
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
      apiBackupHistory(data)
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
      apiBackupHistory(data)
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
      apiBackupHistory(data)
        .then(res => {
          ElMessage({
            type: 'success',
            message: t('administration.backup.restoreSuccess'),
          })
          getList()
        })
        .catch(_ => {
          ElMessage({
            type: 'error',
            message: t('omsSetting.failUpdate'),
          })
        })
    })
    .catch(() => {})
}

defineOptions({
  name: 'BackupHistory',
})
</script>

<style scoped lang="scss">
:deep(.el-tag) {
  border-radius: 3px;
  padding: 1px 9px;
}

:deep(.el-tag.el-tag--success) {
  color: #34c759;
  border: 1px solid #aee9bd;
  background: #f5fcf6;
}

:deep(.el-tag.el-tag--warning) {
  color: #fd8312;
  border: 1px solid #fd8312;
  background: #ffe7d1;
}

:deep(.el-tag.el-tag--danger) {
  color: #ff3b49;
  border: 1px solid #fcaeb3;
  background: #ffecef;
}
</style>
