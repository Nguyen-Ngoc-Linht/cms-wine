<template>
  <div>
    <div class="content w-full">
      <el-tabs
        v-model="activeName"
        class="tab-expressway"
      >
        <el-tab-pane
          label="Điều khoản"
          name="clause"
          lazy
        >
          <clause />
        </el-tab-pane>
        <el-tab-pane
          label="Nội quy chung"
          name="generalRule"
          lazy
        >
          <general-rule />
        </el-tab-pane>
        <el-tab-pane
          label="Chính sách bảo mật"
          name="privacyPolicy"
          lazy
        >
          <privacy />
        </el-tab-pane>
        <el-tab-pane
          label="Chính sách hoàn trả"
          name="refundCancel"
          lazy
        >
          <refund-cancel />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/locale'
import Clause from '@/views/system/component/clause.vue'
import GeneralRule from '@/views/system/component/generalRule.vue'
import Privacy from '@/views/system/component/privacy.vue'
import RefundCancel from '@/views/system/component/refundCancel.vue'
const route = useRoute()
const { t } = useI18n()

const activeName = ref('clause')

onMounted(() => {
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
