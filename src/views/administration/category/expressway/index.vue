<template>
  <div>
    <div class="content w-full">
      <el-tabs
        v-model="activeName"
        class="tab-expressway"
      >
        <el-tab-pane
          :label="$t('configUser.expresswayManagement')"
          name="expressway"
        >
          <Expressway />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('configUser.manageSupplier')"
          name="supplier"
        >
          <Supplier />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('configUser.stationManagement')"
          name="station"
        >
          <Station />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Expressway from '@/views/administration/category/expressway/expressway.vue'
import Station from '@/views/administration/category/expressway/station.vue'
import { useI18n } from '@/locale'
import Supplier from '@/views/administration/category/expressway/supplier.vue'
const route = useRoute()
const { t } = useI18n()

const activeName = ref('expressway')

onMounted(() => {
  const query = route.query.activeName
  if (query === 'station') {
    activeName.value = 'station'
  } else if (query === 'supplier') {
    activeName.value = 'supplier'
  }
})
</script>

<style lang="scss">
.tab-expressway {
  .el-tabs__item {
    padding: 12px 0px !important;
    min-width: 274px;
    height: 50px;
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
