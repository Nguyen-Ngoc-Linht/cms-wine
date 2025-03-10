<template>
  <div class="paddingX-24 py-4">
    <el-form
      ref="refParameterDelete"
      class="box-parameter-config"
      :rules="rulesDelete"
      :model="parameterDelete"
    >
      <div class="p-4 bg-white">
        <el-row gutter="20">
          <el-col
            :lg="12"
            :sm="24"
          >
            <el-form-item
              :label="t('collection.periodicallyDeleteFiles')"
              prop="unitOfTime"
              class="custom mb-2"
              style="display: inline-block; width: 100%"
            >
              <InputInteger
                v-model="parameterDelete.unitOfTime"
                :append="true"
                :max-length="4"
                :disabled="!roleData.canUpdate"
              >
                <template #append>{{ t('el.datepicker.day')?.toLowerCase() }}</template>
              </InputInteger>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <el-form
      ref="formParameterConfig"
      class="box-parameter-config"
      :rules="rules"
      :model="parameterConfig"
      v-loading="loading"
    >
      <div class="p-4 bg-white">
        <el-row gutter="20">
          <el-col
            :lg="6"
            :sm="12"
          >
            <el-form-item
              :label="t('collection.collectionType')"
              prop="logType"
              class="custom mb-2 inline-block w-full"
            >
              <el-select
                v-model="parameterConfig.logType"
                class="w-full"
                filterable
                collapse-tags
                clearable
                :placeholder="t('collection.collectionType')"
                @change="onChangeTypeReport"
              >
                <el-option
                  v-for="item in listTypeReport"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :lg="6"
            :sm="12"
          >
            <el-form-item
              :label="t('configUser.userManagement.route')"
              prop="routeId"
              class="custom mb-2 inline-block w-full"
            >
              <el-select
                v-model="parameterConfig.routeId"
                class="w-full"
                filterable
                collapse-tags
                clearable
                @change="onChangeRouteSearch"
                :placeholder="t('configUser.userManagement.route')"
              >
                <el-option
                  v-for="item in listRoutes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :lg="6"
            :sm="12"
            v-if="parameterConfig.logType === 1"
          >
            <el-form-item
              :label="t('configUser.station')"
              prop="stationId"
              class="custom mb-2 inline-block w-full"
            >
              <el-select
                v-model="parameterConfig.stationId"
                class="w-full"
                filterable
                collapse-tags
                clearable
                :placeholder="t('configUser.station')"
                name="station"
                @change="onChangeSearchStation"
              >
                <el-option
                  v-for="item in listStations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--          <el-col :lg="6" :sm="12" v-if="parameterConfig.logType === 2">-->
          <!--            <el-form-item-->
          <!--              :label="t('monitoring.toll.transactionType')"-->
          <!--              prop="detailType"-->
          <!--              class="custom mb-2 inline-block w-full"-->
          <!--            >-->
          <!--              <el-select-->
          <!--                v-model="parameterConfig.detailType"-->
          <!--                class="w-full"-->
          <!--                filterable-->
          <!--                collapse-tags-->
          <!--                clearable-->
          <!--                :placeholder="t('monitoring.toll.transactionType')"-->
          <!--                name="station"-->
          <!--                @change="onChangeDetailType"-->
          <!--              >-->
          <!--                <el-option-->
          <!--                  v-for="item in listType"-->
          <!--                  :key="item.id"-->
          <!--                  :label="item.name"-->
          <!--                  :value="item.id"-->
          <!--                />-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col
            :lg="6"
            :sm="12"
            v-if="parameterConfig.logType === 1"
          >
            <el-form-item
              :label="t('configUser.lane')"
              prop="laneId"
              class="custom mb-2 inline-block w-full"
            >
              <el-select
                v-model="parameterConfig.laneId"
                class="w-full"
                filterable
                collapse-tags
                clearable
                :placeholder="t('configUser.lane')"
                name="laneId"
                @change="onChangeSearchLane"
              >
                <el-option
                  v-for="item in listLane"
                  :key="item.id"
                  :label="item.number + ' - ' + item.type"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col
            :lg="12"
            :sm="24"
          >
            <el-form-item
              :label="t('collection.ip')"
              prop="ipAddress"
              class="custom mb-2 inline-block w-full"
            >
              <el-input
                v-model="parameterConfig.ipAddress"
                :append="true"
                maxlength="50"
                show-word-limit
                :disabled="!roleData.canUpdate"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col
            :lg="12"
            :sm="24"
          >
            <el-form-item
              :label="t('collection.port')"
              prop="port"
              class="custom mb-2 inline-block w-full"
            >
              <el-input
                v-model="parameterConfig.port"
                :append="true"
                maxlength="10"
                show-word-limit
                :disabled="!roleData.canUpdate"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col
            :lg="12"
            :sm="24"
          >
            <el-form-item
              :label="t('configUser.account')"
              prop="user"
              class="custom mb-2 inline-block w-full"
            >
              <el-input
                v-model="parameterConfig.user"
                :append="true"
                maxlength="20"
                show-word-limit
                :disabled="!roleData.canUpdate"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col
            :lg="12"
            :sm="24"
          >
            <el-form-item
              :label="t('configUser.loginPassword')"
              prop="password"
              class="custom mb-2 inline-block w-full"
            >
              <!--              <el-input v-model="parameterConfig.password"-->
              <!--                        :append="true"-->
              <!--                        maxlength="20"-->
              <!--                        show-word-limit-->
              <!--                        :disabled="!roleData.canUpdate"-->
              <!--              >-->
              <!--              </el-input>-->
              <el-input
                v-model="parameterConfig.password"
                :type="parameterConfig.showPass ? 'text' : 'password'"
                autocomplete="new-password"
                maxlength="20"
                show-word-limit
                :disabled="!roleData.canUpdate"
              >
                <template #suffix>
                  <svg-icon
                    icon-class="eyeClose"
                    class="width-18 height-18 pointer"
                    @click="handleShowPass()"
                    v-if="parameterConfig.showPass"
                  />
                  <svg-icon
                    icon-class="eye"
                    class="width-18 height-18 pointer"
                    @click="handleShowPass()"
                    v-else
                  />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col
            :lg="12"
            :sm="24"
          >
            <el-form-item
              :label="t('collection.frequency')"
              prop="unitOfTime"
              class="custom mb-2"
              style="display: inline-block; width: 100%"
            >
              <InputInteger
                v-model="parameterConfig.unitOfTime"
                :append="true"
                maxlength="4"
                :disabled="!roleData.canUpdate"
              >
                <template #append>{{ t('el.datepicker.minute')?.toLowerCase() }}</template>
              </InputInteger>
            </el-form-item>
          </el-col>
          <el-col
            :lg="12"
            :sm="24"
            v-if="parameterConfig.logType === 1 || parameterConfig.logType === 3"
          >
            <el-form-item
              :label="
                parameterConfig.logType === 1
                  ? t('collection.signalLog')
                  : t('collection.transactionFile')
              "
              class="custom mb-2 inline-block w-full"
            >
              <el-input
                v-model="parameterConfig.filePath"
                :append="true"
                maxlength="300"
                show-word-limit
                :disabled="!roleData.canUpdate"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col
            :lg="12"
            :sm="24"
            v-if="parameterConfig.logType === 1 || parameterConfig.logType === 3"
          >
            <el-form-item
              :label="
                parameterConfig.logType === 1
                  ? t('collection.deviceLog')
                  : t('collection.transactionFileFreeVehicle')
              "
              class="custom mb-2 inline-block w-full"
            >
              <el-input
                v-model="parameterConfig.filePath2"
                :append="true"
                maxlength="300"
                show-word-limit
                :disabled="!roleData.canUpdate"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col
            :lg="12"
            :sm="24"
            v-if="parameterConfig.logType === 2"
          >
            <el-form-item
              :label="t('collection.path')"
              class="custom mb-2 inline-block w-full"
            >
              <el-input
                v-model="parameterConfig.filePath"
                :append="true"
                maxlength="300"
                show-word-limit
                :disabled="!roleData.canUpdate"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="flex justify-end pt-5 pb-3">
      <el-button
        v-if="roleData.canUpdate"
        @click="handleUpdateAll"
        :loading="processing"
        type="primary"
        class="el-button--main"
        style="min-width: 100px"
        >{{ $t('omsSetting.save') }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiUpdateConfigFE, apiGetConfigFE } from '@/api/collect'
