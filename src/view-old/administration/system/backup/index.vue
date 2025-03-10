<template>
  <div>
    <el-tabs
      v-model="activeTabs"
      class="config-tabs"
    >
      <el-tab-pane
        :label="t('administration.backup.configBackup')"
        name="config"
      >
        <BackupConfig />
      </el-tab-pane>
      <el-tab-pane
        :label="t('administration.backup.historyBackup')"
        name="history"
      >
        <BackupHistory />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import { useAppStore, usePermissionStore } from '@/store'
import moment from 'moment/moment'
import { formatDateTime } from '@/utils/date'
import lang from '@/locale/getMessage.js'
import Pagination from '@/components/Pagination'
import BackupConfig from './components/config.vue'
import BackupHistory from './components/history.vue'

const appStore = useAppStore()
const locale = computed(() => lang[appStore.lang])

const { roleData } = usePermissionStore()

const { t } = useI18n()
const activeTabs = ref('config')

defineOptions({
  name: 'BackupManager',
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
