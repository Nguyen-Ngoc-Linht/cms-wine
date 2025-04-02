<template>
  <div>
    <div class="w-full bg-white flex items-center justify-between px-4 py-3">
      <h5 class="flex items-center">
        <div class="back pointer" @click="backProduct()">
          <img src="@/assets/imgs/weightStation/back.png" alt="..."/>
        </div>
        <div v-if="!isEdit && !isView" class="ms-2 text-2xl font-bold">Thêm sản phẩm</div>
        <div v-if="isEdit && !isView" class="ms-2 text-2xl font-bold">Sửa sản phẩm</div>
        <div v-if="isView" class="ms-2 text-2xl font-bold">Thông tin sản phẩm</div>
      </h5>
      <div class="flex items-center">
        <el-button
          v-if="!isEdit && !isView"
          :loading="processing"
          @click="handleAddProduct()"
          class="el-button--main"
        >{{ $t('omsSetting.save') }}
        </el-button>
        <el-button
          :loading="processing"
          v-if="isEdit"
          @click="handleUpdateProduct()"
          class="el-button--main"
        >
          {{ $t('omsSetting.update') }}
        </el-button>
      </div>
    </div>
    <!--  Content  -->
    <div class="px-6 mt-4 content-page">
      <div class="bg-white px-5 pt-6 pb-4">
        <el-form ref="formProduct" :rules="ruleEdit" :model="infoProduct">
          <div class="flex items-center justify-between">
            <h5 class="text-black font-semibold text-lg">
              Thông tin sản phẩm
            </h5>
          </div>
          <el-row :gutter="20">
            <el-col :sm="12" :span="24">
              <el-form-item
                label="Tên sản phẩm"
                prop="name"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoProduct.name"
                  maxlength="250"
                  :placeholder="$t('configUser.pleaseEnter')"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :span="24">
              <el-form-item
                label="Thuộc tính sản phẩm"
                prop="attributes"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoProduct.attributes"
                  clearable
                  filterable
                  multiple
                  collapse-tags
                  @change="setAttribute"
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isEdit || isView"
                >
                  <el-option
                    v-for="item in attributes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="infoProduct.attributes.length > 0" :span="24">
              <h6 class="text-md font-bold mb-0">Danh sách thuộc tính</h6>
            </el-col>
            <el-col
              v-for="(attribute, index) in infoProduct.productAttributes"
              :key="index"
              :md="8"
              :sm="12"
              :span="24"
            >
              <el-form-item :label="attribute.attribute.name">
                <el-input v-model="attribute.value"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :span="24">
              <el-form-item label="Số nhóm biến thể">
                <el-input v-model="nbVariant" type="number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :span="24">
              <el-form-item prop="category.id" label="Danh mục sản phẩm">
                <el-select
                  v-model="infoProduct.category.id"
                  clearable
                  collapse-tags
                  style="width: 100%"
                >
                  <el-option
                    v-for="(item, index) in categories"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="mt-2"></el-col>
            <el-col :span="24" class="mt-2"></el-col>
            <el-col :span="24">
              <el-form-item
                prop="description"
                label="Mô tả sản phẩm"
                style="display: inline-block; width: 100%;"
              >
                <el-input
                  v-model="infoProduct.description"
                  type="textarea"
                  show-word-limit
                  maxlength="5000"
                  :autosize="{ minRows: 4, maxRows: 5 }"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <h6 class="font-bold text-base custom">
                Ảnh sản phẩm
              </h6>
              <el-upload
                v-model:file-list="infoProduct.listImage"
                class="avatar-uploader mt-3 custom-upload-list w-full"
                drag
                :on-success="null"
                :on-preview="null"
                :on-remove="handleRemove"
                :on-change="
                (file, fileList) => {
                  handleChangeFile(file, fileList, 2)
                }
              "
                :before-remove="beforeRemove"
                :on-exceed="null"
                :auto-upload="false"
                list-type="picture-card"
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
                  class="file-note text-center"
                  style="color: #a4a6a7"
                >
                  ({{ $t('configUser.importLimitAndType', ['Jpg/Png', '10MB']) }})
                </p>
              </el-upload>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import { useI18n } from '@/locale'
