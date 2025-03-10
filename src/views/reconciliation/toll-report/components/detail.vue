<template>
  <el-dialog
    :title="t('configUser.viewDetail')"
    v-model="isShow"
    modal-class="toll-detail"
    :before-close="handleClose"
    @open="getData"
    style="width: 90%; max-width: 1200px"
  >
    <el-table
      ref="multipleTable"
      :data="data"
      style="width: 100%"
      max-height="650"
      :cell-class-name="highlightDiff"
    >
      <el-table-column>
        <template #default="{ $index }">
          <span v-if="$index === 0">{{ t('reconciliation.tollCollectionReport') }}</span>
          <span v-else>Logfile</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Etag"
        property="etag"
      >
        <template #default="{ row }">
          <span>{{ row.etag }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('reconciliation.timeIn')"
        property="checkinDateIn"
        width="90"
      >
        <template #default="{ row }">
          <span>{{ formatDateTime(row.checkinDateIn) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('reconciliation.stationIn')"
        property="stationIn"
      >
        <template #default="{ row }">
          <span>{{ row.stationIn }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('reconciliation.laneIn')"
        property="laneIn"
      >
        <template #default="{ row }">
          <span>{{ row.laneIn }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('reconciliation.timeOut')"
        property="checkinDateOut"
        width="90"
      >
        <template #default="{ row }">
          <span>{{ formatDateTime(row.checkinDateOut) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('reconciliation.stationOut')"
        property="stationOut"
      >
        <template #default="{ row }">
          <span>{{ row.stationOut }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('reconciliation.laneOut')"
        property="laneOut"
      >
        <template #default="{ row }">
          <span>{{ row.laneOut }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('reconciliation.plateRec')"
        property="identificationPlate"
      >
        <template #default="{ row }">
          <span>{{ row.identificationPlate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('reconciliation.vehicleType')"
        property="vehicleType"
      >
        <template #default="{ row }">
          <span>{{ row.vehicleType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('reconciliation.plateReg')"
        property="registrationPlate"
      >
        <template #default="{ row }">
          <span>{{ row.registrationPlate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('reconciliation.amount')"
        property="price"
      >
        <template #default="{ row }">
          <span>{{ formatNumber(row.price, '.') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('reconciliation.sickOn')"
        property="sickOn"
      >
        <template #default="{ row }">
          <span>{{ row.sickOn }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('reconciliation.loopOn')"
        property="loopOn"
      >
        <template #default="{ row }">
          <span>{{ row.sickOn }}</span>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">
          {{ $t('configUser.close') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import { formatNumber } from '@/utils'
import { apiGetReconcDetail } from '@/api/reconciliation'
import { formatDateTime } from '@/utils/date'

const { t } = useI18n()

const isShow = computed(() => props.dialogVisible)

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  activeData: {
    type: Object,
    default: () => {},
  },
  config: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['handleClose'])

const loading = ref(false)
const data = ref([])

const getData = () => {
  if (loading.value) return

  loading.value = true
  apiGetReconcDetail(props.activeData.id)
    .then(res => {
      const info = [{ ...res.data.report }, { ...res.data.system }]
      data.value = info
    })
    .catch(_ => {
      data.value = []
    })
    .finally(_ => {
      loading.value = false
    })
}

const colCheck = computed(() => ({
  laneIn: props.config.isLaneIn,
  laneOut: props.config.isLaneOut,
  stationIn: props.config.isStationIn,
  checkinDateIn: props.config.isStationInTime,
  stationOut: props.config.isStationOut,
  checkinDateOut: props.config.isStationOutTime,
  vehicleType: props.config.isVehicleType,
  price: props.config.isTicketPrice,
}))

const highlightDiff = ({ row, column, rowIndex, columnIndex }) => {
  if (
    props.activeData.type !== 3 ||
    !colCheck.value[column.property] ||
    data.value.every(i => i[column.property] === data.value[0][column.property])
  ) {
    return ''
  }
  return 'highlight'
}

const handleClose = () => {
  emit('handleClose', false)
}

defineOptions({
  name: 'ReconciliationDetail',
})
</script>

<style scoped lang="scss">
:deep(.highlight) {
  padding: 16px 0 8px;
}

:deep(.highlight::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin-top: 8px;
  background: #feedb4 !important;
  z-index: -1;
  box-sizing: content-box;
}
</style>
