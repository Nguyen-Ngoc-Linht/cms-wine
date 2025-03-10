<template>
  <RoleForm :is-create="true" />
</template>

<script setup>
import RoleForm from './components/role-form.vue'

defineOptions({
  name: 'AddRole',
})
</script>

<style scoped></style>
