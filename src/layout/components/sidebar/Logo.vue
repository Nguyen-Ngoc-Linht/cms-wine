<template>
  <div class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <div
        v-if="props.collapse"
        key="collapse"
        :title="title"
        class="sidebar-logo-link cursor-pointer"
      >
        <svg-icon
          icon-class="logo-vec"
          class="sidebar-logo !mr-0"
          @click="toggleSideBar"
        />
      </div>

      <div
        v-else
        key="expand"
        :title="title"
        class="sidebar-logo-link !text-left padding-left-16 cursor-pointer"
        @click="goHome"
      >
        <svg-icon
          icon-class="logo-vec"
          class="sidebar-logo"
        />
        <span class="sidebar-title fs-16">{{ title }} </span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import logo from '@/assets/imgs/logo2.png'
import { useAppStore } from '@/store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = ref('GSTP')

const props = defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
})

const appStore = useAppStore()
const toggleSideBar = () => {
  appStore.TOGGLE_SIDEBAR()
}
const goHome = () => {
  router.push('/')
}

defineOptions({
  name: 'SidebarLogo',
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.module.scss';

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 48px;
  line-height: 48px;
  background: $menuActiveText;
  text-align: center;
  overflow: hidden;

  .sidebar-logo-link {
    height: 100%;
    width: 100%;

    .sidebar-logo {
      width: 28px;
      height: 28px;
      vertical-align: middle;
      margin-right: 12px;
      display: inline-block;
    }

    .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 48px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
</style>
