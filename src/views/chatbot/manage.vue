<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5">
      <el-button
        class="el-button--main"
        @click="triggerFileInput"
        >Tải dữ liệu
      </el-button>
      <input
          ref="fileInput"
          type="file"
          style="display: none"
          accept=".txt"
          @change="handleFileChange"
      />
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <!--  Table  -->
    <div class="paddingX-24 mt-3">
      <div class="padding-12 bg-white">
        <TableViolation
          :listLoading="listLoading"
          :fields="fields"
          :STT="true"
          :data="list"
          :page="filter.page"
          :size="filter.size"
          :height="150"
        >
          <template #status="{ row }">
            <span>{{ row.status == 1 ? 'Dữ liệu sử dụng' : 'Không sử dụng' }}</span>
          </template>
        </TableViolation>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-unified'
import TableViolation from '@/components/Table/index.vue'
import {apiGetAllDataChatbot} from '@/api/chatbot'
import {ElMessage} from 'element-plus'

const fields = ref([
  {
    key: 'id',
    label: 'ID',
    width: 80,
    prop: 'id',
  },
  {
    key: 'content',
    label: 'Nội dung dữ liệu bot',
    width: 1250,
    prop: 'content',
  },
  {
    key: 'createTime',
    label: 'Thời gian tạo',
    prop: 'createTime',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    prop: 'status',
  },
  {
    key: 'action',
    label: 'Hành động',
    prop: 'action',
    // width: 150,
    align: 'center',
  },
])

const listLoading = ref(true)
const list = ref([])
const defaultFilter = {
  page: 1,
  size: 10,
  total: 0,
  bankAccountId: null,
  keyword: null,
  bankAccount: [],
  timeSearch: null,
}
const filter = reactive(cloneDeep(defaultFilter))
onMounted(() => {
  getList()
})

const getList = async () => {
  listLoading.value = true
  const rs = await apiGetAllDataChatbot()
  if (rs.code === 200) {
    list.value = rs.data
  }
  listLoading.value = false
}
const fileInput = ref(null)
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    console.log('File đã chọn:', file.name)
    if (!file.name.endsWith('.txt')) {
      console.log('khong dung dinh dang')
      ElMessage({
        message: 'Không đúng định dạng file, yêu cầu file txt',
        type: 'error',
        duration: 3 * 1000,
      })
    }
    // Gọi hàm xử lý tiếp nếu cần
    // Ví dụ: uploadFile(file)
  }
}
const triggerFileInput = () => {
  fileInput.value.click()
}
</script>

<style lang="scss" scoped>
.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}
</style>
