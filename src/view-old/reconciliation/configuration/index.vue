<script setup>
import ReconciliationTransaction from '@/views/reconciliation/configuration/components/reconciliation-transaction.vue'
import ReconciliationFreeVehicle from '@/views/reconciliation/configuration/components/reconciliation-free-vehicle.vue'
import ConfigAlert from '@/views/reconciliation/configuration/components/config-alert.vue'
import { useI18n } from '@/locale'
import { useUserStore } from '@/store'
import { ref } from 'vue'

const { t } = useI18n()
const userStore = useUserStore()
const activeName = ref('transaction')

defineOptions({
  name: 'ReconciliationConfiguration',
})
</script>

<template>
  <div class="content w-full">
    <el-tabs
      class="tab-be-collection"
      v-model="activeName"
    >
      <el-tab-pane
        :label="t('reconciliation.transactionReconciliation')"
        name="transaction"
      >
        <ReconciliationTransaction />
      </el-tab-pane>
      <el-tab-pane
        :label="t('reconciliation.reconciliationFreeVehicle')"
        name="free-vehicle"
      >
        <ReconciliationFreeVehicle />
      </el-tab-pane>
      <el-tab-pane
        :label="t('reconciliation.configAlert')"
        name="config-alert"
      >
        <ConfigAlert />
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
