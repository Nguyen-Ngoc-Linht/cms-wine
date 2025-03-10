<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import { useUserStore, useRouteUser } from '@/store'
import WarningCollected from '@/views/collection/standardize-data/components/warning-collected.vue'
import ResultData from '@/views/collection/standardize-data/components/result-data.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useI18n()
const userStore = useUserStore()
const activeName = ref('warning')

const handleChangeTabs = activeName => {
  // Get the current URL
  const url = new URL(window.location.href)

  // Update or add the query parameter
  url.searchParams.set('tabs', activeName)
  window.history.replaceState({}, '', url)
}

onMounted(() => {
  const tab = route.query.tabs
  if (tab && ['warning', 'data'].includes(tab)) {
    activeName.value = tab
  }
})

defineOptions({
  name: 'standardize-data',
})
</script>

<template>
  <div class="content w-full">
    <el-tabs
      class="tab-be-collection"
      v-model="activeName"
      @tabChange="handleChangeTabs"
    >
      <el-tab-pane
        :label="t('collection.resultDataCollection')"
        name="warning"
      >
        <WarningCollected />
      </el-tab-pane>
      <el-tab-pane
        :label="t('collection.warningCollected')"
        name="data"
      >
        <ResultData />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss">
.tab-be-collection {
  .el-tabs__item {
    padding: 12px 0px !important;
    min-width: 320px;
    height: 45px;
    font-size: 14px;
    line-height: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    list-style: none;
    font-weight: 500;
    color: #76809b;
    background-color: #ebebec;
    border-bottom: 2px solid #cdcdce;
    position: relative;

    &.is-active {
      background-color: white;
      color: #292663;
    }
  }

  .el-tabs__active-bar {
    background-color: #292663;
  }
}
</style>
