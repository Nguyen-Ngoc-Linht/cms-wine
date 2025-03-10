<template>
  <div>
    <router-view></router-view>
    <IdleCheck v-if="!loadSessionConfig" />
  </div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { IdleCheck } from './components'
import { useAppStore } from '@/store'

import { apiSessionConfig } from '@/api/systemconfig'

const appStore = useAppStore()
const loadSessionConfig = ref(true)
const getSessionConfig = () => {
  const params = {
    method: 'GET',
  }
  apiSessionConfig(params)
    .then(res => {
      appStore.SET_IDLE_TIME(res.data * 60 * 1000)
    })
    .catch(_ => {
      console.error('can get session timeout')
    })
    .finally(_ => {
      loadSessionConfig.value = false
    })
}
onBeforeMount(() => {
  getSessionConfig()
})
</script>

<style scoped></style>
