<template>
  <div class="px-3">
    <div class="flex items-center justify-between mb-2">
      <h2 class="font-bold">Nhập thông tin chính sách</h2>
      <el-button
        class="el-button--main"
        :loading="processing"
        @click="savePolicy"
      >Lưu
      </el-button>
    </div>
    <Tinymce
      ref="clausePolicy"
      v-model="contentPolicy"
      :height="800"
    ></Tinymce>
  </div>
</template>
<script setup>
import Tinymce from '@/views/system/component/TinyComponent.vue'
import {onMounted, ref} from 'vue'
import {apiGetSystemConfig, apiUpdateSystemConfig} from '@/api/systemconfig'
import {ElMessage} from 'element-plus'

const contentPolicy = ref('')
const clausePolicy = ref(null)
clausePolicy.value = undefined
const processing = ref(false)

onMounted(() => {
  initData()
})

const initData = async () => {
  try {
    const params = {
      code: 'GENERAL_RULES'
    }
    const res = await apiGetSystemConfig(params)
    if (res.code === 200) {
      contentPolicy.value = res.data.value
      clausePolicy.value.setContent(contentPolicy.value)
    }
  } catch (e) {
    console.log(e)
  }
}

const savePolicy = async () => {
  try {
    processing.value = true
    const params = {
      code: 'GENERAL_RULES',
      value: contentPolicy.value
    }
    const res = await apiUpdateSystemConfig(params)
    if (res.code === 200) {
      ElMessage.success('Cập nhật thành công')
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
</script>
