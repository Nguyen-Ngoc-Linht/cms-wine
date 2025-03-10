<template>
  <FormKPIDetail :is-create="true"></FormKPIDetail>
</template>
<script setup>
import FormKPIDetail from '@/views/statistical-report/KPI-detail/FormKPIDetail.vue'

defineOptions({
  name: 'CreateKPIDetail',
})
</script>

<style lang="scss" scoped></style>
