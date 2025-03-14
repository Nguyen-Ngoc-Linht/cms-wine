<template>
  <div class="settings-container">
    <el-drawer
      :size="315"
      v-model="showSettings"
      direction="rtl"
      :append-to-body="false"
      :close-on-click-modal="true"
    >
      <template #header>
        <h4 class="drawer-title">Project configuration</h4>
      </template>
      <template #default>
        <div>
          <el-divider content-position="center">System Configuration</el-divider>

          <div class="drawer-item">
            <span>turn on TagsView</span>
            <el-switch
              v-model="set.tagsView"
              inline-prompt
              class="drawer-switch"
              active-text="open"
              inactive-text="close"
            />
          </div>
          <div class="drawer-item">
            <span>Sidebar Logo</span>
            <el-switch
              v-model="set.sidebarLogo"
              inline-prompt
              class="drawer-switch"
              active-text="open"
              inactive-text="close"
            />
          </div>

          <el-divider content-position="center">layout mode</el-divider>

          <div class="drawer-item">
            <div class="layoutMode">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="left mode"
                placement="top-start"
              >
                <div
                  class="modeItem"
                  :class="{ active: set.layoutMod == 'vertical' }"
                  @click="set.layoutMod = 'vertical'"
                >
                  <div></div>
                  <div></div>
                </div>
              </el-tooltip>

              <el-tooltip
                class="box-item"
                effect="dark"
                content="top mode( todo : coming soon )"
                placement="top-start"
              >
                <div
                  class="modeItem"
                  :class="{ active: set.layoutMod == 'horizontal' }"
                  @click="set.layoutMod = 'horizontal'"
                >
                  <div></div>
                  <div></div>
                </div>
              </el-tooltip>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-alert type="success">
            <template #title>
              <el-link
                type="primary"
                href="https://github.com/mvpyb/vite-element-admin"
                >Click me to go to github</el-link
              >
            </template>
          </el-alert>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useSettingsStore } from '@/store'
import { emitter } from '@/utils/mitt'

const settingStore = useSettingsStore()
const showSettings = ref(false)

const set = reactive({
  fixedHeader: computed({
    get() {
      return settingStore.fixedHeader
    },
    set(val) {
      settingStore.CHANGE_SETTING({
        key: 'fixedHeader',
        value: val,
      })
    },
  }),
  tagsView: computed({
    get() {
      return settingStore.tagsView
    },
    set(val) {
      settingStore.CHANGE_SETTING({
        key: 'tagsView',
        value: val,
      })
    },
  }),
  sidebarLogo: computed({
    get() {
      return settingStore.sidebarLogo
    },
    set(val) {
      settingStore.CHANGE_SETTING({
        key: 'sidebarLogo',
        value: val,
      })
    },
  }),
  layoutMod: computed({
    get() {
      return settingStore.layoutMod
    },
    set(val) {
      settingStore.CHANGE_LAYOUT_MOD(val)
    },
  }),
})

emitter.on('openSettings', () => {
  showSettings.value = true
})

defineOptions({
  name: 'Settings',
})
</script>

<style lang="scss" scoped>
.settings-container {
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    color: rgba(0, 0, 0, 0.85);
    font-size: 18px;
  }

  .drawer-item {
    height: 32px;
    margin: 25px 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .drawer-switch {
    float: right;
    display: inline-flex;
    align-items: center;
    position: relative;
    font-size: 14px;
    line-height: 20px;
    height: 32px;
    vertical-align: middle;
  }
}

.el-divider {
  margin-bottom: 30px;
}

/*Navigation mode*/
.layoutMode {
  width: 100%;
  height: 48px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .modeItem {
    width: 18%;
    height: 45px;
    background: #f0f2f5;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border-radius: 4px;
    box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);

    &:nth-child(1) {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          background: #1b2a47;
        }

        &:nth-child(2) {
          width: 70%;
          height: 30%;
          top: 0;
          right: 0;
          background: #fff;
          box-shadow: 0 0 1px #888;
          position: absolute;
        }
      }
    }

    &:nth-child(2) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(3) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }

        &:nth-child(2) {
          width: 30%;
          height: 70%;
          bottom: 0;
          left: 0;
          background: #fff;
          box-shadow: 0 0 1px #888;
          position: absolute;
        }
      }
    }

    &.active {
      border: 2px solid #409eff;
    }
  }
}
</style>
