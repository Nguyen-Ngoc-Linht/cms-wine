<template>
  <div class="upload-container">
    <!-- Chỉ hiển thị upload khi chưa có ảnh -->
    <el-upload
      v-show="!imageUrl"
      class="image-uploader"
      drag
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleChangeFile"
      accept="image/png,image/jpeg"
      :disabled="!isEdit"
    >
      <i class="fas fa-camera"></i>
      <div class="el-upload__text" v-if="showText">
        Upload photos
      </div>
    </el-upload>

    <!-- Ảnh đã chọn -->
    <div class="image-preview" v-if="imageUrl">
      <div class="image-preview-wrapper">
        <img :src="imageUrl" />
        <div class="image-preview-action" v-if="isEdit">
          <button @click="triggerChange">Change</button>
          <button @click="rmImage">Delete</button>
          <!-- hidden upload input để change -->
          <input
            ref="hiddenUpload"
            type="file"
            accept="image/png,image/jpeg"
            @change="onFileInputChange"
            style="display: none"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile } from '@/api/product'
import { useConfig } from '@/config'

const props = defineProps({
  modelValue: String,
  showText: {type: Boolean, default: true},
  isEdit: {type: Boolean, default: false},
  userId: {type: [String, Number], required: true}
})

const emit = defineEmits(['update:modelValue'])
const config = useConfig()
const baseUrl = ref(config.VITE_PROXY_DOMAIN)

const hiddenUpload = ref(null)

const imageUrl = computed(() => {
  const val = props.modelValue
  if (!val) return ''
  if (val.startsWith('http')) return val
  const fixedPath = val.replace(/^\.\/uploads/, '/uploads')
  return `${baseUrl.value}media-service/api/v1.0/images${fixedPath}`
})

const emitInput = (val) => emit('update:modelValue', val)

const rmImage = () => emitInput('')

const triggerChange = () => {
  hiddenUpload.value?.click()
}

const onFileInputChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    handleChangeFile({raw: file}, [])
  }
}

const handleChangeFile = async (file, fileList) => {
  try {
    const fileRaw = file.raw || file
    const isAllowedSize = fileRaw.size / 1024 / 1024 < 10
    if (!isAllowedSize) {
      ElMessage.error('Dung lượng tối đa là 10MB')
      return false
    }

    const allowedTypes = ['image/jpeg', 'image/png']
    if (!allowedTypes.includes(fileRaw.type)) {
      ElMessage.error('File không đúng định dạng .jpg/.png')
      return false
    }

    const formData = new FormData()
    formData.append('file', fileRaw)
    formData.append('user_id', props.userId)
    formData.append('server_name', 'wine')

    const res = await uploadFile(formData)

    if (res.code === 201) {
      emitInput(res.data.filePath)
    } else {
      ElMessage.error('Tải file thất bại')
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('Tải file thất bại')
  }
}
</script>

<style scoped lang="scss">
.upload-container {
  width: 100%;

  .image-uploader {
    width: 100%;
    aspect-ratio: 1 / 1;
    text-align: center;
    border: 2px dashed #409eff;
    border-radius: 8px;
  }

  .image-preview {
    width: 100%;
    aspect-ratio: 1 / 1;
    position: relative;

    .image-preview-wrapper {
      width: 100%;
      height: 100%;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid #e2e7f1;
      }

      .image-preview-action {
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        opacity: 0;
        transition: opacity 0.3s ease;
        cursor: pointer;

        button {
          background: #fff;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          font-weight: 600;
          cursor: pointer;

          &:hover {
            background-color: #f2f2f2;
          }
        }
      }

      &:hover .image-preview-action {
        opacity: 1;
      }
    }
  }
}
</style>
