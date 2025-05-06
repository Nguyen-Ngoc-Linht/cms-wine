<template>
  <div class="w-full">
    <el-row :gutter="10">
      <!-- Cột bên trái: nhập thông tin -->
      <el-col :span="12">
        <div>
          <div class="flex items-center justify-between">
            <h5 class="text-black font-semibold text-base w-1/2">Trường thông tin</h5>
            <el-select
              v-model="typeId"
              clearable
              @change="handleAddType"
              placeholder="Chọn thông tin hiển thị"
            >
              <el-option
                v-for="type in lstTypeDescription"
                :key="type.id"
                :label="type.name"
                :value="type.value"
              />
            </el-select>
          </div>

          <div class="mt-3">
            <el-card
              v-for="(item, index) in arrDescription"
              :key="index"
              class="mt-2"
            >
              <div class="flex items-center justify-between mb-1">
                <h6 class="text-base text--secondary">{{ item.nameType }}</h6>
                <span
                  @click="deleteType(index)"
                  class="cursor-pointer bg-outline-danger text--danger rounded-sm px-2"
                >Xóa</span>
              </div>

              <template v-if="item.type === 'text' || item.type === 'tag'">
                <el-input
                  v-model="item.valueType"
                  :type="item.type === 'text' ? 'textarea' : 'text'"
                  :autosize="item.type === 'text' ? { minRows: 2, maxRows: 4 } : false"
                />
              </template>

              <template v-else-if="item.type === 'blockquote'">
                <label>Tiêu đề</label>
                <el-input v-model="item.title" />
                <label>Nội dung chính</label>
                <el-input v-model="item.textMain" type="textarea" :autosize="{ minRows: 1, maxRows: 4 }" />
                <label>Tiêu đề phụ</label>
                <el-input v-model="item.subTitle" />
              </template>

              <template v-else-if="item.type === 'image'">
                <!-- Có thể thêm upload ở đây -->
                <span>Ảnh (chưa xử lý phần upload)</span>
              </template>
            </el-card>
          </div>
        </div>
      </el-col>

      <!-- Cột bên phải: xem trước -->
      <el-col :span="12" class="pb-7">
        <h5 class="text-black font-semibold text-base">Mẫu hiển thị</h5>
        <el-card class="mt-1 h-full">
          <div class="flex items-center justify-between mb-1">
            <span class="tag-name">{{ tagName }}</span>
          </div>
          <h5 class="text-xl text-black font-medium">{{ nameProduct }}</h5>

          <div v-for="(item, index) in arrDescription" :key="index" class="mt-2">
            <p v-if="item.type === 'text'" class="text-custom">{{ item.valueType }}</p>

            <div v-else-if="item.type === 'tag'" class="my-6">
              <span class="tag-custom">{{ item.valueType }}</span>
            </div>

            <div v-else-if="item.type === 'blockquote'" class="box-blockquote">
              <p class="name-block">"{{ item.title }}"</p>
              <p class="main-block">{{ item.textMain }} - <span style="font-style: italic">{{ item.subTitle }}</span></p>
            </div>

            <div v-else-if="item.type === 'image'">
              <!-- Hiển thị ảnh nếu có -->
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  nameProduct: String,
  tagName: String,
  description: Array
})

const emit = defineEmits(['update:description'])

const lstTypeDescription = ref([
  { id: 1, name: 'Thẻ - tag', value: 'tag' },
  { id: 2, name: 'Đoạn văn bản', value: 'text' },
  { id: 3, name: 'Danh sách', value: 'list' },
  { id: 4, name: 'Ảnh', value: 'image' },
  { id: 5, name: 'Trích dẫn', value: 'blockquote' }
])

const typeId = ref(null)
const arrDescription = ref([])

// Khởi tạo lại mô tả khi nhận props mới
watch(
  () => props.description,
  (newVal) => {
    if (Array.isArray(newVal)) {
      arrDescription.value = [...newVal]
    }
  },
  { immediate: true }
)

// Gửi ngược dữ liệu mô tả khi thay đổi
watch(
  arrDescription,
  (val) => {
    emit('update:description', val)
  },
  { deep: true }
)

// Thêm loại thông tin mới
const handleAddType = (value) => {
  const type = lstTypeDescription.value.find(t => t.value === value)
  if (!type) return

  const base = { type: type.value, nameType: type.name }

  // eslint-disable-next-line default-case
  switch (type.value) {
    case 'text':
    case 'tag':
      arrDescription.value.push({ ...base, valueType: '' })
      break
    case 'image':
      arrDescription.value.push({ ...base, imgLink: '' })
      break
    case 'blockquote':
      arrDescription.value.push({ ...base, title: '', textMain: '', subTitle: '' })
      break
  }

  typeId.value = null
}

// Xóa loại thông tin
const deleteType = (index) => {
  arrDescription.value.splice(index, 1)
}
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
