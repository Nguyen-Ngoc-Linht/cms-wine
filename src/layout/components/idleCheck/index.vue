<template>
  <div></div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useIdle, useTimestamp } from '@vueuse/core'
import { ElMessageBox } from 'element-plus'
import { useI18n } from '@/locale'
import { useAppStore, useUserStore } from '@/store'

const { t } = useI18n()

const appStore = useAppStore()
const userStore = useUserStore()

const { idle, lastActive } = useIdle(appStore.idleTime)
const showAlert = ref(false)

watch(idle, newValue => {
  if (newValue && !showAlert.value) {
    showAlert.value = true
    ElMessageBox.alert(t('configUser.sessionTimeoutNotify'), t('el.messagebox.title'), {
      confirmButtonText: t('omsSetting.confirm'),
      confirmButtonClass: 'el-button--main',
      buttonSize: 'default',
      callback: () => {
        userStore.CLEAR_VERIFY()
        window.location.reload()
      },
    })
  }
})

defineOptions({
  name: 'IdleCheck',
})
</script>

<style scoped></style>
