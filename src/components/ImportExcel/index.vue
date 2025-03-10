<script setup>
import { ref, watch, inject, computed } from 'vue'
import { ElMessage } from 'element-plus'
import http from '@/utils/request'
import { useI18n } from '@/locale'
import { useConfig } from '@/config'

const config = useConfig()
defineOptions({
  name: 'ImportExcel',
})
const emit = defineEmits(['uploadSuccess', 'removeSuccess'])
const props = defineProps({
  limit: {
    type: Number,
    default: 10,
  },
  maxSize: {
    type: Number,
    default: 200,
  },
  files: {
    type: Array,
    default: () => [],
  },
  keepFileName: {
    type: Boolean,
    default: true,
  },
  mainEntityName: {
    type: String,
    default: 'unknown',
  },
  fileCategory: {
    type: Number,
    default: 0,
  },
  fileContent: {
    type: String,
    default: '',
  },
  fileType: {
    type: String,
    default: '',
  },
  actionUrl: {
    type: String,
    default: null,
  },
  reportType: {
    type: String,
    default: '',
  },
  isCheckUpload: {
    type: Boolean,
    default: false,
  },
})

const defaultActionUrl = computed(() =>
  props.actionUrl ? props.actionUrl : `${config.VITE_APP_UPLOAD_URL}/upload`
)

const { t } = useI18n()
const urlUpload = ref(config.VITE_APP_UPLOAD_URL + '/upload')
const urlDeleteUpload = ref(config.VITE_APP_UPLOAD_URL)

const listFile = ref([])
const loadingFile = ref(false)
watch(
  () => props.files,
  (newList, oldList) => {
    console.log('newList: ', newList)
    if (newList) {
      const listUrl = newList
      listFile.value = newList.reduce((arr, item) => {
        arr.push({
          name: item.fileName,
          url: getSourceUrl(item),
          response: [item],
        })
        return arr
      }, [])
    }
  },
  { immediate: true }
)

const handleChange = (file, fileList) => {}
const handleSuccess = (response, file, fileList) => {
  fileList.value = [...fileList]
  emit('uploadSuccess', response)
}
const handleExceed = (file, fileList) => {
  ElMessage.warning(t('explanationSupport.limitFile', [props.limit]))
}
const handleRemove = (file, fileList) => {
  console.log('handleRemove: ', file, fileList)
  const index = listFile.value.indexOf(file)
  const payload = {
    idFile: file.response[0].id,
  }
  if (index > -1) {
    listFile.value.splice(index, 1)
    emit('removeSuccess', payload)
  } else {
    // emit('removeSuccess', fileList)
    emit('removeSuccess', payload)
  }
  // requestDeleteFile(file.response[0].id).then(response => {
  //   if (response.status === 200) {
  //     console.log('response: ', response)
  //     const index = listFile.value.indexOf(file)
  //     if (index > -1) {
  //       listFile.value.splice(index, 1)
  //       emit('removeSuccess', listFile.value)
  //     } else {
  //       emit('removeSuccess', fileList)
  //     }
  //   }
  // }).catch(err => {
  //   console.log(err)
  // })
}
const handleBeforeUpload = file => {
  const typeXlsx = 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  const fileType = file.type.split('/')[1]

  const fileName = file.name
  const fileExtension = fileName.split('.').pop().toLowerCase()

  if (
    (fileExtension !== 'xlsx' && fileExtension !== fileType) ||
    (fileExtension === 'xlsx' && fileType !== typeXlsx)
  ) {
    ElMessage.error(`Vui lòng upload file dạng .xlsx`)
    // ElMessage.error(t('files.fileType', [fileType]))
    return false
  }
  // if (!['xlsx'].includes(fileType)) {
  // ElMessage.error('Vui lòng upload file xlsx')
  // return false
  // }

  const maxSize = file.size / 1024 / 1024 < props.maxSize
  console.log(file.size / 1024 / 1024)

  if (!maxSize) {
    // ElMessage.error(`Dung lượng tệp tối đa ${props.maxSize}MB`)
    ElMessage.error(t('files.fileSize', [props.maxSize]))
  }

  return true
}
const customRequestUpload = options => {
  loadingFile.value = true
  const { file } = options

  const formData = new FormData()
  formData.append('file', file)
  formData.append('keepFileName', props.keepFileName) // Custom param
  formData.append('mainEntityName', props.mainEntityName) // Custom param
  formData.append('fileCategory', props.fileCategory) // Custom param
  if (props.reportType !== '') {
    formData.append('reportType', props.reportType)
  }

  requestUpload(options, formData)
    .then(response => {
      if (response.status === 200) {
        console.log('response: ', response)
        options.onSuccess(response.data)
        loadingFile.value = false
      } else {
        listFile.value = []
        loadingFile.value = false
      }
    })
    .catch(err => {
      console.log(err)
      listFile.value = []
      loadingFile.value = false
    })
}

const requestUpload = (options, data) => {
  return http.request({
    url: options.action,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
const requestDeleteFile = data => {
  return http.request({
    url: urlDeleteUpload.value + `/${data}`,
    method: 'delete',
  })
}
function getSourceUrl(url) {
  return url.filePath
}
</script>

<template>
  <el-upload
    class="upload-excel"
    drag
    v-loading="loadingFile"
    :action="defaultActionUrl"
    :file-list="listFile"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :on-change="handleChange"
    :before-upload="handleBeforeUpload"
    :auto-upload="true"
    :http-request="customRequestUpload"
    :limit="limit"
    :on-exceed="handleExceed"
    :disabled="isCheckUpload"
    multiple
    :accept="fileType"
    list-type="text"
  >
    <svg-icon
      icon-class="import-bold"
      class="mb-3 svg-icon"
    />
    <div class="el-upload__text">
      <p class="color-[#7C7E81] fs-18 font-[500] mb-2">
        {{ t('files.infoFile') }} ({{ fileType }})
      </p>
      <p
        class="color-[#A4A6A7] fs-14 mb-2"
        v-if="fileContent !== ''"
      >
        ({{ fileContent }})
      </p>
    </div>
    <!--    <template #tip>-->
    <!--      <div class="el-upload__tip">-->
    <!--        jpg/png files with a size less than 500kb-->
    <!--      </div>-->
    <!--    </template>-->
  </el-upload>
</template>

<style scoped lang="scss">
svg.svg-icon {
  width: 52px;
  height: 52px;
  margin-right: 8px;
}
.upload-excel {
  width: 100%;
}
</style>
