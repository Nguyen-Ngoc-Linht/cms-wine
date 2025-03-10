<script setup>
import ExplanationForm from '@/views/explanation-support/components/form-explanation.vue'
defineOptions({
  name: 'AddExplanationReport',
})
</script>

<template>
  <explanation-form :is-create-report="true" />
</template>

<style scoped lang="scss"></style>
