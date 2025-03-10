<template>
  <el-dropdown
    trigger="click"
    class="international"
    @command="handleSetLanguage"
  >
    <div class="select-language">
      <svg-icon
        class-name="international-icon"
        :icon-class="language"
      />
      <span class="text-language">{{ language === 'vi' ? 'Tiếng Việt' : 'English' }} </span
      ><el-icon><ArrowDown /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          :disabled="language === 'vi'"
          command="vi"
        >
          <svg-icon
            class-name="international-icon height-12"
            icon-class="vi"
          />
          {{ language === 'vi' ? 'Tiếng Việt' : 'Vietnamese' }}
        </el-dropdown-item>
        <el-dropdown-item
          :disabled="language === 'en'"
          command="en"
        >
          <svg-icon
            class-name="international-icon height-12"
            icon-class="en"
          />
          {{ language === 'en' ? 'English' : 'Tiếng Anh' }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/store'
import { useI18n } from 'vue-i18n'

const appStore = useAppStore()
const { locale } = useI18n()

const language = computed(() => {
  return appStore.lang
})
locale.value = language.value

const handleSetLanguage = val => {
  appStore.SET_LANG(val)
  locale.value = val
}

defineOptions({
  name: 'LangSelect',
})
</script>

<style lang="scss" scoped>
.international-icon {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px !important;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #c6c6c7e7;
}
:deep(.el-dropdown-menu__item.is-disabled) {
  background-color: #ecf5ff;
  color: #66b1ff;
}

:deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
  background-color: #fff;
  color: #000;
}
.international {
  margin-top: 16px;
}
.select-language {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #99a2bc;
  padding: 6px 4px;
  border-radius: 4px;
  width: 131px;
  .text-language {
    padding: 0px 8px;
  }
}
</style>
