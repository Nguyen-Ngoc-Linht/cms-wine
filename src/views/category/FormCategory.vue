<template>
  <div>
    <div class="w-full bg-white flex items-center justify-between px-4 py-3">
      <h5 class="flex items-center">
        <div class="back pointer" @click="backCategory()">
          <img src="@/assets/imgs/weightStation/back.png" alt="..."/>
        </div>
        <div v-if="!isEdit && !isView" class="ms-2 text-2xl font-bold">Thêm danh mục</div>
        <div v-if="isEdit && !isView" class="ms-2 text-2xl font-bold">Sửa danh mục</div>
        <div v-if="isView" class="ms-2 text-2xl font-bold">Thông tin danh mục</div>
      </h5>
      <div class="flex items-center">
        <el-button
          v-if="isCreate"
          :loading="processing"
          @click="handleAddCategory()"
          class="el-button--main"
        >{{ $t('omsSetting.save') }}
        </el-button>
        <el-button
          :loading="processing"
          v-if="isEdit"
          @click="handleEditCategory()"
          class="el-button--main"
        >
          {{ $t('omsSetting.update') }}
        </el-button>
      </div>
    </div>
    <div class="px-6 my-4 content-page">
      <div class="bg-white px-5 pt-6 pb-4">
        <el-form
          ref="formCategory"
          :model="infoCategory"
          :rules="ruleEdit"
          label-position="top"
          label-width="100%"
          class="custom-form"
        >
          <el-row :gutter="12">
            <el-col :span="24" :sm="12">
              <el-form-item
                class="custom mb-5"
                label="Tên thuộc tính"
                prop="name"
              >
                <el-input
                  v-model="infoCategory.name"
                  maxlength="250"
                  :placeholder="$t('configUser.pleaseEnter')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" :sm="12">
              <el-form-item
                class="custom mb-5"
                label="Hiển thị trang chủ giới thiệu"
                prop="isShowHome"
              >
                <el-select
                  v-model="infoCategory.isShowHome"
                  filterable
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="1"
                  :placeholder="t('configUser.pleaseSelect')"
                >
                  <el-option label="Hiển thị" :value="true"/>
                  <el-option label="Ẩn" :value="false"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" :sm="12">
              <el-form-item
                class="custom mb-5"
                label="Tiêu đề"
                prop="title"
              >
                <el-input
                  v-model="infoCategory.title"
                  maxlength="250"
                  :placeholder="$t('configUser.pleaseEnter')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" :sm="12">
              <el-form-item
                class="custom mb-5"
                label="Nguồn gốc xuất xứ"
                prop="origin"
              >
                <el-select
                  v-model="infoCategory.origin"
                  filterable
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="1"
                  :placeholder="t('configUser.pleaseSelect')"
                >
                  <el-option
                    v-for="country in lstCountry"
                    :key="country.id"
                    :label="country.name"
                    :value="country.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="mt-4">
              <h6 class="font-bold text-base custom">
                Ảnh nền
              </h6>
              <el-upload
                v-model:file-list="infoCategory.listImage"
                class="avatar-uploader mt-0 custom-upload-list w-full"
                drag
                :on-success="null"
                :on-preview="null"
                :on-exceed="null"
                :auto-upload="false"
                :before-remove="beforeRemove"
                :on-remove="handleRemove"
                :on-change="handleChangeFile"
                list-type="picture-card"
                multiple
                accept=".jpg,.png"
                :limit="1"
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
                  class="file-note text-center"
                  style="color: #a4a6a7"
                >
                  ({{ $t('configUser.importLimitAndType', ['Jpg/Png', '10MB']) }})
                </p>
              </el-upload>
            </el-col>
            <el-col :span="24">
              <el-form-item
                class="custom mb-5"
                label="Mô tả"
                prop="description"
              >
                <el-input
                  v-model="infoCategory.description"
                  maxlength="1000"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                  show-word-limit
                  :placeholder="$t('configUser.pleaseEnter')"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from '@/locale'
import {ElMessage, ElMessageBox} from 'element-plus'
import {apiCreateCategory, apiGetCategoryDetail, apiUpdateCategory, uploadFile} from '@/api/product'
import {useRoute, useRouter} from 'vue-router'
import {useConfig} from '@/config'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const user = ref({})
const config = useConfig()
const baseUrl = ref(config.VITE_PROXY_DOMAIN)

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  isCreate: {
    type: Boolean,
    default: false,
  },
  isView: {
    type: Boolean,
    default: false,
  },
  // typeDialog: {
  //   type: String,
  //   required: true,
  // },
  // categoryInfo: {
  //   type: Object,
  //   required: false,
  // },
})
const ruleEdit = ref({
  name: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 250, message: t('omsSetting.ruleMaxLengthText'), trigger: 'blur' },
  ],
  isShowHome: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  description: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})

const id_category = ref('')
const infoCategory = ref({})
const formCategory = ref(null)
const processing = ref(false)

