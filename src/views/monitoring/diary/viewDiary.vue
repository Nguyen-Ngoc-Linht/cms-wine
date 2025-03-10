<template>
  <div class="bg-white">
    <el-form
      v-if="roleData.canUpdate || roleData.canCreate"
      ref="viewDiary"
      :model="infoDiary"
      :rules="ruleEdit"
      label-position="top"
      label-width="100%"
      class="custom-form"
    >
      <el-row
        class="mb-4"
        :gutter="20"
      >
        <el-col
          :lg="14"
          :md="16"
          :sm="18"
        >
          <div class="item-mid">
            <el-form-item
              class="custom mb-5"
              :label="$t('monitoring.diary.job')"
              prop="scoringWork.id"
              style="display: inline-block; width: 100%"
            >
              <el-select
                v-model="infoDiary.scoringWork.id"
                :placeholder="t('configUser.pleaseSelect')"
                clearable
                filterable
                collapse-tags
                collapse-tags-tooltip
                class="height-32"
                style="width: 100%"
              >
                <el-option
                  v-for="item in listScoringWork"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="item-mid">
            <el-form-item
              class="custom mb-5"
              :label="$t('monitoring.diary.contentDetail')"
              prop="content"
              style="display: inline-block; width: 100%"
            >
              <el-input
                :disabled="isAbled"
                type="textarea"
                v-model="infoDiary.content"
                :autosize="{ minRows: 6, maxRows: 10 }"
                show-word-limit
                maxlength="5000"
                :placeholder="$t('configUser.pleaseEnter')"
              />
            </el-form-item>
          </div>
        </el-col>
        <el-col
          :lg="10"
          :md="8"
          :sm="6"
        >
          <h4 class="font-bold text-2xl text-black">{{ t('monitoring.rating.fileRating') }}</h4>
          <el-upload
            v-model:file-list="infoDiary.fileList"
            class="avatar-uploader mt-3"
            drag
            :on-success="null"
            :on-change="handleUploadFile"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :auto-upload="false"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
          >
            <svg-icon
              icon-class="import-dialog"
              class="width-50 height-50"
            />
            <p class="drag-note my-2">{{ t('configUser.importImage') }}</p>
            <p class="file-note">
              ({{ $t('configUser.importLimitAndType', ['jpg/png/jepg/pdf', '10MB']) }})
            </p>
          </el-upload>
        </el-col>
      </el-row>
    </el-form>
    <hr
      v-if="!isAbled"
      class="margin-bottom-24"
    />
    <div
      v-if="!isAbled"
      class="action"
    >
      <div class="flex justify-end">
        <el-button
          type="default"
          @click="closeDialog"
          class="bg-outline-secondary"
          >{{ $t('configUser.cancel') }}</el-button
        >
        <el-button
          v-if="typeDialog === 'add' && roleData.canCreate"
          :loading="processing"
          @click="handleAddDiary"
          type="primary"
          class="bg--dark-purple"
          style="border: transparent"
          >{{ $t('configUser.addNew') }}
        </el-button>
        <el-button
          v-if="typeDialog === 'edit' && roleData.canUpdate"
          :loading="processing"
          @click="handleUpdateScoringLog"
          type="primary"
          class="bg--dark-purple"
          style="border: transparent"
          >{{ $t('omsSetting.update') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, inject } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  apiCreateScoringLog,
  apiGetListScoringWork,
  apiUpdateScoringLog,
  uploadFile,
} from '@/api/rating'
import { usePermissionStore } from '@/store'
import { useConfig } from '@/config'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const props = defineProps({
  typeDialog: {
    type: String,
    required: true,
  },
  diaryInfo: {
    type: Object,
    required: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})
const ruleEdit = ref({
  scoringWork: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  content: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})
const listScoringWork = ref([])
const processing = ref(false)
const isAbled = ref(false)
const infoDiary = ref({
  scoringWork: {
    id: '',
  },
})

const config = useConfig()
const baseUrl = ref(config.VITE_APP_UPLOAD_URL)
const viewDiary = ref(null)
const emit = defineEmits(['closeUpdate'])
const closeDialog = () => {
  console.log('close')
  emit('closeUpdate')
}

onMounted(() => {
  setDataDefault()
  initData()
  console.log('env', baseUrl.value)
})

const setDataDefault = async () => {
  const rs = await apiGetListScoringWork()
  if (rs.status === 200) {
    listScoringWork.value = rs.data
  }
}
const initData = () => {
  if (props.typeDialog === 'view') {
    isAbled.value = true
  }
  if (props.typeDialog === 'edit' && props.diaryInfo) {
    infoDiary.value = props.diaryInfo
    setListFileData()
  }
}
const setListFileData = () => {
  const files = props.diaryInfo.fileVaultsDTOS
  infoDiary.value.fileVaultIds = []
  infoDiary.value.fileList = []
  for (const file of files) {
    infoDiary.value.fileList.push({
      name: file.fileName,
      url: `${baseUrl.value}${file.filePath}`,
    })
    infoDiary.value.fileVaultIds.push(file.id)
  }
}
const handleAddDiary = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const params = {
      scoringWork: {
        id: infoDiary.value.scoringWork.id,
      },
      content: infoDiary.value.content,
      fileVaultIds: infoDiary.value.fileVaultIds,
    }
    console.log(infoDiary.value)
    const rs = await apiCreateScoringLog(params)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.addSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      emit('closeUpdate')
    }
  } catch (e) {
    console.log(e)
    processing.value = false
  }
}
const handleUpdateScoringLog = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const params = {
      scoringWork: {
        id: infoDiary.value.scoringWork.id,
      },
      content: infoDiary.value.content,
      fileVaultIds: infoDiary.value.fileVaultIds,
    }
    console.log(infoDiary.value)
    const rs = await apiUpdateScoringLog(infoDiary.value.id, params)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      emit('closeUpdate')
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    viewDiary.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}

