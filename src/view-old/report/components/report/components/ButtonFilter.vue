<template>
  <el-popover
    :visible="visiblePopover"
    class="dropdown-search"
    placement="bottom-start"
    width="680"
    trigger="manual"
  >
    <template #reference>
      <el-button
        class="btn-popover"
        @click="visiblePopover = !visiblePopover"
      >
        <svg-icon icon-class="icon-search" />
        {{ t('configUser.searchFilter') }}
        <el-icon>
          <ArrowDown v-if="!visiblePopover" />
          <ArrowUp v-else />
        </el-icon>
      </el-button>
    </template>

    <div class="flex gap-px-16 flex-col">
      <div class="flex justify-between items-end">
        <p class="font-bold fs-18">{{ t('configUser.searchFilter') }}</p>
        <el-icon
          :size="24"
          class="pointer"
          @click="visiblePopover = !visiblePopover"
        >
          <Close class="width-24 height-24" />
        </el-icon>
      </div>
      <el-config-provider :locale="locale">
        <el-row :gutter="8">
          <el-col :span="12">
            <el-select
              v-model="filter.station"
              :placeholder="t('configUser.station')"
              class="w-full"
              filterable
              clearable
              @change="handleStationChange"
            >
              <el-option
                v-for="item in stationList"
                :key="item.stationId"
                :label="item.name"
                :value="item.stationId"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-select
              v-model="filter.lane"
              :key="keyLane"
              :placeholder="t('configUser.lane')"
              class="w-full"
              :disabled="disableLane"
            >
              <el-option
                v-for="item in laneList"
                :key="item.laneId"
                :label="item.name"
                :value="item.laneId"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <!-- <el-col :span="12">
            <el-select
              v-model="filter.typeVehicle"
              :placeholder="t('configUser.typeVehicle')"
              class="w-full"
            >
              <el-option
                v-for="item in category.listVehicle"
                :key="item.code"
                :label="item.name"
                :value="Number(item.code)"
              >
              </el-option>
            </el-select>
          </el-col> -->
          <el-col :span="24">
            <el-select
              v-model="filter.vehicleAxle"
              :placeholder="t('report.vehicleAxle')"
              filterable
              multiple
              collapse-tags
              clearable
              class="w-full"
            >
              <el-option
                v-for="item in category.listAxle"
                :key="item.code"
                :label="item.name"
                :value="Number(item.code)"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="8">
          <el-col :span="12">
            <el-select
              v-model="filter.typeViolation"
              :placeholder="t('configUser.typeViolation')"
              class="w-full"
              :disabled="disableViolation"
            >
              <el-option
                v-for="item in category.listTypeViolation"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-select
              v-model="filter.violation"
              :placeholder="t('weightStation.violation')"
              class="w-full"
              :disabled="disableViolation"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col>
            <el-select
              v-model="filter.status"
              :placeholder="t('configUser.status')"
              class="w-full"
              :disabled="disableViolation"
            >
              <el-option
                v-for="item in category.listAuditStatus"
                :key="item.code"
                :label="item.name"
                :value="Number(item.code)"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row> -->
      </el-config-provider>

      <div class="flex justify-end items-start">
        <el-button
          type="info"
          plain
          @click="saveFilter('reset')"
        >
          {{ t('placeholder.reset') }}
        </el-button>
        <el-button
          class="el-button--main"
          @click="saveFilter()"
        >
          {{ t('placeholder.search') }}
        </el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { useSearchStore, useAppStore } from '@/store'
import { genKey } from '@/utils/app/string.js'
import { getListTransactions, getLaneByStation } from '@/api/search'
import { getListStation } from '@/api/weightstation'
import lang from '@/locale/getMessage.js'

const { t } = useI18n()
const emit = defineEmits(['filter'])
const props = defineProps({
  disableFields: {
    type: Array,
    default: () => [],
  },
})

const visiblePopover = ref(false)
const appStore = useAppStore()
const locale = computed(() => lang[appStore.lang])
const searchStore = useSearchStore()
const category = computed(() => {
  return {
    listVehicle: searchStore.listVehicle,
    listAxle: searchStore.listAxle,
    listTypeViolation: searchStore.listTypeViolation,
    listAuditStatus: searchStore.listAuditStatus,
  }
})
const laneList = ref([])
const disableLane = ref(true)
const disableViolation = ref(true)

const defaultFilter = {
  status: null,
  station: null,
  lane: null,
  typeVehicle: null,
  vehicleAxle: null,
  typeViolation: null,
  violation: null,
}

const filter = reactive(cloneDeep(defaultFilter))

const saveFilter = type => {
  if (type === 'reset') {
    for (const key in defaultFilter) {
      filter[key] = defaultFilter[key]
    }
    disableLane.value = true
  }
  visiblePopover.value = false
  emit('filter', filter)
}

const getLaneByStationIds = async stationIds => {
  if (!stationIds) return
  const { data } = await getLaneByStation({ stationIds: [stationIds] })
  laneList.value = data
}

const stationList = ref([])
const getStationList = async () => {
  const { data } = await getListStation({
    keyWord: '',
  })
  if (data) {
    stationList.value = data.map(item => item.weightStation)
  }
}
getStationList()

const keyLane = ref()
keyLane.value = genKey()
const handleStationChange = listStationIds => {
  keyLane.value = genKey()
  if (listStationIds) {
    getLaneByStationIds(listStationIds)
    disableLane.value = false
  } else {
    laneList.value = []
    filter.lane = []
    disableLane.value = true
  }
}
</script>

<style lang="scss" scoped>
.btn-popover {
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e3f2fd;
  border: 1px solid #078ae7;
  color: #078ae7;
  font-weight: 500;
  padding: 6px;
  border-radius: 2px;
  margin-left: 0px;

  svg.svg-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  i {
    font-weight: bold;
    margin-left: 8px;
  }
}
</style>
