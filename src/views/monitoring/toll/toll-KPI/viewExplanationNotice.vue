<template>
  <div class="bg-white">
    <el-table
      :data="KPITollInfo"
      row-key="id"
      fit
      highlight-current-row
      style="width: 100%"
      class="cell-main-3"
    >
      <el-table-column class="py-2">
        <template #default="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="feeRecognitionRatio"
        :label="$t('monitoring.toll.feeRecognitionRatio')"
      >
        <template #default="{ row }">
          <span :title="row.feeRecognitionRatio">{{ row.feeRecognitionRatio }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('monitoring.toll.terminalCardRecognitionRate')">
        <template #default="{ row }">
          <span :title="row.terminalCardRecognitionRate">{{
            row.terminalCardRecognitionRate
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('monitoring.toll.licensePlateRecognitionRate')">
        <template #default="{ row }">
          <span :title="row.licensePlateRecognitionRate">{{
            row.licensePlateRecognitionRate
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('monitoring.toll.tollCollectionSystem')">
        <template #default="{ row }">
          <span :title="row.tollCollectionSystem">{{ row.tollCollectionSystem }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="action mt-4">
      <div class="flex justify-end">
        <el-button
          type="default"
          @click="closeDialog"
          class="bg-outline-secondary"
          >{{ $t('configUser.cancel') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage } from 'element-plus'
const { t } = useI18n()

const props = defineProps({
  infoKPIToll: {
    type: Object,
    required: false,
  },
})
const KPITollInfo = ref([
  {
    title: 'Hệ thống tính được',
    feeRecognitionRatio: '',
    terminalCardRecognitionRate: '',
    licensePlateRecognitionRate: '',
    tollCollectionSystem: '',
  },
  {
    title: 'Từ báo cáo đơn vị thu phí',
    feeRecognitionRatio: '',
    terminalCardRecognitionRate: '',
    licensePlateRecognitionRate: '',
    tollCollectionSystem: '',
  },
])
const emit = defineEmits(['closeUpdate'])
const closeDialog = () => {
  emit('closeUpdate')
}

onMounted(() => {
  setData()
})

const setData = async () => {
  if (props.infoKPIToll) {
    KPITollInfo.value[0].feeRecognitionRatio = props.infoKPIToll.ratioRecognitione || ''
    KPITollInfo.value[0].terminalCardRecognitionRate =
      props.infoKPIToll.rateTerminalCardRecognition || ''
    KPITollInfo.value[0].licensePlateRecognitionRate =
      props.infoKPIToll.rateLicensePlateRecognition || ''
    KPITollInfo.value[0].tollCollectionSystem = props.infoKPIToll.tollCollectionSystem || ''
  }
}
</script>
