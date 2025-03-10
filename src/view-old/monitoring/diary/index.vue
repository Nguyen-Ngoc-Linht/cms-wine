<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5">
      <el-select
        v-model="filter.scoringWork"
        :placeholder="t('monitoring.diary.job')"
        clearable
        filterable
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listJob"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-model="filter.timeSearch"
        type="datetimerange"
        :start-placeholder="t('el.datepicker.startTime')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.endTime')"
        clearable
        value-format="YYYY-MM-DD"
        format="DD/MM/YYYY"
        @change="handleDateChange"
        class="w-full md:max-w-[30%] lg:max-w-[360px] flex-grow-0"
      />
      <el-button
        class="el-button--main"
        @click="searchListData()"
        >{{ t('configUser.search') }}</el-button
      >
    </div>
    <div class="flex flex-wrap items-center paddingX-24 mt-4 gap-px-8">
      <el-button
        v-if="roleData.canCreate"
        text
        size="default"
        class="!p-0"
        @click="handleOpenAddScoringLog()"
      >
        <div
          class="flex items-center pointer text-[#525B73]"
          style="line-height: 20px"
        >
          <svg-icon
            icon-class="el-icon-plus"
            class="width-20 height-20 margin-right-4"
          />
          {{ t('monitoring.diary.addDiary') }}
        </div>
      </el-button>
      <el-button
        v-if="roleData.canExport"
        @click="handleExportFileExcel()"
        text
        size="default"
        class="!p-0"
      >
        <div
          class="flex items-center pointer text-[#525B73]"
          style="line-height: 20px"
        >
          <svg-icon
            icon-class="import-file"
            class="width-20 height-20 margin-right-4 me-2"
          />
          {{ t('monitoring.tollCollectionReport.exportExcel') }}
        </div>
      </el-button>
      <el-button
        v-if="roleData.canExport"
        @click="handleExportFilePdf"
        text
        size="default"
        class="!p-0"
      >
        <div
          class="flex items-center pointer text-[#525B73]"
          style="line-height: 20px"
        >
          <svg-icon
            icon-class="import-file"
            class="width-20 height-20 me-2"
          />
          {{ t('monitoring.tollCollectionReport.exportPdf') }}
        </div>
      </el-button>
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <div class="paddingX-24 mb-4">
      <div class="px-3 py-3 bg-white">
        <TableViolation
          :listLoading="listLoading"
          :fields="fields"
          :data="listScoringLog"
          :selectRow="false"
          :STT="true"
          :page="filter.page"
          :size="filter.size"
        >
          <template #scoringWork="{ row }">
            <span>{{ row.scoringWork ? row.scoringWork.name : '' }}</span>
          </template>
          <template #content="{ row }">
            <span class="limited-content">{{ row.content }}</span>
          </template>
          <template #createTime="{ row }">
            <span>{{ formatDate(row.createTime) }}</span>
          </template>
          <template #fileVaults="{ row }">
            <p
              v-for="file of row.fileVaultsDTOS"
              :key="file.id"
              class="mt-2"
            >
              {{ file.fileName }}
            </p>
          </template>
          <template #modifyTime="{ row }">
            <span>{{ formatDate(row.modifyTime) }}</span>
          </template>
          <template #operation="{ row }">
            <el-tooltip
              v-if="roleData.canUpdate"
              :content="t('monitoring.diary.editDiary')"
              placement="bottom"
              effect="light"
            >
              <span
                @click.stop="handleEditScoringLog(row)"
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
              v-if="roleData.canDelete"
              :content="t('monitoring.diary.deleteDiary')"
              placement="bottom"
              effect="light"
            >
              <span
                @click.stop="openDialogDeleteScoringLog(row)"
                class="delete-member pointer ms-2 me-3"
              >
                <svg-icon
                  style="width: 24px; height: 24px"
                  icon-class="remove-administrative"
                  class="mr-2"
                />
              </span>
            </el-tooltip>
          </template>
        </TableViolation>
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
      :width="'1024'"
      :title="titleDialog"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <ViewDiary
          :typeDialog="typeDialog"
          :diaryInfo="infoScoringLog"
          @closeUpdate="handleCloseDialog"
        />
      </template>
    </Dialog>
    <el-dialog
      v-model="showDialogDelete"
      :title="$t('monitoring.diary.deleteDiary')"
      width="500"
      align-center
    >
      <span>{{ $t('omsSetting.confirmDelete') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="showDialogDelete = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            v-if="roleData.canDelete"
            class="el-button--main"
            @click="handleDeleteScoringLog()"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="showDialogExportExcel"
      :title="$t('monitoring.tollCollectionReport.exportExcel')"
      width="500"
      align-center
    >
      <span>{{ $t('monitoring.confirmExportFile') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="showDialogExportExcel = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            v-if="roleData.canExport"
            class="el-button--main"
            @click="handleExportFileExcel()"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="showDialogExportPdf"
      :title="$t('monitoring.tollCollectionReport.exportPdf')"
      width="500"
      align-center
    >
      <span>{{ $t('monitoring.confirmExportPdf') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="showDialogExportPdf = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            v-if="roleData.canExport"
            class="el-button--main"
            @click="handleExportFileExcel()"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from 'vue'
import Dialog from '@/components/Dialog/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { dayjs, ElMessage } from 'element-plus'
import ViewDiary from '@/views/monitoring/diary/viewDiary.vue'
import TableViolation from '@/components/Table/index.vue'
import { cloneDeep } from 'lodash-unified'
import { useI18n } from '@/locale'
import {
  apiDeleteScoringLog,
  apiExportFileExcelScoringLog,
  apiExportFilePdfScoringLog,
  apiGetListScoringWork,
  getListScoringLog,
} from '@/api/rating'
import { usePermissionStore } from '@/store'
import { useConfig } from '@/config'

const { t } = useI18n()
const config = useConfig()
const baseUrl = ref(config.VITE_APP_UPLOAD_URL)
const { roleData } = usePermissionStore()

const defaultFilter = {
  page: 1,
  size: 10,
  total: 0,
  scoringWork: '',
  timeSearch: [],
}
const filter = reactive(cloneDeep(defaultFilter))
const listLoading = ref(false)
const showDialog = ref(false)
const showDialogDelete = ref(false)
const showDialogExportPdf = ref(false)
const showDialogExportExcel = ref(false)
const typeDialog = ref('add')
const titleDialog = ref(t('monitoring.diary.addDiary'))
const fields = ref([
  {
    key: 'scoringWork',
    label: t('monitoring.diary.job'),
    prop: 'scoringWork',
  },
  {
    key: 'createTime',
    label: t('monitoring.rating.timeRating'),
    prop: 'createTime',
    width: 150,
  },
  {
    key: 'content',
    label: t('notify.content'),
    prop: 'content',
  },
  {
    key: 'fileVaults',
    label: t('monitoring.rating.fileRating'),
    prop: 'fileVaults',
  },
  {
    key: 'createdBy',
    label: t('monitoring.requestProcessingETC.creator'),
    prop: 'createdBy',
  },
  {
    key: 'modifyTime',
    label: t('weightVehicle.updateTime'),
    prop: 'modifyTime',
    width: 150,
  },
  {
    key: 'operation',
    label: t('configUser.operation'),
    prop: 'operation',
    width: 200,
  },
])
const listScoringLog = ref([])
const infoScoringLog = ref({})
const listJob = ref([])

onMounted(() => {
  initializeDateRange()
  getList()
})

const initializeDateRange = async () => {
  const today = dayjs().format('YYYY-MM-DD')
  const sevenDaysAgo = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
  filter.startTime = `${sevenDaysAgo} 00:00:00`
  filter.endTime = `${today} 23:59:59`
  filter.timeSearch = [dayjs(sevenDaysAgo), dayjs(today)]

  const rs = await apiGetListScoringWork()
  if (rs.status === 200) {
    listJob.value = rs.data
  }
}
const getList = async () => {
  const params = {
    pageIndex: filter.page,
    pageSize: filter.size,
    startDate: filter.startTime,
    endDate: filter.endTime,
    scoringWorkId: filter.scoringWork,
  }
  const rs = await getListScoringLog(params)
  if (rs.status === 200) {
    listScoringLog.value = rs.data.content
    filter.total = rs.data.totalElements
  }
}

const handleOpenAddScoringLog = () => {
  titleDialog.value = t('monitoring.diary.addDiary')
  infoScoringLog.value = {
    content: '',
    scoringWork: {
      id: '',
    },
  }
  typeDialog.value = 'add'
  showDialog.value = true
}
const handleEditScoringLog = async data => {
  titleDialog.value = t('monitoring.diary.editDiary')
  typeDialog.value = 'edit'
  infoScoringLog.value = data
  showDialog.value = true
}
const handleDeleteScoringLog = async () => {
  if (roleData.canDelete) {
    const rs = await apiDeleteScoringLog({ id: infoScoringLog.value.id })
    if (rs.status === 200) {
      ElMessage({
        message: t('omsSetting.deleteSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      await getList()
      showDialogDelete.value = false
    } else {
      ElMessage({
        message: t('el.image.error'),
        type: 'error',
        duration: 3 * 1000,
      })
    }
  }
}
const handleExportFileExcel = async () => {
  const params = {
    scoring_work_id: filter.scoringWork,
    start_date: filter.timeSearch ? dayjs(filter.timeSearch[0]).format('YYYY-MM-DD') : '',
    end_date: filter.timeSearch ? dayjs(filter.timeSearch[1]).format('YYYY-MM-DD') : '',
  }
  const rs = await apiExportFileExcelScoringLog(params)
  if (rs.status === 200) {
    ElMessage({
      message: t('monitoring.successExportExcel'),
      type: 'success',
      duration: 3 * 1000,
    })
    const url = `${baseUrl.value}${rs.data}`
    window.open(url, '_blank')
    // showDialogExportExcel.value = false
  }
}
const handleExportFilePdf = async () => {
  const params = {
    scoring_work_id: filter.scoringWork,
    start_date: filter.timeSearch ? dayjs(filter.timeSearch[0]).format('YYYY-MM-DD') : '',
    end_date: filter.timeSearch ? dayjs(filter.timeSearch[1]).format('YYYY-MM-DD') : '',
  }
  const rs = await apiExportFilePdfScoringLog(params)
  if (rs.status === 200) {
    ElMessage({
      message: t('monitoring.successExportExcel'),
      type: 'success',
      duration: 3 * 1000,
    })
    const url = `${baseUrl.value}${rs.data}`
    window.open(url, '_blank')
    // showDialogExportExcel.value = false
  }
}
const openDialogDeleteScoringLog = data => {
  infoScoringLog.value = data
  showDialogDelete.value = true
}

const searchListData = () => {
  getList()
}
const handleCloseDialog = () => {
  showDialog.value = false
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
const formatDate = dateString => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
const handleDateChange = dates => {
  if (dates && dates.length === 2) {
    const [startTime, endTime] = dates
    const formattedStartTime = `${startTime} 00:00:00`
    const formattedEndTime = `${endTime} 23:59:59`

    filter.startTime = formattedStartTime
    filter.endTime = formattedEndTime
  } else {
    filter.startTime = null
    filter.endTime = null
  }
}
</script>

<style lang="scss" scoped>
.limited-content {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
</style>
