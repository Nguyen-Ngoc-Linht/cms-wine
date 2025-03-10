<template>
  <div class="elc-pagination">
    <el-config-provider :locale="locale">
      <el-pagination
        :current-page="page"
        :page-size="size"
        :page-sizes="[10, 15, 20]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-config-provider>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useAppStore } from '@/store'
import lang from '@/locale/getMessage.js'

const appStore = useAppStore()
defineOptions({
  name: 'Pagination',
})
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  page: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
    default: 1,
  },
  size: {
    type: Number,
    default: 15,
  },
})

const emit = defineEmits(['current-change', 'size-change', 'update:size', 'update:page'])
const small = ref(false)
const background = ref(false)
const locale = computed(() => lang[appStore.lang])

const handleSizeChange = val => {
  emit('update:size', val)
  emit('size-change', val)
}

const handleCurrentChange = val => {
  emit('update:page', val)
  emit('current-change', val)
}
</script>

<style lang="scss" scoped>
.elc-pagination {
  padding: 2px 10px;
  :deep(.el-pagination__total) {
    font-size: 12px;
  }
  :deep(.el-input__wrapper) {
    border: 1px solid #ebebec;
    border-radius: 4px;
    font-size: 12px;
  }
}
:deep(.btn-prev) {
  background: none !important;
}
:deep(.btn-next) {
  background: none !important;
}
:deep(.el-pager li) {
  background: none !important;
  padding-top: 4px;
}
</style>
