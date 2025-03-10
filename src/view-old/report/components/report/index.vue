<template>
  <div class="paddingX-24 padding-top-8">
    <el-select
      v-model="reportName"
      class="width-450"
      @change="handleChangeReport"
    >
      <el-option
        v-for="item in listReport"
        :key="item.value"
        :label="t(item.label)"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <div class="padding-top-8">
      <component :is="componentId"></component>
    </div>
  </div>
</template>

<script setup>
import { computed, markRaw, ref } from 'vue'
import SummaryViolation from './SummaryViolation'
import SummaryWeighingStation from './SummaryWeighingStation'
import VehiclePassingStation from './VehiclePassingStation'
import VehiclePassingLane from './VehiclePassingLane'
import { useI18n } from '@/locale'

const { t } = useI18n()
const listReport = ref([
  {
    label: 'report.violationSummaryReport',
    value: 'SummaryViolation',
    component: markRaw(SummaryViolation),
  },
  {
    label: 'report.weighStationSummaryReport',
    value: 'SummaryWeighingStation',
    component: markRaw(SummaryWeighingStation),
  },
  {
    label: 'report.vehiclesPassingStationReport',
    value: 'VehiclePassingStation',
    component: markRaw(VehiclePassingStation),
  },
  {
    label: 'report.vehiclesPassingLaneReport',
    value: 'VehiclePassingLane',
    component: markRaw(VehiclePassingLane),
  },
])

const componentId = computed(() => {
  const res = listReport.value.find(v => v.value === reportName.value)
  return res ? res.component : SummaryViolation
})
const reportName = ref('SummaryViolation')
const handleChangeReport = () => {}

defineOptions({
  name: 'Report',
})
</script>

<style lang="scss" scoped></style>
