<template>
  <div class="bg-white">
    <div class="content mb-3">{{ $t('explanationSupport.deleteExplanation') }}</div>
    <hr class="margin-bottom-24" />
    <div class="action">
      <div class="flex justify-end">
        <el-button
          type="default"
          @click="closeDialog"
          class="bg-outline-secondary"
          >{{ $t('configUser.cancel') }}</el-button
        >
        <el-button
          @click="handleDeleteNotifyExplanation()"
          type="primary"
          class="bg--dark-purple"
          style="border: transparent"
          >{{ $t('omsSetting.confirm') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage } from 'element-plus'
import { useExplanationSupportStore } from '@/store'

const { t } = useI18n()
const explanationSupportStore = useExplanationSupportStore()

const props = defineProps({
  explanationId: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['closeDeleteNotify', 'loadData'])
const closeDialog = () => {
  emit('closeDeleteNotify')
}

const handleDeleteNotifyExplanation = () => {
  explanationSupportStore.apiRemoveExplanation(props.explanationId).then(res => {
    if (res.status === 200) {
      ElMessage({
        message: t('omsSetting.deleteSuccess1'),
        type: 'success',
      })
      emit('closeDeleteNotify')
      emit('loadData')
    }
  })
}
</script>

<style lang="scss">
.custom {
  .el-form-item__label {
    color: #525b73;
    font-weight: 600 !important;
  }
}
</style>
