<template>
  <el-config-provider
    :locale="locale"
    :size="size"
  >
    <router-view />
  </el-config-provider>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import lang from '@/locale/getMessage.js'
import { useAppStore } from '@/store'
import cookies from '@/utils/cookies'
// import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'App',
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
  },
  setup() {
    // const { t } = useI18n()
    const appStore = useAppStore()
    if (cookies.get('language')) {
      appStore.SET_LANG(cookies.get('language'))
    }
    const locale = computed(() => lang[appStore.lang])
    const size = computed(() => appStore.size)
    return {
      locale,
      size,
    }
  },
})
</script>
