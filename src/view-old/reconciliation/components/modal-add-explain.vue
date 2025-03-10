<template>
  <el-dialog
    :title="t('monitoring.toll.createExplanationNotice')"
    :model-value="dialogVisible"
    modal-class="form-explain"
    :before-close="handleClose"
    style="max-width: 700px; width: 90%"
    @open="getStation"
  >
    <el-form
      ref="formRef"
      class="d-flex"
      :model="formExplain"
      :rules="rules"
      label-position="top"
      label-width="100%"
    >
      <el-form-item
        :label="t('monitoring.toll.nameExplanationNotice')"
        prop="title"
        required
      >
        <el-input
          v-model="formExplain.title"
          maxlength="300"
        />
      </el-form-item>
      <el-form-item
        :label="t('monitoring.toll.contentExplanationNotice')"
        prop="content"
        required
      >
        <el-input
          type="textarea"
          maxlength="5000"
          show-word-limit
          :rows="4"
          resize="none"
          v-model="formExplain.content"
        />
      </el-form-item>
      <el-form-item
        :label="t('configUser.time')"
        prop="time"
        required
        class="w-full"
      >
        <el-date-picker
          v-model="formExplain.time"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="DD/MM/YYYY HH:mm:ss"
          class="w-full height-32"
          disabled
          :clearable="false"
        />
      </el-form-item>
      <div class="group">
        <el-form-item
          :label="t('configUser.route')"
          prop="route"
          required
        >
          <el-select
            v-model="formExplain.route"
            class="w-full"
            :placeholder="t('configUser.pleaseSelect')"
            disabled
          >
            <el-option
              v-for="item in routeLst"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="t('configUser.station')"
          prop="station"
          required
        >
          <el-select
            v-model="formExplain.station"
            class="w-full"
            :placeholder="t('configUser.pleaseSelect')"
            disabled
          >
            <el-option
              v-for="item in stationLst"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">
          {{ $t('configUser.cancel') }}
        </el-button>
        <el-button
          class="el-button--main"
          @click="handleSubmit"
          :loading="processing"
        >
          {{ $t('omsSetting.save') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from '@/locale'
import { usePermissionStore, useRouteUser } from '@/store'
import { formatNumber } from '@/utils'
import { getListRoute, getListStation } from '@/api/expressway'
import { apiCreateExplanation } from '@/api/explanation-support'
import { ElMessage } from 'element-plus'
import moment from 'moment'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  routeLst: {
    type: Array,
    default: () => [],
  },
  reconciliationType: {
    type: String,
    default: 'DATA',
  },
  transactionLst: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['handleClose', 'handleSuccess'])
const isShow = computed(() => props.dialogVisible)

const stationLst = ref([])
const getStation = () => {
  if (props.transactionLst.length) {
    const stationId = props.transactionLst[0].stationOutId
    const params = {
      stationIds: [stationId],
    }
    getListStation(params).then(res => {
      const list = res?.data?.dataRows || []
      stationLst.value = list
      formExplain.station = stationId
      formExplain.route = list.length ? list[0].route.id : null
    })
  } else {
    stationLst.value = []
  }
}

watch(
  () => props.transactionLst,
  newVal => {
    if (newVal?.length) {
      formExplain.transDeviationType = newVal[0].transDeviationTypeId
      formExplain.title = null
      formExplain.content = null
      formExplain.time = moment().format('YYYY-MM-DD HH:mm:ss')
    }
  }
)

const formExplain = reactive({
  title: null,
  content: null,
  time: moment().format('YYYY-MM-DD HH:mm:ss'),
  route: null,
  station: null,
  transDeviationType: null,
})

const rules = reactive({
  title: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
  content: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
  time: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'change' }],
  route: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'change' }],
  station: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'change' },
  ],
})

const formRef = ref(null)

const processing = ref(false)
const handleSubmit = () => {
  if (processing.value) return
  const fromEl = formRef
  fromEl.value.validate(valid => {
    if (valid) {
      const { title, content, time, route, station, transDeviationType } = formExplain

      processing.value = true
      const data = {
        title,
        content,
        created_at: moment(time).format('DD/MM/YYYY HH:mm:ss'),
        route_id: route,
        station_id: station,
        explanation_type: transDeviationType,
        reconciliation_type: props.reconciliationType,
        transaction_ids: props.transactionLst.map(i => i.id),
      }

      apiCreateExplanation(data)
        .then(res => {
          ElMessage({
            message: t('configUser.message.addObjectSuccess', [
              t('monitoring.toll.explanationNotice').toLowerCase(),
            ]),
            type: 'success',
          })
          handleSuccess()
        })
        .catch(_ => {})
        .finally(_ => {
          processing.value = false
        })
    }
  })
}

const handleSuccess = () => {
  emit('handleSuccess', false)
}

const handleClose = () => {
  formRef.value.clearValidate()
  emit('handleClose', false)
}

defineOptions({
  name: 'ModalAddExplain',
})
</script>

<style scoped>
.group {
  display: flex;
}

.group > div {
  flex: 1;
}

.group > div:first-child {
  margin-right: 5px;
}

.group > div:last-child {
  margin-left: 5px;
}
</style>
