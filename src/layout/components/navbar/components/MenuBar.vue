<template>
  <el-popover
    ref="popoverRef"
    :visible="visible"
    placement="bottom"
    :width="400"
    trigger="click"
    popper-class="padding-16"
  >
    <template #reference>
      <el-button
        link
        v-click-outside="onClickOutside"
        @click="visible = true"
      >
        <svg-icon
          icon-class="iconMenubar"
          class="fs-28"
        />
      </el-button>
    </template>
  </el-popover>
</template>

<script setup>
import { computed, ref, inject } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import { getListApp } from '@/api/app'
import settings, { LIST_APP_CONFIG } from '@/settings'
import { useConfig } from '@/config'

const popoverRef = ref()
const visible = ref(false)
const listAppRole = ref([])

const getListAppRole = async () => {
  const { data } = await getListApp()
  if (data && data.length) {
    listAppRole.value = data
  }
}

const config = useConfig()
const baseUrl = ref(config.VITE_APP_UPLOAD_URL)
getListAppRole()

const onClickOutside = () => {
  visible.value = false
}

defineOptions({
  name: 'MenuBar',
})
</script>

<style lang="scss" scoped>
.menu-content > .active {
  background: #e8f0fe;
}
.app-name {
  word-break: break-word;
}
</style>
