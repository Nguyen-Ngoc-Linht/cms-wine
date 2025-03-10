<template>
  <div class="content w-full">
    <el-tabs
      class="tab-be-collection"
      v-model="activeName"
    >
      <el-tab-pane
        :label="t('collection.deviceLogfileList')"
        name="listData"
      >
        <ListCollectionLogFile :typeFileLog="2" />
      </el-tab-pane>
      <el-tab-pane
        :label="t('collection.configureDeviceLogfile')"
        name="parameter"
      >
        <ConfigTimeSaveLogFile :dataType="1" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import { useUserStore, useRouteUser } from '@/store'
import ListCollectionLogFile from '@/views/collection/components/ListCollectionLogFile.vue'
import ConfigTimeSaveLogFile from '@/views/collection/components/ConfigTimeSaveLogFile.vue'
const { t } = useI18n()
const userStore = useUserStore()
const activeName = ref('listData')

defineOptions({
  name: 'CollectionLogfileDevice',
})
</script>

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
      color: #059efb;
    }
  }

  .el-tabs__active-bar {
    background-color: #059efb;
  }
}
</style>
