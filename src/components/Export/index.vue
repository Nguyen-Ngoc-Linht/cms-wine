<template>
  <div>
    <template v-if="$slots.default">
      <div @click="$emit('export')">
        <slot />
      </div>
    </template>
    <template v-else>
      <el-button
        text
        size="default"
        class="!p-0"
      >
        <div
          class="text-gray flex items-center pointer text-[#525B73]"
          @click="$emit('export')"
        >
          <svg-icon
            icon-class="export-file"
            class="width-20 height-20 margin-right-4"
          />
          {{ buttonText || t('configUser.exportFile') }}
        </div>
      </el-button>
    </template>
  </div>
</template>

<script>
import moment from 'moment'
import { SSF, utils, writeFileXLSX } from 'xlsx'
import { useI18n } from '@/locale'

export default {
  name: 'Export',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    tableName: { type: String, default: '' },
    fileName: { type: String, default: 'Sheet.xlsx' },
    data: { type: Array, default: null },
    header: { type: Array, default: null },
    getExport: null,
    buttonText: { type: String, default: null },
  },
  watch: {
    data(val) {
      if (val) {
        const fileName = this.fileName + '_' + moment().format('DDMMYYYY') + '.xlsx'
        const workbook = utils.book_new()
        const worksheet = this.sheetFromArrayOfArrays(val)
        utils.book_append_sheet(workbook, worksheet, 'sheet1')
        writeFileXLSX(workbook, fileName)
      }
    },
  },
  methods: {
    sheetFromArrayOfArrays(data) {
      const ws = {}
      const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } }
      const colWidth = Array(data[0].length).fill({ wpx: 150 })

      for (let R = 0; R !== data.length; ++R) {
        for (let C = 0; C !== data[R].length; ++C) {
          if (range.s.r > R) range.s.r = R
          if (range.s.c > C) range.s.c = C
          if (range.e.r < R) range.e.r = R
          if (range.e.c < C) range.e.c = C
          const cell = { v: data[R][C] }
          if (cell.v == null) continue
          const cell_ref = utils.encode_cell({ c: C, r: R })

          if (typeof cell.v === 'number') cell.t = 'n'
          else if (typeof cell.v === 'boolean') cell.t = 'b'
          else if (cell.v instanceof Date) {
            cell.t = 'n'
            cell.z = SSF._table[14]
          } else cell.t = 's'
          if (R === 0) {
            cell.s = {
              font: {
                bold: true,
              },
              fill: null,
            }
          }
          ws[cell_ref] = cell
        }
      }
      if (range.s.c < 10000000) ws['!ref'] = utils.encode_range(range)
      ws['!cols'] = colWidth
      return ws
    },
  },
}
</script>
<script setup>
const { t } = useI18n()
</script>
