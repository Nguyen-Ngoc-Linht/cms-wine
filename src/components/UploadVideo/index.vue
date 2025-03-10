<template>
  <el-upload
    :key="keyVideoList"
    :file-list="listFile"
    :action="urlUpload"
    :headers="{ Authorization: 'Bearer ' + token }"
    :multiple="false"
    accept=".mp4"
    :limit="limit"
    :data="{ keepFileName: true }"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :on-change="handleChange"
    :on-preview="handlePreview"
    :before-upload="handleBeforeUpload"
  >
    <el-button
      type="primary"
      size="default"
      >Chọn Video
    </el-button>
  </el-upload>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, watch, inject } from 'vue'
import { getToken } from '@/utils/auth'
import { genKey } from '@/utils/app/string.js'
import { useConfig } from '@/config'

const emit = defineEmits(['success'])
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
    type: String,
    default: '',
  },
})

const config = useConfig()
const token = ref(getToken())
const urlUpload = ref(config.VITE_APP_UPLOAD_IMAGE_URL)
const action = ref('')
const keyVideoList = ref('')
const listFile = ref([])

watch(
  () => props.files,
  (newList, oldList) => {
    if (newList) {
      const listUrl = newList.split(',')
      listFile.value = listUrl.reduce((arr, item) => {
        const arrStr = item.split('/')
        arr.push({
          name: arrStr[arrStr.length - 1],
          url: getSourceUrl(item),
        })
        return arr
      }, [])

      keyVideoList.value = genKey()
    }
  },
  { immediate: true }
)

const handleExceed = (files, fileList) => {
  ElMessage.warning(`Chỉ được chọn tối đa ${props.limit} video`)
}
const handleChange = (file, fileList) => {}
const handleSuccess = (response, file, fileList) => {
  listFile.value = fileList
  emit('success', fileList)
}
const handleRemove = (file, fileList) => {
  const index = listFile.value.indexOf(file)
  if (index > -1) {
    listFile.value.splice(index, 1)
    emit('success', listFile.value)
  } else {
    emit('success', fileList)
  }
}
const handlePreview = file => {
  window.open(file.url, '_blank')
}
const handleBeforeUpload = file => {
  const fileType = file.type.split('/')[1]

  if (!['mp4', 'wmv', 'avi'].includes(fileType)) {
    ElMessage.error('Định dạng video không được hỗ trợ')
    return false
  }

  const maxSize = file.size / 1024 / 1024 < props.maxSize

  if (!maxSize) {
    ElMessage.error(`Dung lượng tệp tối đa ${props.maxSize}MB`)
  }

  return true
}

function getSourceUrl(url) {
  return url
}

defineOptions({
  name: 'UploadVideo',
})
</script>

<style lang="scss" scoped>
:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
  border-radius: 2px;
  border: 1px dashed #99a2bc;
}

:deep(.el-upload-list__item-file-name) {
  width: 300px;
}
</style>
