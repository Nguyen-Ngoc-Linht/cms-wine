<template>
  <el-table
    v-loading="listLoading"
    :data="data"
    row-key="id"
    fit
    style="width: 100%"
    class="cell-main-3"
    :row-class-name="tableRowClassName"
    @selection-change="handleSelectionChange"
    @row-click="handeShowView"
  >
    <el-table-column
      v-if="selectRow"
      type="selection"
      width="55"
    >
    </el-table-column>
    <el-table-column
      v-if="STT"
      class="padding-table"
      label="STT"
      width="50"
    >
      <template #default="{ $index }">
        <span>{{ (page - 1) * size + $index + 1 }}</span>
      </template>
    </el-table-column>
    <el-table-column
      v-for="field in fields"
      :key="field.key"
      :label="field.label"
      :prop="field.prop"
      :width="field.width"
      :sortable="field.sort"
    >
      <template
        v-if="$slots[field.prop]"
        #default="{ row }"
      >
        <slot
          :name="field.prop"
          :row="row"
        />
      </template>
      <template
        v-else
        #default="{ row }"
      >
        <span>{{ row[field.prop] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref } from 'vue'
defineOptions({
  name: 'TableViolation',
})

const props = defineProps({
  listLoading: Boolean,
  data: {
    type: Array,
  },
  STT: Boolean,
  selectRow: Boolean,
  fields: Array,
  page: Number,
  size: Number,
})

const selectTable = ({ row }) => {
  return true
}

const emit = defineEmits(['listRowSelect', 'showView'])
const selectedRows = ref([])
const handleSelectionChange = rows => {
  selectedRows.value = rows
  emit('listRowSelect', selectedRows.value)
}

const handeShowView = data => {
  emit('showView', data)
}

const tableRowClassName = ({ row }) => {
  return selectedRows.value.includes(row) ? 'row-selected' : ''
}
</script>

<style lang="scss">
//.el-table .row-selected {
//  --el-table-tr-bg-color: #FCECAA !important;
//}

.el-table-column--selection .cell .el-checkbox__input .el-checkbox__inner {
  height: 16px;
  width: 16px;
  border: 2px #059efb solid;
}
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #059efb;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #059efb;
}
</style>
