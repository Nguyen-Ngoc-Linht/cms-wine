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
import {apiGetAttribute} from '@/api/product'

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
})
const infoProduct = ref({
  name: '',
  attributes: [],
  productAttributes: []
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

const backProduct = () => {
  router.push('/product/manage')
}
</script>
