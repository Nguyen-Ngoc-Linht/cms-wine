<template>
  <div>
    <el-dialog
      :title="isCreate ? t('collection.addIncident') : t('collection.editIncident')"
      v-model="isShow"
      modal-class="form-incident"
      :before-close="handleClose"
    >
      <el-form
        ref="formRef"
        class="d-flex"
        :model="incidentInfo"
        :rules="rules"
        label-position="top"
        label-width="100%"
      >
        <div class="group">
          <el-form-item
            :label="t('collection.incidentType')"
            prop="type"
            required
          >
            <el-select
              v-model="incidentInfo.type"
              class="w-full"
              :placeholder="t('configUser.pleaseSelect')"
              :disabled="!isCreate"
            >
              <el-option
                v-for="item in typeLst"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="t('configUser.status')"
            prop="status"
            required
          >
            <el-select
              v-model="incidentInfo.status"
              class="w-full"
              :placeholder="t('configUser.pleaseSelect')"
            >
              <el-option
                v-for="item in statusLst"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="group">
          <el-form-item
            :label="t('configUser.route')"
            prop="routeId"
            required
          >
            <el-select
              v-model="incidentInfo.routeId"
              class="w-full"
              @change="handleRouteChange"
              :placeholder="t('configUser.pleaseSelect')"
              :disabled="!isCreate"
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
            prop="stationId"
            required
          >
            <el-select
              v-model="incidentInfo.stationId"
              class="w-full"
              :placeholder="t('configUser.pleaseSelect')"
              :disabled="!isCreate"
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
        <el-form-item
          :label="t('collection.remediationProcess')"
          prop="rectificationProcess"
          required
        >
          <el-input
            v-model="incidentInfo.rectificationProcess"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            resize="none"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleSubmit"
            v-if="isCreate"
          >
            {{ $t('omsSetting.save') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="handleSubmit"
            v-else
          >
            {{ $t('omsSetting.update') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from '@/locale'
import { usePermissionStore, useRouteUser } from '@/store'
import { formatNumber, trimData } from '@/utils'
import { getListStation } from '@/api/expressway'
import { apiIncident } from '@/api/dashboard'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const routeUser = useRouteUser()

const statusLst = [
  {
    value: 'PROCESSED',
    label: t('configUser.processed'),
  },
  {
    value: 'PROCESSING',
    label: t('configUser.processing'),
  },
  {
    value: 'UNPROCESSED',
    label: t('configUser.unprocessed'),
  },
]

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  isCreate: {
    type: Boolean,
    default: false,
  },
  typeLst: {
    type: Array,
    default: () => [],
  },
  routeLst: {
    type: Array,
    default: () => [],
  },
  selectValue: {
    type: Object,
    default: () => {},
  },
})
const emit = defineEmits(['handleClose'])

const isShow = computed(() => props.dialogVisible)

watch(
  () => props.selectValue,
  async value => {
    if (value) {
      await getStationList(value.route.id)
      incidentInfo.id = value.id
      incidentInfo.type = value.type
      incidentInfo.status = value.status
      incidentInfo.routeId = value.route.id
      incidentInfo.stationId = value.station.id
      incidentInfo.rectificationProcess = value.rectificationProcess
    }
  }
)

const stationLst = ref([])
const getStationList = async routeId => {
  if (routeId) {
    const params = {
      routeIds: [routeId],
      stationIds: routeUser.GET_STATIONS(routeId),
    }
    await getListStation(params).then(res => {
      stationLst.value = res?.data?.dataRows || []
      incidentInfo.stationId = null
    })
  } else {
    stationLst.value = []
  }
}
const handleRouteChange = routeId => {
  getStationList(routeId)
}

const incidentInfo = reactive({
  id: null,
  type: null,
  status: null,
  routeId: null,
  stationId: null,
  rectificationProcess: null,
})

const rules = reactive({
  type: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'change' }],
  status: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'change' },
  ],
  routeId: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'change' },
  ],
  stationId: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'change' },
  ],
  rectificationProcess: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
})

const formRef = ref()
const processing = ref(false)
const handleSubmit = () => {
  const formEl = formRef
  Object.assign(incidentInfo, trimData(incidentInfo))
  formEl.value.validate(valid => {
    if (valid) {
      if (props.isCreate) {
        handleCreate()
      } else {
        handleEdit()
      }
    }
  })
}

const handleCreate = () => {
  const data = {
    method: 'ADD',
    arguments: {
      type: incidentInfo.type,
      routeId: incidentInfo.routeId,
      rectificationProcess: incidentInfo.rectificationProcess,
      status: incidentInfo.status,
      stationId: incidentInfo.stationId,
    },
  }
  processing.value = true
  apiIncident(data)
    .then(res => {
      emit('handleSuccess')
      ElMessage({
        type: 'success',
        message: t('configUser.message.addSuccess'),
      })
      handleClose()
    })
    .catch(_ => {
      ElMessage({
        message: t('omsSetting.failAdd'),
        type: 'error',
      })
    })
    .finally(_ => {
      processing.value = false
    })
}

const handleEdit = () => {
  const data = {
    method: 'UPDATE',
    arguments: {
      incidentId: incidentInfo.id,
      type: incidentInfo.type,
      routeId: incidentInfo.routeId,
      rectificationProcess: incidentInfo.rectificationProcess,
      status: incidentInfo.status,
      stationId: incidentInfo.stationId,
    },
  }
  processing.value = true
  apiIncident(data)
    .then(res => {
      emit('handleSuccess')
      ElMessage({
        type: 'success',
        message: t('configUser.message.updateSuccess'),
      })
      handleClose()
    })
    .catch(_ => {
      ElMessage({
        message: t('omsSetting.failUpdate'),
        type: 'error',
      })
    })
    .finally(_ => {
      processing.value = false
    })
}

const handleClose = () => {
  formRef.value.resetFields()
  emit('handleClose', false)
}

defineOptions({
  name: 'CollectionIncident',
})
</script>

<style scoped lang="scss">
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
