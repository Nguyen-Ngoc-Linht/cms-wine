<template>
  <Dialog
    :show="show"
    :appendToBody="true"
    width="1200"
    :title="content.fileName"
    @closeDialog="handleCloseDialog"
    v-if="content"
  >
    <template v-slot:content>
      <div
        class="view-cont"
        v-loading="loading"
      >
        <pre>{{ content.content }}</pre>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import Dialog from '@/components/Dialog'

const props = defineProps({
  content: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: true,
  },
  dialogVisible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['handleCloseView'])

const show = computed(() => props.dialogVisible)
const handleCloseDialog = () => {
  emit('handleCloseView')
}

defineOptions({
  name: 'ViewLog',
})
</script>

<style scoped>
.view-cont {
  width: 100%;
  min-height: 500px;
  overflow-y: auto;
}
</style>
