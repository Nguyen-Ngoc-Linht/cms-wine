<template>
  <div>
    <div class="">
      <el-form
        :model="filter"
        class="flex padding-top-16 gap-px-8 bg-white paddingX-24"
      >
        <el-form-item>
          <el-input
            v-model="filter.keyword"
            :placeholder="t('notify.searchBySource')"
            :prefix-icon="Search"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filter.level"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
            :placeholder="t('notify.priority')"
          >
            <el-option
              v-for="item in category.levelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filter.notifyType"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
            :placeholder="t('notify.typeNotify')"
          >
            <el-option
              v-for="item in category.actionTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-config-provider :locale="locale">
            <el-date-picker
              v-model="filter.startEnd"
              type="datetimerange"
              :start-placeholder="t('el.datepicker.startDate')"
              :range-separator="t('el.datepicker.to')"
              :end-placeholder="t('el.datepicker.endDate')"
              value-format="YYYY-MM-DD HH:mm:ss"
              format="DD/MM/YYYY HH:mm:ss"
              :default-time="defaultTime"
            />
          </el-config-provider>
        </el-form-item>
        <el-button
          style="background-color: #059efb; border: none"
          class="fs-14 height-32"
          type="success"
          @click="getList"
          >{{ t('placeholder.search') }}
        </el-button>
        <el-button
          style="background-color: #fff; border-color: #7c7e81; color: #7c7e81"
          class="fs-14 height-32 !ml-0"
          type="info"
          @click="resetFilter"
          >{{ t('placeholder.reset') }}
        </el-button>
      </el-form>

      <div class="flex gap-px-16 padding-top-8 paddingX-24">
        <div class="flex gap-px-8">
          <div
            @click="getList"
            class="pointer flex items-center justify-center text-[#525B73]"
          >
            <el-icon
              size="20px"
              class="mr-2"
            >
              <RefreshRight class="width-30 height-30" />
            </el-icon>
            {{ t('el.table.resetFilter') }}
          </div>
        </div>
        <div
          @click="handleReadAllNotify"
          class="flex gap-px-8"
        >
          <div class="pointer flex items-center justify-center text-[#525B73]">
            <svg-icon
              class="width-20 height-20 margin-right-2"
              icon-class="v-icon"
            ></svg-icon>
            <span>{{ t('notify.markReadAll') }}</span>
          </div>
        </div>

        <el-divider
          direction="vertical"
          class="height-32"
        />

        <div class="flex gap-px-8 items-center">
          <p>{{ t('notify.receiveNotify') }}</p>
          <ElcSwitch
            :value="isReceiveNoti"
            @change="handleChangeReceiveNoti"
          />

          <span class="font-bold">{{ isReceiveNoti ? t('notify.on') : t('notify.off') }}</span>
        </div>
      </div>
    </div>

    <hr class="margin-bottom-12 margin-top-8" />

    <div class="paddingX-24">
      <div class="padding-12 bg-white">
        <el-config-provider :locale="locale">
          <el-table
            v-loading="listLoading"
            :data="list"
            row-key="id"
            highlight-current-row
            max-height="660px"
            style="width: 100%"
            class="cell-main-3"
            :row-class-name="customRowClass"
            @row-click="handleRowClick"
          >
            <el-table-column
              :label="t('weightVehicle.numberOrder')"
              width="65"
            >
              <template #default="{ $index }">
                <span>{{ (filter.page - 1) * filter.size + $index + 1 }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="t('notify.source')"
              width="300"
              prop="source"
              sortable
            >
              <template #default="{ row }">
                <span>{{ row.source }}</span>
              </template>
            </el-table-column>

            <el-table-column width="50">
              <div class="line" />
            </el-table-column>

            <el-table-column
              :label="t('configUser.time')"
              width="200"
              prop="startTime"
              sortable
            >
              <template #default="{ row }">
                <span>{{ formatDateTime(row.startTime) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="t('notify.priority')"
              width="200"
            >
              <template #default="{ row }">
                <div
                  class="status-noti"
                  :class="getClassRate(row.level)"
                >
                  <span />
                  {{ row.level }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              :label="t('notify.typeNotify')"
              width="200"
            >
              <template #default="{ row }">
                <span>{{ row.notifyType }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="t('notify.content')">
              <template #default="{ row }">
                <el-tooltip
                  :content="row.content"
                  placement="bottom"
                  effect="light"
                >
                  <span>{{ formatContent(row.content) }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-config-provider>
      </div>

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
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { getNotifyList, readAllNotify, readNotify, changeReceiveNotify } from '@/api/notify.js'
import Pagination from '@/components/Pagination'
import { useNotifyStore, useUserStore, useAppStore } from '@/store'
import { formatDateTime } from '@/utils/date'
import { Search } from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash-unified'
import moment from 'moment'
import { handleRedirect, handleRedirectWeight } from './redirect'
import { useI18n } from '@/locale'
import lang from '@/locale/getMessage.js'
import { ElMessage } from 'element-plus'
import ElcSwitch from '@/components/ElcSwitch'

const appStore = useAppStore()
const userStore = useUserStore()
const notifyStore = useNotifyStore()

const locale = computed(() => lang[appStore.lang])
const { t } = useI18n()

const list = ref(null)
const totalValue = ref(0)
const listLoading = ref(true)
const category = reactive({
  actionTypeList: [
    {
      value: 22,
      label: t('notify.warningOverload'),
    },
    {
      value: 23,
      label: t('notify.overloadToPunishment'),
    },
    {
      value: 24,
      label: t('notify.violationPunishment'),
    },
  ],
  levelList: [
    {
      value: 0,
      label: t('notify.low'),
    },
    {
      value: 1,
      label: t('notify.medium'),
    },
    {
      value: 2,
      label: t('notify.high'),
    },
  ],
})

const isReceiveNoti = ref(false)
const storeReceiveNoti = computed(() => notifyStore.isReceiveNotify)
watch(
  () => storeReceiveNoti.value,
  val => {
    isReceiveNoti.value = val
  },
  {
    immediate: true,
  }
)
const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]

const defaultFilter = {
  page: 1,
  size: 15,
  keyword: null,
  level: [],
  notifyType: [],
  app: 'OMS',
  sortBy: 'start_time',
  sortType: 'DESC',
  content: '',
  createdDate: null,
  // fromDate: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
  // toDate: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
  startEnd: [
    moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  ],
}
const filter = reactive(cloneDeep(defaultFilter))

const getList = async () => {
  listLoading.value = true
  filter.startEnd = filter.startEnd || [
    moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  ]

  const {
    page,
    size,
    keyword,
    level,
    notifyType,
    app,
    sortBy,
    sortType,
    content,
    createdDate,
    startEnd,
  } = filter

  const params = {
    page: page ? page - 1 : 0,
    size,
    keyword,
    level,
    notifyType,
    app,
    sortBy,
    sortType,
    content,
    createdDate,
    fromDate: moment(startEnd[0]).unix(),
    toDate: moment(startEnd[1]).unix(),
  }

  const { data, total } = await getNotifyList(params)

  listLoading.value = false
  list.value = data
  totalValue.value = total
}
getList()
const resetFilter = () => {
  for (const key in defaultFilter) {
    filter[key] = defaultFilter[key]
  }
  getList()
}
const getClassRate = status => {
  let statusClass = ''
  if (status === 'Cao') {
    statusClass = 'disconnect'
  } else if (status === 'Trung bình') {
    statusClass = 'warning'
  } else if (status === 'Thấp') {
    statusClass = 'connect'
  }
  return statusClass
}
const formatContent = content => {
  const formattedContent = content.replace(/<[^>]+>/g, '')
  return formattedContent
}
const handleSizeChange = size => {
  filter.size = size
  getList()
}
const handlePageChange = page => {
  filter.page = page
  getList()
}

const customRowClass = ({ row }) => {
  let className = 'cursor-pointer '
  if (row.statusView === 0) {
    className += 'not-viewed'
  }
  return className
}

const handleReadNotify = async row => {
  const param = {
    userId: userStore.uuid,
    notiId: row.id,
  }
  const { status } = await readNotify(param)
  if (status === 200) {
    setTimeout(() => {
      getList()
    }, 5000)
    notifyStore.SET_NUMBER_NOTIFY(notifyStore.numberNotify - 1)
  }
}

const handleReadAllNotify = async () => {
  listLoading.value = true
  const param = {
    userId: userStore.uuid,
    app: 'OMS',
  }
  const { status } = await readAllNotify(param)
  if (status === 200) {
    setTimeout(() => {
      getList()
    }, 5000)
    notifyStore.SET_NUMBER_NOTIFY(0)
  } else {
    ElMessage({
      type: 'error',
      message: 'Lỗi',
    })
    listLoading.value = false
  }
}

const handleRowClick = row => {
  if (row.statusView === 0) {
    handleReadNotify(row)
  }
  // handleRedirect(row)
  handleRedirectWeight({
    routerName: 'omsWeightSessionDetail',
    id: row.objectData.id,
    startTime: moment(new Date(row.objectData.startTime)).format('YYYY-MM-DD HH:mm:ss'),
  })
}

const sortStartTime = (a, b) => {
  const timeA = moment(a)
  const timeB = moment(b)
  if (timeA.isBefore(timeB)) return 1
  if (timeA.isAfter(timeB)) return -1
  return 0
}

const handleChangeReceiveNoti = async () => {
  const { status, data } = await changeReceiveNotify({
    userId: userStore.uuid,
    appName: 'OMS',
    receiveStatus: isReceiveNoti.value,
  })

  if (status === 200) {
    ElMessage({
      message: t('notify.updateReceiveNotifyStatusSuccess'),
      type: 'success',
    })
    notifyStore.SET_IS_RECEIVE_NOTIFY(notifyStore.isReceiveNotify ? 0 : 1)
  }
}

defineOptions({
  name: 'Notify',
})
</script>
<style lang="scss" scoped>
.connect {
  color: #34c759;
  font-weight: 500;
  font-size: 14px;
}

.disconnect {
  color: #ff3b49;
  font-weight: 500;
  font-size: 14px;
}

.warning {
  color: #fec318;
  font-weight: 500;
  font-size: 14px;
}

:deep(.el-table tr.not-viewed) {
  background-color: #f1fbff;

  td .cell .line {
    &::after {
      content: '';
      position: absolute;
      top: 35%;
      left: 0;
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background-color: #2e89ff;
    }
  }
}
</style>