import {useRoute, useRouter} from 'vue-router'
import {apiGetAttribute, apiGetCategory} from '@/api/product'
import {ElMessage, ElMessageBox} from 'element-plus'

const props = defineProps({
  isView: {
    type: Boolean,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const ruleEdit = ref({
  name: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  attributes: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  category: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  }
})
const nbVariant = ref(null)
const infoProduct = ref({
  name: '',
  attributes: [],
  productAttributes: [],
  category: {
    id: ''
  },
  listImage: [],
})
const formProduct = ref(null)

const attributes = ref([])
const attributeCache = ref([])
const categories = ref([])

const processing = ref(false)

onMounted(() => {
  setDataDefault()
})

const setDataDefault = async () => {
  try {
    const params = {
      name: '',
      paged: {
        page: 1,
        size: 1000
      }
    }
    const rs1 = await apiGetAttribute(params)
    if (rs1.code === 200) {
      attributes.value = rs1.data.content
    }
    const params1 = {
      name: '',
      description: '',
      paged: {
        page: 1,
        size: 1000
      }
    }
    const rs2 = await apiGetCategory(params1)
    if (rs2.code === 200) {
      categories.value = rs2.data.content
    }
  } catch (e) {
    console.log(e)
  }
}

const handleAddProduct = async () => {
  try {
    await Promise.all([
      validFormData()
    ])
    processing.value = true
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const handleUpdateProduct = async () => {
  try {
    await Promise.all([
      validFormData()
    ])
    processing.value = true
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    formProduct.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}

const setAttribute = (selectedAttributes) => {
  if (!attributeCache.value) {
    attributeCache.value = []
  }

  infoProduct.value.productAttributes.forEach((item) => {
    attributeCache.value[item.attribute.id] = item.value
  })

  // Cập nhật danh sách productAttributes
  infoProduct.value.productAttributes = selectedAttributes.map((attributeId) => {
    const attribute = attributes.value.find((item) => item.id === attributeId)
    if (attribute) {
      return {
        attribute,
        value: attributeCache.value[attributeId] || '',
      }
    }
    return null
  }).filter((item) => item !== null)
}
const handleChangeFile = async (file, fileList, type) => {
  const isAllowedSize = file.size / 1024 / 1024 < 10
  if (!isAllowedSize) {
    const index = fileList.indexOf(file)
    if (index > -1) {
      fileList.splice(index, 1)
    }
    ElMessage.error(t('configUser.message.overflowMaxSize', ['10']))
    return false
  }
  if (type === 1) {
    const allowedTypes = ['application/pdf']
    if (!allowedTypes.includes(file.raw.type)) {
      const index = fileList.indexOf(file)
      if (index > -1) {
        fileList.splice(index, 1)
      }
      ElMessage.error('File không đúng định dạng pdf')
      return false
    }
  } else if (type === 2) {
    const allowedTypes = ['image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.raw.type)) {
      const index = fileList.indexOf(file)
      if (index > -1) {
        fileList.splice(index, 1)
      }
      ElMessage.error('File không đúng định dạng .jpg/.png')
      return false
    }
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
  formData.append('fileCategory', type)

  // const rs = await uploadFile(formData)
  // if (rs.status === 200) {
  //   const idFile = rs.data.data[0].id
  //   if (!Array.isArray(infoEvent.value.fileVaultIds) || !infoEvent.value.fileVaultIds) {
  //     infoEvent.value.fileVaultIds = []
  //   }
  //   infoEvent.value.fileVaultIds.push(idFile)
  //   if (!Array.isArray(infoEvent.value.fileVaults) || !infoEvent.value.fileVaults) {
  //     infoEvent.value.fileVaults = []
  //   }
  //   infoEvent.value.fileVaults.push(rs.data.data[0])
  // }
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
  const item = infoProduct.value.fileVaults
  const length = item.length
  let id_file = ''
  for (let i = 0; i < length; i++) {
    if (file.name === item[i].fileName) {
      id_file = item[i].id
      break
    }
  }
  infoProduct.value.fileVaults = infoProduct.value.fileVaults.filter(item => item.id !== id_file)
  infoProduct.value.fileVaultIds = infoProduct.value.fileVaultIds.filter(item => item !== id_file)
}

const backProduct = () => {
  router.push('/product/manage')
}
</script>

<style lang="scss">
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
