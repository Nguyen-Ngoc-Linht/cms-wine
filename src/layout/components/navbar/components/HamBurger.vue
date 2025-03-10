<template>
  <div
    class="hamburger-section m-0"
    @click="toggleClick"
  >
    <svg-icon
      icon-class="toggle-menu"
      class-name="hamburger"
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
.hamburger-section {
  margin: 0 15px;
  .hamburger {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }

  .hamburger {
    transform: rotate(0deg);
  }
}
</style>
