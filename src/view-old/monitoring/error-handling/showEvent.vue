<template>
  <div>
    <div class="w-full bg-white flex items-center justify-between px-4 py-3">
      <div class="flex items-center w-4/5">
        <div
          class="back pointer"
          @click="backErrorHandling()"
        >
          <img
            src="@/assets/imgs/weightStation/back.png"
            alt="Back"
          />
        </div>
        <div
          class="ms-2 text-2xl font-bold overflow-hidden"
          style="flex: 1; text-overflow: ellipsis; white-space: nowrap"
        >
          {{ infoEvent.name }}
        </div>
      </div>
      <div class="flex items-center">
        <el-tooltip
          :content="t('monitoring.rating.editRating')"
          v-if="infoEvent.status === 'OPEN' && roleData.canUpdate"
          placement="bottom"
          effect="light"
        >
          <span
            @click.stop="handleEditEvent()"
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
          :content="t('monitoring.errorHandling.sendEvent')"
          v-if="infoEvent.status === 'OPEN' && roleData.canNotify"
          placement="bottom"
          effect="light"
        >
          <span
            @click.stop="openSendEventDialog()"
            class="delete-member pointer ms-2 me-3"
          >
            <svg-icon
              style="width: 20px; height: 20px"
              icon-class="sendEvent"
              class="mr-2"
            />
          </span>
        </el-tooltip>
        <el-tooltip
          :content="t('monitoring.errorHandling.updateProgress')"
          v-if="infoEvent.status === 'PROCESSING' && roleData.canExplain"
          placement="bottom"
          effect="light"
        >
          <span
            @click="handleUpdateProcessEvent()"
            class="delete-member pointer ms-2 me-3"
          >
            <svg-icon
              style="width: 24px; height: 24px"
              icon-class="transform"
              class="mr-2"
            />
          </span>
        </el-tooltip>
        <el-tooltip
          :content="t('monitoring.errorHandling.closeEvent')"
          v-if="infoEvent.status === 'PROCESSED' && roleData.canConfirm"
          placement="bottom"
          effect="light"
        >
          <span
            @click="openCloseDialog()"
            class="delete-member pointer ms-2 me-3"
          >
            <svg-icon
              style="width: 24px; height: 24px"
              icon-class="pause"
              class="mr-2"
            />
          </span>
        </el-tooltip>
        <el-tooltip
          :content="t('monitoring.errorHandling.deleteEvent')"
          v-if="
            (infoEvent.status === 'OPEN' || infoEvent.status === 'PROCESSING') && roleData.canDelete
          "
          placement="bottom"
          effect="light"
        >
          <span
            @click.stop="openDeleteDialog()"
            class="delete-member pointer ms-2 me-3"
          >
            <svg-icon
              style="width: 24px; height: 24px"
              icon-class="remove-administrative"
              class="mr-2"
            />
          </span>
        </el-tooltip>
      </div>
    </div>
    <!--  Content  -->
    <div
      v-if="roleData.canRead"
      class="px-6 mt-4"
    >
      <div class="flex w-100">
        <div
          v-if="infoEvent.processEvent !== null"
          class="bg-white px-5 pt-6 pb-4 mb-4 me-3"
          style="width: 38%"
        >
          <h4 class="text-black font-semibold text-2xl">
            {{ $t('monitoring.errorHandling.updateProgress') }}
          </h4>
          <el-row
            :gutter="20"
            class="mt-4"
          >
            <el-col :md="24">
              <h5 class="text-lg font-bold">{{ t('monitoring.errorHandling.progress') }}:</h5>
            </el-col>
            <el-col
              :md="24"
              class="mt-2"
            >
              <el-input
                v-model="infoEvent.processEvent"
                type="textarea"
                maxlength="1000"
                autosize
                style="width: 100%"
                disabled
              ></el-input>
            </el-col>
          </el-row>
          <el-row
            :gutter="20"
            class="mt-4"
          >
            <el-col :md="24">
              <h5 class="text-lg font-bold">{{ t('monitoring.errorHandling.result') }}:</h5>
            </el-col>
            <el-col
              :md="24"
              class="mt-2"
            >
              <el-input
                v-model="infoEvent.resultEvent"
                type="textarea"
                maxlength="5000"
                autosize
                style="width: 100%"
                disabled
              ></el-input>
            </el-col>
          </el-row>
          <h5 class="text-lg font-bold mb-3 mt-5">
            {{ t('monitoring.requestProcessingETC.attachedPhoto') }}
          </h5>
          <el-row :gutter="20">
            <el-col
              v-for="(url, index) of listImageUpdate"
              :key="url"
              :md="12"
              :sm="24"
            >
              <div class="flex w-full justify-center my-4 box-image">
                <el-image
                  :src="url"
                  lazy
                  fit="cover"
                  :preview-src-list="listImageUpdate"
                  :initial-index="index"
                ></el-image>
              </div>
            </el-col>
          </el-row>
        </div>
        <div
          class="bg-white px-5 pt-6 pb-4 mb-4"
          style="flex: 1"
        >
          <h4 class="text-black font-semibold text-2xl">
            {{ $t('monitoring.errorHandling.infoEvent') }}
          </h4>
          <el-row
            class="mt-3"
            :gutter="20"
          >
            <el-col
              :xl="12"
              :md="12"
            >
              <el-row :gutter="12">
                <el-col :md="6">
                  <h5 class="text-lg font-bold">{{ t('monitoring.errorHandling.nameEvent') }}:</h5>
                </el-col>
                <el-col :md="18">
                  <p class="text-lg text-color wrap-text">{{ infoEvent.name }}</p>
                </el-col>
              </el-row>
            </el-col>
            <el-col
              :xl="12"
              :md="12"
            >
              <el-row :gutter="12">
                <el-col :md="6">
                  <h5 class="text-lg font-bold">{{ t('configUser.gland') }}:</h5>
                </el-col>
                <el-col :md="18">
                  <span class="text-lg text-color">{{
                    infoEvent.route ? infoEvent.route.name : ''
                  }}</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row
            class="mt-3"
            :gutter="20"
          >
            <el-col
              :xl="12"
              :md="12"
            >
              <el-row :gutter="12">
                <el-col :md="6">
                  <h5 class="text-lg font-bold">{{ t('monitoring.errorHandling.typeEvent') }}:</h5>
                </el-col>
                <el-col :md="18">
                  <span class="text-lg text-color">{{ setTypeError(infoEvent.eventType) }}</span>
                </el-col>
              </el-row>
            </el-col>
            <el-col
              :xl="12"
              :md="12"
            >
              <el-row :gutter="12">
                <el-col :md="6">
                  <h5 class="text-lg font-bold">{{ t('configUser.station') }}:</h5>
                </el-col>
                <el-col :md="18">
                  <p class="text-lg text-color">
                    {{ infoEvent.station ? infoEvent.station.name : '' }}
                  </p>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row
            class="mt-3 mb-5"
            :gutter="20"
          >
            <el-col
              :xl="12"
              :md="12"
            >
              <el-row :gutter="12">
                <el-col :md="6">
                  <h5 class="text-lg font-bold">{{ t('report.time') }}:</h5>
                </el-col>
                <el-col :md="18">
                  <span class="text-lg text-color">{{
                    formatDate(infoEvent.startTime) + ' - ' + formatDate(infoEvent.endTime)
                  }}</span>
                </el-col>
              </el-row>
              <el-row
                :gutter="12"
                class="mt-3"
              >
                <el-col :md="6">
                  <h5 class="text-lg font-bold">{{ t('configUser.status') }}:</h5>
                </el-col>
                <el-col :md="18">
                  <span
                    v-if="infoEvent.status === 'OPEN'"
                    class="bg-outline-info text--info box-action"
                    >{{ $t('configUser.open') }}</span
                  >
                  <span
                    v-if="infoEvent.status === 'CLOSED'"
                    class="bg-outline-secondary text--secondary box-action"
                    >{{ $t('configUser.closed') }}</span
                  >
                  <span
                    v-if="infoEvent.status === 'PROCESSING'"
                    class="bg-outline-success text--success box-action"
                    >{{ $t('configUser.processing') }}</span
                  >
                  <span
                    v-if="infoEvent.status === 'PROCESSED'"
                    class="bg-outline-warning text--warning box-action"
                    >{{ t('configUser.processes') }}</span
                  >
                </el-col>
              </el-row>
            </el-col>
            <el-col
              :xl="12"
              :md="12"
            >
              <el-row :gutter="12">
                <el-col :md="6">
                  <h5 class="text-lg font-bold">{{ t('configUser.lane') }}:</h5>
                </el-col>
                <el-col :md="18">
                  <span
                    v-for="(lane, index) in infoEvent.lanes"
                    :key="lane.id"
                    class="text-lg text-color"
                  >
                    {{ lane.number }}
                    <span v-if="index < infoEvent.lanes.length - 1">; </span>
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!--          <hr class="margin-bottom-12 mt-2"/>-->
          <div class="w-full mt-4">
            <h5 class="text-lg font-bold mb-3">{{ t('monitoring.errorHandling.contentEvent') }}</h5>
            <el-input
              v-model="infoEvent.content"
              type="textarea"
              maxlength="5000"
              autosize
              style="width: 100%"
              disabled
            ></el-input>
          </div>
          <div class="w-full mt-4">
            <h5 class="text-lg font-bold mb-3">
              {{ t('monitoring.requestProcessingETC.attachedPhoto') }}
            </h5>
            <el-row :gutter="10">
              <el-col
                v-for="(url, index) of listImage"
                :key="url"
                :md="8"
                :sm="12"
              >
                <div class="flex w-full justify-center my-4 box-image">
                  <el-image
                    :src="url"
                    lazy
                    fit="cover"
                    :preview-src-list="listImage"
                    :initial-index="index"
                  ></el-image>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="w-full mt-4">
            <h5 class="text-lg font-bold mb-3">{{ t('monitoring.rating.fileRating') }}</h5>
            <el-upload
              v-model:file-list="listFileEvent"
              class="upload-display-none"
              :on-success="null"
              :on-error="null"
              :auto-upload="false"
              :on-preview="handlePreviewFile"
              :disabled="true"
            >
            </el-upload>
          </div>
        </div>
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
        <SendEvent
          @closeUpdate="handleCloseDialog"
          :eventInfo="infoEvent"
        ></SendEvent>
      </template>
    </Dialog>
    <el-dialog
      v-model="showDialogDelete"
      :title="$t('monitoring.errorHandling.deleteEvent')"
      width="500"
      align-center
    >
      <span>{{ $t('monitoring.errorHandling.confirmDeleteEvent') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="showDialogDelete = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleDeleteEvent()"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="showDialogClose"
      :title="$t('monitoring.errorHandling.closeEvent')"
      width="500"
      align-center
    >
      <span>{{ $t('monitoring.errorHandling.confirmCloseEvent') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="showDialogClose = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleCloseEvent()"
          >
            {{ $t('configUser.closed') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePermissionStore, useUserStore } from '@/store'
import { useI18n } from '@/locale'
import { ElMessage } from 'element-plus'
import Dialog from '@/components/Dialog/index.vue'
import SendEvent from '@/views/monitoring/error-handling/sendEvent.vue'
import { apiCloseEvent, apiDeleteEvent, apiGetDetailEvent } from '@/api/errorHandling'
import { useConfig } from '@/config'

const { t } = useI18n()
const config = useConfig()
const baseUrl = ref(config.VITE_APP_UPLOAD_URL)
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { roleData } = usePermissionStore()

const infoEvent = ref({})
const isLoading = ref(false)
const listImage = ref([])
const listFileEvent = ref([])
const listImageUpdate = ref([])
const showDialog = ref(false)
const showDialogDelete = ref(false)
const showDialogClose = ref(false)
const titleDialog = ref('')

onMounted(() => {
  initData()
})
const initData = async () => {
  const event_id = route.params.id
  if (event_id) {
    const rs = await apiGetDetailEvent(event_id)
    if (rs.status === 200) {
      infoEvent.value = rs.data
      await setListDataDefault()
    }
  }
}
const setListDataDefault = async () => {
  listImage.value = []
  listImageUpdate.value = []
  listFileEvent.value = []
  const listFile = infoEvent.value.fileVaults
  for (const file of listFile) {
    if (file.fileCategory === 2) {
      listImage.value.push(`${baseUrl.value}${file.filePath}`)
    } else if (file.fileCategory === 1) {
      listFileEvent.value.push({
        name: file.fileName,
        url: `${baseUrl.value}${file.filePath}`,
      })
    } else if (file.fileCategory === 3) {
      listImageUpdate.value.push(`${baseUrl.value}${file.filePath}`)
    }
  }
}
const backErrorHandling = () => {
  router.push(`/monitoring/error-handling`)
}
const handleCloseDialog = () => {
  showDialog.value = false
  initData()
}
const handleDeleteEvent = async () => {
  const event_id = infoEvent.value.id
  if (event_id) {
    const rs = await apiDeleteEvent(event_id)
    if (rs.status === 200) {
      ElMessage({
        message: t('omsSetting.deleteSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      router.push(`/monitoring/error-handling`)
      showDialogDelete.value = false
    } else {
      ElMessage({
        message: t('el.image.error'),
        type: 'error',
        duration: 3 * 1000,
      })
    }
  }
  showDialogDelete.value = false
}
const handleCloseEvent = async () => {
  const event_id = infoEvent.value.id
  if (event_id) {
    const rs = await apiCloseEvent(event_id)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      showDialogClose.value = false
      await initData()
    }
  }
}
const handlePreviewFile = file => {
  if (file.url) {
    window.open(file.url, '_blank')
  } else if (file.raw) {
    const fileUrl = URL.createObjectURL(file.raw)
    window.open(fileUrl, '_blank')
  } else {
    ElMessage.error('Không thể xem trước file này')
  }
}
const handleUpdateProcessEvent = () => {
  router.push(`/monitoring/update-process-event/${infoEvent.value.id}`)
}
const handleEditEvent = () => {
  router.push(`/monitoring/error-handling-view/${infoEvent.value.id}`)
}
const openDeleteDialog = () => {
  showDialogDelete.value = true
}
const openCloseDialog = () => {
  showDialogClose.value = true
}
const openSendEventDialog = () => {
  showDialog.value = true
}
const formatDate = dateString => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
const setTypeError = type => {
  switch (type) {
    case 0:
      return t('monitoring.errorHandling.maintenancePlan')
    case 1:
      return t('monitoring.errorHandling.periodicInspectionAndAcceptancePlan')
    case 2:
      return t('monitoring.errorHandling.monitoringAndEvaluationPlan')
    case 3:
      return t('monitoring.errorHandling.reportProblem')
    default:
      return ''
  }
}

const checkShowAction = () => {
  return userStore.userName === infoEvent.value.createdBy
}
</script>

<style scoped lang="scss">
.text-color {
  color: #525b73;
}

.wrap-text {
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}

.box-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 1px solid #99a2bc;
  border-radius: 8px;
  overflow: hidden;
}
</style>

<style scoped lang="scss">
.upload-display-none {
  .el-upload {
    display: none;
  }
}

:deep(.ql-editor) {
  height: 100%;
  padding: 0;
  border: none;
}

:deep(.ql-container.ql-snow) {
  border: transparent;
}

:deep(.el-textarea.is-disabled .el-textarea__inner) {
  background-color: transparent;
  box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
  cursor: text;
  color: #525b73;
}

:deep(.el-textarea__inner:hover) {
  border: transparent;
}
:deep(.el-textarea__inner) {
  box-shadow: none !important;
  border-radius: 2px !important;
  border: transparent !important;
  font-size: 1.125rem !important;
  line-height: 1.6rem !important;
  padding: 0;
  resize: none;
}
</style>
