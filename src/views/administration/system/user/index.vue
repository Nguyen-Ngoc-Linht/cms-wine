<template>
  <div v-if="roleData.canRead">
    <div class="flex flex-wrap gap-px-8 paddingX-24 padding-top-14 margin-bottom-10">
      <el-input
        v-model="filter.keyword"
        class="w-full md:max-w-[30%] lg:max-w-[300px]"
        :placeholder="t('configUser.userManagement.username')"
        maxlength="250"
        @keyup.enter="getList"
        clearable
      />
      <el-tree-select
        v-model="filter.administrativeUnit"
        class="w-full md:max-w-[30%] lg:max-w-[300px]"
        required
        :placeholder="t('configUser.workUnit')"
        :data="listUnit"
        default-expand-all
        check-strictly
        clearable
      >
      </el-tree-select>
      <el-date-picker
        v-model="filter.startEnd"
        type="daterange"
        :start-placeholder="t('el.datepicker.begin')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.end')"
        clearable
        value-format="YYYY-MM-DD"
        format="DD/MM/YYYY"
        class="w-full md:max-w-[30%] lg:max-w-[300px] flex-grow-0"
      />
      <el-button
        class="fs-14 height-32 el-button--main rounded-[2px]"
        @click="search"
        >{{ t('placeholder.search') }}
      </el-button>
    </div>
    <div
      class="flex items-center justify-between paddingX-24 padding-bottom-10"
      v-if="roleData.canCreate"
    >
      <div class="flex gap-px-16 items-center">
        <el-button
          text
          size="default"
          class="!p-0"
          @click="handleAddUser()"
        >
          <div class="text-gray flex items-center pointer text-[#525B73]">
            <svg-icon
              icon-class="el-icon-plus"
              class="width-20 height-20 margin-right-4"
            />
            {{ $t('omsSetting.addUser') }}
          </div>
        </el-button>
      </div>
    </div>
    <hr class="margin-bottom-12" />
    <div class="paddingX-24">
      <div
        v-loading="listLoading"
        class="padding-12 bg-white"
      >
        <el-table
          ref="multipleTable"
          :data="usersList"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
          @row-click="rowClicked"
          max-height="670"
        >
          <!--        <el-table-column-->
          <!--            type="selection"-->
          <!--            width="55"-->
          <!--            label="#"-->
          <!--            :selectable="canSelectRow"-->
          <!--        />-->
          <el-table-column
            :label="t('configUser.orderNumber')"
            width="60px"
            class-name="highlight"
          >
            <template #default="{ $index }">
              <span>{{ (filter.page - 1) * filter.size + $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.userManagement.username')"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span>{{ row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.userCode')"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span>{{ row.userCode }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.fullName')"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span>{{ row.fullName }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('configUser.phoneNumber1')">
            <template #default="{ row }">
              <span>{{ row.mobile }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Email">
            <template #default="{ row }">
              <span>{{ row.email }}</span>
            </template>
          </el-table-column>
          <!--          <el-table-column :label="t('configUser.userManagement.route')">-->
          <!--            <template #default="{ row }">-->
          <!--              <span>{{ row.route }}</span>-->
          <!--            </template>-->
          <!--          </el-table-column>-->

          <!--          <el-table-column :label="t('configUser.userManagement.station')">-->
          <!--            <template #default="{ row }">-->
          <!--              <span>{{ row.station }}</span>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column :label="t('configUser.workUnit')">
            <template #default="{ row }">
              <span>{{ row.administrativeUnit }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="t('configUser.position')">
            <template #default="{ row }">
              <span>{{ row.positionUnit }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="t('configUser.role')">
            <template #default="{ row }">
              <span v-if="row.roleCode">{{ row.roleName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="t('configUser.userManagement.createDate')"
            width="100px"
          >
            <template #default="{ row }">
              <span>{{ formatDate(row.createdTimestamp) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="t('configUser.action')"
            v-if="roleData.canUpdate || roleData.canDelete"
            width="115px"
          >
            <template #default="{ row }">
              <div class="flex flex-wrap items-center gap-px-8">
                <template v-if="roleData.canDelete">
                  <div
                    class="pointer"
                    @click.stop="handleDeleteUser(row)"
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
                <template v-if="roleData.canUpdate">
                  <div
                    class="pointer"
                    @click.stop="handleEditUser(row)"
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
                  <template v-if="canInteract(row.roleCode)">
                    <div
                      class="pointer"
                      @click.stop="handleBlockUser(row)"
                      v-if="row.enabled"
                    >
                      <svg-icon
                        icon-class="user-block"
                        class="width-24 height-24"
                      />
                    </div>
                    <div
                      class="pointer"
                      @click.stop="handleActiveUser(row)"
                      v-else
                    >
                      <svg-icon
                        icon-class="user-active"
                        class="width-24 height-24"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="pointer disabled"
                      v-if="row.enabled"
                    >
                      <svg-icon
                        icon-class="user-block"
                        class="width-24 height-24"
                      />
                    </div>
                    <div
                      class="pointer disabled"
                      v-else
                    >
                      <svg-icon
                        icon-class="user-active"
                        class="width-24 height-24"
                      />
                    </div>
                  </template>
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
import { Search } from '@element-plus/icons-vue'
import { useI18n } from '@/locale'
import { useAppStore, usePermissionStore, useUserStore } from '@/store'
import { getUserList, blockUser, apiDeleteUser } from '@/api/user'
import moment from 'moment/moment'
import { formatDate } from '@/utils/date'
import lang from '@/locale/getMessage.js'
import Export from '@/components/Export/index.vue'
import Pagination from '@/components/Pagination'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiGetUnitDepartments } from '@/api/administrativeDepartment'

const appStore = useAppStore()
const locale = computed(() => lang[appStore.lang])

const { roleData } = usePermissionStore()
const { isAdmin } = useUserStore()

const { t } = useI18n()
const router = useRouter()
const defaultFilter = {
  page: 1,
  size: 15,
  keyword: null,
  administrativeUnit: null,
  startEnd: [null, null],
}

const listLoading = ref(true)

const filter = reactive(cloneDeep(defaultFilter))
const listUnit = ref([])
const getListUnit = () => {
  apiGetUnitDepartments().then(res => {
    let data = res?.data || []
    data = data.map(i => ({
      label: i.unitName,
      value: i.id,
      // disabled: i.departmentUnit && i.departmentUnit.length > 0,
      children: i.departmentUnit.map(d => ({
        value: d.id,
        label: d.departmentName,
      })),
    }))
    listUnit.value = data
  })
}

const handleChangeUnit = () => {}

const usersList = ref([])
const dataExport = ref(null)
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
  getListUnit()
  getList()
})
const getList = async () => {
  listLoading.value = true
  const { keyword, page, size, administrativeUnit, startEnd } = filter
  const params = {
    currentPage: page,
    rowsPerPage: size,
    sort: 'userName',
    keyword: keyword ? encodeURIComponent(keyword.trim()) : '',
    administrativeUnit,
    startDate: startEnd && startEnd[0] ? moment(startEnd[0]).valueOf() : null,
    endDate: startEnd && startEnd[1] ? moment(startEnd[1]).endOf('day').valueOf() : null,
  }
  getUserList(params)
    .then(rs => {
      if (rs.data != null) {
        const userAdmin = rs.data.filter(function (val) {
          return val.userName === 'admin'
        })
        usersList.value = rs.data.filter(function (val) {
          return val.userName !== 'admin'
        })
        usersList.value = userAdmin.concat(usersList.value)
        totalValue.value = rs.total
        listLoading.value = false
      } else {
        usersList.value = []
        totalValue.value = 0
      }
    })
    .catch(_ => {
      totalValue.value = 0
      usersList.value = []
    })
    .finally(_ => {
      listLoading.value = false
    })
}
const multipleSelection = ref([])
const flag_active = ref(null)

const handleSelectionChange = val => {
  multipleSelection.value = val
}

const canInteract = roleCode => {
  if (roleCode === 'SUPER_ADMIN') {
    return false
  } else if (!isAdmin && roleCode === 'ADMIN') {
    return false
  }
  return true
}

const tableRowClassName = row => {
  if (row.uuid === flag_active.value) {
    return 'active-row'
  }
  return ''
}
const rowClicked = async data => {
  router.push({
    name: 'detailUser',
    params: { id: data.uuid },
  })
}

const handleAddUser = () => {
  router.push({
    name: 'addUser',
  })
}

const handleEditUser = data => {
  router.push({
    name: 'editUser',
    params: { id: data.uuid },
  })
}

const handleExport = () => {}

const processing = ref(false)

const handleBlockUser = data => {
  ElMessageBox.confirm(t('configUser.userManagement.confirmBlock'), t('omsSetting.warning'), {
    confirmButtonText: t('omsSetting.confirm'),
    cancelButtonText: t('omsSetting.cancel'),
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  })
    .then(() => {
      activeUser(data.uuid, false)
    })
    .catch(() => {})
}

const handleActiveUser = data => {
  ElMessageBox.confirm(t('configUser.userManagement.confirmActive'), t('omsSetting.warning'), {
    confirmButtonText: t('omsSetting.confirm'),
    cancelButtonText: t('omsSetting.cancel'),
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  })
    .then(() => {
      activeUser(data.uuid, true)
    })
    .catch(() => {})
}

const activeUser = (userId, enabled) => {
  if (processing.value) {
    return
  }

  const data = {
    userId,
    enabled,
  }
  processing.value = true
  blockUser(data)
    .then(res => {
      getList()
      ElMessage({
        type: 'success',
        message: t('omsSetting.successUpdate'),
      })
    })
    .catch(_ => {
      // ElMessage({
      //   type: 'error',
      //   message: t('omsSetting.failUpdate'),
      // })
    })
    .finally(_ => {
      processing.value = false
    })
}

const handleDeleteUser = data => {
  ElMessageBox.confirm(t('configUser.userManagement.confirmDelete'), t('omsSetting.warning'), {
    confirmButtonText: t('omsSetting.confirm'),
    cancelButtonText: t('omsSetting.cancel'),
    confirmButtonClass: 'el-button--main',
    cancelButtonClass: 'el-button--secondary',
    buttonSize: 'default',
  })
    .then(() => {
      deleteUser(data.uuid)
    })
    .catch(() => {})
}

const deleteUser = userId => {
  if (processing.value) {
    return
  }
  processing.value = true
  apiDeleteUser(userId)
    .then(() => {
      getList()
      ElMessage({
        type: 'success',
        message: t('omsSetting.deleteSuccess'),
      })
    })
    .catch(_ => {
      // ElMessage({
      //   type: 'error',
      //   message: t('omsSetting.failDelete'),
      // })
    })
    .finally(_ => {
      processing.value = false
    })
}

defineOptions({
  name: 'UserManagement',
})
</script>

<style lang="scss" scoped>
:deep(div#user-table .el-table::before) {
  height: 0;
}

div#user-table::before {
  height: 0;
}

div#user-table {
  overflow-y: auto;
}

:deep(div#user-table .el-table__header-wrapper) {
  position: sticky;
  top: -16px;
  z-index: 9;
}

span.status-user {
  color: #ff3b49;
  border-radius: 2px;
  border: 1px solid #fcaeb3;
  background: #ffecef;
  padding: 2px 8px;
}

span.status-user.active {
  color: #34c759;
  border-radius: 2px;
  border: 1px solid #aee9bd;
  background: #f5fcf6;
}

.el-table tr > th:first-child .cell,
.el-table tr > td:first-child .cell {
  vertical-align: middle;
  justify-content: start !important;
}

.el-table .el-table__cell.is-center {
  text-align: left;
}

th.el-table-column--selection .el-checkbox {
  margin-left: 0;
}

th.el-table__cell {
  height: 42px;
}

.el-table th.el-table__cell > .cell {
  line-height: 1.5;
  display: flex !important;
  align-items: center;
}

.el-table-column--selection .cell .el-checkbox__input {
  height: auto;
}

.user-page {
  .el-form-item {
    margin-bottom: 15px;
  }

  .el-table td:first-child .cell {
    display: inline-block;

    .el-checkbox {
      margin-bottom: 0;
    }
  }

  .el-input input {
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    border: solid 1px #9999;
  }

  .el-icon-camera-solid {
    font-size: 25px;
    color: #9a9a9a;
    position: relative;
    top: -50px;
    left: 54px;
    background: #dfdfdf;
    border-radius: 50%;
    padding: 8px;
    border: 1px solid white;
  }

  .img_avatar {
    text-align: center;
    padding-top: 25px;

    img {
      border-radius: 50%;
    }
  }

  .el-dialog {
    margin-top: 30px !important;
  }

  .item-left {
    width: 48%;
    float: left;
    margin-right: 2%;
  }

  .item-right {
    width: 48%;
    float: left;
    margin-left: 2%;
  }

  .block-item {
    width: 100%;
    float: left;
  }

  .el-dialog__header {
    .el-dialog__title {
      color: #212633;
      font-size: 20px;
      font-weight: 500;
    }

    .el-icon-close {
      color: #2b2f33;
      font-size: 22px;
      top: -10px;
      position: relative;
    }
  }

  .el-dialog__body {
    .el-form-item__label {
      padding-bottom: 0;
      font-size: 14px;
      color: #363030;
      font-weight: 500 !important;
    }
  }

  .el-dialog__footer {
    clear: both;
    padding-bottom: 25px;

    .el-button--primary {
      background: #1f7ff5;
      height: 40px;
      border-radius: 5px;
      width: 147px;
      text-transform: uppercase;
      font-weight: bold;
      border-color: #1f7ff5;
    }

    .el-button--danger {
      background: #9e9e9e;
      height: 40px;
      border-radius: 5px;
      width: 147px;
      text-transform: uppercase;
      font-weight: bold;
      border-color: #9e9e9e;
      float: left;
    }
  }

  #select-all-delete {
    clear: both;
    height: 63px;
    line-height: 63px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    background-color: #ff4646;
    color: white;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    .el-icon-close {
      font-size: 25px;
      margin-left: 20px;
      margin-right: 35px;
      position: relative;
      top: 4px;
      cursor: pointer;
    }

    button {
      background: #e00000;
      border: initial;
      border-radius: 5px;
      float: right;
      display: inline-block;
      margin-top: 15px;
      margin-right: 15px;
    }
  }

  .action {
    margin-top: 20px;
    padding-bottom: 20px;

    // .el-button--primary {
    //   background: #64789a;
    //   border: initial;
    //   border-radius: 4px;
    //   width: 125px;
    //   height: 40px;
    // }

    // .el-button--success {
    //   background: #ff6161;
    //   border: initial;
    //   border-radius: 4px;
    //   width: 125px;
    //   height: 40px;
    //   float: right;
    // }
  }

  #detail-user {
    position: relative;
    width: 0;
    background: white;
    padding: 25px;
    float: left;
    margin-left: 25px;
    display: none;
    overflow: hidden;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.05);
    border-radius: 4px;

    .avatar {
      text-align: center;
      margin-bottom: 25px;
      margin-top: 25px;

      img {
        border-radius: 50%;
      }
    }

    .item-label {
      color: #363030;
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 10px;
    }

    .item-text {
      color: black;
      font-size: 16px;
      margin-bottom: 20px;
      opacity: 0.6;
      word-break: break-word;
    }

    .el-icon-close {
      background: #e3e3e3;
      height: 30px;
      width: 30px;
      border-radius: 50%;
      text-align: center;
      line-height: 30px;
      color: #878787;
      font-size: 16px;
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
    }
  }

  .el-table th > .cell {
    text-align: left;
  }

  .el-table tr > th:first-child .cell {
    text-align: center;
  }

  .el-table th {
    color: black;
    font-size: 14px;
  }

  .el-table td {
    color: black;
    font-size: 14px;
  }

  .el-table tr td:first-child {
    text-align: left;
  }

  .el-table td:first-child .cell {
    display: inline-block;
  }

  .filter-container {
    padding-bottom: 20px;
  }

  tbody {
    tr {
      cursor: pointer;
    }
  }

  .search-block {
    text-align: left;
    float: left;
    width: 100%;
    margin-bottom: 20px;

    .search {
      float: left;
      width: calc(100% - 162px);
      display: inline;

      input {
        width: 500px;
        height: 32px !important;
        line-height: 32px !important;
        // border: solid 1px #9999;
        // border-radius: 5px;
        padding-left: 40px;
      }

      .el-icon-search {
        line-height: 16px;
        font-size: 19px;
        color: #666;
      }

      span {
        left: 10px;
      }
    }

    button {
      background: #1f7ff5;
      border-radius: 4px;
      height: 40px !important;
      width: 147px;
      margin-left: 15px;
      border-color: #1f7ff5;

      span {
        font-size: 16px;
        font-weight: bold;
        text-transform: uppercase;
      }
    }
  }
}

.el-select-dropdown .el-tree {
  height: unset !important;
}

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
