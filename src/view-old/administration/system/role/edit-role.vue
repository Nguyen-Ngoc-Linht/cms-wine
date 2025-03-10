<template>
  <RoleForm :is-edit="true" />
</template>

<script setup>
import RoleForm from './components/role-form.vue'

defineOptions({
  name: 'EditRole',
})
</script>

<style scoped></style>
