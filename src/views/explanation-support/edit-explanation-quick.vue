<script setup>
import ExplanationForm from '@/views/explanation-support/components/form-explanation.vue'
defineOptions({
  name: 'EditExplanationQuick',
})
</script>

<template>
  <explanation-form :is-edit-quick="true" />
</template>

<style scoped lang="scss"></style>
