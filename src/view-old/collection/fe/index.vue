<template>
  <el-tabs
    v-model="activeTabs"
    class="config-tabs"
  >
    <el-tab-pane
      :label="t('collection.logfileList')"
      name="data"
    >
      <LogfileList />
    </el-tab-pane>
    <el-tab-pane
      :label="t('collection.apiConfig')"
      name="config"
    >
      <LogfileConfig />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '@/locale'
import LogfileList from './components/logfìle-list.vue'
import LogfileConfig from './components/config.vue'

const { t } = useI18n()
const activeTabs = ref('data')

defineOptions({
  name: 'FE',
})
</script>

<style lang="scss" scoped>
:deep(.el-tabs__header) {
  margin: 0;
}
:deep(.el-tabs__active-bar) {
  background-color: #059efb;
  min-width: 250px;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: #cdcdce;
}

:deep(.el-tabs__item) {
  padding: 10px 0px;
  height: 45px;
  min-width: 250px;
  text-align: center;
  color: #76809b;
  background-color: #ebebec;
  border-bottom: 2px solid #cdcdce;

  &.is-active {
    background-color: #ffffff;
    color: #059efb;
    font-weight: 700;
  }
}
</style>
