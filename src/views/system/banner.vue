<template>
  <div>
    <div class="flex items-center justify-between paddingX-24 mt-3">
      <div class="flex gap-px-8 items-center">
        <el-button
          @click.stop="handleAddBanner"
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
            Thêm banner
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
          <template #imageUrl="{ row }">
            <img
              v-if="getPrimaryImage(row)"
              :src="getPrimaryImage(row)"
              alt="Product Image"
              class="product-image"
            />
            <span v-else>Không có ảnh</span>
          </template>
          <template #action="{ row }">
              <span
                @click.stop="handleEditBanner(row)"
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
      :width="'820'"
      :title="titleDialog"
      @closeDialog="handleCloseDialog"
    >
      <template v-slot:content>
        <banner-dialog :info-banner="infoBanner" :typeDialog="typeDialog" :user_id="user.userId" @closeUpdate="handleCloseDialog"></banner-dialog>
      </template>
    </Dialog>
    <el-dialog
      v-model="deleteCategoryDialog"
      title="Xóa banner"
      width="500"
      align-center
    >
      <span>Bạn có chắc chắn muốn xóa banner đã chọn</span>
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
            @click="handleDeleteBanner()"
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
import {apiDeleteProduct} from '@/api/product'
import Dialog from '@/components/Dialog/index.vue'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'
import {useConfig} from '@/config'
import {apiDeleteBanner, apiGetAllBanner} from '@/api/systemconfig'
import BannerDialog from '@/views/system/BannerDialog.vue'
const { t } = useI18n()
const router = useRouter()
const user = ref({})

const fields = ref([
  {
    key: 'title',
    label: 'Tiêu đề banner',
    prop: 'title',
  },
  {
    key: 'description',
    label: 'Mô tả',
    prop: 'description',
  },
  {
    key: 'imageUrl',
    label: 'Banner',
    prop: 'imageUrl',
  },
  {
    key: 'linkUrl',
    label: 'Điều hướng',
    prop: 'linkUrl',
  },
  {
    key: 'type',
    label: 'Màn hình hiển thị',
    prop: 'type',
    width: 150,
    align: 'center',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    prop: 'status',
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
  keyword: '',
}
const filter = reactive(cloneDeep(defaultFilter))

const showDialog = ref(false)
const titleDialog = ref('')
const typeDialog = ref('add')
const infoBanner = ref({})

onMounted(() => {
  user.value = JSON.parse(localStorage.getItem('userInfo'))
  getList()
})

const getList = async () => {
  listLoading.value = true
  const params = {
    paged: {
      page: filter.page,
      size: filter.size
    },
    name: filter.keyword,
    categoryIds: []
  }
  const rs = await apiGetAllBanner()
  if (rs.code === 200) {
    list.value = rs.data
    filter.total = rs.data.length
  }
  listLoading.value = false
}
const config = useConfig()
const baseUrl = ref(config.VITE_PROXY_DOMAIN)
const getPrimaryImage = (row) => {
  const img = row.imageUrl
  return img ? baseUrl.value + 'media-service/api/v1.0/images' + img.replace(/^\.\/uploads/, '/uploads') : null
}

const handleAddBanner = () => {
  showDialog.value = true
  infoBanner.value = {}
  typeDialog.value = 'add'
  titleDialog.value = 'Thêm banner'
}
const handleEditBanner = (data) => {
  showDialog.value = true
  infoBanner.value = data
  typeDialog.value = 'edit'
  titleDialog.value = 'Sửa banner'
}
const openDialogDelete = (data) => {
  infoBanner.value = data
  deleteCategoryDialog.value = true
}
const handleDeleteBanner = async () => {
  try {
    const rs = await apiDeleteBanner(infoBanner.value.id)
    if (rs.code === 200) {
      ElMessage.success('Xóa Banner thành công')
    } else {
      ElMessage.error('Xóa Banner thất bại')
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
.product-image {
  width: 180px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
