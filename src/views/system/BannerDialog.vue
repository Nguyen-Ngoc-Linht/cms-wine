<template>
  <div>
    <el-form ref="formBanner" :model="bannerObj" :rules="ruleEdit">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="Tiêu đề Banner" prop="title">
            <el-input v-model="bannerObj.title" placeholder="Vui lòng nhập"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Đường dẫn banner" prop="linkUrl">
            <el-input v-model="bannerObj.linkUrl" placeholder="Vui lòng nhập"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Loại banner" prop="type">
            <el-select v-model="bannerObj.type" placeholder="Chọn loại banner">
              <el-option label="Màn Home" :value="'home'"></el-option>
              <el-option label="Màn khác" :value="'khác'"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Mô tả">
            <el-input
              v-model="bannerObj.description"
              type="textarea"
              :autosize="{minRows: 4, maxRows: 6}"
              placeholder="Vui lòng nhập"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Banner" prop="imageUrl">
            <upload-image-banner
              v-model="bannerObj.imageUrl"
              :user-id="user_id"
              :is-edit="true"
            ></upload-image-banner>
          </el-form-item>
        </el-col>
      </el-row>
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
            v-if="typeDialog === 'add'"
            :loading="processing"
            @click="handleCreateBanner"
            type="primary"
            class="bg--dark-purple"
            style="border: transparent"
          >{{ $t('configUser.addNew') }}
          </el-button>
          <el-button
            v-if="typeDialog === 'edit'"
            :loading="processing"
            @click="handleUpdateBanner"
            type="primary"
            class="bg--dark-purple"
            style="border: transparent"
          >{{ $t('omsSetting.update') }}
          </el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useI18n} from '@/locale'
import {useConfig} from '@/config'
import UploadImageBanner from '@/views/system/component/UploadImageBanner.vue'
import {apiCreateBanner, apiUpdateBanner} from '@/api/systemconfig'
import {ElMessage} from 'element-plus'

const { t } = useI18n()
const props = defineProps({
  infoBanner: {
    type: Object,
  },
  user_id: {
    type: String,
  },
  typeDialog: {
    type: String,
    // required: true,
  },
})

const ruleEdit = ref({
  title: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  description: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  imageUrl: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  // linkUrl: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  type: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})
const config = useConfig()
const baseUrl = ref(config.VITE_PROXY_DOMAIN)
const bannerObj = ref({})
const formBanner = ref(null)
const processing = ref(false)

const emit = defineEmits(['closeUpdate'])

onMounted(() => {
  bannerObj.value = {...props.infoBanner}
})

const handleCreateBanner = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const params = {
      title: bannerObj.value.title,
      description: bannerObj.value.description,
      imageUrl: bannerObj.value.imageUrl,
      linkUrl: bannerObj.value.linkUrl,
      type: bannerObj.value.type,
    }
    const res = await apiCreateBanner(params)
    if (res.code === 201) {
      ElMessage.success('Thêm mới banner thành công')
      emit('closeUpdate')
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const handleUpdateBanner = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const params = {
      title: bannerObj.value.title,
      description: bannerObj.value.description,
      imageUrl: bannerObj.value.imageUrl,
      linkUrl: bannerObj.value.linkUrl,
      type: bannerObj.value.type,
    }
    const res = await apiUpdateBanner(props.infoBanner.id, params)
    if (res.code === 200) {
      ElMessage.success('Cập nhật banner thành công')
      emit('closeUpdate')
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    formBanner.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}

const closeDialog = () => {
  emit('closeUpdate')
}
</script>
