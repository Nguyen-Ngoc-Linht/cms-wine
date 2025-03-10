<template>
  <div>
    <div class="w-full bg-white flex items-center justify-between px-4 py-3">
      <h5 class="flex items-center">
        <div
          class="back pointer"
          @click="backErrorHandling()"
        >
          <img src="@/assets/imgs/weightStation/back.png" />
        </div>
        <div class="ms-2 text-2xl font-bold">
          {{ infoEvent.name }}
        </div>
      </h5>
    </div>
    <!--  Content  -->
    <div class="w-full mt-3 px-4">
      <el-row :gutter="20">
        <el-col :md="10">
          <div class="bg-white pt-6 pb-4 mb-4">
            <div class="px-5">
              <h4 class="text-black font-semibold text-2xl">
                {{ $t('monitoring.errorHandling.updateProgress') }}
              </h4>
              <el-form
                class="mt-4"
                ref="formUpdateProgressEvent"
                :rules="ruleEdit"
                :model="infoEvent"
              >
                <div class="w-full">
                  <el-form-item
                    :label="t('monitoring.errorHandling.progress')"
                    prop="processEvent"
                    class="custom"
                    style="display: inline-block; width: 100%"
                  >
                    <el-input
                      v-model="infoEvent.processEvent"
                      type="textarea"
                      :autosize="{ minRows: 4 }"
                      show-word-limit
                      maxlength="5000"
                      :placeholder="t('configUser.pleaseEnter')"
                    >
                    </el-input>
                  </el-form-item>
                </div>
                <div class="w-full">
                  <el-form-item
                    :label="t('monitoring.errorHandling.result')"
                    prop="resultEvent"
                    class="custom"
                    style="display: inline-block; width: 100%"
                  >
                    <el-input
                      v-model="infoEvent.resultEvent"
                      type="textarea"
                      :autosize="{ minRows: 4 }"
                      show-word-limit
                      maxlength="5000"
                      :placeholder="t('configUser.pleaseEnter')"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="w-full">
                  <h6 class="font-bold text-base custom">
                    {{ t('monitoring.requestProcessingETC.attachedPhoto') }}
                  </h6>
                  <el-upload
                    v-model:file-list="infoEvent.listImage"
                    class="avatar-uploader mt-3"
                    drag
                    :limit="4"
                    :on-change="handleChangeFile"
                    :on-success="null"
                    :on-preview="handlePreviewFile"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :on-exceed="null"
                    :auto-upload="false"
                    multiple
                    accept=".jpg,.png"
                  >
                    <svg-icon
                      icon-class="import-dialog"
                      class="width-50 height-50"
                    />
                    <p
                      class="drag-note my-2 font-semibold"
                      style="color: #7c7e81"
                    >
                      {{ t('configUser.importImage') }}
                    </p>
                    <p
                      class="file-note"
                      style="color: #a4a6a7"
                    >
                      ({{ $t('configUser.importLimitAndType', ['jpg/png', '5MB']) }})
                    </p>
                  </el-upload>
                </div>
              </el-form>
            </div>
            <hr class="my-5" />
            <div class="px-5">
              <div class="flex justify-end items-center">
                <el-button
                  type="default"
                  @click="backErrorHandling"
                  class="bg-outline-secondary"
                  >{{ $t('configUser.closed') }}</el-button
                >
                <el-button
                  v-if="roleData.canExplain"
                  :loading="processing"
                  @click="handleUpdateProgressEvent()"
                  type="primary"
                  class="bg--dark-purple"
                  style="border: transparent"
                  >{{ $t('omsSetting.save') }}
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :md="14">
          <div class="bg-white px-5 pt-6 pb-4 mb-4">
            <h4 class="text-black font-semibold text-2xl">
              {{ $t('monitoring.errorHandling.infoEvent') }}
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
                    <h5 class="text-lg font-bold">
                      {{ t('monitoring.errorHandling.nameEvent') }}:
                    </h5>
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
                    <h5 class="text-lg font-bold">
                      {{ t('monitoring.errorHandling.typeEvent') }}:
                    </h5>
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
              class="mt-3 mb-3"
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
            <div class="w-full mt-4">
              <h5 class="text-lg font-bold mb-3">
                {{ t('monitoring.errorHandling.contentEvent') }}
              </h5>
              <p class="text-color mt-4 text-lg text-justify wrap-text">{{ infoEvent.content }}</p>
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
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiGetDetailEvent, apiUpdateProcessResult } from '@/api/errorHandling'
import { uploadFile } from '@/api/rating'
import { usePermissionStore } from '@/store'
import { useConfig } from '@/config'

