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
    </div>
    <!--  Content  -->
    <div class="px-6 mt-4">
      <div
        v-if="roleData.canExplain"
        class="bg-white px-5 pt-6 pb-4 mb-4"
      >
        <div class="flex items-center justify-between">
          <h4 class="text-black font-semibold text-2xl">
            {{ $t('monitoring.requestProcessingETC.contentToImplement') }}
          </h4>
          <el-button
            v-if="!isEdit"
            @click="handleUpdateNewContentRequestVEC"
            class="el-button--main"
            >{{ $t('omsSetting.save') }}</el-button
          >
          <el-button
            v-else
            :loading="processing"
            @click="handleUpdateNewContentRequestVEC"
            class="el-button--main"
          >
            {{ $t('omsSetting.update') }}
          </el-button>
        </div>
        <el-form
          ref="formAddNewRequestVEC"
          :rules="ruleEdit"
          :model="infoRequestProcessingVEC"
        >
          <div class="w-full">
            <el-form-item
              :label="t('report.time')"
              prop="executionTime"
              class="custom mb-2"
              style="display: inline-block; width: 100%"
            >
              <el-date-picker
                v-model="infoRequestProcessingVEC.executionTime"
                type="date"
                clearable
                value-format="YYYY-MM-DD HH:mm:ss"
                format="DD/MM/YYYY"
                style="flex: 1"
              />
            </el-form-item>
          </div>
          <div class="w-full">
            <el-form-item
              :label="t('notify.content')"
              prop="executionContent"
              class="custom w-full"
              style="display: inline-block; width: 100%"
            >
              <el-input
                v-model="infoRequestProcessingVEC.executionContent"
                type="textarea"
                :autosize="{ minRows: 6, maxRows: 10 }"
                maxlength="1000"
                style="width: 100%"
                show-word-limit
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div
        v-if="roleData.canRead"
        class="bg-white px-5 pt-6 pb-4 mb-4"
      >
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
                <h5 class="text-lg font-medium">{{ t('configUser.status') }}:</h5>
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
            {{ t('monitoring.requestProcessingETC.requestContent') }}:
          </h5>
          <p class="text-color mt-4 text-lg text-justify">{{ infoRequestProcessingVEC.content }}</p>
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
              <div class="flex w-full justify-center my-4 box-image">
                <el-image
                  :src="url"
                  lazy
                  fit="contain"
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
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import Dialog from '@/components/Dialog/index.vue'
import {
  apiGetDetailRequestProcessingVEC,
  apiUpdateSenderRequestNewContentProcessingVEC,
} from '@/api/requestProcessingETC'
import { ElMessage } from 'element-plus'
import { usePermissionStore } from '@/store'
import { useConfig } from '@/config'

const { t } = useI18n()
const config = useConfig()
const baseUrl = ref(config.VITE_APP_UPLOAD_URL)
const router = useRouter()
const route = useRoute()
const { roleData } = usePermissionStore()
const ruleEdit = ref({
  executionTime: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  executionContent: [{ required: true, message: t('omsSetting.ruleEnter') }],
})
const infoRequestProcessingVEC = ref({})
const processing = ref(false)
const listImage = ref([])
const listFileRequest = ref([])
const formAddNewRequestVEC = ref(null)
const isEdit = ref(false)

onMounted(() => {
  initData()
})

const initData = async () => {
  const request_id = route.params.id
  if (request_id) {
    const rs = await apiGetDetailRequestProcessingVEC(request_id)
    if (rs.status === 200) {
      infoRequestProcessingVEC.value = rs.data
      isEdit.value = !!rs.data.executionContent
      setDataAddNewRequest()
      setListImage()
    }
  } else {
  }
}
const setDataAddNewRequest = () => {
  if (infoRequestProcessingVEC.value.executionContent !== null) {
  } else {
    infoRequestProcessingVEC.value.executionTime = getDefaultDate()
    infoRequestProcessingVEC.value.executionContent = ''
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
const handleUpdateNewContentRequestVEC = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const params = {
      executionTime: infoRequestProcessingVEC.value.executionTime,
      executionContent: infoRequestProcessingVEC.value.executionContent,
      // leaderId: infoRequestProcessingVEC.value.leaderId
    }
    const request_id = infoRequestProcessingVEC.value.id
    const rs = await apiUpdateSenderRequestNewContentProcessingVEC(request_id, params)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      router.push('/monitoring/VEC-request-processing')
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.error(e)
  }
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    formAddNewRequestVEC.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}

const getDefaultDate = () => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const hh = String(today.getHours()).padStart(2, '0')
  const mi = String(today.getMinutes()).padStart(2, '0')
  const ss = String(today.getSeconds()).padStart(2, '0')

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
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
  color: #525b73;
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
