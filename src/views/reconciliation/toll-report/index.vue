<template>
  <el-tabs
    v-model="activeTabs"
    class="config-tabs"
    :class="{ 'hide-header': !roleData.canExport }"
    @tab-change="handleChangeTabs"
  >
    <el-tab-pane
      :label="t('reconciliation.reconc')"
      name="data"
      v-if="roleData.canRead"
    >
      <ReconciliationData />
    </el-tab-pane>
    <el-tab-pane
      :label="t('reconciliation.reconcReport')"
      name="report"
    >
      <ReconciliationReport />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { useI18n } from '@/locale'
import { onBeforeMount, ref } from 'vue'
import ReconciliationData from './components/data.vue'
import ReconciliationReport from './components/report.vue'
import { useRoute } from 'vue-router'
import { usePermissionStore } from '@/store'

const route = useRoute()
const { roleData } = usePermissionStore()
const { t } = useI18n()

const activeTabs = ref(null)

const handleChangeTabs = activeName => {
  // Get the current URL
  const url = new URL(window.location.href)

  // Update or add the query parameter
  url.searchParams.set('tabs', activeName)
  window.history.replaceState({}, '', url)
}
onBeforeMount(() => {
  const tabs = route.query.tabs
  activeTabs.value = tabs || 'data'
})

defineOptions({
  name: 'tollReconc',
})
</script>

<style lang="scss" scoped>
:deep(.el-tabs__header) {
  margin: 0;
  background: #f8f8f8;
}

:deep(.el-tabs__active-bar) {
  background-color: #059efb;
  min-width: 250px;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: #cdcdce;
}

:deep(.el-tabs__item) {
  padding: 0px;
  min-width: 250px;
  text-align: center;
  text-transform: uppercase;

  &.is-active {
    background-color: #ffffff;
    color: #059efb;
    font-weight: 700;
  }
}

.hide-header :deep(.el-tabs__header) {
  display: none;
}
</style>
