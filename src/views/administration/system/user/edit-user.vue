<template>
  <UserForm :is-edit="true" />
</template>
<script setup>
import UserForm from './components/user-form.vue'

defineOptions({
  name: 'EditUser',
})
</script>

<style lang="scss" scoped></style>
