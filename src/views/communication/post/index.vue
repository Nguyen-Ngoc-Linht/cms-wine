<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5 mb-2">
      <el-input
        v-model="filter.keySearch"
        @keyup.enter="getList"
        placeholder="Từ khóa tìm kiếm"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
      </el-input>
      <el-select
        v-model="filter.typePost"
        placeholder="Loại bài viết"
        clearable
        filterable
        multiple
        collapse-tags
        collapse-tags-tooltip
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
        <el-option
          v-for="item in listTypePost"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button class="el-button--main" @click="getList()">{{ t('configUser.search') }}</el-button>
    </div>
    <div class="flex items-center justify-between paddingX-24 mt-3">
      <div class="flex gap-px-8 items-center">
        <el-button
          @click.stop="handleAddPost"
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
            Thêm bài viết
          </div>
        </el-button>
      </div>
    </div>
    <hr class="margin-bottom-12 margin-top-12" />
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
        >
          <template #typePost="{ row }">
            <span>{{ row.typePost ? row.typePost.nameType : '' }}</span>
          </template>
          <template #action="{ row }">
            <span @click="editPost(row.id)" class="delete-member pointer ms-2 me-3">
              <svg-icon
                style="width: 24px; height: 24px"
                icon-class="edit-administrative"
                class="mr-2"
              />
            </span>
            <span class="delete-member pointer">
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
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import Pagination from '@/components/Pagination/index.vue'
import { cloneDeep } from 'lodash-unified'
import { useI18n } from '@/locale'
import TableViolation from '@/components/Table/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiLockUser, apiPasswordRecovery, apiUnlockUser, getUserList } from '@/api/user'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const fields = ref([
  {
    key: 'name',
    label: 'Tiêu đề',
    prop: 'name',
  },
  {
    key: 'typePost',
    label: 'Loại bài viết',
    prop: 'typePost',
  },
  {
    key: 'viewCount',
    label: 'Lượt xem',
    prop: 'viewCount',
  },
  {
    key: 'createAt',
    label: 'Thời gian tạo',
    prop: 'createAt',
  },
  {
    key: 'createBy',
    label: 'Người tạo',
    prop: 'createBy',
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

const list = ref([
  {
    id: 1,
    name: 'Pradel de Lavaux – Di Sản Làm Vang 4 Thế Kỷ',
    typePost: {
      id: 1,
      nameType: 'Tin tức',
    },
    createAt: '07/05/2025 15:50:07',
    createBy: 'admin',
    viewCount: 200,
    status: 'Xu hướng',
    description: ``,
  }
])
const listLoading = ref(false)
const defaultFilter = {
  page: 1,
  size: 10,
  total: 0,
  keySearch: null,
  typePost: null
}
const filter = reactive(cloneDeep(defaultFilter))
const listTypePost = ref([
  {
    id: 1,
    label: 'Tin tức',
    value: 1,
  },
  {
    id: 2,
    label: 'Kiến thức',
    value: 2,
  },
  {
    id: 3,
    label: 'Thương hiệu',
    value: 3,
  },
  {
    id: 4,
    label: 'Tin tức nổi bật',
    value: 4,
  },
])

onMounted(() => {
  getList()
})

const getList = async () => {
}

const handleAddPost = () => {
  router.push(`/communication/post/add`)
}
const editPost = idPost => {
  router.push(`/communication/post/edit/${idPost}`)
}

const handleSizeChange = size => {
  filter.size = size
  getList()
}
const handlePageChange = page => {
  filter.page = page
  getList()
}

const handleDeleteUser = data => {
  ElMessageBox.confirm('Xác nhận khóa tài khoản này', 'Cảnh báo', {
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  })
    .then(() => {
    })
    .catch(() => {})
}
</script>

<style scoped lang="scss"></style>
