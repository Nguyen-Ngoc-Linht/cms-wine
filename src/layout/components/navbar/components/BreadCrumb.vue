<template>
  <el-breadcrumb
    class="app-breadcrumb"
    separator=""
  >
    <transition-group
      appear
      name="breadcrumb"
    >
      <el-breadcrumb-item
        v-for="(item, index) in levelList"
        :key="item.path"
      >
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect font-bold fs-16"
          >{{ getRouteName(item.meta.title) }}</span
        >
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRouteName } from '@/utils/getPageTitle'

const levelList = ref([])
const route = useRoute()
const router = useRouter()

const isDashboard = route => {
  const name = route && route.name
  if (!name) {
    return false
  }
  return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
}

const getBreadcrumb = () => {
  let matched = route.matched.filter(item => item.meta && item.meta.title && !item.meta.root)
  const first = matched[0]
  if (!isDashboard(first)) {
    matched = [{ path: '/', meta: { title: 'GSTP - Giám sát thu phí' } }].concat(matched)
  }
  levelList.value = matched.filter(
    item => item.meta && item.meta.title && item.meta.breadcrumb !== false
  )
}

getBreadcrumb()

watch(
  () => route.path,
  path => {
    if (path.startsWith('/redirect/')) {
      return
    }
    getBreadcrumb()
  },
  {
    immediate: true,
  }
)

defineOptions({
  name: 'BreadCrumb',
})
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 48px;

  .no-redirect {
    color: #fff;
    cursor: text;
  }
}
</style>
