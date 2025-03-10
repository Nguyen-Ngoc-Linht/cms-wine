<template>
  <div>
    <div class="flex items-center justify-between paddingX-24 mt-5">
      <div class="flex gap-px-8 items-center">
        <el-button
          @click.stop="openAddCategory"
          text
          size="default"
          class="!p-0"
        >
          <div
            class="flex items-center pointer text-[#525B73]"
            style="line-height: 20px"
          >
            <svg-icon
              icon-class="el-icon-plus"
              class="width-20 height-20 margin-right-4"
            />
            Thêm danh mục
          </div>
        </el-button>
      </div>
    </div>
    <hr class="margin-bottom-12 mt-2" />
    <!--  Table  -->
    <div
      class="paddingX-24 mt-3"
    >
      <div class="padding-12 bg-white">
        <TableViolation
          :listLoading="listLoading"
          :fields="fields"
          :STT="true"
          :data="list"
          :page="filter.page"
          :size="filter.size"
        >
          <template #action="{ row }">
              <span
                @click.stop="openEditCategory(row)"
                class="delete-member pointer ms-2 me-3"
              >
                <svg-icon
                  style="width: 24px; height: 24px"
                  icon-class="edit-administrative"
                  class="mr-2"
                />
              </span>
            <span
              @click.stop="openDialogDelete(row)"
              class="delete-member pointer"
            >
                <svg-icon
                  style="width: 24px; height: 24px"
                  icon-class="remove-administrative"
                />
              </span>
          </template>
        </TableViolation>
        <Pagination
          class="margin-top-12"
          v-model:page.sync="filter.page"
          v-model:size.sync="filter.size"
          :total="filter.total"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
    <Dialog
      :show="showDialog"
      :appendToBody="true"
      :width="'682'"
      :title="titleDialog"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <form-category :type-dialog="typeDialog" :category-info="infoCategory" @closeUpdate="handleCloseDialog"></form-category>
      </template>
    </Dialog>
    <el-dialog
      v-model="deleteCategoryDialog"
      title="Xóa danh mục"
      width="500"
      align-center
    >
      <span>Bạn có chắc chắn muốn xóa danh mục đã chọn</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="deleteCategoryDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleDeleteCategory()"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import Pagination from '@/components/Pagination/index.vue'
import { cloneDeep } from 'lodash-unified'
import { useI18n } from '@/locale'
import TableViolation from '@/components/Table/index.vue'
import {apiDeleteCategory, apiGetCategory} from '@/api/product'
import Dialog from '@/components/Dialog/index.vue'
import { ElMessage } from 'element-plus'
import FormCategory from '@/views/category/FormCategory.vue'
const { t } = useI18n()

const fields = ref([
  {
    key: 'name',
    label: 'Tên thuộc tính',
    prop: 'name',
  },
  {
    key: 'description',
    label: 'Mô tả',
    prop: 'description',
  },
  {
    key: 'action',
    label: 'Thao tác',
    prop: 'action',
  },
])

const listLoading = ref(true)
const list = ref([])
const deleteCategoryDialog = ref(false)
const defaultFilter = {
  page: 1,
  size: 10,
  total: 0,
}
const filter = reactive(cloneDeep(defaultFilter))
const showDialog = ref(false)
const titleDialog = ref('')
const typeDialog = ref('add')
const infoCategory = ref({})

onMounted(() => {
  getList()
})

const getList = async () => {
  listLoading.value = true
  const params = {
    name: '',
    description: '',
    paged: {
      page: filter.page,
      size: filter.size
    }
  }
  const rs = await apiGetCategory(params)
  if (rs.code === 200) {
    list.value = rs.data.content
    filter.total = rs.data.totalElements
  }
  listLoading.value = false
}

const openAddCategory = () => {
  titleDialog.value = 'Thêm danh mục'
  typeDialog.value = 'add'
  infoCategory.value = {}
  showDialog.value = true
}
const openEditCategory = (data) => {
  titleDialog.value = 'Sửa danh mục'
  typeDialog.value = 'edit'
  infoCategory.value = data
  showDialog.value = true
}
const openDialogDelete = (data) => {
  infoCategory.value = data
  deleteCategoryDialog.value = true
}
const handleDeleteCategory = async () => {
  try {
    const rs = await apiDeleteCategory(infoCategory.value.id)
    if (rs.code === 200) {
      ElMessage.success('Xóa danh mục thành công')
    } else {
      ElMessage.error('Xóa danh mục thất bại')
    }
    deleteCategoryDialog.value = false
    await getList()
  } catch (e) {
    console.log(e)
  }
}

const handleCloseDialog = () => {
  showDialog.value = false
  getList()
}
const handleSizeChange = size => {
  filter.size = size
  getList()
}
const handlePageChange = page => {
  filter.page = page
  getList()
}
</script>

<style lang="scss" scoped>
.text-hover:hover {
  cursor: pointer;
  font-weight: 800;
  color: #0078d4;
}
</style>
