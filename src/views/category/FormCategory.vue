<template>
  <div class="bg-white">
    <div class="">
      <el-form
        ref="formCategory"
        :model="infoCategory"
        :rules="ruleEdit"
        label-position="top"
        label-width="100%"
        class="custom-form"
      >
        <el-row :gutter="12">
          <el-col :span="24">
            <el-form-item
              class="custom mb-5"
              label="Tên thuộc tiính"
              prop="name"
            >
              <el-input
                v-model="infoCategory.name"
                maxlength="250"
                :placeholder="$t('configUser.pleaseEnter')"
              />
            </el-form-item>
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
            :loading="processing"
            v-if="typeDialog === 'add'"
            @click="handleAddCategory"
            type="primary"
            class="bg--dark-purple"
            style="border: transparent"
          >{{ $t('configUser.addNew') }}
          </el-button>
          <el-button
            :loading="processing"
            v-if="typeDialog === 'edit'"
            @click="handleEditCategory"
            type="primary"
            class="bg--dark-purple"
            style="border: transparent"
          >{{ $t('omsSetting.update') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage } from 'element-plus'
import {apiCreateCategory, apiUpdateAttribute, apiUpdateCategory} from '@/api/product'

const { t } = useI18n()
const props = defineProps({
  typeDialog: {
    type: String,
    required: true,
  },
  categoryInfo: {
    type: Object,
    required: false,
  },
})
const ruleEdit = ref({
  name: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 250, message: t('omsSetting.ruleMaxLengthText'), trigger: 'blur' },
  ],
  description: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})
const infoCategory = ref({})
const formCategory = ref(null)
const processing = ref(false)
const emit = defineEmits(['closeUpdate'])

const closeDialog = () => {
  emit('closeUpdate')
}

onMounted(async () => {
  infoCategory.value = { ...props.categoryInfo }
  if (props.typeDialog === 'view') {
  } else if (props.typeDialog === 'add') {
  }
})

const handleAddCategory = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const params = {
      name: infoCategory.value.name,
      description: infoCategory.value.description,
    }
    const rs = await apiCreateCategory(params)
    if (rs.code === 201) {
      ElMessage.success('Thêm danh mục thành công')
      emit('closeUpdate')
    } else {
      ElMessage.success('Thêm danh mục thất bại')
      emit('closeUpdate')
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
      description: infoCategory.value.description,
    }
    const rs = await apiUpdateCategory(infoCategory.value.id, params)
    if (rs.code === 200) {
      ElMessage.success('Sửa thuộc tính thành công')
      emit('closeUpdate')
    } else {
      ElMessage.success('Thêm thuộc tính thất bại')
      emit('closeUpdate')
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
</style>
