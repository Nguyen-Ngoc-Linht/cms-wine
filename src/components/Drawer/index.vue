<template>
  <el-drawer
    :model-value="show"
    @before-close="beforeClose"
    :size="size"
    :title="title"
    :with-header="withHeader"
    @close="handleClose"
    append-to-body
    :destroy-on-close="true"
    :modal="true"
    :direction="direction"
    class="drawer-component"
  >
    <el-button
      type=""
      class="close-wr-icon"
      @click="handleClose"
      link
    >
      <el-icon class="width-30 height-30"> <Close class="fs-24" /> </el-icon>
    </el-button>
    <slot name="content"></slot>
  </el-drawer>
</template>

<script setup>
defineOptions({
  name: 'DetailViolation',
})
const props = defineProps({
  show: Boolean,
  withHeader: {
    type: Boolean,
    default: false,
  },
  direction: {
    type: String,
    default: 'rtl',
  },
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '30%',
  },
})

const emit = defineEmits(['closeDrawer'])
const beforeClose = done => {
  emit('closeDrawer')
  // Nếu bạn muốn thực hiện một số kiểm tra trước khi đóng el-drawer, hãy thêm logic vào đây
  done() // Đánh dấu việc đóng đã hoàn tất
}
const handleClose = () => {
  emit('closeDrawer')
}
</script>
<style lang="scss" scoped>
.close-wr-icon {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
<style lang="scss">
.drawer-component.el-drawer.rtl {
  height: calc(100% - 48px) !important;
  top: 48px !important;
  overflow-y: auto;
}
.drawer-component.el-drawer.ltr {
  height: calc(100% - 48px) !important;
  top: 48px !important;
  overflow-y: auto;
}
</style>