const { t } = useI18n()
const config = useConfig()
const baseUrl = ref(config.VITE_APP_UPLOAD_URL)
const { roleData } = usePermissionStore()
const router = useRouter()
const route = useRoute()
const infoEvent = ref({})
const processing = ref(false)
const listImage = ref([])
const listFileEvent = ref([])
const formUpdateProgressEvent = ref(null)
const ruleEdit = ref({
  processEvent: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 5000, message: t('omsSetting.ruleMaxLengthText', ['5000']), trigger: 'blur' },
  ],
  resultEvent: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 5000, message: t('omsSetting.ruleMaxLengthText', ['5000']), trigger: 'blur' },
  ],
})

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
  const listFile = infoEvent.value.fileVaults
  infoEvent.value.fileVaultIds = []
  for (const file of listFile) {
    if (file.fileCategory === 2) {
      listImage.value.push(`${baseUrl.value}${file.filePath}`)
    } else if (file.fileCategory === 1) {
      listFileEvent.value.push({
        name: file.fileName,
        url: `${baseUrl.value}${file.filePath}`,
      })
    }
    infoEvent.value.fileVaultIds.push(file.id)
  }
}
const handleUpdateProgressEvent = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const event_id = route.params.id
    if (event_id) {
      const params = {
        processEvent: infoEvent.value.processEvent,
        resultEvent: infoEvent.value.resultEvent,
        fileVaultIds: infoEvent.value.fileVaultIds,
      }
      const rs = await apiUpdateProcessResult(event_id, params)
      if (rs.status === 200) {
        ElMessage({
          message: t('configUser.message.updateSuccess'),
          type: 'success',
          duration: 3 * 1000,
        })
        backErrorHandling()
      }
      processing.value = false
    }
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    formUpdateProgressEvent.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}
const backErrorHandling = () => {
  router.push(`/monitoring/error-handling`)
}
const formatDate = dateString => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const handleChangeFile = async (file, fileList) => {
  const isAllowedSize = file.size / 1024 / 1024 < 5
  if (!isAllowedSize) {
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    ElMessage.error(t('configUser.message.overflowMaxSize', ['5']))
    return false
  }
  const allowedTypes = ['image/jpg', 'image/png']
  if (!allowedTypes.includes(file.raw.type)) {
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    ElMessage.error('File không đúng định dạng .jpg/.png')
    return false
  }
  const fileToUpload = file.raw || file
  console.log(file)
  if (!fileToUpload || !(fileToUpload instanceof File)) {
    console.error('Invalid file provided:', file)
    return
  }
  const formData = new FormData()
  formData.append('file', fileToUpload)
  formData.append('keepFileName', true)
  formData.append('mainEntityName', 'requestProcessing')
  formData.append('fileCategory', 3)

  const rs = await uploadFile(formData)
  if (rs.status === 200) {
    const idFile = rs.data.data[0].id
    if (!Array.isArray(infoEvent.value.fileVaultIds) || !infoEvent.value.fileVaultIds) {
      infoEvent.value.fileVaultIds = []
    }
    infoEvent.value.fileVaultIds.push(idFile)
    if (!Array.isArray(infoEvent.value.fileVaultsUpdate) || !infoEvent.value.fileVaultsUpdate) {
      infoEvent.value.fileVaultsUpdate = []
    }
    infoEvent.value.fileVaultsUpdate.push(rs.data.data[0])
  }
}
const beforeRemove = () => {
  return ElMessageBox.confirm(t('administration.ip.confirmDeleteFile'), {
    confirmButtonText: t('omsSetting.confirm'),
    cancelButtonText: t('omsSetting.cancel'),
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  }).then(
    () => true,
    () => false
  )
}
const handleRemove = file => {
  const item = infoEvent.value.fileVaultsUpdate
  const length = item.length
  let id_file = ''
  for (let i = 0; i < length; i++) {
    if (file.name === item[i].fileName) {
      id_file = item[i].id
      break
    }
  }
  infoEvent.value.fileVaultsUpdate = infoEvent.value.fileVaultsUpdate.filter(
    item => item.id !== id_file
  )
  infoEvent.value.fileVaultIds = infoEvent.value.fileVaultIds.filter(item => item !== id_file)
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
</script>

<style scoped lang="scss">
.box-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 1px solid #99a2bc;
  border-radius: 8px;
  overflow: hidden;
}
</style>

<style lang="scss">
.custom {
  .el-form-item__label {
    color: #525b73;
    font-weight: 600 !important;
  }
}
.upload-display-none {
  .el-upload {
    display: none;
  }
}
</style>