const handleUploadFile = async (file, fileList) => {
  const isAllowedSize = file.size / 1024 / 1024 < 10
  if (!isAllowedSize) {
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    ElMessage.error(t('configUser.message.overflowMaxSize', ['10']))
    return false
  }
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
  if (!allowedTypes.includes(file.raw.type)) {
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    ElMessage.error('File không đúng định dạng .jpg/.jepg/.png/.pdf')
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
  formData.append('fileCategory', 2)

  const rs = await uploadFile(formData)
  if (rs.status === 200) {
    const idFile = rs.data.data[0].id
    if (!Array.isArray(infoDiary.value.fileVaultIds) || !infoDiary.value.fileVaultIds) {
      infoDiary.value.fileVaultIds = []
    }
    infoDiary.value.fileVaultIds.push(idFile)
    if (!Array.isArray(infoDiary.value.fileVaultsDTOS) || !infoDiary.value.fileVaultsDTOS) {
      infoDiary.value.fileVaultsDTOS = []
    }
    infoDiary.value.fileVaultsDTOS.push(rs.data.data[0])
  }
}
const handlePreview = file => {
  if (file.url) {
    window.open(file.url, '_blank')
  } else if (file.raw) {
    const fileUrl = URL.createObjectURL(file.raw)
    window.open(fileUrl, '_blank')
  } else {
    ElMessage.error('Không thể xem trước file này')
  }
}
const handleRemove = file => {
  const item = infoDiary.value.fileVaultsDTOS
  const length = item.length
  let id_file = ''
  for (let i = 0; i < length; i++) {
    if (file.name === item[i].fileName) {
      id_file = item[i].id
      break
    }
  }
  infoDiary.value.fileVaultsDTOS = infoDiary.value.fileVaultsDTOS.filter(
    item => item.id !== id_file
  )
  infoDiary.value.fileVaultIds = infoDiary.value.fileVaultIds.filter(item => item !== id_file)
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
</script>

<style lang="scss">
.custom {
  .el-form-item__label {
    color: #525b73;
    font-weight: 600 !important;
  }
}
.custom-form {
  .el-form-item {
    //display: flex;
    --font-size: 14px;
    margin-bottom: 8px;
    margin-top: 8px;
  }
  .el-form-item--default {
    --font-size: 14px;
    --el-form-label-font-size: var(--font-size);
    margin-bottom: 8px;
    margin-top: 8px;
  }
}
.el-upload-list__item.is-success:focus:not(:hover) .el-icon--close-tip {
  display: none;
}
</style>
