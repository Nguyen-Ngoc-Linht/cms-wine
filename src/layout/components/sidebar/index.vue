<template>
  <div :class="{ 'has-logo': set.showLogo }">
    <Logo
      v-if="set.showLogo"
      :class="set.layoutMod + '-logo'"
      :collapse="set.isCollapse"
    />
    <HamBurger
      v-show="set.layoutMod === 'vertical' && set.sidebar.opened"
      id="hamburger-container"
      :is-active="set.sidebar.opened"
      class="hamburger-container !m-0 animated-element"
      @toggle-click="toggleSideBar"
    />
    <el-scrollbar wrap-class="scrollbar-wrapper paddingX-8 padding-top-16">
      <Menu />
      <div
        :class="{ active: !set.isCollapse }"
        class="logo-sidebar"
      >
        <span v-if="!set.isCollapse">2025 &copy; Design by Joy Plus</span>
<!--        <img src="@/assets/imgs/logo_elcom.png" />-->
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useAppStore, useSettingsStore } from '@/store'
import HamBurger from './components/HamBurger'
import Logo from './Logo'
import Menu from './Menu'

const appStore = useAppStore()
const settingsStore = useSettingsStore()

const toggleSideBar = () => {
  appStore.TOGGLE_SIDEBAR()
}

const set = reactive({
  showLogo: computed(() => {
    return settingsStore.sidebarLogo
  }),
  layoutMod: computed(() => {
    return settingsStore.layoutMod
  }),
  isCollapse: computed(() => {
    return !appStore.sidebar.opened
  }),
  sidebar: computed(() => {
    return appStore.sidebar
  }),
})
</script>

<style scoped lang="scss">
.horizontal-logo {
  width: 210px;
  display: flex;
}
.hamburger-container {
  position: fixed;
  left: 240px;
  top: 0;
  line-height: 46px;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animated-element {
  animation: fadeIn 0.5s ease-in-out;
}
.logo-sidebar {
  transition: 0.3s;
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  justify-content: center;
  width: 54px;
  height: 34px;
  align-items: center;
  border-top: 1px solid #bdc4d8;
  background: white;
  color: #99a2bc;
  span {
    font-size: 12px;
  }
  img {
    width: 50px;
    object-fit: contain;
  }
}
.logo-sidebar.active {
  width: 250px;
  img {
    width: 50px;
    object-fit: contain;
    margin-left: 5px;
  }
}
</style>

<style>
#app .sidebar-container .el-sub-menu .nest-menu .el-menu-item {
  margin: 6px 0px !important;
}
</style>
