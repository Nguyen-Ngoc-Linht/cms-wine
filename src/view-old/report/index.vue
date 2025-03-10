<template>
  <!-- <el-tabs v-model="activeTabs">
    <el-tab-pane
      :label="$t('report.overview')"
      name="overview"
    >
      <Overview />
    </el-tab-pane>
    <el-tab-pane
      :label="$t('report.report')"
      name="report"
    > -->
  <Report />
  <!-- </el-tab-pane>
  </el-tabs> -->
</template>

<script setup>
import { ref } from 'vue'
import Overview from './components/overview'
import Report from './components/report'

const activeTabs = ref('report')
defineOptions({
  name: 'Report',
})
</script>
<style lang="scss" scoped>
:deep(.el-tabs__header) {
  margin: 0;
  background-color: #ffffff;
}
:deep(.el-tabs__item) {
  padding: 0px;
  min-width: 250px;
  text-align: center;
  &.is-active {
    background-color: #ffffff;
    color: #0078d4;
  }
}
</style>
