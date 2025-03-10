<template>
  <el-dialog
    v-model="isShow"
    width="70%"
    modal-class="preview-pdf"
    top="30px"
    :before-close="handleClose"
    :destroy-on-close="true"
  >
    <div class="view-page">
      <embed
        :src="props.urlFile"
        type="application/pdf"
        frameBorder="0"
        scrolling="auto"
        height="100%"
        width="100%"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  urlFile: {
    type: String,
    default: '',
  },
})

const isShow = computed(() => props.dialogVisible)

const emit = defineEmits(['update:dialogVisible'])
const handleClose = () => {
  emit('update:dialogVisible', false)
}
defineOptions({
  name: 'PreviewPdf',
})
</script>

<style lang="scss" scoped>
.view-page {
  height: calc(100vh - 80px);
}
</style>

<style lang="scss">
.preview-pdf {
  .el-dialog__body {
    padding: 0px;
  }
  .el-dialog__headerbtn {
    width: 24px;
    height: 24px;
    top: 0;
    font-size: 18px;
  }
}
</style>
