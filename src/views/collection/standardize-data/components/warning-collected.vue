<script setup>
import {ref, onMounted, computed} from 'vue'
import {useI18n} from '@/locale'
import lang from '@/locale/getMessage'
import {useAppStore, usePermissionStore, useRouteUser, useStatisticalReportStore, useUserStore} from '@/store'
import {apiGetDataCollectWarning, apiGetIntermittentCollect, apiGetAllCollectionAlerts} from '@/api/collect'
import {useRoute} from 'vue-router'
import {apiCollectPropertySystem} from '@/api/reconciliation'
import {ElMessage} from 'element-plus'

defineOptions({
  name: 'warning-collected',
})
const {t} = useI18n()
const appStore = useAppStore()
const statisticalReportStore = useStatisticalReportStore()
const userStore = useUserStore()
const locale = computed(() => lang[appStore.lang])
const listLoading = ref(false)
const routeUser = useRouteUser()
const parameterConfig = ref({})
const {roleData} = usePermissionStore()
const route = useRoute()
const dataTime = ref(null)
const isCheckTime = ref(false)
const listRoutes = ref([])
const routeId = ref(null)
const listWarningConfig = ref([])
const activeNames = ref(0)
const objCheckTime = ref({})

const dataStatus = ref([
  {
    id: 0,
    name: t('collection.notDoneYet')
  },
  {
    id: 1,
    name: t('collection.checkingData')
  },
  {
    id: 0,
    name: t('collection.explaining')
  },
  {
    id: 3,
    name: t('el.datepicker.end')
  }
])

onMounted(async () => {
  // initData()
  await initDataRecon()
  await handleGetAllWarning()
  // await getListRoute()
})
const initData = async () => {
  const params = {
    name: 'DataCollectResult',
  }
  const rs = await apiGetDataCollectWarning(params)
  if (rs.status === 200) {
    parameterConfig.value = rs.data
  }
}
const initDataRecon = async () => {
  const params = {
    name: 'Đối soát giao dịch'
  }
  await apiCollectPropertySystem(params)
    .then(res => {
      if (res.status === 200) {
        dataTime.value = res.data
        checkTime()
      }
    })
    .catch(err => console.error(err))
}
const handleGetAllWarning = async () => {
  await apiGetAllCollectionAlerts()
    .then(res => {
      if (res.status === 200) {
        listWarningConfig.value = res.data
        checkTimeList()
      }
    })
    .catch(err => console.error(err))
}
const checkTime = () => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  if (
    currentHour > dataTime.value.reconciliationHour ||
    (currentHour === dataTime.value.reconciliationHour && currentMinute >= dataTime.value.reconciliationMinute)
  ) {
    isCheckTime.value = true
  }
}
const checkTimeList = () => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  listWarningConfig.value.forEach((item, index) => {
    objCheckTime.value[index] = currentHour > dataTime.value.reconciliationHour ||
      (currentHour === dataTime.value.reconciliationHour && currentMinute >= dataTime.value.reconciliationMinute)
  })
}
const getStatus = (status) => {
  return dataStatus.value.find((item) => item.id === status)?.name
}
const handleReconciliation = async () => {
  await apiGetIntermittentCollect()
    .then(res => {
      if (res.status === 200) {
        ElMessage({
          message: t('configUser.message.updateSuccess'),
          type: 'success'
        })
        initData()
      }
    })
}
const getListRoute = async () => {
  await statisticalReportStore.getListRoute().then(res => {
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
    }
  }).catch(err => {
    console.log(err)
  })
}
const onChangeRouteSearch = async (value) => {
  const params = {
    routeId: value
  }
}
</script>

<template>
  <div class="padding-12">
