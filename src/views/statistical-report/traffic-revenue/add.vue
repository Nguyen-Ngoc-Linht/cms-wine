<template>
  <FormTrafficRevenue :isCreate="true"></FormTrafficRevenue>
</template>
<script setup>
import FormTrafficRevenue from '@/views/statistical-report/traffic-revenue/FormTrafficRevenue.vue'

defineOptions({
  name: 'AddTrafficRevenue',
})
</script>

<style lang="scss" scoped></style>
