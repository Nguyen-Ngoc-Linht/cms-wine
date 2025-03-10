<template>
  <div>
    <template v-if="$slots.default">
      <div @click="showDialog">
        <slot />
      </div>
    </template>
    <template v-else>
      <el-button
        text
        size="default"
        class="!p-0"
      >
        <div
          class="text-gray flex items-center pointer text-[#525B73]"
          @click="showDialog"
        >
          <svg-icon
            icon-class="import-file"
            class="width-20 height-20 margin-right-4"
          />
          {{ buttonText || $t('configUser.importFile') }}
        </div>
      </el-button>
    </template>
    <Dialog
      :show="show"
      :appendToBody="true"
      width="600"
      :title="dialogTitle || $t('configUser.importFile')"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <p
          v-if="dialogText"
          class="required"
        >
          {{ dialogText }}
        </p>
        <el-upload
          v-model:file-list="fileList"
          class="avatar-uploader"
          drag
          action="#"
          :on-success="null"
          :before-upload="null"
          :on-change="
            (file, fileList1) => {
              checkFileFormat(file, fileList1)
            }
          "
          :limit="limitFile"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-exceed="handleExceed"
          :auto-upload="false"
          accept=".xls,.xlsx"
          multiple
        >
          <svg-icon
            icon-class="import-dialog"
            class="width-50 height-50"
          />
          <p class="drag-note">{{ t('configUser.importDrag') }}</p>
          <p class="file-note">
            ({{ $t('configUser.importLimit', [allowExtension.join(', '), getSizeText(maxSize)]) }})
          </p>
        </el-upload>
        <div class="foot flex justify-end">
          <el-button
            style="background-color: #fff; border-color: #7c7e81; color: #7c7e81"
            class="border-1 paddingX-10"
            type="info"
            @click="handleCloseDialog()"
            >{{ $t('omsSetting.cancel') }}
          </el-button>
          <el-button
            class="border-1 paddingX-30 el-button--main"
            @click="handleUpload"
            :loading="processing"
            :disabled="!fileList.length"
            >{{ $t('omsSetting.confirm') }}
          </el-button>
        </div>
      </template>
    </Dialog>
    <Export
      ref="exportRef"
      class="hidden"
      :file-name="'ip-error'"
      :data="dataExport"
      @export="handleExport"
    />
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useI18n } from '@/locale'
import Dialog from '@/components/Dialog'
import lang from '@/locale/getMessage'
import { useAppStore } from '@/store'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiIpConfig } from '@/api/systemconfig'
import Export from '@/components/Export'

const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()

const locale = computed(() => lang[appStore.lang])

const props = defineProps({
  buttonText: { type: String, default: null },
  dialogTitle: { type: String, default: null },
  dialogText: { type: String, default: null },
  maxSize: { type: Number, default: 15000000 },
  limitFile: { type: Number, default: 1 },
  allowedContentTypes: {
    type: Array,
    default() {
      return [
        {
          type: 'xls',
          name: 'application/vnd.ms-excel',
        },
        {
          type: 'xlsx',
          name: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ]
    },
  },
})
const emit = defineEmits(['onSuccess'])

const allowExtension = computed(() => props.allowedContentTypes.map(i => '.' + i.type))
const allowAcceptFile = computed(() => props.allowedContentTypes.map(i => i.name))

const show = ref(false)

const fileList = ref([])

const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview = uploadFile => {
  console.log(uploadFile)
}

const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(t('el.upload.reachLimit', [props.limitFile]))
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

const showDialog = () => {
  show.value = true
}
const handleCloseDialog = () => {
  fileList.value = []
  show.value = false
}

const getSizeText = size => {
  if (size >= 1000000000) {
    return parseFloat((size / 1000000000).toFixed(2)) + 'GB'
  } else if (size >= 1000000) {
    return parseFloat((size / 1000000).toFixed(2)) + 'MB'
  } else if (size >= 1000) {
    return parseFloat((size / 1000).toFixed(2)) + 'KB'
  }
  return ''
}
const exportRef = ref(null)
const errorData = ref(null)
const dataExport = ref([])
const processing = ref(false)
const handleUpload = async () => {
  if (processing.value || !fileList.value) {
    return
  }
  processing.value = true
  const data = {
    method: 'IMPORT',
    arguments: {
      type: 'EXCEL',
      data: await convertFilesToBase64(fileList.value[0]),
    },
  }
  apiIpConfig(data)
    .then(res => {
      errorData.value = res.data
      if (res?.data) {
        ElMessageBox.confirm(t('administration.ip.errorImport'), t('el.messagebox.title'), {
          confirmButtonText: t('omsSetting.download'),
          cancelButtonText: t('omsSetting.cancel'),
          confirmButtonClass: 'el-button--main',
          cancelButtonClass: 'el-button--secondary',
          buttonSize: 'default',
        })
          .then(() => {
            handleExport()
          })
          .catch(() => {})
      } else {
        ElMessageBox.alert(t('administration.ip.saveSuccess'), t('el.messagebox.title'), {
          confirmButtonText: t('omsSetting.confirm'),
          confirmButtonClass: 'el-button--main',
          buttonSize: 'default',
        })
      }
      emit('onSuccess')
      handleCloseDialog()
    })
    .catch(_ => {
      errorData.value = []
    })
    .finally(_ => {
      processing.value = false
    })
}
const convertFilesToBase64 = async file => {
  try {
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64Data = reader.result.split(',')[1]
        resolve(base64Data)
      }
      reader.onerror = reject
      reader.readAsDataURL(file.raw)
    })
    return base64Data
  } catch (e) {
    console.log(e)
    return null
  }
}

const checkFileFormat = (file, fileList) => {
  const isAllowedSize = file.size / 1024 / 1024 < 5
  if (!isAllowedSize) {
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    ElMessage.error(t('configUser.message.overflowMaxSize', ['5']))
    return false
  }

  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ]
  if (!allowedTypes.includes(file.raw.type)) {
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    ElMessage.error('File không đúng định dạng xls/xlsx')
    return false
  }

  return true
}

const handleExport = () => {
  // const exportData = errorData.value.reduce((arr, item, index) => {
  //   const {
  //     ipAddress,
  //     error
  //   } = item
  //   arr.push([
  //     index + 1,
  //     ipAddress,
  //     error
  //   ])
  //   return arr
  // }, [])
  //
  // exportData.unshift([
  //   'STT',
  //   t('omsSetting.address'),
  //   t('el.upload.error')
  // ])
  // dataExport.value = [...exportData]
  if (errorData.value) {
    const data = errorData.value
    downloadFileBase64(data.name, data.data)
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
  name: 'ImportExcel',
})
</script>

<style scoped>
:deep(.el-upload-dragger) {
  padding: 30px 10px;
}

.drag-note {
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  text-align: center;
  margin: 10px 0;
}

.file-note {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
}

.required:before {
  content: '*';
  color: var(--el-color-danger);
  margin-right: 4px;
}
</style>
