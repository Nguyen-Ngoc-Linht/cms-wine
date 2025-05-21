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
    <div class="px-6 my-4 content-page">
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
            <el-col :md="12" :sm="12" :span="24">
              <el-form-item prop="category.id" label="Danh mục sản phẩm">
                <el-select
                  v-model="infoProduct.category.id"
                  clearable
                  collapse-tags
                  style="width: 100%"
                  :placeholder="$t('configUser.pleaseSelect')"
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
            <el-col :sm="12" :span="24">
              <el-form-item
                label="Tiêu đề sản phẩm"
                prop="title"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoProduct.title"
                  maxlength="200"
                  :placeholder="$t('configUser.pleaseEnter')"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="infoProduct.attributes && infoProduct.attributes.length > 0" :span="24">
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
            <el-col :span="24">
              <description-product
                :name-product="infoProduct.name"
                :tag-name="infoProduct.category?.name"
                v-model:description="infoProduct.description"
              ></description-product>
<!--              <el-form-item-->
<!--                prop="description"-->
<!--                label="Mô tả sản phẩm"-->
<!--                style="display: inline-block; width: 100%;"-->
<!--              >-->
<!--                <el-input-->
<!--                  v-model="infoProduct.description"-->
<!--                  type="textarea"-->
<!--                  show-word-limit-->
<!--                  maxlength="5000"-->
<!--                  :autosize="{ minRows: 4, maxRows: 5 }"-->
<!--                ></el-input>-->
<!--              </el-form-item>-->
            </el-col>
            <el-col :span="24" class="mt-3">
              <h6 class="font-bold text-base custom">
                Ảnh sản phẩm
              </h6>
              <el-upload
                v-model:file-list="infoProduct.listImage"
                class="avatar-uploader mt-1 custom-upload-list w-full"
                drag
                :on-success="null"
                :on-preview="null"
                :on-remove="handleRemove"
                :on-change="(file, fileList) => {handleChangeFile(file, fileList)}"
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
                <p class="drag-note my-2 font-semibold" style="color: #7c7e81">
                  {{ t('configUser.importImage') }}
                </p>
                <p class="file-note text-center" style="color: #a4a6a7">
                  ({{ $t('configUser.importLimitAndType', ['Jpg/Png', '10MB']) }})
                </p>
              </el-upload>
            </el-col>
            <div class="w-full my-2 px-3">
              <el-button @click="showAddVariants" class="bg-outline-info text--info mb-2">Thêm loại sản phẩm</el-button>
              <el-card
                v-for="(variantProduct, index) in infoProduct.productVariants"
                :key="index"
              >
                <div class="flex w-full">
                  <div class="w-1/3 flex">
                    <h5 class="tag-variant w-1/3">Tên loại sản phẩm</h5>
                    <h5 class="tag-variant-info w-2/3">{{ variantProduct.variantName }}</h5>
                  </div>
                  <div class="w-1/3 flex">
                    <h5 class="tag-variant w-1/3">Giá</h5>
                    <h5 class="tag-variant-info w-2/3">{{ formatNumber(variantProduct.price, '.') }}</h5>
                  </div>
                  <div class="w-1/3 flex">
                    <h5 class="tag-variant w-1/3">Mã loại sản phẩm</h5>
                    <h5 class="tag-variant-info w-2/3">{{ variantProduct.variantCode }}</h5>
                  </div>
                </div>
                <div class="w-full flex">
                  <h5 class="tag-variant w-1/3">Mô tả sản phẩm</h5>
                  <h5 class="tag-variant-info w-2/3">{{ variantProduct.description }}</h5>
                </div>
                <div class="flex w-full flex-wrap">
                  <div class="w-1/3 flex" v-for="(attribute, index) in variantProduct.variantAttributes" :key="index">
                    <h5 class="tag-variant w-1/3">{{ attribute.attribute.name}}</h5>
                    <h5 class="tag-variant-info w-2/3">{{ attribute.value }}</h5>
                  </div>
                </div>
                <div class="flex items-center">
                  <el-button @click="handleEditVariant(index)" class="bg-outline-success text--success mt-3">Sửa</el-button>
                  <el-button @click="handleDeleteVariant(index)" class="bg-outline-danger text--danger mt-3">Xóa</el-button>
                </div>
              </el-card>
            </div>
          </el-row>
        </el-form>
      </div>
    </div>

    <!--  Dialog  -->
    <Dialog
      :show="showModalVariants"
      :appendToBody="true"
      :width="'682'"
      :title="titleDialog"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <ModalVariant
          :is-create="typeDialog"
          :is-edit="!typeDialog"
          :variant="infoVariant"
          @addVariants="handleAddVariantProduct"
          @editVariants="handleEditVariantProduct"
          @closeUpdate="handleCloseDialog"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useI18n} from '@/locale'
import {useRoute, useRouter} from 'vue-router'
import {
  apiCreateProduct,
  apiGetAttribute,
  apiGetCategory,
  apiGetDetailProduct,
  apiUpdateProduct,
  uploadFile
} from '@/api/product'
import {ElMessage, ElMessageBox} from 'element-plus'
import Dialog from '@/components/Dialog/index.vue'
import ModalVariant from '@/views/product/component/ModalVariant.vue'
import {formatNumber} from '@/utils'
import {useConfig} from '@/config'
import DescriptionProduct from '@/views/product/component/DescriptionProduct.vue'

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
const user = ref({})

const ruleEdit = ref({
  name: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  title: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  attributes: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  category: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  }
})
const id_product = ref(null)
const infoProduct = ref({
  name: '',
  attributes: [],
  productAttributes: [],
  category: {
    id: ''
  },
  listImage: [],
  productVariants: [],
})
const formProduct = ref(null)
const config = useConfig()
const baseUrl = ref(config.VITE_PROXY_DOMAIN)

