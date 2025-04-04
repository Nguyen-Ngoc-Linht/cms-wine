<template>
  <div class="bg-white">
    <el-form
      ref="formVariants"
      :model="infoVariants"
      :rules="ruleEdit"
      label-position="top"
      label-width="100%"
      class="custom-form"
    >
      <el-row :gutter="12">
        <el-col :span="24">
          <el-form-item
            class="custom mb-5"
            label="Tên loại sản phẩm"
            prop="variantName"
            style="font-weight: 600 !important; width: 100%; display: inline-block"
          >
            <el-input
              v-model="infoVariants.variantName"
              :placeholder="$t('configUser.pleaseEnter')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            class="custom mb-5"
            label="Giá"
            prop="price"
            style="display: inline-block; width: 100%"
          >
            <InputInteger
              v-model="infoVariants.price"
              :is-format="true"
              :max-length="12"
              :placeholder="$t('configUser.pleaseEnter')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            class="custom mb-5"
            label="Mã loại sản phẩm"
            prop="variantCode"
            style="font-weight: 600 !important; width: 100%; display: inline-block"
          >
            <el-input
              v-model="infoVariants.variantCode"
              maxlength="50"
              :placeholder="$t('configUser.pleaseEnter')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            class="custom mb-5"
            label="Mô tả loại sản phẩm"
            prop="description"
            style="font-weight: 600 !important; width: 100%; display: inline-block"
          >
            <el-input
              v-model="infoVariants.description"
              maxlength="1000"
              type="textarea"
              show-word-limit
              :autosize="{ minRows: 3, maxRows: 5 }"
              :placeholder="$t('configUser.pleaseEnter')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="Thuộc tính sản phẩm"
            prop="attributes"
            class="custom mb-2"
            style="display: inline-block; width: 100%"
          >
            <el-select
              v-model="infoVariants.attributes"
              clearable
              filterable
              multiple
              collapse-tags
              @change="setAttribute"
              :placeholder="$t('configUser.pleaseSelect')"
            >
              <el-option
                v-for="item in lstAttributes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="infoVariants.variantAttributes.length > 0" :span="24">
          <h6 class="text-md font-bold mb-2">Danh sách thuộc tính</h6>
        </el-col>
        <el-col
          v-for="(attribute, index) in infoVariants.variantAttributes"
          :key="index"
          :sm="12"
          :span="24"
        >
          <el-form-item :label="attribute.attribute.name">
            <el-input v-model="attribute.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <hr class="margin-bottom-24 mt-3"/>
    <div class="action">
      <div class="flex justify-end">
        <el-button
          type="default"
          @click="closeDialog"
          class="bg-outline-secondary"
        >{{ $t('configUser.cancel') }}
        </el-button>
        <el-button
          v-if="isCreate"
          :loading="processing"
          @click="handleAddVariants"
          type="primary"
          class="bg--dark-purple"
          style="border: transparent"
        >{{ $t('configUser.addNew') }}
        </el-button>
        <el-button
          v-if="isEdit"
          :loading="processing"
          @click="handleUpdateVariants"
          type="primary"
          class="bg--dark-purple"
          style="border: transparent"
        >{{ $t('omsSetting.update') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage } from 'element-plus'
import InputInteger from '@/components/InputInteger/index.vue'
import { usePermissionStore } from '@/store'
import {apiGetAttribute} from '@/api/product'

const { t } = useI18n()
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  isCreate: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: Object,
    default: () => {},
  }
})

const ruleEdit = ref({
  variantName: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },],
  price: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },],
  description: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  variantCode: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  attributes: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  variantAttributes: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})
const processing = ref(false)
const formVariants = ref(null)
const infoVariants = ref({
  variantName: null,
  price: null,
  description: null,
  variantCode: null,
  attributes: null,
  variantAttributes: [],
})

const lstAttributes = ref([])
const attributeCache = ref([])

onMounted(() => {
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
    const rs = await apiGetAttribute(params)
    if (rs.code === 200) {
      lstAttributes.value = rs.data.content
    }
  } catch (e) {
    console.log(e)
  }
}
const initData = () => {
  console.log(props.isEdit, props.isCreate, 'prop')
  if (props.isEdit) {
    infoVariants.value = {
      variantName: props.variant.variantName,
      price: props.variant.price,
      description: props.variant.description,
      variantCode: props.variant.variantCode,
      attributes: props.variant.attributes,
      variantAttributes: props.variant.variantAttributes,
    }
    console.log(infoVariants.value, 'thoong rin')
  }
}

const handleAddVariants = async () => {
  try {
    await Promise.all([
      validFormData()
    ])
    processing.value = true
    emit('addVariants', infoVariants.value)
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const handleUpdateVariants = async () => {
  try {
    await Promise.all([
      validFormData()
    ])
    processing.value = true
    emit('editVariants', infoVariants.value)
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    formVariants.value.validate(valid => {
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

  infoVariants.value.variantAttributes.forEach((item) => {
    attributeCache.value[item.attribute.id] = item.value
  })

  // Cập nhật danh sách productAttributes
  infoVariants.value.variantAttributes = selectedAttributes.map((attributeId) => {
    const attribute = lstAttributes.value.find((item) => item.id === attributeId)
    if (attribute) {
      return {
        attribute,
        value: attributeCache.value[attributeId] || '',
      }
    }
    return null
  }).filter((item) => item !== null)
}

const emit = defineEmits(['closeUpdate', 'addVariants', 'editVariants'])
const closeDialog = () => {
  emit('closeUpdate')
}
</script>
