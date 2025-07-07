<template>
  <div class="w-full">
    <el-button @click="addParameter" class="bg-outline-info text--info my-2">Thêm thông số</el-button>
    <el-row v-if="arrParameter.length > 0" :gutter="10">
      <el-col v-for="(parameter, index) in arrParameter" :key="index" :span="8">
        <el-form-item label="Tên thông số">
          <el-input v-model="parameter.title" placeholder="Vui lòng nhập tên thông số"></el-input>
        </el-form-item>
        <el-form-item label="Mô tả thông số">
          <div class="w-full">
            <QuillEditor
              v-model:content="parameter.description"
              :options="quillOptions"
              contentType="html"
            />
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>]

<script setup>
import {ref, watch} from 'vue'
import { QuillEditor } from '@vueup/vue-quill'

const props = defineProps({
  parameters: {
    type: Array,
  },
  isView: Boolean
})

const emit = defineEmits(['update:parameters'])
const arrParameter = ref([])

const quillOptions = {
  theme: 'snow',
  readOnly: props.isView,
  placeholder: !props.isView ? 'Nhập mô tả thông số' : '',
  modules: {
    toolbar: [[{ header: [1, 2, 3, false] }], ['bold', 'italic', 'underline']],
    keyboard: {
      bindings: {
        'list autofill': {
          key: ' ',
          collapsed: true,
          prefix: /^\d+\.$|^[-*+]$/,
          handler: () => {
            return true
          },
        },
        list: null,
      },
    },
  },
}
watch(
  () => props.parameters,
  (newVal) => {
    if (Array.isArray(newVal)) {
      arrParameter.value = [...newVal]
    }
  },
  { immediate: true }
)

let lastParameter = JSON.stringify([])
watch(
  arrParameter,
  (val) => {
    const newDesc = JSON.stringify(val)
    if (newDesc !== lastParameter) {
      emit('update:parameters', val)
      lastParameter = newDesc
    }
  },
  { deep: true }
)

const addParameter = async () => {
  arrParameter.value.push({
    title: '',
    description: ''
  })
}
</script>
