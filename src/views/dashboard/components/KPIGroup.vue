<template>
  <div
    class="bg-white mb-[8px] px-[10px] pt-[10px]"
    :id="props.type"
  >
    <div class="flex items-center relative">
      <div class="title">{{ props.title }}</div>
      <div class="custom-pagination"></div>
    </div>
    <swiper
      :modules="modules"
      :space-between="8"
      :pagination="pagination"
      :slides-per-view="1"
      loop
      :autoplay="autoplay"
    >
      <swiper-slide
        v-for="(item, idx) in data"
        :key="idx"
      >
        <el-row :gutter="8">
          <template
            v-for="ele in config"
            :key="ele.id"
          >
            <el-col
              :sm="12"
              :lg="6"
              class="mb-[10px]"
              v-if="ele.type === 'kpi1'"
            >
              <ChartGauge
                :title="t('dashboard.rateRecognizeVehicle')"
                :data="item.successfulChargeRate"
              />
            </el-col>
            <el-col
              :sm="12"
              :lg="6"
              class="mb-[10px]"
              v-if="ele.type === 'kpi2'"
            >
              <ChartGauge
                :title="t('dashboard.rateRecognizeEtag')"
                :data="item.etcReadingSuccessRate"
              />
            </el-col>
            <el-col
              :sm="12"
              :lg="6"
              class="mb-[10px]"
              v-if="ele.type === 'kpi3'"
            >
              <ChartGauge
                :title="t('dashboard.rateRecognizePlate')"
                :data="item.plateRecognitionRate"
              />
            </el-col>
            <el-col
              :sm="12"
              :lg="6"
              class="mb-[10px]"
              v-if="ele.type === 'kpi4'"
            >
              <ChartGauge
                :title="t('dashboard.systemKPI')"
                :data="item.systemKpi"
              />
            </el-col>
          </template>
        </el-row>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import ChartGauge from './ChartGauge.vue'

import { useI18n } from '@/locale'
import { usePermissionStore, useRouteUser } from '@/store'

const { roleData } = usePermissionStore()
const { t } = useI18n()
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  routeId: {
    type: [String, Number, null],
    default: null,
  },
  config: {
    type: Object,
    default: () => {},
  },
  data: {
    type: Object,
    default: () => {},
  },
})
const modules = [Pagination, Autoplay]
const pagination = {
  clickable: true,
  el: `#${props.type} .custom-pagination`,
  dynamicBullets: true,
  renderBullet: function (index, className) {
    return `<span class="${className}">${
      data.value[index].routeName || t('dashboard.allRoute')
    }</span>`
  },
}

const data = computed(() => {
  if (props.data?.average) {
    if (props.routeId) {
      return props.data.average ? [props.data.average] : []
    } else {
      return [props.data.average, ...props.data.list]
    }
  }
  return [
    {
      successfulChargeRate: 0,
      etcReadingSuccessRate: 0,
      plateRecognitionRate: 0,
      systemKpi: 0,
    },
  ]
})
const autoplay = {
  delay: 5000,
  speed: 800,
  disableOnInteraction: false,
}

const kpiData = ref({})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.module.scss';
.title {
  color: $menuText !important;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 8px;
}

.custom-pagination {
  position: relative;
  height: 32px;
  left: unset !important;
  top: unset !important;
  bottom: unset !important;
  transform: none !important;
  margin-left: 10px;
}

.custom-pagination :deep(.swiper-pagination-bullet) {
  position: absolute;
  display: inline-block;
  top: 0 !important;
  left: 0 !important;
  transform: none;
  width: unset;
  height: unset;
  padding: 0 8px;
  border: 1px solid #0c98f5;
  border-radius: 20px;
  opacity: 0;
  background: #e3f2fd;
  color: #0c98f5;
  transition: opacity 0.25s ease-in-out !important;
}

.custom-pagination :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
}
</style>