<!--    <div class="mb-4">-->
<!--      <el-select-->
<!--        v-model="routeId"-->
<!--        class="w-full md:max-w-[30%] lg:max-w-[200px] short"-->
<!--        filterable-->
<!--        collapse-tags-->
<!--        clearable-->
<!--        @change="onChangeRouteSearch"-->
<!--        :placeholder="t('configUser.userManagement.route')"-->
<!--      >-->
<!--        <el-option-->
<!--          v-for="item in listRoutes"-->
<!--          :key="item.id"-->
<!--          :label="item.name"-->
<!--          :value="item.id"-->
<!--        />-->
<!--      </el-select>-->
<!--    </div>-->
    <div class="list-warning">
      <el-row gutter="10">
        <el-col :lg="12" :sm="24" class="item-warning" v-for="(item, index) in listWarningConfig" :key="index">
          <el-collapse v-model="activeNames" class="padding-10" accordion>
            <el-collapse-item>
              <template #title>
                <div class="">{{item.routeName}}</div>
              </template>
              <div class="group-check bg-white padding-12">
                <div class="flex-column flex gap-3 w-full mb-2">
                  <div class="group-result paddingY-12 flex items-center">
                    <svg-icon
                      v-if="item.deviceLogCollectionStatus"
                      icon-class="true-active"
                      class="svg-icon"
                    />
                    <span class="block ml-3" :class="{'text-[#059EFB] font-[600]': item.deviceLogCollectionStatus}">{{t('route.collectLogfileDevice')}}</span>
                  </div>
                  <div class="group-result paddingY-12 flex items-center">
                    <svg-icon
                      v-if="item.signalLogCollectionStatus"
                      icon-class="true-active"
                      class="svg-icon"
                    />
                    <span class="block ml-3" :class="{'text-[#059EFB] font-[600]': item.signalLogCollectionStatus}">{{t('collection.collectSignalLogfile')}}</span>
                  </div>
                  <div class="group-result paddingY-12 flex items-center">
                    <svg-icon
                      v-if="item.backendDataCollectionStatus"
                      icon-class="true-active"
                      class="svg-icon"
                    />
                    <span class="block ml-3" :class="{'text-[#059EFB] font-[600]': item.backendDataCollectionStatus}">{{t('collection.collectTransactionBe')}}</span>
                  </div>
                  <div class="group-result paddingY-12 flex items-center">
                    <svg-icon
                      v-if="item.apiDataCollectionStatus"
                      icon-class="true-active"
                      class="svg-icon"
                    />
                    <span class="block ml-3" :class="{'text-[#059EFB] font-[600]': item.apiDataCollectionStatus}">{{t('collection.collectDataApi')}}</span>
                  </div>
                  <div class="group-result paddingY-12 flex items-center">
                    <svg-icon
                      v-if="item.tdrDataCollectionStatus"
                      icon-class="true-active"
                      class="svg-icon"
                    />
                    <span class="block ml-3" :class="{'text-[#059EFB] font-[600]': item.tdrDataCollectionStatus}">{{t('collection.collectDataTdr')}}</span>
                  </div>
                  <div class="group-result paddingY-12 flex items-center">
                    <svg-icon
                      v-if="item.vehicleListCollectionStatus"
                      icon-class="true-active"
                      class="svg-icon"
                    />
                    <span class="block ml-3" :class="{'text-[#059EFB] font-[600]': item.vehicleListCollectionStatus}">{{t('collection.collectCarList')}}</span>
                  </div>
                  <div class="group-result paddingY-12 flex items-center">
                    <svg-icon
                      v-if="item.feeReportDataCollectionStatus"
                      icon-class="true-active"
                      class="svg-icon"
                    />
                    <span class="block ml-3" :class="{'text-[#059EFB] font-[600]': item.feeReportDataCollectionStatus}">{{t('collection.collectReportData')}}</span>
                  </div>
                  <!--        <el-checkbox :label="t('route.collectLogfileDevice')"-->
                  <!--                     v-model="parameterConfig.deviceLogCollectionStatus"-->
                  <!--                     disabled-->
                  <!--        />-->
                  <!--        <el-divider class="my-0"></el-divider>-->
                  <!--        <el-checkbox :label="t('collection.collectSignalLogfile')"-->
                  <!--                     v-model="parameterConfig.signalLogCollectionStatus"-->
                  <!--                     disabled-->
                  <!--        />-->
                  <!--        <el-divider class="my-0"></el-divider>-->
                  <!--        <el-checkbox :label="t('collection.collectTransactionBe')"-->
                  <!--                     v-model="parameterConfig.backendDataCollectionStatus"-->
                  <!--                     disabled-->
                  <!--        />-->
                  <!--        <el-divider class="my-0"></el-divider>-->
                  <!--        <el-checkbox :label="t('collection.collectDataApi')"-->
                  <!--                     v-model="parameterConfig.apiDataCollectionStatus"-->
                  <!--                     disabled-->
                  <!--        />-->
                  <!--        <el-divider class="my-0"></el-divider>-->
                  <!--        <el-checkbox :label="t('collection.collectDataTdr')"-->
                  <!--                     v-model="parameterConfig.tdrDataCollectionStatus"-->
                  <!--                     disabled-->
                  <!--        />-->
                  <!--        <el-divider class="my-0"></el-divider>-->
                  <!--        <el-checkbox :label="t('collection.collectCarList')"-->
                  <!--                     v-model="parameterConfig.vehicleListCollectionStatus"-->
                  <!--                     disabled-->
                  <!--        />-->
                  <!--        <el-divider class="my-0"></el-divider>-->
                  <!--        <el-checkbox :label="t('collection.collectReportData')"-->
                  <!--                     v-model="parameterConfig.feeReportDataCollectionStatus"-->
                  <!--                     disabled-->
                  <!--        />-->
                </div>
                <div class="flex items-center ml-3">
                  <div class="text-[#000000] font-[600] fs-16 mr-3">{{ t('collection.controlStatus') }}:</div>
                  <div class="text-[#000000] font-[600] fs-16 mr-3">{{ getStatus(item.reconciliationStatus) }}</div>
                  <el-button
                    v-if="objCheckTime[index] && item.reconciliationStatus === 0"
                    type="primary"
                    class="bg--dark-purple"
                    style="border: transparent"
                    @click="handleReconciliation"
                  >
                    {{ t('collection.startChecking') }}
                  </el-button>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
.group-result {
  border-bottom: 1px #EBEBEC solid;
}
:deep(.el-collapse-item) {
  background-color: #fff !important;
}
</style>
