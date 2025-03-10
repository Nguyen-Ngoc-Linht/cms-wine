<template>
  <div class="bg-white">
    <div v-if="roleData.canRead">
      <el-form
        ref="sendDataRequest"
        :model="infoApp"
        :rules="ruleEdit"
        label-position="top"
        label-width="100%"
        class="custom-form"
      >
        <div class="item-mid">
          <el-form-item
            class="custom mb-5"
            :label="'Avatar'"
            prop="avatar"
            style="display: inline-block; width: 100%"
          >
            <el-upload
              v-model:file-list="infoApp.avatar"
              list-type="picture-card"
              :show-file-list="false"
              :auto-upload="false"
              :on-remove="null"
              :on-change="handleUploadFile"
              accept="image/.png,.jpg,.jpeg"
            >
              <template
                v-if="
                  infoApp.avatar &&
                  infoApp.avatar[0] &&
                  (infoApp.avatar[0].url || infoApp.avatar[0].raw)
                "
              >
                <img
                  :src="infoApp.avatar[0].url || URL.createObjectURL(infoApp.avatar[0].raw)"
                  alt="Avatar"
                  class="uploaded-avatar"
                  style="width: 100%; height: 100%; object-fit: cover"
                />
              </template>
              <template v-else>
                <el-icon><Plus /></el-icon>
              </template>
            </el-upload>
          </el-form-item>
        </div>
        <div class="item-mid">
          <el-form-item
            class="custom mb-5"
            :label="$t('monitoring.deviceETC.nameApp')"
            prop="name"
            style="display: inline-block; width: 100%"
          >
            <el-input
              v-model="infoApp.name"
              maxlength="300"
              :placeholder="t('configUser.pleaseEnter')"
            ></el-input>
          </el-form-item>
        </div>
        <div
          v-if="!typeDialog"
          class="item-mid"
        >
          <el-form-item
            class="custom mb-5"
            :label="$t('monitoring.deviceETC.link')"
            prop="supplierLeader"
            style="display: inline-block; width: 100%"
          >
            <el-input
              v-model="infoApp.link"
              maxlength="3000"
              :autosize="{ minRows: 5, maxRows: 10 }"
              show-word-limit
              type="textarea"
              :disabled="typeDialog"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <hr class="margin-bottom-24" />
      <div class="action">
        <div class="flex justify-end">
          <el-button
            type="default"
            @click="closeDialog"
            class="bg-outline-secondary"
            >{{ $t('configUser.cancel') }}</el-button
          >
          <el-button
            v-if="roleData.canUpdate"
            @click="handleUpdateApp"
            type="primary"
            class="bg--dark-purple"
            style="border: transparent"
            >{{ $t('omsSetting.saveChange') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { apiCreateDevice, apiUpdateDevice } from '@/api/deviceETC'
import { uploadFile } from '@/api/rating'
import { usePermissionStore } from '@/store'
import { useConfig } from '@/config'

const { roleData } = usePermissionStore()
const { t } = useI18n()

const config = useConfig()
const baseUrl = ref(config.VITE_APP_UPLOAD_URL)

const props = defineProps({
  typeDialog: {
    type: Boolean,
    required: false,
  },
  canEditLink: {
    type: Boolean,
    request: false,
  },
  deviceInfo: {
    type: Object,
    required: false,
  },
})

const ruleEdit = ref({
  avatar: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  name: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})
const infoApp = ref({})

const sendDataRequest = ref(null)
const emit = defineEmits(['closeUpdate'])

const closeDialog = () => {
  emit('closeUpdate')
}

onMounted(async () => {
  await initData()
})

const initData = async () => {
  console.log(props.deviceInfo)
  infoApp.value = { ...props.deviceInfo }
  if (infoApp.value.fileVaults !== null && infoApp.value.fileVaults.length > 0) {
    infoApp.value.avatar = [
      {
        name: infoApp.value.fileVaults[0].fileName,
        url: `${baseUrl.value}${infoApp.value.fileVaults[0].filePath}`,
      },
    ]
  }
  console.log(infoApp.value)
}

const handleUpdateApp = async () => {
  try {
    await validFormData()
    const params = {
      name: infoApp.value.name,
      link: infoApp.value.link,
      fileVaults: infoApp.value.fileVaults || [],
    }
    const rs = await apiUpdateDevice(infoApp.value.id, params)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3000,
      })
      emit('closeUpdate')
    }
  } catch (e) {
    console.error(e)
  }
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    sendDataRequest.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        reject(new Error('Form validation failed'))
      }
    })
  })
}
const handleUploadFile = async (file, fileList) => {
  if (fileList.length > 1) {
    fileList.splice(0, 1)
  }
  const allowedTypes = ['image/jpeg', 'image/png']
  if (!allowedTypes.includes(file.raw.type)) {
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    ElMessage.error('File không đúng định dạng .jpg/.png')
    return false
  }

  const fileToUpload = file.raw || file
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
    infoApp.value.fileVaults = [
      {
        id: idFile,
      },
    ]
  }
}
</script>

<style scoped lang="scss">
.el-form-item__label {
  color: #525b73;
  font-weight: 600 !important;
}
.uploaded-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.custom {
  :deep(el-form-item__label) {
    color: #525b73;
    font-weight: 600 !important;
  }
}
</style>

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
</style>
