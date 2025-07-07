<template>
  <div class="w-full">
    <el-button @click="addCertificate" class="bg-outline-info text--info my-2">Thêm chứng chỉ</el-button>
    <el-row v-if="arrCertificate.length > 0" :gutter="10">
      <el-col v-for="(certificate, index) in arrCertificate" :key="index" :span="4">
        <el-form-item label="Tên chứng chỉ">
          <el-input v-model="certificate.name" placeholder="Vui lòng nhập tên chứng chỉ"></el-input>
        </el-form-item>
        <el-form-item label="Điểm chứng chỉ (thang điểm 100)">
          <el-input type="number" v-model="certificate.score" placeholder="Vui lòng nhập điểm chứng chỉ"></el-input>
        </el-form-item>
        <el-form-item label="Ảnh chứng chỉ (ảnh vuông tỉ lị 1x1 - định dạng png - 512x512)">
          <upload-image-product v-model="certificate.image" :user-id="userId" :is-edit="true"></upload-image-product>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>]

<script setup>
import {ref, watch} from 'vue'
import {useI18n} from '@/locale'
import UploadImageProduct from '@/views/product/component/UploadImageProduct.vue'
const { t } = useI18n()

const props = defineProps({
  certificates: {
    type: Array,
  },
  isView: Boolean,
  userId: String,
})

const emit = defineEmits(['update:certificates'])
const arrCertificate = ref([])

watch(
  () => props.certificates,
  (newVal) => {
    if (Array.isArray(newVal)) {
      arrCertificate.value = [...newVal]
    }
  },
  { immediate: true }
)

let lastCertificates = JSON.stringify([])
watch(
  arrCertificate,
  (val) => {
    const newDesc = JSON.stringify(val)
    if (newDesc !== lastCertificates) {
      emit('update:certificates', val)
      lastCertificates = newDesc
    }
  },
  { deep: true }
)

const addCertificate = async () => {
  arrCertificate.value.push({
    name: '',
    score: '',
    image: ''
  })
}
</script>
