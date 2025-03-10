<template>
  <div>
    <div class="w-full bg-white flex items-center justify-between px-4 py-3">
      <h5 class="flex items-center">
        <div
          class="back pointer"
          @click="backRequestProcessingVEC()"
        >
          <img src="@/assets/imgs/weightStation/back.png" />
        </div>
        <div class="ms-2 text-2xl font-bold">
          {{ infoRequestProcessingVEC.name }}
        </div>
      </h5>
      <div class="flex items-center">
        <el-tooltip
          :content="t('monitoring.rating.editRating')"
          v-if="infoRequestProcessingVEC.status === 0 && roleData.canUpdate && checkShowAction()"
          placement="bottom"
          effect="light"
        >
          <span
            @click.stop="handleEditRequestProcessing()"
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
          :content="t('monitoring.requestProcessingETC.sendRequest')"
          v-if="infoRequestProcessingVEC.status === 0 && roleData.canNotify && checkShowAction()"
          placement="bottom"
          effect="light"
        >
          <span
            @click="openDialogSendRequest()"
            class="delete-member pointer ms-2 me-3"
            @click.stop
          >
            <svg-icon
              style="width: 20px; height: 20px"
              icon-class="sendEvent"
              class="mr-2"
            />
          </span>
        </el-tooltip>
        <el-tooltip
          v-if="infoRequestProcessingVEC.status === 1 && roleData.canExplain"
          :content="t('monitoring.requestProcessingETC.addContentToImplement')"
          placement="bottom"
          effect="light"
        >
          <span
            @click="handleAddNewRequestProcessing()"
            class="delete-member pointer ms-2 me-3"
          >
            <svg-icon
              style="width: 20px; height: 20px"
              icon-class="plus"
              class="mr-2"
            />
          </span>
        </el-tooltip>
        <el-tooltip
          v-if="
            infoRequestProcessingVEC.executionContent !== null &&
            infoRequestProcessingVEC.status === 1 &&
            roleData.canApprove
          "
          :content="t('monitoring.requestProcessingETC.submitContentReport')"
          placement="bottom"
          effect="light"
        >
          <span
            @click.stop="openDialogSendRequest2()"
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
          v-if="infoRequestProcessingVEC.status === 2 && roleData.canConfirm && checkShowAction()"
          :content="t('monitoring.requestProcessingETC.closeRequest')"
          placement="bottom"
          effect="light"
        >
          <span
            @click="openDiaLogCloseRequest()"
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
          :content="t('monitoring.requestProcessingETC.deleteRequest')"
          v-if="
            (infoRequestProcessingVEC.status === 0 || infoRequestProcessingVEC.status === 1) &&
            roleData.canDelete &&
            checkShowAction()
          "
          placement="bottom"
          effect="light"
        >
          <span
            @click.stop="openDialogDeleteRequest()"
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
      <div
        v-if="infoRequestProcessingVEC.executionContent !== null"
        class="bg-white px-5 pt-6 pb-4 mb-4"
      >
        <h4 class="text-black font-semibold text-2xl mb-3">
          {{ $t('monitoring.requestProcessingETC.contentToImplement') }}
        </h4>
        <el-input
          v-model="infoRequestProcessingVEC.executionContent"
          type="textarea"
          maxlength="1000"
          autosize
          style="width: 100%"
          disabled
        ></el-input>
        <!--        <p class="text-color mt-4 text-lg text-justify">{{infoRequestProcessingVEC.executionContent}}</p>-->
      </div>
      <div class="bg-white px-5 pt-6 pb-4 mb-4">
        <h4 class="text-black font-semibold text-2xl">
          {{ $t('monitoring.requestProcessingETC.requestInformation') }}
        </h4>
        <el-row
          class="mt-5"
          :gutter="20"
        >
          <el-col
            :xl="12"
            :md="12"
          >
            <el-row :gutter="12">
              <el-col :md="6">
                <h5 class="text-lg font-medium">
                  {{ t('monitoring.requestProcessingETC.requestName') }}:
                </h5>
              </el-col>
              <el-col :md="18">
                <span class="text-lg text-color">{{ infoRequestProcessingVEC.name }}</span>
              </el-col>
            </el-row>
          </el-col>
          <el-col
            :xl="12"
            :md="12"
          >
            <el-row :gutter="12">
              <el-col :md="6">
                <h5 class="text-lg font-medium">{{ t('configUser.gland') }}:</h5>
              </el-col>
              <el-col :md="18">
                <span class="text-lg text-color">
                  {{ infoRequestProcessingVEC.route ? infoRequestProcessingVEC.route.name : '' }}
                </span>
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
                <h5 class="text-lg font-medium">{{ t('configUser.station') }}:</h5>
              </el-col>
              <el-col :md="18">
                <span class="text-lg text-color">
                  {{
                    infoRequestProcessingVEC.station ? infoRequestProcessingVEC.station.name : ''
                  }}
                </span>
              </el-col>
            </el-row>
          </el-col>
          <el-col
            :xl="12"
            :md="12"
          >
            <el-row :gutter="12">
              <el-col :md="6">
                <h5 class="text-lg font-medium">{{ t('configUser.lane') }}:</h5>
              </el-col>
              <el-col :md="18">
                <span class="text-lg text-color">
                  {{ infoRequestProcessingVEC.lane ? infoRequestProcessingVEC.lane.number : '' }}
                </span>
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
                <h5 class="text-lg font-medium">
                  {{ t('monitoring.requestProcessingETC.typeError') }}:
                </h5>
              </el-col>
              <el-col :md="18">
                <span class="text-lg text-color">{{
                  setDataErrorType(infoRequestProcessingVEC.errorType)
                }}</span>
              </el-col>
            </el-row>
          </el-col>
          <el-col
            :xl="12"
            :md="12"
          >
            <el-row :gutter="12">
              <el-col :md="6">
                <h5 class="text-lg font-medium">{{ t('configUser.status') }}</h5>
              </el-col>
              <el-col :md="18">
                <span
                  v-if="infoRequestProcessingVEC.status === 0"
                  class="bg-outline-info text--info box-action"
                  >{{ t('configUser.open') }}</span
                >
                <span
                  v-if="infoRequestProcessingVEC.status === 3"
                  class="bg-outline-secondary text--secondary box-action"
                  >{{ t('configUser.closed') }}</span
                >
                <span
                  v-if="infoRequestProcessingVEC.status === 1"
                  class="bg-outline-success text--success box-action"
                  >{{ t('configUser.processing') }}</span
                >
                <span
                  v-if="infoRequestProcessingVEC.status === 2"
                  class="bg-outline-warning text--warning box-action"
                  >{{ t('configUser.processes') }}</span
                >
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <div class="w-full mt-4">
          <h5 class="text-lg font-medium mb-3">
            {{ t('monitoring.requestProcessingETC.requestContent') }}
          </h5>
          <el-input
            v-model="infoRequestProcessingVEC.content"
            type="textarea"
            maxlength="5000"
            autosize
            style="width: 100%"
            disabled
          ></el-input>
          <!--          <p class="text-color mt-4 text-lg text-justify">{{infoRequestProcessingVEC.content}}</p>-->
        </div>
        <div class="w-full mt-4">
          <h5 class="text-lg font-bold mb-3">
            {{ t('monitoring.requestProcessingETC.attachedPhoto') }}
          </h5>
          <el-row :gutter="6">
            <el-col
              v-for="(url, index) of listImage"
              :key="url"
              :md="6"
              :sm="12"
            >
              <div class="flex w-full justify-center box-image my-4">
                <el-image
                  :src="url"
                  lazy
                  fit="contain"
                  :preview-src-list="listImage"
                  :initial-index="index"
                  style="height: 250px"
                ></el-image>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="w-full mt-4">
          <h5 class="text-lg font-bold mb-3">{{ t('monitoring.rating.fileRating') }}</h5>
          <el-upload
            v-model:file-list="listFileRequest"
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

    <Dialog
      :show="showDialogSend"
      :appendToBody="true"
      :width="'682'"
      :title="t('monitoring.requestProcessingETC.sendRequest')"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <SendRequest
          @closeUpdate="handleCloseDialog"
          :requestInfo="infoRequestProcessingVEC"
        ></SendRequest>
      </template>
    </Dialog>
    <el-dialog
      v-model="deleteRequestDialog"
      :title="$t('monitoring.requestProcessingETC.deleteRequest')"
      width="500"
      align-center
    >
      <span>{{ $t('monitoring.requestProcessingETC.confirmDeleteRequest') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="deleteRequestDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleDeleteRequestProcessingVEC()"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="closeRequestDialog"
      :title="$t('monitoring.requestProcessingETC.closeRequest')"
      width="500"
      align-center
    >
      <span>{{ $t('monitoring.requestProcessingETC.confirmCloseRequest') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="closeRequestDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleCloseRequestProcessingVEC()"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="activateRequestDialog"
      :title="$t('monitoring.requestProcessingETC.sendReportRequest')"
      width="500"
      align-center
    >
      <span>{{ $t('monitoring.requestProcessingETC.confirmSendContentRequest') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="activateRequestDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleSendRequestProcessingVEC()"
          >
            {{ $t('configUser.send') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { usePermissionStore, useUserStore } from '@/store'
import Dialog from '@/components/Dialog/index.vue'
import {
  apiChangeStatusRequestProcessingVEC,
  apiCloseRequestProcessingVEC,
  apiDeleteRequestProcessingVEC,
  apiGetDetailRequestProcessingVEC,
  apiUpdateSenderRequestProcessingVEC,
} from '@/api/requestProcessingETC'
import { ElMessage } from 'element-plus'
import SendRequest from '@/views/monitoring/request-processing-ETC/sendRequest.vue'
import { useConfig } from '@/config'

const { t } = useI18n()
const config = useConfig()
const baseUrl = ref(config.VITE_APP_UPLOAD_URL)
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { roleData } = usePermissionStore()
const menuRole = ref({})
const infoRequestProcessingVEC = ref({})
const isLoading = ref(false)
const showDialogSend = ref(false)
const deleteRequestDialog = ref(false)
const closeRequestDialog = ref(false)
const activateRequestDialog = ref(false)
const listImage = ref([])
const listFileRequest = ref([])

onMounted(() => {
  initData()
})

const initData = async () => {
  const request_id = route.params.id
  if (request_id) {
    const rs = await apiGetDetailRequestProcessingVEC(request_id)
    if (rs.status === 200) {
      infoRequestProcessingVEC.value = rs.data
      setListImage()
    }
  }
}
const setListImage = () => {
  const listFile = infoRequestProcessingVEC.value.fileVaults
  for (const file of listFile) {
    if (file.fileCategory === 2) {
      listImage.value.push(`${baseUrl.value}${file.filePath}`)
    } else if (file.fileCategory === 1) {
      listFileRequest.value.push({
        name: file.fileName,
        url: `${baseUrl.value}${file.filePath}`,
      })
    }
  }
}
const handleEditRequestProcessing = () => {
  const request_id = route.params.id
  if (request_id) {
    router.push(`/monitoring/request-processing/${request_id}`)
  }
}
const handleAddNewRequestProcessing = () => {
  const request_id = route.params.id
  if (request_id) {
    router.push(`/monitoring/add-new-request-processing/${request_id}`)
  }
}
const handleDeleteRequestProcessingVEC = async () => {
  const request_id = route.params.id
  if (request_id) {
    const rs = await apiDeleteRequestProcessingVEC(request_id)
    if (rs.status === 200) {
      ElMessage({
        message: t('omsSetting.deleteSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      router.push('/monitoring/VEC-request-processing')
    } else {
      ElMessage({
        message: t('el.image.error'),
        type: 'error',
        duration: 3 * 1000,
      })
    }
  }
  deleteRequestDialog.value = false
}
const handleCloseRequestProcessingVEC = async () => {
  const request_id = route.params.id
  if (request_id) {
    const rs = await apiCloseRequestProcessingVEC(request_id)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      closeRequestDialog.value = false
      await initData()
    }
  }
}
const handleSendRequestProcessingVEC = async () => {
  const request_id = route.params.id
  if (request_id) {
    const params = {
      leaderId: infoRequestProcessingVEC.value.supplierLeader,
      type: 2,
    }
    const rs = await apiUpdateSenderRequestProcessingVEC(request_id, params)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      activateRequestDialog.value = false
      await initData()
    }
  }
}

const openDialogSendRequest = () => {
  showDialogSend.value = true
}
const openDialogDeleteRequest = () => {
  deleteRequestDialog.value = true
}
const openDiaLogCloseRequest = () => {
  closeRequestDialog.value = true
}
const openDialogSendRequest2 = () => {
  activateRequestDialog.value = true
}

const setDataErrorType = type => {
  switch (type) {
    case 1:
      return t('monitoring.requestProcessingETC.outOfMoney')
    case 2:
      return t('monitoring.requestProcessingETC.deviceFailure')
    case 3:
      return t('monitoring.requestProcessingETC.suspectedEquipmentFailure')
    default:
      return ''
  }
}
const backRequestProcessingVEC = () => {
  router.push('/monitoring/VEC-request-processing')
}
const handleCloseDialog = async () => {
  showDialogSend.value = false
  await initData()
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

const checkShowAction = () => {
  return userStore.uuid === infoRequestProcessingVEC.value.createdBy
}
</script>

<style scoped lang="scss">
.text-color {
  color: #525b73;
}
.box-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 1px solid #99a2bc;
  border-radius: 8px;
  overflow: hidden;
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
}
</style>
<style lang="scss">
.upload-display-none {
  .el-upload {
    display: none;
  }
}
</style>
