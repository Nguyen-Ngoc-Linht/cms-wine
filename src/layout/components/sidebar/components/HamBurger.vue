<template>
  <div
    class="toggle-menu-section gap"
    @click="toggleClick"
  >
    <svg-icon
      icon-class="toggle-menu"
      class-name="toggle-menu "
      :class="{ 'is-active': props.isActive }"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['toggleClick'])

const toggleClick = () => {
  emit('toggleClick')
}

defineOptions({
  name: 'HamBurger',
})
</script>

<style scoped lang="scss">
.toggle-menu-section {
  .toggle-menu {
    display: inline-block;
    vertical-align: middle;
    font-size: 20px;
  }
}
</style>
