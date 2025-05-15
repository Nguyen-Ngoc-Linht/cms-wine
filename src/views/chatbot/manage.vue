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
          <template #action="{ row }">
            <div class="flex items-center justify-center gap-2">
              <el-radio
                v-model="defaultMethod"
                :label="row.id"
                @change="handleDefaultMethodChange(row.id)"
                class="no-label-radio"
              >
              </el-radio>

              <div class="cursor-pointer">
                <svg-icon
                  icon-class="export-file"
                  class="w-6 h-6"
                  @click="downloadFile(row.filePath)"
                />
              </div>
            </div>
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
import {apiDownloadFile, apiGetAllDataChatbot, apiSetDefaultData, uploadData} from '@/api/chatbot'
import { ElMessage, ElMessageBox } from 'element-plus'

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
    width: 150,
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
    console.log(list.value)
  }
  listLoading.value = false
}
const fileInput = ref(null)
const handleFileChange = async event => {
  try {
    const file = event.target.files[0]
    if (!file) return

    console.log('File đã chọn:', file.name)

    if (!file.name.endsWith('.txt')) {
      console.log('không đúng định dạng')
      ElMessage({
        message: 'Không đúng định dạng file, yêu cầu file txt',
        type: 'error',
        duration: 3000,
      })
      return
    }

    const fileToUpload = file.raw || file
    if (!(fileToUpload instanceof File)) {
      console.error('Invalid file provided:', file)
      ElMessage.error('File không hợp lệ')
      return
    }

    const formData = new FormData()
    formData.append('file', fileToUpload)

    const rs = await uploadData(formData)

    if (rs.code === 202) {
      ElMessage.success(rs.message)
      await getList()
    } else {
      ElMessage.error('Tải file thất bại')
    }
  } catch (error) {
    console.error('Lỗi khi xử lý file:', error)
    ElMessage({
      message: 'Đã xảy ra lỗi trong quá trình xử lý file',
      type: 'error',
      duration: 3000,
    })
  }
}
const triggerFileInput = () => {
  fileInput.value.click()
}

const defaultMethod = computed({
  get: () => list.value.find(i => i.status === 1).id,
  set: newValue => {
    list.value.forEach(i => (i.status = i.id === newValue))
  },
})

const handleDefaultMethodChange = async id => {
  try {
    await ElMessageBox.confirm('Bạn có chắc chắn muốn sử dụng bộ dữ liệu này?', 'Xác nhận', {
      confirmButtonText: 'Có',
      cancelButtonText: 'Hủy',
      type: 'warning',
    })

    const rs = await apiSetDefaultData(id)
    if (rs.code === 200) {
      console.log('set defaultMethod', rs)
      ElMessage.success('Dữ liệu đang được thay đổi, vui lòng thử lại sau ít phút')
    } else {
      ElMessage.error('Cài mặc định thất bại')
    }
  } catch (error) {
    console.log('Người dùng đã hủy xác nhận.')
  }
  await getList()
}

const downloadFile = async filePath => {
  console.log('Đường dẫn ban đầu:', filePath)
  try {
    await ElMessageBox.confirm('Bạn có chắc chắn muốn tải file?', 'Xác nhận', {
      confirmButtonText: 'Có',
      cancelButtonText: 'Hủy',
      type: 'success',
    })

    filePath = filePath.slice(1)

    const response = await apiDownloadFile(filePath)
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url

    const fileName = filePath.split('/').pop() || 'download.txt'
    link.setAttribute('download', fileName)

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success('Tải file thành công')
  } catch (error) {
    console.error('Lỗi tải file:', error)
    ElMessage.error('Tải file thất bại')
  }

  await getList()
}

</script>

<style lang="scss">
.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}

.no-label-radio .el-radio__label {
  display: none !important;
}
</style>
