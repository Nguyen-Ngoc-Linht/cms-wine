<template>
  <ReportForm :is-view="true" />
</template>

<script setup>
import ReportForm from './components/reportForm.vue'

defineOptions({
  name: 'EditReportPostInspection',
})
</script>

<style scoped></style>
