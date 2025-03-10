<template>
  <div v-if="roleData.canRead">
    <div class="flex items-center justify-between paddingX-24 paddingY-10">
      <div class="flex gap-px-16 items-center">
        <el-button
          text
          size="default"
          class="!p-0"
          @click="handleAdd()"
          v-if="roleData.canCreate"
        >
          <div class="text-gray flex items-center pointer text-[#525B73]">
            <svg-icon
              icon-class="el-icon-plus"
              class="width-20 height-20 margin-right-4"
            />
            {{ $t('configUser.addNew') }}
          </div>
        </el-button>
        <el-button
          text
          size="default"
          class="!p-0"
          @click="getList"
        >
          <div class="pointer flex items-center justify-center text-[#525B73]">
            <el-icon
              size="20px"
              class="mr-2"
            >
              <RefreshRight class="width-30 height-30" />
            </el-icon>
            {{ t('configUser.refresh') }}
          </div>
        </el-button>
      </div>
    </div>
    <hr class="margin-bottom-12" />
    <div class="paddingX-24">
      <div
        v-loading="loading"
        class="padding-12 bg-white"
      >
        <el-table
          id="user-table"
          ref="multipleTable"
          :data="listData"
          style="width: 100%"
          @row-click="handleDetail"
          :max-height="730"
        >
          <!--        <el-table-column-->
          <!--            type="selection"-->
          <!--            width="55"-->
          <!--            label="#"-->
          <!--            :selectable="canSelectRow"-->
          <!--        />-->
          <el-table-column
            :label="t('configUser.orderNumber')"
            width="75px"
            class-name="highlight"
          >
            <template #default="{ $index }">
              <span>{{ (filter.page - 1) * filter.size + $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('administration.role.roleName')"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span>{{ row.roleName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('administration.role.roleCode')"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span>{{ row.roleCodeAuto }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('administration.role.description')">
            <template #default="{ row }">
              <span>{{ row.description }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="t('configUser.action')"
            v-if="roleData.canUpdate || roleData.canDelete"
          >
            <template #default="{ row }">
              <div class="flex flex-wrap items-center gap-px-8">
                <template v-if="roleData.canDelete">
                  <div
                    class="pointer"
                    @click.stop="handleDelete(row)"
                    v-if="canInteract(row.roleCode)"
                  >
                    <svg-icon
                      icon-class="remove-administrative"
                      class="width-24 height-24"
                    />
                  </div>
                  <div
                    class="pointer disabled"
                    v-else
                  >
                    <svg-icon
                      icon-class="remove-administrative"
                      class="width-24 height-24"
                    />
                  </div>
                </template>
                <template v-if="roleData.canDelete">
                  <div
                    class="pointer"
                    @click.stop="handleEdit(row)"
                    v-if="canInteract(row.roleCode)"
                  >
                    <svg-icon
                      icon-class="edit-administrative"
                      class="width-24 height-24"
                    />
                  </div>
                  <div
                    class="pointer disabled"
                    v-else
                  >
                    <svg-icon
                      icon-class="edit-administrative"
                      class="width-24 height-24"
                    />
                  </div>
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="margin-top-12">
          <Pagination
            v-model:page="filter.page"
            v-model:size="filter.size"
            :total="totalValue"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed, onMounted, reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-unified'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import { useI18n } from '@/locale'
import { useAppStore, usePermissionStore, useUserStore } from '@/store'
import { getRoleList, apiDestroyRole } from '@/api/role'
import moment from 'moment/moment'
import { formatDateTime } from '@/utils/date'
import lang from '@/locale/getMessage.js'
import Export from '@/components/Export/index.vue'
import Pagination from '@/components/Pagination'
import { ElMessage, ElMessageBox } from 'element-plus'

const appStore = useAppStore()
const locale = computed(() => lang[appStore.lang])

const { roleData } = usePermissionStore()
const { roles, isAdmin } = useUserStore()

const { t } = useI18n()
const router = useRouter()
const defaultFilter = {
  page: 1,
  size: 15,
  search: '',
}

const loading = ref(true)
const filter = reactive(cloneDeep(defaultFilter))

const listData = ref([])
const totalValue = ref(0)

const search = () => {
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
onMounted(() => {
  getList()
})
const getList = async () => {
  loading.value = true
  const { page, size, search } = filter
  const params = {
    page,
    size,
    search,
    sort: 'createdAt',
  }
  const rs = await getRoleList(params)
  if (rs.status === 200) {
    if (rs.data != null) {
      listData.value = rs.data
      totalValue.value = rs.total
      loading.value = false
    } else {
      listData.value = []
      totalValue.value = 0
    }
  } else {
    listData.value = []
    totalValue.value = 0
  }

  loading.value = false
}

const canInteract = roleCode => {
  return roleCode !== 'SUPER_ADMIN' && roleCode !== 'ADMIN'
}

const handleAdd = () => {
  router.push('/administration/system/role/add')
}
const handleEdit = data => {
  router.push({
    name: 'editRole',
    params: { id: data.id },
  })
}
const handleDetail = data => {
  router.push({
    name: 'detailRole',
    params: { id: data.id },
  })
}
const handleDelete = data => {
  ElMessageBox.confirm(
    data.used ? t('administration.role.confirmUsedDelete') : t('administration.role.confirmDelete'),
    t('omsSetting.warning'),
    {
      confirmButtonText: t('omsSetting.confirm'),
      cancelButtonText: t('omsSetting.cancel'),
      confirmButtonClass: 'el-button--main',
      cancelButtonClass: 'el-button--secondary',
      buttonSize: 'default',
    }
  )
    .then(() => {
      apiDestroyRole(data.id)
        .then(res => {
          ElMessage({
            type: 'success',
            message: t('omsSetting.deleteSuccess1'),
          })
          getList()
        })
        .catch(_ => {
          ElMessage({
            type: 'error',
            message: t('omsSetting.failDelete'),
          })
        })
    })
    .catch(() => {})
}

defineOptions({
  name: 'RoleManagement',
})
</script>

<style scoped>
.disabled {
  cursor: not-allowed;
  filter: grayscale(1);
  opacity: 0.8;
}
:deep(td.el-table__cell .cell) {
  color: #76809b;
}
:deep(td.el-table__cell.highlight .cell) {
  color: #000000;
}
</style>