import { apiCollectPropertySystem, apiUpdateConfigTimeDelete } from '@/api/reconciliation'
import InputInteger from '@/components/InputInteger/index.vue'
import { usePermissionStore, useRouteUser, useStatisticalReportStore, useUserStore } from '@/store'
import { cloneDeep } from 'lodash-unified'

const { t } = useI18n()
const props = defineProps({
  dataType: {
    type: Number,
    required: false,
  },
})

const validateNonNegative = (rule, value, callback) => {
  if (value < 0) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}
const rules = reactive({
  ipAddress: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  port: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
  user: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
  password: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  unitOfTime: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  logType: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
  routeId: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
  stationId: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  laneId: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
  // detailType: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
})
const formSearchDefault = {
  typeReport: 1,
  routerIds: '',
  stationIds: '',
  laneId: '',
}
const filter = reactive(cloneDeep(formSearchDefault))
const { roleData } = usePermissionStore()
const statisticalReportStore = useStatisticalReportStore()
const userStore = useUserStore()
const routeUser = useRouteUser()
const processing = ref(false)
const ruleEdit = ref({})
const infoParameterConfig = ref([])
const parameterConfig = ref({
  ipAddress: '',
  port: '',
  user: '',
  password: '',
  unitOfTime: 0,
  filePath: '',
  filePath2: '',
  logType: 1,
  routeId: '',
  stationId: '',
  laneId: '',
  // detailType: 0,
  showPass: false,
})
const formParameterConfig = ref(null)
const listRoutes = ref([])
const listStations = ref([])
const listLane = ref([])
const listTypeReport = ref([
  {
    id: 1,
    name: 'LogFile',
  },
  {
    id: 2,
    name: 'TDR',
  },
  {
    id: 3,
    name: 'BE',
  },
])
const objFindStationDefault = {
  keyword: '',
  page: 1,
  size: 1000,
  unitIds: [],
  routeIds: [],
  stationIds: [],
}
const loading = ref(false)
const rulesDelete = reactive({
  unitOfTime: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
})
const refParameterDelete = ref(null)
const parameterDelete = ref({
  unitOfTime: 0,
})
const listType = ref([
  {
    id: 1,
    name: 'ETC',
  },
  {
    id: 2,
    name: 'MTC',
  },
  {
    id: 3,
    name: 'OTC',
  },
])

