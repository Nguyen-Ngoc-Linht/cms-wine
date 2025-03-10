<template>
  <div
    :class="set.classObject"
    class="app-wrapper"
  >
    <div
      class="layout-section"
      :class="set.layoutMod + '-layout'"
    >
      <div
        v-if="set.device === 'mobile' && set.sidebar.opened && set.layoutMod === 'vertical'"
        class="drawer-bg"
        @click="handleClickOutside(false)"
      />
      <SideBar
        class="sidebar-container vertical"
        v-if="set.layoutMod === 'vertical'"
      />

      <div
        class="main-container"
        :class="{ hasTagsView: set.needTagsView }"
      >
        <div :class="{ 'fixed-header': set.fixedHeader }">
          <NavBar :class="set.layoutMod === 'vertical' ? '' : 'sidebar-container horizontal'" />
          <TagsView v-if="set.needTagsView" />
        </div>
        <AppMain :need-tags-view="set.needTagsView" />
        <Settings />
        <IdleCheck v-if="!loadSessionConfig" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  unref,
  reactive,
  computed,
  watch,
  watchEffect,
  onMounted,
  onBeforeMount,
  nextTick,
  getCurrentInstance,
} from 'vue'

import { NavBar, AppMain, SideBar, TagsView, Settings, IdleCheck } from './components'
import { toggleClass } from '@/utils/el'
import { useEventListener } from '@vueuse/core'

import { useRoute } from 'vue-router'
import {
  useAppStore,
  useSettingsStore,
  useUserStore,
  usePermissionStore,
} from '@/store'
import MilestoneConnect from '@/milestone/connect'
import MilestoneConnectTunnel from '@/milestone/connectTunnel'

import { apiSessionConfig } from '@/api/systemconfig'

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const userStore = useUserStore()
const permissionStore = usePermissionStore()
const route = useRoute()

const hiddenMainContainer = 'hidden-main-container'

const set = reactive({
  sidebar: computed(() => {
    return appStore.sidebar
  }),
  device: computed(() => {
    return appStore.device
  }),
  showSettings: computed(() => {
    return settingsStore.showSettings
  }),
  needTagsView: computed(() => {
    return settingsStore.tagsView
  }),
  fixedHeader: computed(() => {
    return settingsStore.fixedHeader
  }),
  classObject: computed(() => {
    const obj = {
      hideSidebar: !set.sidebar.opened,
      openSidebar: !!set.sidebar.opened,
      withoutAnimation: set.sidebar.withoutAnimation,
      mobile: set.device === 'mobile',
    }
    return obj
  }),
  layoutMod: computed(() => {
    return settingsStore.layoutMod
  }),
})

const handleClickOutside = params => {
  appStore.CLOSE_SIDEBAR({ withoutAnimation: params })
}

const WIDTH = ref(992)
const containerHiddenSideBar = ref(false)

const roles = reactive({
  canRead: false,
  canDetail: false,
  canCreate: false,
  canUpdate: false,
  canDelete: false,
  canApprove: false,
  canConfirm: false,
  canExplain: false,
  canExport: false,
  canNotify: false,
})
// TODO sửa check role
const checkRole = (roleDetail = 'canRead', fullPath) => {
  fullPath = fullPath ?? route.path

  if (route.isAdmin) {
    return true
  }

  const { meta } = route
  const permissions = meta.permissions || []
  const listRoleMenu = userStore.roleMenuButtonList
  const permission = permissions[0]

  if (permission) {
    const roleMenu = listRoleMenu.find(item => item.url === permission)
    return roleMenu ? roleMenu[roleDetail] : false
  } else {
    return true
  }
}

const handleCheckRole = () => {
  roles.canRead = checkRole()
  roles.canDetail = checkRole('canDetail')
  roles.canCreate = checkRole('canCreate')
  roles.canUpdate = checkRole('canUpdate')
  roles.canDelete = checkRole('canDelete')
  roles.canApprove = checkRole('canApprove')
  roles.canConfirm = checkRole('canConfirm')
  roles.canExplain = checkRole('canExplain')
  roles.canExport = checkRole('canExport')
  roles.canNotify = checkRole('canNotify')

  permissionStore.SET_ROLE_DATA(roles)
}

const loadSessionConfig = ref(true)
const getSessionConfig = () => {
  const params = {
    method: 'GET',
  }
  apiSessionConfig(params)
    .then(res => {
      appStore.SET_IDLE_TIME(res.data * 60 * 1000)
    })
    .catch(_ => {
      console.error('can get session timeout')
    })
    .finally(_ => {
      loadSessionConfig.value = false
    })
}

watchEffect(() => {
  if (set.device === 'mobile' && !set.sidebar.opened) {
    handleClickOutside(false)
  }
})

watch(
  route,
  async val => {
    handleCheckRole()
    if (set.device === 'mobile' && set.sidebar.opened) {
      handleClickOutside(false)
    }

    // TODO research Milestone
    // if (val?.meta?.useMilestone) {
    //   if (!commonStore.checkConnectMilestone) {
    //     nextTick(() => {
    //       const MilestoneConnectClass = new MilestoneConnect()
    //       MilestoneConnectClass.connectToServer()
    //     })
    //   }
    //   if (!commonStore.checkConnectMilestoneTunnel) {
    //     nextTick(() => {
    //       const MilestoneConnectTunnelClass = new MilestoneConnectTunnel()
    //       MilestoneConnectTunnelClass.connectToServer()
    //     })
    //   }
    // }
  },
  { immediate: true }
)

const $_isMobile = () => {
  const rect = document.body.getBoundingClientRect()
  return rect.width - 1 < WIDTH.value
}

onMounted(() => {
  const isMobile = $_isMobile()
  if (isMobile) {
    appStore.TOGGLE_DEVICE('mobile')
    handleClickOutside(true)
  }
  toggleClass(
    unref(containerHiddenSideBar),
    hiddenMainContainer,
    document.querySelector('.main-container')
  )
})

const $_resizeHandler = () => {
  if (!document.hidden) {
    const isMobile = $_isMobile()
    const currentDevice = isMobile ? 'mobile' : 'desktop'
    appStore.TOGGLE_DEVICE(currentDevice)
    if (isMobile) {
      handleClickOutside(true)
    }
  }
}

onBeforeMount(() => {
  getSessionConfig()
  useEventListener('resize', $_resizeHandler)
})
</script>

<style lang="scss" scoped>
@import '../styles/mixin.scss';
@import '../styles/variables.module.scss';

.app-wrapper {
  @include clearFix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9 !important;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;

  &.main-container {
    width: 100%;
  }
}

.hideSidebar {
  .fixed-header {
    width: calc(100% - #{$sideBarCollapseWidth});
  }

  .horizontal-layout .fixed-header {
    width: 100%;
  }
}

.horizontal-layout .fixed-header,
.mobile .fixed-header {
  width: 100%;
}

.layout-section {
  &.horizontal-layout {
    width: 100%;
    position: relative;
  }
}
</style>
