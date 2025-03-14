<template>
  <div>
    <div class="flex flex-wrap gap-px-8 items-center justify-start paddingX-24 mt-5">
      <el-input
        v-model="filter.name"
        @keyup.enter="getList"
        placeholder="Tên người dùng"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
      </el-input>
      <el-input
        v-model="filter.email"
        @keyup.enter="getList"
        placeholder="Email"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
      </el-input>
      <el-input
        v-model="filter.phone"
        @keyup.enter="getList"
        placeholder="Số điện thoại"
        class="w-full md:max-w-[30%] lg:max-w-[200px] short"
      >
      </el-input>
      <el-button
        class="el-button--main"
        @click="getList()"
      >{{ t('configUser.search') }}</el-button
      >
    </div>
    <div class="flex items-center justify-between paddingX-24 mt-3">
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
            Thêm tài khoản
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
          <template #name="{ row }">
            <span>{{ row.firstName + ' ' + row.lastName }}</span>
          </template>
          <template #action="{ row }">
              <span
                @click.stop="handleEditUser(row)"
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
    <el-dialog
      v-model="deleteUserDialog"
      title="Xóa người dùng"
      width="500"
      align-center
    >
      <span>Bạn có chắc chắn muốn xóa người dùng này</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="deleteUserDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleDeleteProduct()"
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
import { ElMessage } from 'element-plus'
import {getUserList} from '@/api/user'
import {useRouter} from 'vue-router'
const { t } = useI18n()
const router = useRouter()
const fields = ref([
  {
    key: 'name',
    label: 'Tên người dùng',
    prop: 'name',
  },
  {
    key: 'phoneNumber',
    label: 'Số điện thoại',
    prop: 'phoneNumber',
  },
  {
    key: 'email',
    label: 'Email',
    prop: 'email',
  },
  {
    key: 'address',
    label: 'Địa chỉ',
    prop: 'address',
  },
  {
    key: 'identityCardNumber',
    label: 'Số thẻ giao dịch',
    prop: 'identityCardNumber',
  },
  {
    key: 'roleList',
    label: 'Quyền',
    prop: 'roleList',
  },
  {
    key: 'action',
    label: 'Thao tác',
    prop: 'action',
  },
])

const listLoading = ref(true)
const list = ref([])
const deleteUserDialog = ref(false)
const defaultFilter = {
  page: 1,
  size: 10,
  total: 0,
  name: null,
  email: null,
  phone: null,
}
const filter = reactive(cloneDeep(defaultFilter))
const infoUser = ref({})

onMounted(() => {
  getList()
})

const getList = async () => {
  listLoading.value = true
  const params = {
    name: filter.name,
    email: filter.email,
    phone: filter.phone,
    paged: {
      page: filter.page,
      size: filter.size
    }
  }
  const rs = await getUserList(params)
  if (rs.code === 200) {
    list.value = rs.data.content
    filter.total = rs.data.totalElements
  }
  listLoading.value = false
}

const handleEditUser = (data) => {
  router.push(`/user/edit/${data.id}`)
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