onMounted(async () => {
  await getListRoute()
  await initDataDeleteFile()
})
const initDataDeleteFile = async () => {
  const params = {
    name: 'TimeDelete',
  }
  await apiCollectPropertySystem(params)
    .then(res => {
      if (res.status === 200) {
        parameterDelete.value = { ...res.data }
      }
    })
    .catch(err => console.error(err))
}
const updateConfigDelete = async () => {
  if (processing.value) {
    return
  }
  processing.value = true
  await apiUpdateConfigTimeDelete(parameterDelete.value, parameterDelete.value.id)
    .then(res => {
      if (res.status === 200) {
        processing.value = false
        initDataDeleteFile()
      }
    })
    .catch(err => {
      console.error(err)
      processing.value = false
    })
}
const getListRoute = async () => {
  await statisticalReportStore
    .getListRoute()
    .then(res => {
      if (res.status === 200) {
        const data = res.data.dataRows
        if (userStore.positionUnitId === null) {
          listRoutes.value = data
        } else {
          data.forEach(item => {
            if (routeUser.routes.includes(item.id)) {
              listRoutes.value.push(item)
            }
          })
        }
        initData()
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const onChangeRouteSearch = async value => {
  objFindStationDefault.routeIds = []
  objFindStationDefault.routeIds = objFindStationDefault.routeIds.concat(value)
  const listStationUser = routeUser.GET_STATIONS(value)
  objFindStationDefault.stationIds = []
  objFindStationDefault.stationIds = objFindStationDefault.stationIds.concat(listStationUser)
  await getListStationSearch(objFindStationDefault)
  await initDataChange()
}
const onChangeRoute = async value => {
  objFindStationDefault.routeIds = []
  objFindStationDefault.routeIds = objFindStationDefault.routeIds.concat(value)
  const listStationUser = routeUser.GET_STATIONS(value)
  objFindStationDefault.stationIds = []
  // objFindStationDefault.stationIds = objFindStationDefault.stationIds.concat(listStationUser)
  await getListStation(objFindStationDefault)
}
const getListStation = async obj => {
  await statisticalReportStore
    .getListStationReport(obj)
    .then(res => {
      if (res.status === 200) {
        listStations.value = res.data.dataRows
        setListLane(listStations.value[0].id)
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const getListStationSearch = async obj => {
  await statisticalReportStore
    .getListStationReport(obj)
    .then(res => {
      if (res.status === 200) {
        listStations.value = res.data.dataRows
        parameterConfig.value.stationId = listStations.value[0].id
        setListLaneSearch(parameterConfig.value.stationId)
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const initData = async () => {
  loading.value = true
  if (parameterConfig.value.logType === 1) {
    await onChangeRoute(listRoutes.value[0].id)
  }
  const params = {
    logType: parameterConfig.value.logType,
    routeId: listRoutes.value[0].id,
    stationId:
      parameterConfig.value.logType === 1 && listStations.value.length > 0
        ? listStations.value[0].id
        : null,
    laneId:
      parameterConfig.value.logType === 1 && listLane.value.length > 0
        ? listLane.value[0].id
        : null,
  }
  const rs = await apiGetConfigFE(params)
  console.log('apiGetConfigFE', rs)
  if (rs.status === 200) {
    formParameterConfig.value.clearValidate()
    const listParameter = rs.data
    if (listParameter) {
      parameterConfig.value = {
        ...listParameter[0],
        showPass: false,
      }
    }
    loading.value = false
  } else {
    resetData()
  }
  loading.value = false
}
const initDataChange = async () => {
  loading.value = true
  const params = {
    logType: parameterConfig.value.logType,
    routeId: parameterConfig.value.routeId ? parameterConfig.value.routeId : null,
    stationId:
      parameterConfig.value.logType === 1 && parameterConfig.value.stationId
        ? parameterConfig.value.stationId
        : null,
    laneId:
      parameterConfig.value.logType === 1 && parameterConfig.value.laneId
        ? parameterConfig.value.laneId
        : null,
    // detailType: parameterConfig.value.logType === 2 && parameterConfig.value.detailType ? parameterConfig.value.detailType : null,
  }
  const rs = await apiGetConfigFE(params)
  if (rs.status === 200) {
    formParameterConfig.value.clearValidate()
    const listParameter = rs.data
    if (listParameter) {
      parameterConfig.value = {
        ...listParameter[0],
        showPass: false,
      }
    } else {
      resetData()
    }
    loading.value = false
  } else {
    loading.value = false
  }
}
const handleSaveParameterConfig = async () => {
  try {
    processing.value = true
    const params = {
      data: [parameterConfig.value],
    }
    const rs = await apiUpdateConfigFE(params)
    if (rs.status === 200) {
      ElMessage({
        type: 'success',
        message: t('configUser.message.updateSuccess'),
      })
    } else {
      ElMessage({
        type: 'error',
        message: t('omsSetting.failUpdate'),
      })
    }
    processing.value = false
  } catch (e) {
    console.log(e)
    processing.value = false
  }
}
const onChangeTypeReport = value => {
  initData()
  if (value === 3 || value === 2) {
    rules.stationId = [
      {
        required: false,
        message: t('configUser.validateMessage.required'),
        trigger: 'blur',
      },
    ]
    rules.lane = [
      {
        required: false,
        message: t('configUser.validateMessage.required'),
        trigger: 'blur',
      },
    ]
  } else {
    rules.stationId = [
      {
        required: true,
        message: t('configUser.validateMessage.required'),
        trigger: 'blur',
      },
    ]
    rules.lane = [
      {
        required: true,
        message: t('configUser.validateMessage.required'),
        trigger: 'blur',
      },
    ]
  }
}
const setListLaneSearch = async value => {
  listLane.value = []
  listStations.value.forEach(item => {
    if (item.id === value) {
      listLane.value = item.lanes
      parameterConfig.value.laneId = listLane.value[0].id
    }
  })
}
const setListLane = async value => {
  listLane.value = []
  listStations.value.forEach(item => {
    if (item.id === value) {
      listLane.value = item.lanes
    }
  })
}
const onChangeSearchStation = value => {
  setListLaneSearch(value)
  initDataChange()
}
const onChangeSearchLane = value => {
  initDataChange()
}
const onChangeDetailType = value => {
  initDataChange()
}
const handleUpdateAll = async () => {
  refParameterDelete.value.validate(async valid => {
    if (valid) {
      formParameterConfig.value.validate(async valid => {
        if (valid) {
          await updateConfigDelete()
          await handleSaveParameterConfig()
        }
      })
    }
  })
}
const resetData = () => {
  parameterConfig.value = {
    ipAddress: '',
    port: '',
    user: '',
    password: '',
    unitOfTime: 0,
    filePath: '',
    filePath2: '',
    logType: parameterConfig.value.logType,
    routeId: parameterConfig.value.routeId,
    stationId: parameterConfig.value.stationId,
    laneId: parameterConfig.value.laneId,
    // detailType: parameterConfig.value.detailType,
  }
}
const handleShowPass = () => {
  const showPass = !!parameterConfig.value.showPass
  parameterConfig.value.showPass = !showPass
}
</script>

<style lang="scss">
.custom {
  color: #525b73;

  .el-form-item__label {
    color: #525b73;
    font-weight: 600 !important;
  }
}

.text-custom {
  color: #525b73;
  font-weight: 600;
  font-size: 18px;
}
</style>
