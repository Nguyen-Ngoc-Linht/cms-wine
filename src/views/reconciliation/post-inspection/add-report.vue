<template>
  <ReportForm :is-create="true" />
</template>

<script setup>
import ReportForm from './components/reportForm.vue'

defineOptions({
  name: 'AddReportPostInspection',
})
</script>

<style scoped></style>
