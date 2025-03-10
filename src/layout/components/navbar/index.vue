<template>
  <div
    class="navbar padding-left-35"
    :class="set.layoutMod + '-nav-section'"
  >
    <div
      v-if="set.layoutMod === 'horizontal'"
      class="horizontal-sidebar-container"
    >
      <Logo
        :class="set.layoutMod + '-logo'"
        :collapse="set.isCollapse"
      />
      <!--      <MenuBar/>-->
    </div>

    <BreadCrumb
      v-if="set.layoutMod === 'vertical'"
      id="breadcrumb-container"
      class="breadcrumb-container"
    />

    <div
      class="right-menu"
      :class="{ mobile: set.device === 'mobile' }"
    >
      <!-- <LangSelect class="p8 hover-effect" /> -->
      <!--      <MenuBar />-->
      <Notify />
      <el-dropdown
        class="padding-right-14 avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <div class="username">
            {{ set.userName }}
          </div>
          <img
            :src="set.avatar + '?imageView2/1/w/80/h/80'"
            class="user-avatar"
          />
          <!-- <el-icon class="arrow">
            <ArrowDown />
          </el-icon> -->
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goProfile()">
              <span style="display: block">{{ t('app.profile') }}</span>
            </el-dropdown-item>
            <el-dropdown-item @click="showDialogCensorship = true">
              <span style="display: block">{{ t('app.version') }}</span>
            </el-dropdown-item>
            <el-dropdown-item @click="showDialogChangePassword = true">
              <span style="display: block">{{
                t('configUser.userManagement.changePassword')
              }}</span>
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <span style="display: block">{{ t('app.logOut') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <Dialog
        top="24vh"
        width="589"
        :title="t('aboutUs.infoVesion')"
        :show="showDialogCensorship"
        @closeDialog="handleCloseCensorship"
        :append-to-body="true"
        style="font-weight: 500 !important"
      >
        <template v-slot:content>
          <About />
        </template>
      </Dialog>
      <Dialog
        top="24vh"
        width="480"
        :title="t('configUser.userManagement.changePassword')"
        :show="showDialogChangePassword"
        @closeDialog="handleCloseChangePassword"
        :append-to-body="true"
        style="font-weight: 500 !important"
      >
        <template v-slot:content>
          <ChangePassword @closeChangePassword="handleCloseChangePassword" />
        </template>
      </Dialog>
      <Dialog
        top="24vh"
        width="480"
        :title="t('route.notify')"
        :show="showDialogCheckAccountLock"
        @closeDialog="handleCloseCheckAccountLock"
        :append-to-body="true"
        style="font-weight: 500 !important"
      >
        <template v-slot:content>
          <p>
            Đã quá {{ limitTime }} ngày, bạn nên đổi mật khẩu để nâng cao bảo mật cho tài khoản của
            bạn
          </p>
          <div class="foot flex justify-end">
            <el-button
              style="background-color: #fff; border-color: #7c7e81; color: #7c7e81"
              class="border-1 paddingX-10"
              @click="handleCloseCheckAccountLock"
              type="info"
              >{{ $t('monitoring.toll.cancel') }}</el-button
            >
            <el-button
              style="background-color: #292663; border: none"
              class="border-1 paddingX-30"
              @click="handleShowDialogChangePassword"
              type="success"
              >{{ $t('configUser.userManagement.changePassword') }}
            </el-button>
          </div>
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '@/locale'
import { ref, reactive, computed, onMounted } from 'vue'
import { useAppStore, useUserStore, useSettingsStore } from '@/store'
import { useRouter } from 'vue-router'
import { LIST_APP_CONFIG } from '@/settings'
import BreadCrumb from './components/BreadCrumb'
import Notify from '@/views/notify/bell'
import Dialog from '@/components/Dialog'
import About from './components/About'

import Logo from '@/layout/components/sidebar/Logo'
import ChangePassword from '@/layout/components/navbar/components/ChangePassword.vue'
import { checkAccountChangePass, getPasswordTimePolicy } from '@/api/user'

const { t } = useI18n()

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

const showDialogCensorship = ref(false)
const handleCloseCensorship = () => {
  showDialogCensorship.value = false
}
const showDialogChangePassword = ref(false)
const handleCloseChangePassword = () => {
  showDialogChangePassword.value = false
}
const showDialogCheckAccountLock = ref(false)
const handleCloseCheckAccountLock = () => {
  showDialogCheckAccountLock.value = false
}
const limitTime = ref(0)

const set = reactive({
  showLogo: computed(() => {
    return settingsStore.sidebarLogo
  }),
  layoutMod: computed(() => {
    return settingsStore.layoutMod
  }),
  sidebar: computed(() => {
    return appStore.sidebar
  }),
  avatar: computed(() => {
    return userStore.avatar
  }),
  userName: computed(() => {
    return userStore.name
  }),
  device: computed(() => {
    return appStore.device
  }),
})

onMounted(() => {
  const loginOne = localStorage.getItem('loginOne')
  if (!loginOne) {
    handleCheckAccountChangePassword()
  }
})

const logout = async () => {
  localStorage.removeItem('loginOne')
  await userStore.LOGIN_OUT()
}
const goProfile = () => {
  router.push({
    name: 'profile',
  })
}
const handleCheckAccountChangePassword = async () => {
  await checkAccountChangePass({
    userId: userStore.uuid,
  }).then(res => {
    if (res.status === 0) {
      getTime()
      showDialogCheckAccountLock.value = true
      localStorage.setItem('loginOne', 1)
    }
  })
}
const getTime = async () => {
  await getPasswordTimePolicy()
    .then(res => {
      if (res.data) {
        limitTime.value = res.data.passwordReminder
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const handleShowDialogChangePassword = () => {
  showDialogCheckAccountLock.value = false
  showDialogChangePassword.value = true
}
defineOptions({
  name: 'NavBar',
})
</script>

<style lang="scss" scoped>
.navbar {
  height: 48px;
  overflow: hidden;
  position: relative;
  background: #059efb;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  // background-image: url('../../../assets/imgs/bg-nav.png');
  background-size: cover;
  background-position: right;
  display: flex;
  justify-content: space-between;

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    height: 100%;
    display: flex;
    min-width: 280px;
    align-items: center;
    color: #000000d9;
    justify-content: flex-end;
    padding-right: 10px;

    .icons {
      height: 100%;
      line-height: 48px;
      display: inline-block;
    }

    &:focus {
      outline: none;
    }

    .hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .p8 {
      padding: 0 8px;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
    }

    .avatar-container {
      margin-right: 0px;

      .avatar-wrapper {
        vertical-align: middle;
        margin-top: 4px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          vertical-align: middle;
          display: inline-block;
        }

        .username {
          padding-right: 12px;
          padding-left: 12px;
          vertical-align: middle;
          display: inline-block;
          font-size: 14px;
          position: relative;
          color: #ffffff;
        }

        .arrow {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 0;
          font-size: 12px;
        }
      }
    }

    .el-icon-setting {
      font-size: 16px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .setting {
        color: #000;
      }
    }
  }

  &.horizontal-nav-section {
    height: 48px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;

    .horizontal-sidebar-container {
      flex: 1 1;
      min-width: 0;
      height: 48px;
      background: rgba(0, 0, 0, 0.2);
      position: relative !important;
      align-items: center;

      .horizontal-logo {
        float: left;
        width: 210px;
      }

      .sidebar-menus {
        float: left;
        width: calc(100% - 210px) !important;
      }

      :deep(.el-menu) {
        .el-menu-item,
        .submenu-title-noDropdown,
        .el-sub-menu__title {
          height: 48px;
          line-height: 48px;
        }
      }
    }

    .right-menu {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      /*min-width: 690px;*/
      color: #fff;

      :deep(.header-search) {
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }

      :deep(.svg-icon) {
        color: #fff;
      }

      .icons {
        color: #fff;
      }

      .hover-effect {
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }

      .right-menu-item {
        color: #fff;
      }

      .el-icon-setting {
        .setting {
          color: #fff;
        }
      }
    }
  }
}
</style>
