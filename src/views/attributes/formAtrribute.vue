<template>
  <div class="bg-white">
    <div class="">
      <el-form
        ref="formAttributes"
        :model="infoAttributes"
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
                v-model="infoAttributes.name"
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
                v-model="infoAttributes.description"
                maxlength="1000"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 5 }"
                show-word-limit
                :placeholder="$t('configUser.pleaseEnter')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              class="custom mb-5"
              label="Loại dữ liệu"
              prop="dataType"
              style="display: inline-block; width: 100%"
            >
              <el-select
                v-model="infoAttributes.dataType"
                clearable
                filterable
                collapse-tags
                style="width: 100%"
                :placeholder="$t('configUser.pleaseSelect')"
              >
                <el-option key="1" label="Văn bản / Nội dung" value="STRING"/>
                <el-option key="2" label="Số lượng / Giá trị số" value="NUMBER"/>
              </el-select>
            </el-form-item>
          </el-col>
<!--          <el-col :span="24">-->
<!--            <el-form-item-->
<!--              class="custom mb-5"-->
<!--              label="Tìm kiếm theo"-->
<!--              prop="typeSearch"-->
<!--              style="display: inline-block; width: 100%"-->
<!--            >-->
<!--              <el-select-->
<!--                v-model="infoAttributes.typeSearch"-->
<!--                clearable-->
<!--                filterable-->
<!--                collapse-tags-->
<!--                style="width: 100%"-->
<!--                :placeholder="$t('configUser.pleaseSelect')"-->
<!--              >-->
<!--                <el-option-->
<!--                  v-for="type in lstTypeSearch"-->
<!--                  :key="type.id"-->
<!--                  :label="type.name"-->
<!--                  :value="type.value"-->
<!--                />-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
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
            @click="handleAddAttributes"
            type="primary"
            class="bg--dark-purple"
            style="border: transparent"
          >{{ $t('configUser.addNew') }}
          </el-button>
          <el-button
            :loading="processing"
            v-if="typeDialog === 'edit'"
            @click="handleEditAttributes"
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
import {apiCreateAttribute, apiUpdateAttribute} from '@/api/product'

const { t } = useI18n()
const props = defineProps({
  typeDialog: {
    type: String,
    required: true,
  },
  attributesInfo: {
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
  dataType: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  typeSearch: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})
const infoAttributes = ref({})
const formAttributes = ref(null)
const processing = ref(false)
const emit = defineEmits(['closeUpdate'])
const lstTypeSearch = ref([
  {
    id: 1,
    name: 'Khoảng',
    value: 'about',
  },
  {
    id: 2,
    name: 'Chọn',
    value: 'select',
  },
  {
    id: 3,
    name: 'Nhập',
    value: 'enter',
  },
])

const closeDialog = () => {
  emit('closeUpdate')
}

onMounted(async () => {
  infoAttributes.value = { ...props.attributesInfo }
  if (props.typeDialog === 'view') {
  } else if (props.typeDialog === 'add') {
  }
})

const handleAddAttributes = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const params = {
      name: infoAttributes.value.name,
      description: infoAttributes.value.description,
      dataType: infoAttributes.value.dataType,
    }
    const rs = await apiCreateAttribute(params)
    if (rs.code === 201) {
      ElMessage.success('Thêm thuộc tính thành công')
      emit('closeUpdate')
    } else {
      ElMessage.success('Thêm thuộc tính thất bại')
      emit('closeUpdate')
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}

const handleEditAttributes = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const params = {
      name: infoAttributes.value.name,
      description: infoAttributes.value.description,
      dataType: infoAttributes.value.dataType,
    }
    const payload = {
      attributes_id: infoAttributes.value.id,
      data: params
    }
    const rs = await apiUpdateAttribute(infoAttributes.value.id, params)
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
    formAttributes.value.validate(valid => {
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