const showModalVariants = ref(false)
const titleDialog = ref('Thêm mới loại sản phẩm')
const typeDialog = ref(false)
const infoVariant = ref({})
const indexVariant = ref(0)

const attributes = ref([])
const attributeCache = ref([])
const categories = ref([])

const processing = ref(false)

onMounted(() => {
  user.value = JSON.parse(localStorage.getItem('userInfo'))
  setDataDefault()
  initData()
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
const initData = async () => {
  try {
    id_product.value = route.params.id
    if ( id_product.value) {
      const rs = await apiGetDetailProduct(id_product.value)
      if (rs.code === 200) {
        infoProduct.value = rs.data
        convertDataProduct(rs.data)
      }
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
    const params = formatValidValue()
    const rs = await apiCreateProduct(params)
    if (rs.code === 201) {
      ElMessage({
        message: 'Thêm sản phẩm thành công',
        type: 'success',
        duration: 3 * 1000,
      })
      backProduct()
    }
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
    const params = formatValidValueUpdate()
    console.log(params, 'day')
    const rs = await apiUpdateProduct(id_product.value, params)
    if (rs.code === 200) {
      ElMessage({
        message: 'Cập nhật sản phẩm thành công',
        type: 'success',
        duration: 3 * 1000,
      })
      backProduct()
    }
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
const formatValidValue = () => {
  const variant = []
  const variantProduct = infoProduct.value.productVariants
  variantProduct.forEach((item) => {
    const attributeVariant = item.variantAttributes
    const attributes = []
    attributeVariant.forEach((attribute) => {
      attributes.push({
        value: attribute.value,
        attributeId: attribute.attribute.id
      })
    })
    variant.push({
      variantCode: item.variantCode,
      variantName: item.variantName,
      price: item.price,
      attributes
    })
  })
  const attributesProductLst = []
  const attributeProduct = infoProduct.value.productAttributes
  attributeProduct.forEach((content) => {
    attributesProductLst.push({
      attributeId: content.attribute.id,
      value: content.value
    })
  })
  return {
    name: infoProduct.value.name,
    title: infoProduct.value.title,
    description: JSON.stringify(infoProduct.value.description),
    categoryId: infoProduct.value.category.id,
    attributes: attributesProductLst,
    images: infoProduct.value.images,
    variants: variant
  }
}
const formatValidValueUpdate = () => {
  const variant = infoProduct.value.productVariants.map((item) => ({
    variantId: item.id,
    variantCode: item.variantCode,
    variantName: item.variantName,
    price: item.price,
    attributes: item.variantAttributes.map((attribute) => ({
      value: attribute.value,
      attributeId: attribute.attribute.id,
      productAttributeId: attribute.productVariantAttributeId,
    })),
  }))

  const attributesProductLst = infoProduct.value.productAttributes.map((content) => ({
    productAttributeId: content.id || null,
    attributeId: content.attribute.id,
    value: content.value,
  }))

  return {
    name: infoProduct.value.name,
    title: infoProduct.value.title,
    description: JSON.stringify(infoProduct.value.description),
    categoryId: infoProduct.value.category.id,
    attributes: attributesProductLst,
    images: infoProduct.value.images,
    variants: variant,
    isUpdate: true,
  }
}

const convertDataProduct = (productData) => {
  infoProduct.value.attributes = []
  productData.productAttributes.forEach((attribute) => {
    infoProduct.value.attributes.push(attribute.attribute.id)
  })
  const imagesProduct = infoProduct.value.images
  infoProduct.value.listImage = []
  imagesProduct.forEach((image) => {
    infoProduct.value.listImage.push({
      name: 'item' + image.id,
      url: baseUrl.value + 'media-service/api/v1.0/images' + image.url.replace(/^\.\/uploads/, '/uploads')
    })
  })
  console.log(JSON.parse(infoProduct.value.description), 'mo ta day')
  infoProduct.value.description = JSON.parse(infoProduct.value.description)
}
// Thuộc tính và biến thể
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
const showAddVariants = () => {
  titleDialog.value = 'Thêm mới loại sản phẩm'
  typeDialog.value = true
  infoVariant.value = {}
  showModalVariants.value = true
}
const handleAddVariantProduct = (variant) => {
  console.log(variant, 'info')
  infoProduct.value.productVariants.push(variant)
  showModalVariants.value = false
}
const handleEditVariantProduct = (variant) => {
  console.log(variant, 'info')
  infoProduct.value.productVariants[indexVariant.value] = variant
  showModalVariants.value = false
}
const handleEditVariant = (index) => {
  indexVariant.value = index
  titleDialog.value = 'Sửa loại sản phẩm'
  typeDialog.value = false
  infoVariant.value = infoProduct.value.productVariants[index]
  showModalVariants.value = true
}
const handleDeleteVariant = (index) => {}
// File
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
    if (!Array.isArray(infoProduct.value.images)) {
      infoProduct.value.images = []
    }
    if (rs.code === 201) {
      infoProduct.value.images.push({
        url: rs.data.filePath
      })
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
  console.log(infoProduct.value.images, 'trước khi xóa')
  infoProduct.value.images.splice(indexDeleteFile.value, 1)
  console.log(infoProduct.value.images, 'sau khi xóa')
  indexDeleteFile.value = null
}

const handleCloseDialog = () => {
  showModalVariants.value = false
}
const backProduct = () => {
  router.push('/product/manage')
}
</script>

<style lang="scss">
.tag-variant {
  background-color: #F8F8F8;
  height: 40px;
  border: 1px solid #EAE8F1;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
.tag-variant-info {
  height: 40px;
  border: 1px solid #EAE8F1;
  padding: 0 12px;
  display: flex;
  align-items: center;
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
