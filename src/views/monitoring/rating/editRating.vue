<template>
  <FormRating :isEdit="true" />
</template>
<script setup>
import FormRating from '@/views/monitoring/rating/FormRating.vue'

defineOptions({
  name: 'EditRating',
})
</script>

<style lang="scss" scoped></style>