const lstCountry = ref([
  {
    id: 1,
    name: 'Pháp',
    value: 1,
  },
  {
    id: 2,
    name: 'Ý',
    value: 2,
  },
  {
    id: 3,
    name: 'Chile',
    value: 3,
  },
])

onMounted(async () => {
  id_category.value = route.params.id
  user.value = JSON.parse(localStorage.getItem('userInfo'))
  if (props.isEdit || props.isView) {
    await initData()
  }
})

const initData = async () => {
  try {
    const rs = await apiGetCategoryDetail(id_category.value)
    if (rs.code === 200) {
      infoCategory.value = rs.data
      convertData()
    }
  } catch (e) {
    console.log(e)
  }
}

const convertData = () => {
  const imagesProduct = infoCategory.value.image
  if (imagesProduct) {
    infoCategory.value.listImage = []
    infoCategory.value.listImage.push({
      name: 'item' + imagesProduct.id,
      url: baseUrl.value + 'media-service/api/v1.0/images' + imagesProduct.replace(/^\.\/uploads/, '/uploads')
    })
  }
}

const handleAddCategory = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const params = {
      name: infoCategory.value.name,
      isShowHome: infoCategory.value.isShowHome,
      image: infoCategory.value.image,
      title: infoCategory.value.title,
      origin: infoCategory.value.origin,
      description: infoCategory.value.description,
    }
    console.log(params, infoCategory.value)
    const rs = await apiCreateCategory(params)
    if (rs.code === 201) {
      ElMessage.success('Thêm danh mục thành công')
      backCategory()
    } else {
      ElMessage.success('Thêm danh mục thất bại')
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}

const handleEditCategory = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const params = {
      name: infoCategory.value.name,
      isShowHome: infoCategory.value.isShowHome,
      image: infoCategory.value.image,
      title: infoCategory.value.title,
      origin: infoCategory.value.origin,
      description: infoCategory.value.description,
    }
    const rs = await apiUpdateCategory(infoCategory.value.id, params)
    if (rs.code === 200) {
      ElMessage.success('Sửa thuộc tính thành công')
      backCategory()
    } else {
      ElMessage.success('Thêm thuộc tính thất bại')
      // emit('closeUpdate')
    }
    processing.value = false
  } catch (e) {
    console.log(e)
  }
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    formCategory.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}

const handleChangeFile = async (file, fileList) => {
  try {
    const isAllowedSize = file.size / 1024 / 1024 < 10
    if (!isAllowedSize) {
      const index = fileList.indexOf(file)
      if (index > -1) {
        fileList.splice(index, 1)
      }
      ElMessage.error(t('configUser.message.overflowMaxSize', ['10']))
      return false
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
    formData.append('user_id', user.value.userId)
    formData.append('server_name', 'wine')

    const rs = await uploadFile(formData)
    if (rs.code === 201) {
      infoCategory.value.image = rs.data.filePath
      console.log(infoCategory.value.image)
    } else {
      const index = fileList.indexOf(file)
      if (index > -1) {
        fileList.splice(index, 1)
      }
      ElMessage.error('Tải file thất bại')
      return false
    }
  } catch (e) {
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    console.log(e)
    ElMessage.error('Tải file thất bại')
    return false
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
const beforeRemove = (file, fileList) => {
  return ElMessageBox.confirm(t('administration.ip.confirmDeleteFile'), {
    confirmButtonText: t('omsSetting.confirm'),
    cancelButtonText: t('omsSetting.cancel'),
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  }).then(
    () => {
      const index = fileList.indexOf(file)
      if (index > -1) {
        indexDeleteFile.value = index
      }
      return true
    },
    () => false
  )
}
const indexDeleteFile = ref(null)
const handleRemove = (file, fileList) => {
  console.log(indexDeleteFile.value, 'vị trí xóa')
  console.log(infoCategory.value.images, 'trước khi xóa')
  infoCategory.value.images.splice(indexDeleteFile.value, 1)
  console.log(infoCategory.value.images, 'sau khi xóa')
  indexDeleteFile.value = null
}

const backCategory = () => {
  router.push('/product/category')
}
</script>

<style scoped lang="scss">
.el-form-item__label {
  color: #525b73;
  font-weight: 600 !important;
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

.custom-upload-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .el-upload-list {
    margin: 10px 0 0;
    padding: 0;
    list-style: none;
    width: 100%;
    position: relative;
  }

  .el-upload-list__item {
    flex: 0 0 24%;
    height: 250px;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-upload-list__item-thumbnail img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .el-upload--picture-card {
    height: 250px;
  }

  .el-upload {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    outline: 0;
    flex: 0 0 24%;
  }

  .el-upload-dragger {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    border-radius: 6px;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}

.el-upload-list__item.is-success:focus:not(:hover) .el-icon--close-tip {
  display: none;
}
</style>
