<template>
  <el-dialog
    :model-value="show"
    @before-close="beforeClose"
    :width="width"
    :title="title"
    :with-header="withHeader"
    :close-on-click-modal="false"
    :show-close="false"
    :append-to-body="appendToBody"
    @close="handleClose"
    :destroy-on-close="true"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="dialog-header">
        <div
          :id="titleId"
          :class="titleClass"
          class="font-[500]"
        >
          {{ title }}
          <slot name="custom-header" />
        </div>
        <el-button
          class="close-wr-icon"
          @click="close"
          link
        >
          <el-icon class="width-24 height-24">
            <Close class="fs-20" />
          </el-icon>
        </el-button>
      </div>
    </template>

    <slot name="content"></slot>
  </el-dialog>
</template>

<script setup>
defineOptions({
  name: 'DialogViolation',
})
const props = defineProps({
  show: Boolean,
  withHeader: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '30%',
  },
  appendToBody: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['closeDialog'])
const beforeClose = done => {
  emit('closeDialog')
  done()
}
const handleClose = () => {
  emit('closeDialog')
}
</script>
<style lang="scss" scoped>
.close-wr-icon {
  position: absolute;
  top: 7px;
  right: 10px;
}
</style>
