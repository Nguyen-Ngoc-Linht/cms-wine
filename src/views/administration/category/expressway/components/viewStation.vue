<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { getDetailStation } from '@/api/expressway'
import { dayjs } from 'element-plus'
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const listLoading = ref(false)
const infoDetailStation = ref({})
const activeName = ref('serviceFE')
const stationId = ref('')
const laneExit = ref([])
const laneEntry = ref([])
const serviceProviders = ref([
  {
    name: '',
    contactNumber: '',
    address: '',
    type: 1,
    members: [],
  },
  {
    name: '',
    contactNumber: '',
    address: '',
    type: 2,
    members: [],
  },
  {
    name: '',
    contactNumber: '',
    address: '',
    type: 3,
    members: [],
  },
  {
    name: '',
    contactNumber: '',
    address: '',
    type: 4,
    members: [],
  },
])

onMounted(() => {
  initData()
})

const initData = async () => {
  listLoading.value = true
  stationId.value = route.params.id
  if (stationId.value) {
    const rs = await getDetailStation(stationId.value)
    if (rs.status === 200) {
      infoDetailStation.value = rs.data
      setDataLane(rs.data.lanes)
      const listServiceProviders = rs.data.serviceProviders || []
      listServiceProviders.sort((a, b) => a.type - b.type)
      initServiceProvider()
    }
  } else {
    infoDetailStation.value = {
      route: { id: '' },
      codeBE: { id: '' },
      lanes: [],
    }
  }
  listLoading.value = false
}

const initServiceProvider = () => {
  const provider = infoDetailStation.value.serviceProviders
  if (!provider) return
  const provider1 = provider.find(item => item.type === 1)
  const provider2 = provider.find(item => item.type === 2)
  const provider3 = provider.find(item => item.type === 3)
  const provider4 = provider.find(item => item.type === 4)
  if (provider1) {
    serviceProviders1.value = { ...provider1 }
  }
  if (provider2) {
    serviceProviders2.value = { ...provider2 }
  }
  if (provider3) {
    serviceProviders3.value = { ...provider3 }
  }
  if (provider4) {
    serviceProviders4.value = { ...provider4 }
  }
}
const serviceProviders1 = ref({
  name: '',
  contactNumber: '',
  address: '',
  type: 1,
  duration: 0,
  members: [],
})
const serviceProviders2 = ref({
  name: '',
  contactNumber: '',
  address: '',
  type: 1,
  duration: 0,
  members: [],
})
const serviceProviders3 = ref({
  name: '',
  contactNumber: '',
  address: '',
  type: 1,
  duration: 0,
  members: [],
})
const serviceProviders4 = ref({
  name: '',
  contactNumber: '',
  address: '',
  type: 1,
  duration: 0,
  members: [],
})
const setDataLane = nbLane => {
  if (!nbLane) {
    return
  }
  for (let i = 0; i < nbLane.length; i++) {
    if (nbLane[i].type === 'in') {
      laneEntry.value.push(nbLane[i])
    } else if (nbLane[i].type === 'out') {
      laneExit.value.push(nbLane[i])
    }
  }
}
const formatDate = dateStr => {
  return dayjs(dateStr).format('DD/MM/YYYY')
}
const backStationManagement = () => {
  router.push(`/administration/category/expressway?activeName=station`)
}
</script>

