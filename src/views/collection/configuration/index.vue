<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import { useUserStore, useRouteUser } from '@/store'
import ConfigTimeSaveLogFile from '@/views/collection/components/ConfigTimeSaveLogFile.vue'
import ConfigApiVehicle from '@/views/collection/components/ConfigApiVehicle.vue'
import ConfigTimeDelete from '@/views/collection/components/ConfigTimeDelete.vue'
const { t } = useI18n()
const userStore = useUserStore()
const activeName = ref('Signal')

defineOptions({
  name: 'CollectionConfiguration',
})
</script>

<template>
  <div class="content w-full">
    <el-tabs
      class="tab-be-collection"
      v-model="activeName"
    >
      <el-tab-pane
        :label="t('route.collectionConfiguration')"
        name="Signal"
      >
        <ConfigTimeSaveLogFile />
      </el-tab-pane>
      <!--      <el-tab-pane-->
      <!--        :label="t('collection.configureDeviceLogfile')"-->
      <!--        name="Device"-->
      <!--      >-->
      <!--        <ConfigTimeSaveLogFile :dataType="2"/>-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane-->
      <!--        :label="t('collection.configureBELogfile')"-->
      <!--        name="BE"-->
      <!--      >-->
      <!--        <ConfigTimeSaveLogFile :dataType="4"/>-->
      <!--      </el-tab-pane>-->
      <el-tab-pane
        :label="t('collection.apiConfig')"
        name="Api"
      >
        <ConfigApiVehicle :dataType="5" />
      </el-tab-pane>
      <!--      <el-tab-pane-->
      <!--        :label="t('collection.configTimeDelete')"-->
      <!--        name="TimeDelete"-->
      <!--      >-->
      <!--        <ConfigTimeDelete />-->
      <!--      </el-tab-pane>-->
      <!--      <el-tab-pane-->
      <!--        :label="t('collection.configFreeVehicle')"-->
      <!--        name="Vehicle"-->
      <!--      >-->
      <!--        <ConfigApiVehicle :dataType="6"/>-->
      <!--      </el-tab-pane>-->
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
