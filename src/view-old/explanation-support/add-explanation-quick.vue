<script setup>
import ExplanationForm from '@/views/explanation-support/components/form-explanation.vue'
defineOptions({
  name: 'AddExplanationQuick',
})
</script>

<template>
  <explanation-form :is-create-quick="true" />
</template>

<style scoped lang="scss"></style>
