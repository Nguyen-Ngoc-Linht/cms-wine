<template>
  <div class="w-full">
    <el-row :gutter="10">
      <el-col :span="12">
        <div>
          <div class="flex items-center justify-between">
            <h5 class="text-black font-semibold text-base w-1/2">
              Trường thông tin
            </h5>
            <el-select
              v-model="typeId"
              clearable
              @change="changeType"
              placeholder="Chọn thông tin hiển thị"
            >
              <el-option
                v-for="type in lstTypeDescription"
                :key="type.id"
                :label="type.name"
                :value="type.value"
              ></el-option>
            </el-select>
          </div>
          <div class="mt-3">
            <el-card
              v-for="(description, index) in arrDescription"
              :key="index"
              class="mt-2"
            >
              <div v-if="description.type === 'text'">
                <div class="flex items-center justify-between mb-1">
                  <h6 class="text-base text--secondary">{{ description.nameType }}</h6>
                  <span @click="deleteTypeDescription(index)" class="cursor-pointer bg-outline-danger text--danger rounded-sm px-2">Xóa</span>
                </div>
                <el-input
                  v-model="description.valueType"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                ></el-input>
              </div>
              <div v-if="description.type === 'tag'">
                <div class="flex items-center justify-between mb-1">
                  <h6 class="text-base text--secondary">{{ description.nameType }}</h6>
                  <span @click="deleteTypeDescription(index)" class="cursor-pointer bg-outline-danger text--danger rounded-sm px-2">Xóa</span>
                </div>
                <el-input v-model="description.valueType"></el-input>
              </div>
              <div v-if="description.type === 'blockquote'">
                <div class="flex items-center justify-between mb-1">
                  <h6 class="text-base text--secondary">{{ description.nameType }}</h6>
                  <span @click="deleteTypeDescription(index)" class="cursor-pointer bg-outline-danger text--danger rounded-sm px-2">Xóa</span>
                </div>
                <label for="">Tiêu đề</label>
                <el-input v-model="description.title"></el-input>
                <label for="">Nội dung chính</label>
                <el-input
                  v-model="description.textMain"
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 4 }"
                ></el-input>
                <label for="">Tiêu đề phụ</label>
                <el-input v-model="description.subTitle"></el-input>
              </div>
              <div v-if="description.type === 'image'">
                <div class="flex items-center justify-between mb-1">
                  <h6 class="text-base text--secondary">{{ description.nameType }}</h6>
                  <span @click="deleteTypeDescription(index)" class="cursor-pointer bg-outline-danger text--danger rounded-sm px-2">Xóa</span>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </el-col>
      <el-col :span="12" class="pb-7">
        <h5 class="text-black font-semibold text-base">
          Mẫu hiển thị
        </h5>
        <el-card class="mt-1 h-full">
          <div class="flex items-center justify-between mb-1">
            <span class="tag-name">{{ tagName }}</span>
          </div>
          <h5 class="text-xl text-black font-medium">{{ nameProduct }}</h5>
          <div v-for="(description, index) in arrDescription" :key="index" class="mt-2">
            <div v-if="description.type === 'text'">
              <p class="text-custom">{{ description.valueType }}</p>
            </div>
            <div v-if="description.type === 'tag'" class="my-6">
              <span class="tag-custom">{{ description.valueType }}</span>
            </div>
            <div v-if="description.type === 'image'">
            </div>
            <div v-if="description.type === 'blockquote'" class="box-blockquote">
              <p class="name-block">"{{ description.title }}"</p>
              <p class="main-block">{{ description.textMain}} -
                <span style="font-style: italic">{{ description.subTitle}}</span>
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'

const props = defineProps({
  nameProduct: {
    type: String,
    required: false,
  },
  tagName: {
    type: String,
    required: false,
  },
  description: {
    type: Array,
    required: false
  }
})

const lstTypeDescription = ref([
  {
    id: 1,
    name: 'Thẻ - tag',
    value: 'tag',
  },
  {
    id: 2,
    name: 'Đoạn văn bản',
    value: 'text',
  },
  {
    id: 3,
    name: 'Danh sách',
    value: 'list',
  },
  {
    id: 4,
    name: 'Ảnh',
    value: 'image',
  },
  {
    id: 5,
    name: 'Trích dẫn',
    value: 'blockquote',
  }
])
const typeId = ref(null)

const arrDescription = ref([])

const emit = defineEmits(['update:description'])
const changeType = (valueType) => {
  if (!Array.isArray(arrDescription.value)) {
    arrDescription.value = []
  }
  const type = lstTypeDescription.value.find((item) => item.value === valueType)
  const typeValue = type.value
  const typeName = type.name
  if (typeValue === 'text') {
    arrDescription.value.push({
      type: typeValue,
      nameType: typeName,
      valueType: ''
    })
  } else if (typeValue === 'tag') {
    arrDescription.value.push({
      type: typeValue,
      nameType: typeName,
      valueType: ''
    })
  } else if (typeValue === 'image') {
    arrDescription.value.push({
      type: typeValue,
      nameType: typeName,
      imgLink: ''
    })
  } else if (typeValue === 'blockquote') {
    arrDescription.value.push({
      type: typeValue,
      nameType: typeName,
      title: '',
      textMain: '',
      subTitle: ''
    })
  }

  typeId.value = null
}
const deleteTypeDescription = (index) => {
  arrDescription.value.splice(index, 1)
}
watch(
  () => props.description,
  (newVal) => {
    if (Array.isArray(newVal)) {
      arrDescription.value = [...newVal]
    }
  },
  { immediate: true }
)

watch(
  arrDescription,
  (newVal) => {
    emit('update:description', newVal)
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.tag-name {
  color: rgba(34, 197, 94);
  background-color: rgba(34, 197, 94, .1);
  padding: 2px 4px;
  border-radius: 4px;
}

.text-custom {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  unicode-bidi: isolate;
  font-size: 15px;
  font-family: "Font Awesome 6 Brands", serif;
}

.tag-custom {
  background-color: rgba(244, 246, 249);
  padding: 10px 12px;
  border-radius: 4px;
  font-size: 15px;
  margin: 6px 0;
}

.box-blockquote {
  padding-left: 2.25rem;
  border-left: 1px solid #e2e7f1;
}

.name-block {
  font-size: 18px;
  font-style: italic;
}

.main-block {
  color: #95a0c5;
  font-style: 14px;
}
</style>
