<template>
  <UserForm :is-create="true" />
</template>
<script setup>
import UserForm from './components/user-form.vue'
defineOptions({
  name: 'AddUser',
})
</script>

<style lang="scss" scoped></style>
