<template>
  <div class="bg-white mb-[8px] px-[10px] pt-[10px]">
    <div class="title">{{ t('dashboard.warning') }}</div>
    <el-row :gutter="8">
      <template
        v-for="ele in config"
        :key="ele.id"
      >
        <el-col
          :sm="8"
          class="mb-[10px]"
          v-if="ele.type === 'warn1'"
        >
          <div
            class="warn-group"
            @click="goto('sk-abnormal-warning')"
          >
            <div class="num">{{ formatNumber(props.data?.abnormal || 0, '.') }}</div>
            <div class="text">{{ t('dashboard.warnAbnormal') }}</div>
          </div>
        </el-col>
        <el-col
          :sm="8"
          class="mb-[10px]"
          v-if="ele.type === 'warn2'"
        >
          <div
            class="warn-group"
            @click="goto('unusualReconciliation')"
          >
            <div class="num">{{ formatNumber(props.data?.revenueDecline || 0, '.') }}</div>
            <div class="text">{{ t('dashboard.warnRevenue') }}</div>
          </div>
        </el-col>
        <el-col
          :sm="8"
          class="mb-[10px]"
          v-if="ele.type === 'warn3'"
        >
          <div
            class="warn-group"
            @click="goto('standardizeData', 'data')"
          >
            <div class="num">{{ formatNumber(props.data?.fileGatheringError || 0, '.') }}</div>
            <div class="text">{{ t('dashboard.warnCollect') }}</div>
          </div>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import { useI18n } from '@/locale'
import { usePermissionStore, useRouteUser } from '@/store'
import { formatNumber } from '@/utils'
import { useRouter } from 'vue-router'
import { getObjectValueNotNull } from '@/utils/filter'

const router = useRouter()
const { roleData } = usePermissionStore()
const { t } = useI18n()
const props = defineProps({
  config: {
    type: Object,
    default: () => {},
  },
  data: {
    type: Object,
    default: () => {},
  },
  filter: {
    type: Object,
    default: () => {},
  },
})
const goto = (name, tabs) => {
  const query = getObjectValueNotNull({
    route: props.filter.route,
    station: props.filter.station,
    tabs,
  })
  router.push({
    name,
    query,
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.module.scss';
.title {
  color: $menuText;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 8px;
}

.warn-group {
  display: flex;
  width: 100%;
  height: 100px;
  gap: 5%;
  align-items: center;
  background: #fff;
  border: 1px solid #ebebec;
  border-radius: 2px;
  padding: 0 10px;
}

.num {
  font-weight: 600;
  font-size: 16px;
  width: 100px;
  text-align: center;
  color: #fd8312;
  cursor: pointer;
}

.text {
  color: $menuText;
  font-weight: 600;
}
</style>
