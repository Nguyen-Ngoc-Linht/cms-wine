<template>
  <div>
    <div class="flex flex-wrap gap-px-8 paddingX-24 padding-top-14 padding-bottom-12">
      <el-input
        v-model="filter.username"
        class="w-full md:max-w-[30%] lg:max-w-[250px] height-32"
        :placeholder="$t('configUser.userManagement.username')"
        @keyup.enter="getList"
        maxlength="250"
        clearable
      />
      <el-select
        v-model="filter.action"
        class="w-full md:max-w-[30%] lg:max-w-[250px] height-32"
        :placeholder="$t('configUser.action')"
        clearable
      >
        <el-option
          v-for="item in listAction"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-model="filter.startEnd"
        type="daterange"
        :start-placeholder="t('el.datepicker.startTime')"
        :range-separator="t('el.datepicker.to')"
        :end-placeholder="t('el.datepicker.endTime')"
        :clearable="false"
        value-format="YYYY-MM-DD"
        format="DD/MM/YYYY"
        class="w-full md:max-w-[30%] lg:max-w-[300px] flex-grow-0 height-32"
      />
      <el-button
        class="fs-14 height-32 el-button--main rounded-[2px]"
        @click="search"
        >{{ t('placeholder.search') }}
      </el-button>
    </div>
    <hr class="margin-bottom-12" />
    <div class="paddingX-24">
      <div
        v-loading="loading"
        class="padding-12 bg-white"
      >
        <el-table
          ref="multipleTable"
          :data="listData"
          style="width: 100%"
          max-height="730"
        >
          <!--        <el-table-column-->
          <!--            type="selection"-->
          <!--            width="55"-->
          <!--            label="#"-->
          <!--            :selectable="canSelectRow"-->
          <!--        />-->
          <el-table-column
            :label="t('configUser.orderNumber')"
            width="100px"
            class-name="highlight"
          >
            <template #default="{ $index }">
              <span>{{ (filter.page - 1) * filter.size + $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="t('configUser.userManagement.username')"
            width="200px"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span>{{ row.username }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="IP"
            class-name="highlight"
          >
            <template #default="{ row }">
              <span>{{ row.ipAddress }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('administration.action.action')">
            <template #default="{ row }">
              <span>{{ row.action }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('administration.action.actionTime')">
            <template #default="{ row }">
              <span>{{ formatDateTime(row.createdAt) }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="t('administration.action.actionResult')">
            <template #default="{ row }">
              <el-tag
                type="success"
                v-if="row.isSuccess"
                >{{ t('omsSetting.success') }}</el-tag
              >
              <el-tag
                type="danger"
                v-else
                >{{ t('omsSetting.failed') }}</el-tag
              >
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
import { Search } from '@element-plus/icons-vue'
import { useI18n } from '@/locale'
import { useAppStore, usePermissionStore } from '@/store'
import moment from 'moment/moment'
import { formatDateTime } from '@/utils/date'
import lang from '@/locale/getMessage.js'
import Pagination from '@/components/Pagination'
import { cloneDeep } from 'lodash-unified'
import { apiUserAction, apiUserActionLog } from '@/api/systemconfig'

const appStore = useAppStore()
const locale = computed(() => lang[appStore.lang])

const { roleData } = usePermissionStore()

const { t } = useI18n()
const router = useRouter()
const defaultFilter = {
  page: 1,
  size: 15,
  username: null,
  action: null,
  startEnd: [moment().add(-7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
}

const filter = reactive(cloneDeep(defaultFilter))
const listAction = ref([])

const getListAction = () => {
  const params = {
    method: 'LIST',
  }
  apiUserAction(params).then(res => {
    listAction.value = res.data.data
  })
}
const handleChangeType = () => {}

const listData = ref([])
const totalValue = ref(0)
const loading = ref(true)

const getList = () => {
  const { username, page, size, action, startEnd } = filter
  const params = {
    method: 'LIST',
    arguments: {
      page: page - 1,
      size,
      username: username?.length ? encodeURIComponent(username.trim()) : null,
      action: action?.length ? action : null,
      createdAt: {
        from: startEnd[0],
        to: startEnd[1],
      },
      sort: {
        direction: 'DESC',
        properties: ['createdAt'],
      },
    },
  }

  apiUserActionLog(params)
    .then(res => {
      listData.value = res.data.data
      totalValue.value = res.data.totalItems
    })
    .catch(_ => {
      listData.value = []
      totalValue.value = 0
    })
    .finally(_ => {
      loading.value = false
    })
}

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
  getListAction()
  getList()
})

defineOptions({
  name: 'ActionManagement',
})
</script>

<style scoped>
:deep(td.el-table__cell .cell) {
  color: #76809b;
}
:deep(td.el-table__cell.highlight .cell) {
  color: #000000;
}
</style>
