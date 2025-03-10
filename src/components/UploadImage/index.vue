<template>
  <el-upload
    list-type="picture-card"
    :file-list="listFile"
    :action="urlUpload"
    :headers="{ Authorization: 'Bearer ' + token }"
    :multiple="false"
    accept=".jpg, .jpeg, .png"
    :limit="limit"
    :data="{ keepFileName: true }"
    :auto-upload="true"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :on-change="handleChange"
    :before-upload="handleBeforeUpload"
  >
    <template #file="{ file }">
      <div>
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt=""
        />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
    <el-icon>
      <svg-icon
        icon-class="plus"
        class="fs-24 text-[#99A2BC]"
      />
    </el-icon>
  </el-upload>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, watch, inject } from 'vue'
import { getToken } from '@/utils/auth'
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
const listFile = ref([])

watch(
  () => props.files,
  (newList, oldList) => {
    if (newList) {
      const listUrl = newList.split(',')
      listFile.value = listUrl.reduce((arr, item) => {
        arr.push({
          name: item,
          url: getSourceUrl(item),
        })
        return arr
      }, [])
    }
  },
  { immediate: true }
)

const handleExceed = (files, fileList) => {
  ElMessage.warning(`Chỉ được chọn tối đa ${props.limit} hình ảnh`)
}
const handleChange = (file, fileList) => {}
const handleSuccess = (response, file, fileList) => {
  fileList.value = [...fileList]
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
const handleBeforeUpload = file => {
  const fileType = file.type.split('/')[1]

  if (!['jpg', 'jpeg', 'png'].includes(fileType)) {
    ElMessage.error('Vui lòng upload ảnh jpg, jpeg, png')
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
  name: 'UploadImage',
})
</script>

<style lang="scss" scoped>
:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
  border-radius: 2px;
  border: 1px dashed #99a2bc;
}
:deep(.el-upload-list__item) {
  width: 100px;
  height: 100px;
}
</style>