<template>
  <div>
    <div class="w-full bg-white flex items-center justify-between px-4 py-3">
      <h5 class="flex items-center">
        <div
          class="back pointer"
          @click="backStationManagement"
        >
          <img src="@/assets/imgs/weightStation/back.png" />
        </div>
        <div class="ms-2 text-2xl font-bold">
          {{ infoDetailStation.name }}
        </div>
      </h5>
    </div>
    <!--  Content  -->
    <div class="content-page px-6 mt-4">
      <div class="bg-white px-5 pt-6 pb-4">
        <el-form
          ref="infoDetailFareTable"
          :model="infoDetailStation"
        >
          <h5 class="text-black font-semibold text-lg">{{ $t('configUser.infoStation') }}</h5>
          <el-row :gutter="12">
            <el-col
              class="mt-3"
              :sm="12"
              :span="24"
            >
              <div class="flex">
                <label
                  class="custom mb-0"
                  style="width: 40%"
                  >{{ $t('configUser.nameStation') }}:</label
                >
                <p
                  style="flex: 1"
                  class="mb-0 text-label"
                >
                  {{ infoDetailStation.name }}
                </p>
              </div>
            </el-col>
            <el-col
              class="mt-3"
              :sm="12"
              :span="24"
            >
              <div class="flex">
                <label
                  class="custom mb-0"
                  style="width: 40%"
                  >{{ $t('configUser.stationLocation') }}:</label
                >
                <p
                  style="flex: 1"
                  class="mb-0 text-label"
                >
                  {{ infoDetailStation.location }}
                </p>
              </div>
            </el-col>
            <el-col
              class="mt-3"
              :sm="12"
              :span="24"
            >
              <div class="flex">
                <label
                  class="custom mb-0"
                  style="width: 40%"
                  >{{ $t('omsSetting.stationCode') }}:</label
                >
                <p
                  style="flex: 1"
                  class="mb-0 text-label"
                >
                  {{ infoDetailStation.code ? infoDetailStation.code : '' }}
                </p>
              </div>
            </el-col>
            <el-col
              class="mt-3"
              :sm="12"
              :span="24"
            >
              <div class="flex">
                <label
                  class="custom mb-0"
                  style="width: 40%"
                  >{{ $t('omsSetting.stationBECode') }}:</label
                >
                <p
                  style="flex: 1"
                  class="mb-0 text-label"
                >
                  {{ infoDetailStation.codeBE }}
                </p>
              </div>
            </el-col>
            <el-col
              class="mt-3"
              :sm="12"
              :span="24"
            >
              <div class="flex">
                <label
                  class="custom mb-0"
                  style="width: 40%"
                  >{{ $t('omsSetting.longitude') }}:</label
                >
                <p
                  style="flex: 1"
                  class="mb-0 text-label"
                >
                  {{ infoDetailStation.longitude }}
                </p>
              </div>
            </el-col>
            <el-col
              class="mt-3"
              :sm="12"
              :span="24"
            >
              <div class="flex">
                <label
                  class="custom mb-0"
                  style="width: 40%"
                  >{{ $t('omsSetting.latitude') }}:</label
                >
                <p
                  style="flex: 1"
                  class="mb-0 text-label"
                >
                  {{ infoDetailStation.latitude }}
                </p>
              </div>
            </el-col>
            <el-col
              class="mt-3"
              :sm="12"
              :span="24"
            >
              <div class="flex">
                <label
                  class="custom mb-0"
                  style="width: 40%"
                  >{{ $t('configUser.stationType') }}:</label
                >
                <p
                  v-if="infoDetailStation.type === 'inline'"
                  style="flex: 1"
                  class="mb-0 text-label"
                >
                  {{ t('configUser.inline') }}
                </p>
                <p
                  v-if="infoDetailStation.type === 'outline'"
                  style="flex: 1"
                  class="mb-0 text-label"
                >
                  {{ t('configUser.outline') }}
                </p>
              </div>
            </el-col>
            <el-col
              class="mt-3"
              :sm="12"
              :span="24"
            >
              <div class="flex">
                <label
                  class="custom mb-0"
                  style="width: 40%"
                  >{{ $t('configUser.gland') }}:</label
                >
                <p
                  style="flex: 1"
                  class="mb-0 text-label"
                >
                  {{ infoDetailStation.route ? infoDetailStation.route.name : '' }}
                </p>
              </div>
            </el-col>
            <el-col
              class="mt-3"
              :sm="12"
              :span="24"
            >
              <div class="flex">
                <label
                  class="custom mb-0"
                  style="width: 40%"
                  >{{ $t('configUser.timePutsIntoOperation') }}:</label
                >
                <p
                  style="flex: 1"
                  class="mb-0 text-label"
                >
                  {{
                    infoDetailStation.inaugurationDay
                      ? formatDate(infoDetailStation.inaugurationDay)
                      : ''
                  }}
                </p>
              </div>
            </el-col>
            <el-col
              class="mt-3"
              :sm="12"
              :span="24"
            >
              <div class="flex">
                <label
                  class="custom mb-0"
                  style="width: 40%"
                  >{{ $t('configUser.stationDescription') }}:</label
                >
                <p
                  style="flex: 1"
                  class="mb-0 text-label"
                >
                  {{ infoDetailStation.description }}
                </p>
              </div>
            </el-col>
            <el-col
              class="mt-3"
              :sm="12"
              :span="24"
            >
              <div class="flex">
                <label
                  class="custom mb-0"
                  style="width: 40%"
                  >{{ $t('configUser.nbOfExitLane') }}:</label
                >
                <p
                  style="flex: 1"
                  class="mb-0 text-label"
                >
                  {{ infoDetailStation.numberLanesOut }}
                </p>
              </div>
            </el-col>
            <el-col
              class="mt-3"
              :sm="12"
              :span="24"
            >
              <div class="flex">
                <label
                  class="custom mb-0"
                  style="width: 40%"
                  >{{ $t('configUser.nbOfEntryLane') }}:</label
                >
                <p
                  style="flex: 1"
                  class="mb-0 text-label"
                >
                  {{ infoDetailStation.numberLanesIn }}
                </p>
              </div>
            </el-col>
            <el-col
              class="mt-3"
              :sm="12"
              :span="24"
            >
              <div class="flex">
                <label
                  class="custom mb-0"
                  style="width: 40%"
                  >{{ $t('configUser.numberExitLane') }}:</label
                >
                <div class="flex-column flex">
                  <p
                    v-for="item of laneExit"
                    :key="item.id"
                    style="flex: 1"
                    class="mb-0 text-label mt-2"
                  >
                    {{ item.number }}
                  </p>
                </div>
              </div>
            </el-col>
            <el-col
              class="mt-3"
              :sm="12"
              :span="24"
            >
              <div class="flex">
                <label
                  class="custom mb-0"
                  style="width: 40%"
                  >{{ $t('configUser.numberEntryLane') }}:</label
                >
                <div class="flex-column flex">
                  <p
                    v-for="item of laneEntry"
                    :key="item.id"
                    style="flex: 1"
                    class="mb-0 text-label mt-2"
                  >
                    {{ item.number }}
                  </p>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="bg-white px-5 pt-6 pb-4 mt-4">
        <el-tabs
          v-model="activeName"
          class="tab-expressway"
        >
          <el-tab-pane
            :label="$t('configUser.serviceProviderFe')"
            name="serviceFE"
          >
            <el-row :gutter="20">
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.supplier') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{ serviceProviders1.name }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.address') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{ serviceProviders1.address }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.phoneNumber1') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{ serviceProviders1.contactNumber }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.servicePeriod') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{
                        serviceProviders1.duration !== 0 && serviceProviders1.duration !== null
                          ? `${serviceProviders1.duration} ${t('el.datepicker.year')}`
                          : ''
                      }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div class="mt-3">
              <h5 class="text-black font-semibold text-lg">{{ t('configUser.listMembers') }}</h5>
              <el-table
                v-loading="listLoading"
                :data="serviceProviders1.members"
                row-key="id"
                fit
                style="width: 100%"
                class="cell-main-3"
              >
                <el-table-column
                  label="STT"
                  width="55"
                >
                  <template #default="{ $index }">
                    <span>{{ $index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="
                    $t('administration.category.administrativeDepartment.nameOfTheResponsible')
                  "
                >
                  <template #default="{ row }">
                    <span :title="row.name">{{ row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('configUser.phoneNumber1')">
                  <template #default="{ row }">
                    <span>{{ row.contactNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="'Email'">
                  <template #default="{ row }">
                    <span>{{ row.email }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane
            :label="$t('configUser.serviceProviderBE')"
            name="serviceBE"
          >
            <el-row :gutter="20">
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.supplier') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{ serviceProviders2.name }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.address') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{ serviceProviders2.address }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.phoneNumber1') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{ serviceProviders2.contactNumber }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.servicePeriod') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{
                        serviceProviders2.duration !== 0 && serviceProviders2.duration !== null
                          ? `${serviceProviders2.duration} ${t('el.datepicker.year')}`
                          : ''
                      }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div class="mt-3">
              <h5 class="text-black font-semibold text-lg">{{ t('configUser.listMembers') }}</h5>
              <el-table
                v-loading="listLoading"
                :data="serviceProviders2.members"
                row-key="id"
                fit
                style="width: 100%"
                class="cell-main-3"
              >
                <el-table-column
                  label="STT"
                  width="55"
                >
                  <template #default="{ $index }">
                    <span>{{ $index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="
                    $t('administration.category.administrativeDepartment.nameOfTheResponsible')
                  "
                >
                  <template #default="{ row }">
                    <span :title="row.name">{{ row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('configUser.phoneNumber1')">
                  <template #default="{ row }">
                    <span>{{ row.contactNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="'Email'">
                  <template #default="{ row }">
                    <span>{{ row.email }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane
            :label="$t('configUser.miningOperatingUnit')"
            name="miningOperating"
          >
            <el-row :gutter="20">
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.supplier') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{ serviceProviders3.name }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.address') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{ serviceProviders3.address }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.phoneNumber1') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{ serviceProviders3.contactNumber }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.servicePeriod') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{
                        serviceProviders3.duration !== 0 && serviceProviders3.duration
                          ? `${serviceProviders3.duration} ${t('el.datepicker.year')}`
                          : ''
                      }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div class="mt-3">
              <h5 class="text-black font-semibold text-lg">{{ t('configUser.listMembers') }}</h5>
              <el-table
                v-loading="listLoading"
                :data="serviceProviders3.members"
                row-key="id"
                fit
                style="width: 100%"
                class="cell-main-3"
              >
                <el-table-column
                  label="STT"
                  width="55"
                >
                  <template #default="{ $index }">
                    <span>{{ $index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="
                    $t('administration.category.administrativeDepartment.nameOfTheResponsible')
                  "
                >
                  <template #default="{ row }">
                    <span :title="row.name">{{ row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('configUser.phoneNumber1')">
                  <template #default="{ row }">
                    <span>{{ row.contactNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="'Email'">
                  <template #default="{ row }">
                    <span>{{ row.email }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane
            :label="$t('configUser.managementUnit')"
            name="managementUnit"
          >
            <el-row :gutter="20">
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.supplier') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{ serviceProviders4.name }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.address') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{ serviceProviders4.address }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.phoneNumber1') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{ serviceProviders4.contactNumber }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col
                class="mt-4"
                :sm="12"
              >
                <el-row>
                  <el-col
                    :lg="10"
                    :sm="12"
                  >
                    <label class="custom"> {{ t('configUser.servicePeriod') }}: </label>
                  </el-col>
                  <el-col
                    :lg="14"
                    :sm="12"
                  >
                    <p class="text-label mb-0">
                      {{
                        serviceProviders4.duration !== 0 && serviceProviders4.duration
                          ? `${serviceProviders4.duration} ${t('el.datepicker.year')}`
                          : ''
                      }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div class="mt-3">
              <h5 class="text-black font-semibold text-lg">{{ t('configUser.listMembers') }}</h5>
              <el-table
                v-loading="listLoading"
                :data="serviceProviders4.members"
                row-key="id"
                fit
                style="width: 100%"
                class="cell-main-3"
              >
                <el-table-column
                  label="STT"
                  width="55"
                >
                  <template #default="{ $index }">
                    <span>{{ $index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="
                    $t('administration.category.administrativeDepartment.nameOfTheResponsible')
                  "
                >
                  <template #default="{ row }">
                    <span :title="row.name">{{ row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('configUser.phoneNumber1')">
                  <template #default="{ row }">
                    <span>{{ row.contactNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="'Email'">
                  <template #default="{ row }">
                    <span>{{ row.email }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
:deep(el-form-item) {
  display: flex;
  --font-size: 14px;
  margin-bottom: 8px;
  margin-top: 8px;
}

:deep(el-form-item--default) {
  --font-size: 14px;
  --el-form-label-font-size: var(--font-size);
  margin-bottom: 14px;
  margin-top: 14px;
}
</style>
<style lang="scss">
.custom {
  color: #525b73;
  font-weight: 600 !important;
}

.table-custom {
  .height-32 {
    height: 34px !important;
  }
}

.text-label {
  color: #525b73;
  font-size: 14px;
  font-weight: 400;
}

.tab-expressway {
  .el-tabs__item {
    padding: 12px 0px !important;
    min-width: 200px;
    width: 100%;
    height: 46px;
    font-size: 14px;
    line-height: 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    list-style: none;
    font-weight: 500;
    color: #76809b;
    //background-color: #ebebec;
    border-bottom: 2px solid #cdcdce;
    position: relative;

    &.is-active {
      //background-color: white;
      color: #059efb;
    }
  }

  .el-tabs__active-bar {
    background-color: #059efb;
  }
}
</style>
