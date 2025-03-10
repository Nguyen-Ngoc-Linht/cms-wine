<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { ElMessage } from 'element-plus'
import {
  apiAddStation,
  apiGetSupplierType,
  apiListCodeBE,
  apiUpdateStation,
  getDetailStation,
  getListRoute,
} from '@/api/expressway'
import { apiGenCategoryCode } from '@/api/category'
import lang from '@/locale/getMessage.js'
import { useAppStore, usePermissionStore } from '@/store'
import InputInteger from '@/components/InputInteger/index.vue'
import Dialog from '@/components/Dialog/index.vue'
import AddMember from '@/views/administration/category/expressway/components/addMember.vue'

const { t } = useI18n()
const { roleData } = usePermissionStore()
const appStore = useAppStore()
const locale = computed(() => lang[appStore.lang])

const router = useRouter()
const route = useRoute()
const ruleEdit = ref({
  name: [
    { required: true, message: t('omsSetting.ruleStationName'), trigger: 'blur' },
    { max: 250, message: t('omsSetting.ruleMaxLengthText'), trigger: 'blur' },
  ],
  location: [{ required: true, message: t('omsSetting.ruleLocationStation'), trigger: 'blur' }],
  codeBE: [{ required: true, message: t('omsSetting.ruleCodeStation'), trigger: 'blur' }],
  code: [{ required: true, message: t('omsSetting.ruleCodeStation'), trigger: 'blur' }],
  route: {
    id: [{ required: true, message: t('omsSetting.ruleChooseGland'), trigger: 'blur' }],
  },
  type: [{ required: true, message: t('omsSetting.ruleTypeStation'), trigger: 'blur' }],
  numberLanesIn: [
    { required: true, message: t('omsSetting.ruleExitLane'), trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const num = Number(value)
        if (!Number.isInteger(num) || num <= 0) {
          callback(new Error(t('omsSetting.ruleNumber')))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  numberLanesOut: [
    { required: true, message: t('omsSetting.ruleEntryLane'), trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const num = Number(value)
        if (!Number.isInteger(num) || num <= 0) {
          callback(new Error(t('omsSetting.ruleNumber')))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  inaugurationDay: [{ required: true, message: t('omsSetting.ruleTimePutInto'), trigger: 'blur' }],
  codeLaneExit: [{ required: true, message: t('omsSetting.ruleExitLane'), trigger: 'blur' }],
  codeLaneEntry: [{ required: true, message: t('omsSetting.ruleEntryLane'), trigger: 'blur' }],
  description: [{ max: 1000, message: t('omsSetting.ruleMaxLengthText1000'), trigger: 'blur' }],
})
const ruleUnit = ref({
  id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})

const isEdit = ref(false)
const listLoading = ref(false)
const infoDetailStation = ref({
  route: {
    id: '',
  },
  codeBE: '',
})
const gland = ref([])
const listCodeBE = ref([])
const stationType = ref([
  { name: t('configUser.inline'), type: 'inline' },
  {
    name: t('configUser.outline'),
    type: 'outline',
  },
])
const activeName = ref('serviceFE')
const stationId = ref('')
const viewStationDetail = ref(null)
const loadingPage = ref(true)
const process = ref(false)

onMounted(() => {
  setDataDefault()
  initData()
})
const getCode = () => {
  apiGenCategoryCode(2)
    .then(res => {
      infoDetailStation.value.code = res.data
    })
    .catch(_ => {
      ElMessage({
        type: 'error',
        message: 'Gen code error',
      })
    })
}
const initData = async () => {
  const rs = await getListRoute()
  if (rs.status === 200) {
    gland.value = rs.data.dataRows
  }
  const rsBE = await apiListCodeBE()
  if (rsBE.status === 200) {
    listCodeBE.value = rsBE.data
  }
  stationId.value = route.params.id
  if (stationId.value) {
    isEdit.value = true
    const rs = await getDetailStation(stationId.value)
    if (rs.status === 200) {
      infoDetailStation.value = rs.data
      setDataLanesExit(rs.data.lanes)
      const listSort = rs.data.serviceProviders ? rs.data.serviceProviders : []
      listSort.sort((a, b) => a.type - b.type)
      initServiceProvider()
      // listCodeBE.value = [rs.data.codeBE]
    }
  } else {
    infoDetailStation.value = {
      route: { id: '' },
      codeBE: '',
      lanes: [],
    }
    getCode()
  }
  loadingPage.value = false
}
const handleAddStation = async () => {
  try {
    await Promise.all([
      validateViewStationDetail(),
      validateLaneExitForm(),
      validateLaneEntryForm(),
    ])
    process.value = true
    convertData()
    infoDetailStation.value.serviceProviders = convertServiceProviders0()
    const rs = await apiAddStation(infoDetailStation.value)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.addSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      router.push(`/administration/category/expressway?activeName=station`)
    } else {
      ElMessage({
        message: t('el.image.error'),
        type: 'error',
        duration: 3 * 1000,
      })
    }
    process.value = false
  } catch (error) {
    console.log(error)
    process.value = false
  }
}
const handleEditStation = async () => {
  try {
    await Promise.all([
      validateViewStationDetail(),
      validateLaneExitForm(),
      validateLaneEntryForm(),
    ])
    process.value = true
    convertData()
    infoDetailStation.value.serviceProviders = convertServiceProviders0()
    const rs = await apiUpdateStation(infoDetailStation.value.id, infoDetailStation.value)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      router.push(`/administration/category/expressway/?activeName=station`)
    } else {
      ElMessage({
        message: t('el.image.error'),
        type: 'error',
        duration: 3 * 1000,
      })
    }
    process.value = false
  } catch (error) {
    console.log(error)
    process.value = false
  }
}
const validateViewStationDetail = () => {
  return new Promise((resolve, reject) => {
    viewStationDetail.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}
const laneExitForm = ref(null)
const validateLaneExitForm = () => {
  return new Promise((resolve, reject) => {
    laneExitForm.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form lanes thoát')
      }
    })
  })
}
const laneEntryForm = ref(null)
const validateLaneEntryForm = () => {
  return new Promise((resolve, reject) => {
    laneEntryForm.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form lanes vào')
      }
    })
  })
}
const convertData = () => {
  infoDetailStation.value.lanes = []
  for (let i = 0; i < laneExit.value.length; i++) {
    laneExit.value[i].number = laneExitData.value[`exitLane${i}`]
    infoDetailStation.value.lanes.push(laneExit.value[i])
  }

  for (let i = 0; i < laneEntry.value.length; i++) {
    laneEntry.value[i].number = laneEntryData.value[`entryLane${i}`]
    infoDetailStation.value.lanes.push(laneEntry.value[i])
  }
}
const convertServiceProviders0 = () => {
  const serviceSend = []
  if (serviceProviders1.value.id !== '' && serviceProviders1.value.id !== undefined) {
    serviceSend.push({
      id: serviceProviders1.value.id,
      type: serviceProviders1.value.type,
    })
  }
  if (serviceProviders2.value.id !== '' && serviceProviders2.value.id !== undefined) {
    serviceSend.push({
      id: serviceProviders2.value.id,
      type: serviceProviders2.value.type,
    })
  }
  if (serviceProviders3.value.id !== '' && serviceProviders3.value.id !== undefined) {
    serviceSend.push({
      id: serviceProviders3.value.id,
      type: serviceProviders3.value.type,
    })
  }
  if (serviceProviders4.value.id !== '' && serviceProviders4.value.id !== undefined) {
    serviceSend.push({
      id: serviceProviders4.value.id,
      type: serviceProviders4.value.type,
    })
  }

  return serviceSend
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
    if (listServiceProvider.value[0].length === 0) {
      listServiceProvider.value[0] = [provider1]
    }
  }
  if (provider2) {
    serviceProviders2.value = { ...provider2 }
    if (listServiceProvider.value[1].length === 1) {
      listServiceProvider.value[1] = [provider2]
    }
  }
  if (provider3) {
    serviceProviders3.value = { ...provider3 }
    if (listServiceProvider.value[2].length === 2) {
      listServiceProvider.value[2] = [provider3]
    }
  }
  if (provider4) {
    serviceProviders4.value = { ...provider4 }
    if (listServiceProvider.value[3].length === 3) {
      listServiceProvider.value[3] = [provider4]
    }
  }
}

const listTypeLane = ref([
  {
    id: 1,
    name: 'Không có Barie',
    value: 0,
  },
  {
    id: 2,
    name: 'Có Barie',
    value: 1,
  },
])
const laneExit = ref([])
const laneExitRules = ref({})
const laneExitData = ref({})
const laneEntry = ref([])
const laneEntryRules = ref({})
const laneEntryData = ref({})
const setDataLanesExit = nbLane => {
  if (!nbLane) {
    return
  }
  for (let i = 0; i < nbLane.length; i++) {
    if (nbLane[i].type === 'in') {
      laneEntry.value.push(nbLane[i])
      const lengthEntry = laneEntry.value.length
      laneEntryData.value[`entryLane${lengthEntry - 1}`] = nbLane[i].number
      laneEntryRules.value[`entryLane${lengthEntry - 1}`] = [
        {
          required: true,
          message: t('omsSetting.ruleEnter'),
          trigger: 'blur',
        },
      ]
    } else if (nbLane[i].type === 'out') {
      laneExit.value.push(nbLane[i])
      const lengthExit = laneExit.value.length
      laneExitData.value[`exitLane${lengthExit - 1}`] = nbLane[i].number
      laneExitRules.value[`exitLane${lengthExit - 1}`] = [
        {
          required: true,
          message: t('omsSetting.ruleEnter'),
          trigger: 'blur',
        },
      ]
    }
  }
}
const updateLanesExit = () => {
  const currentCount = laneExit.value.length
  const newCount = parseFloat(infoDetailStation.value.numberLanesOut)
  if (!Number.isInteger(newCount) || newCount <= 0) {
    laneExit.value = []
    return
  }
  if (currentCount < newCount) {
    for (let i = currentCount; i < newCount; i++) {
      laneExit.value.push({
        number: '',
        type: 'out',
      })
    }
  } else {
    laneExit.value.splice(newCount)
  }
  laneExitRules.value = {}
  for (let i = 0; i < newCount; i++) {
    laneExitRules.value[`exitLane${i}`] = [
      { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    ]
  }
}
const updateLanesEntry = () => {
  const currentCount = laneEntry.value.length
  const newCount = parseFloat(infoDetailStation.value.numberLanesIn)
  if (!Number.isInteger(newCount) || newCount <= 0) {
    laneEntry.value = []
    return
  }
  if (currentCount < newCount) {
    for (let i = currentCount; i < newCount; i++) {
      laneEntry.value.push({
        number: '',
        type: 'in',
        barie: 0,
      })
    }
  } else {
    laneEntry.value.splice(newCount)
  }
  laneEntryRules.value = {}
  for (let i = 0; i < newCount; i++) {
    laneEntryRules.value[`entryLane${i}`] = [
      { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    ]
  }
}
const backStationManagement = () => {
  router.push(`/administration/category/expressway?activeName=station`)
}
// const
const serviceProviders1 = ref({
  name: '',
  contactNumber: '',
  address: '',
  type: 1,
  duration: null,
  members: [],
})
const serviceProviders2 = ref({
  name: '',
  contactNumber: '',
  address: '',
  type: 1,
  duration: null,
  members: [],
})
const serviceProviders3 = ref({
  name: '',
  contactNumber: '',
  address: '',
  type: 1,
  duration: null,
  members: [],
})
const serviceProviders4 = ref({
  name: '',
  contactNumber: '',
  address: '',
  type: 1,
  duration: null,
  members: [],
})

const listServiceProvider = ref([[], [], [], []])
const setDataDefault = async () => {
  try {
    for (let i = 1; i < 5; i++) {
      const rs = await apiGetSupplierType(i)
      if (rs.status === 200) {
        listServiceProvider.value[i - 1] = rs.data
      }
    }
  } catch (e) {
    console.log(e)
  }
}
const setSupplierService = (value, typeIndex) => {
  const supplier = listServiceProvider.value[typeIndex].find(item => item.id === value)
  if (supplier) {
    if (typeIndex === 0) {
      serviceProviders1.value = { ...supplier }
    } else if (typeIndex === 1) {
      serviceProviders2.value = { ...supplier }
    } else if (typeIndex === 2) {
      serviceProviders3.value = { ...supplier }
    } else if (typeIndex === 3) {
      serviceProviders4.value = { ...supplier }
    }
  } else {
    if (typeIndex === 0) {
      serviceProviders1.value = {
        name: '',
        contactNumber: '',
        address: '',
        type: typeIndex + 1,
        duration: null,
        members: [],
      }
    } else if (typeIndex === 1) {
      serviceProviders2.value = {
        name: '',
        contactNumber: '',
        address: '',
        type: typeIndex + 1,
        duration: null,
        members: [],
      }
    } else if (typeIndex === 2) {
      serviceProviders3.value = {
        name: '',
        contactNumber: '',
        address: '',
        type: typeIndex + 1,
        duration: null,
        members: [],
      }
    } else if (typeIndex === 3) {
      serviceProviders4.value = {
        name: '',
        contactNumber: '',
        address: '',
        type: typeIndex + 1,
        duration: null,
        members: [],
      }
    }
  }
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
          <img
            src="@/assets/imgs/weightStation/back.png"
            alt=""
          />
        </div>
        <div
          v-if="!isEdit"
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('configUser.addNew') }}
        </div>
        <div
          v-else
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('configUser.editUser') }}
        </div>
      </h5>
      <el-button
        v-if="!isEdit && roleData.canCreate"
        :loading="process"
        @click="handleAddStation"
        class="el-button--main"
        >{{ $t('omsSetting.save') }}
      </el-button>
      <el-button
        v-if="isEdit && roleData.canUpdate"
        :loading="process"
        @click="handleEditStation"
        class="el-button--main"
        >{{ $t('omsSetting.update') }}
      </el-button>
    </div>
    <!--  Content  -->
    <div
      v-loading="loadingPage"
      v-if="roleData.canRead"
      class="content-page px-6 mt-4"
    >
      <div class="bg-white px-5 pt-6 pb-4">
        <el-form
          ref="viewStationDetail"
          :rules="ruleEdit"
          :model="infoDetailStation"
          class="custom-form"
        >
          <h5 class="text-black font-semibold text-lg">{{ $t('configUser.infoStation') }}</h5>
          <div class="flex justify-between gap-5 mt-4">
            <div style="width: 50%">
              <el-form-item
                :label="t('configUser.nameStation')"
                prop="name"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoDetailStation.name"
                  maxlength="250"
                  :placeholder="$t('configUser.pleaseEnter')"
                />
              </el-form-item>
            </div>
            <div style="width: 50%">
              <el-form-item
                :label="t('configUser.stationLocation')"
                prop="location"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoDetailStation.location"
                  :placeholder="$t('configUser.pleaseEnter')"
                />
              </el-form-item>
            </div>
          </div>
          <div class="flex justify-between gap-5">
            <div style="width: 50%">
              <el-form-item
                :label="t('omsSetting.stationBECode')"
                class="custom"
                prop="codeBE"
                style="display: inline-block; width: 100%"
              >
                <InputInteger
                  v-model="infoDetailStation.codeBE"
                  :max-length="5"
                  :placeholder="$t('configUser.pleaseEnter')"
                ></InputInteger>
                <!--                <el-select-->
                <!--                  v-model="infoDetailStation.codeBE.id"-->
                <!--                  filterable-->
                <!--                  collapse-tags-->
                <!--                  clearable-->
                <!--                  style="width: 100%"-->
                <!--                  :placeholder="$t('configUser.pleaseSelect')"-->
                <!--                  :disabled="isEdit"-->
                <!--                >-->
                <!--                  <el-option-->
                <!--                    v-for="item in listCodeBE"-->
                <!--                    :key="item.id"-->
                <!--                    :label="item.code"-->
                <!--                    :value="item.id"-->
                <!--                  />-->
                <!--                </el-select>-->
              </el-form-item>
            </div>
            <div style="width: 50%">
              <el-form-item
                :label="t('omsSetting.stationCode')"
                class="custom"
                prop="code"
                style="display: inline-block; width: 100%"
                required
              >
                <el-input
                  v-model="infoDetailStation.code"
                  :placeholder="$t('configUser.pleaseEnter')"
                  disabled
                >
                  <template #suffix>
                    <svg-icon
                      icon-class="plus"
                      class="cursor-pointer width-20 height-20"
                      @click="getCode"
                      v-if="!infoDetailStation.code"
                    />
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="flex justify-between gap-5">
            <div style="width: 50%">
              <el-form-item
                :label="t('omsSetting.longitude')"
                class="custom"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoDetailStation.longitude"
                  type="number"
                  :placeholder="$t('configUser.pleaseEnter')"
                />
              </el-form-item>
            </div>
            <div style="width: 50%">
              <el-form-item
                :label="t('omsSetting.latitude')"
                class="custom"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoDetailStation.latitude"
                  type="number"
                  :placeholder="$t('configUser.pleaseEnter')"
                />
              </el-form-item>
            </div>
          </div>
          <div class="flex justify-between gap-5">
            <div style="width: 50%">
              <el-form-item
                :label="$t('configUser.gland')"
                prop="route.id"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoDetailStation.route.id"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isEdit"
                >
                  <el-option
                    v-for="(item, index) in gland"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div style="width: 50%">
              <el-form-item
                :label="$t('configUser.stationType')"
                prop="type"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoDetailStation.type"
                  clearable
                  filterable
                  collapse-tags
                  style="width: 100%"
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isEdit"
                >
                  <el-option
                    v-for="item in stationType"
                    :key="item"
                    :label="item.name"
                    :value="item.type"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="flex justify-between gap-5 mt-2">
            <div style="width: 50%">
              <el-form-item
                :label="$t('configUser.stationDescription')"
                class="custom"
                prop="description"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoDetailStation.description"
                  maxlength="1000"
                  :placeholder="$t('configUser.pleaseEnter')"
                />
              </el-form-item>
            </div>
            <div style="width: 50%">
              <el-form-item
                :label="t('configUser.timePutsIntoOperation')"
                prop="inaugurationDay"
                class="custom"
                style="display: inline-block; width: 100%"
              >
                <el-date-picker
                  type="datetime"
                  v-model="infoDetailStation.inaugurationDay"
                  :placeholder="$t('configUser.pleaseSelect')"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </div>
          </div>
          <div class="flex justify-between gap-5">
            <div style="width: 50%">
              <el-form-item
                :label="t('configUser.nbOfEntryLane')"
                prop="numberLanesIn"
                class="custom"
                @change="updateLanesEntry()"
                style="display: inline-block; width: 100%"
              >
                <InputInteger
                  v-model="infoDetailStation.numberLanesIn"
                  @change="updateLanesExit()"
                  :max-length="2"
                  :placeholder="t('configUser.pleaseEnter')"
                >
                </InputInteger>
              </el-form-item>
            </div>
            <div style="width: 50%">
              <el-form-item
                :label="t('configUser.nbOfExitLane')"
                prop="numberLanesOut"
                class="custom"
                style="display: inline-block; width: 100%"
              >
                <InputInteger
                  v-model="infoDetailStation.numberLanesOut"
                  @change="updateLanesExit()"
                  :max-length="2"
                  :placeholder="t('configUser.pleaseEnter')"
                >
                </InputInteger>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="flex justify-between gap-5">
          <div style="width: 50%">
            <div v-if="infoDetailStation.numberLanesIn > 0">
              <el-row :gutter="10">
                <el-col :sm="12">
                  <h4 class="custom mb-2">
                    <span
                      style="color: red"
                      class="me-1"
                      >*</span
                    >{{ $t('configUser.numberEntryLane') }}
                  </h4>
                  <el-form
                    :model="laneEntryData"
                    :rules="laneEntryRules"
                    ref="laneEntryForm"
                  >
                    <el-form-item
                      v-for="(lane, index) in laneEntry"
                      :key="index"
                      :prop="`entryLane${index}`"
                    >
                      <el-input
                        type="number"
                        v-model="laneEntryData[`entryLane${index}`]"
                      />
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :sm="12">
                  <h4 class="custom mb-2">
                    <span
                      style="color: red"
                      class="me-1"
                      >*</span
                    >{{ $t('configUser.typeLane') }}
                  </h4>
                  <el-form>
                    <el-form-item
                      v-for="(lane, index) in laneEntry"
                      :key="index"
                    >
                      <el-select
                        v-model="lane.barie"
                        filterable
                        collapse-tags
                        style="width: 100%"
                        :placeholder="$t('configUser.pleaseSelect')"
                      >
                        <el-option
                          v-for="item in listTypeLane"
                          :key="item.id"
                          :label="item.name"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
            </div>
          </div>
          <div style="width: 50%">
            <div v-if="infoDetailStation.numberLanesOut > 0">
              <h4 class="custom mb-2">
                <span
                  style="color: red"
                  class="me-1"
                  >*</span
                >{{ $t('configUser.numberExitLane') }}
              </h4>
              <el-form
                :model="laneExitData"
                :rules="laneExitRules"
                ref="laneExitForm"
              >
                <el-form-item
                  v-for="(lane, index) in laneExit"
                  :key="index"
                  :prop="`exitLane${index}`"
                  style="width: 100%"
                >
                  <el-input
                    type="number"
                    v-model="laneExitData[`exitLane${index}`]"
                    class="w-full"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white px-5 pt-6 pb-4 mt-4 mb-8">
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
                :sm="24"
                :md="12"
              >
                <el-form
                  ref="formServiceProviders1"
                  :model="serviceProviders1"
                >
                  <el-form-item
                    :label="t('configUser.supplier')"
                    style="display: inline-block; width: 100%"
                  >
                    <el-select
                      v-model="serviceProviders1.id"
                      @change="
                        value => {
                          setSupplierService(value, 0)
                        }
                      "
                      clearable
                      filterable
                      collapse-tags
                      collapse-tags-tooltip
                      :placeholder="$t('configUser.pleaseSelect')"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in listServiceProvider[0]"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col
                :sm="24"
                :md="12"
                class="py-8"
              >
                <el-row :gutter="20">
                  <el-col :sm="12">
                    <h6 class="font-bold">{{ t('configUser.address') }}:</h6>
                  </el-col>
                  <el-col :sm="12">
                    <h6>{{ serviceProviders1.address }}</h6>
                  </el-col>
                </el-row>
                <el-row
                  :gutter="20"
                  class="mt-4"
                >
                  <el-col :sm="12">
                    <h6 class="font-bold">{{ t('configUser.phoneNumber1') }}:</h6>
                  </el-col>
                  <el-col :sm="12">
                    <h6>{{ serviceProviders1.contactNumber }}</h6>
                  </el-col>
                </el-row>
                <el-row
                  :gutter="20"
                  class="mt-4"
                >
                  <el-col :sm="12">
                    <h6 class="font-bold">{{ t('configUser.servicePeriod') }}:</h6>
                  </el-col>
                  <el-col :sm="12">
                    <h6>
                      {{ serviceProviders1.duration }}
                      {{ serviceProviders1.duration ? t('el.datepicker.year') : '' }}
                    </h6>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div class="mt-2">
              <h5 class="text-black font-semibold text-lg">{{ t('configUser.listMembers') }}</h5>
              <el-table
                v-loading="listLoading"
                :data="serviceProviders1.members"
                fit
                row-key="id"
                highlight-current-row
                style="width: 100%"
                class="cell-main-3 table-station"
              >
                <el-table-column
                  type="index"
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
                <el-table-column label="Email">
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
                :sm="24"
                :md="12"
              >
                <el-form
                  ref="formServiceProviders2"
                  :model="serviceProviders2"
                >
                  <el-form-item
                    :label="t('configUser.supplier')"
                    style="display: inline-block; width: 100%"
                  >
                    <el-select
                      v-model="serviceProviders2.id"
                      @change="
                        value => {
                          setSupplierService(value, 1)
                        }
                      "
                      clearable
                      filterable
                      collapse-tags
                      collapse-tags-tooltip
                      :placeholder="$t('configUser.pleaseSelect')"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in listServiceProvider[1]"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col
                :sm="24"
                :md="12"
                class="py-8"
              >
                <el-row :gutter="20">
                  <el-col :sm="12">
                    <h6 class="font-bold">{{ t('configUser.address') }}:</h6>
                  </el-col>
                  <el-col :sm="12">
                    <h6>{{ serviceProviders2.address }}</h6>
                  </el-col>
                </el-row>
                <el-row
                  :gutter="20"
                  class="mt-4"
                >
                  <el-col :sm="12">
                    <h6 class="font-bold">{{ t('configUser.phoneNumber1') }}:</h6>
                  </el-col>
                  <el-col :sm="12">
                    <h6>{{ serviceProviders2.contactNumber }}</h6>
                  </el-col>
                </el-row>
                <el-row
                  :gutter="20"
                  class="mt-4"
                >
                  <el-col :sm="12">
                    <h6 class="font-bold">{{ t('configUser.servicePeriod') }}:</h6>
                  </el-col>
                  <el-col :sm="12">
                    <h6>
                      {{ serviceProviders2.duration }}
                      {{ serviceProviders2.duration ? t('el.datepicker.year') : '' }}
                    </h6>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div class="mt-2">
              <h5 class="text-black font-semibold text-lg">{{ t('configUser.listMembers') }}</h5>
              <el-table
                v-loading="listLoading"
                :data="serviceProviders2.members"
                fit
                row-key="id"
                highlight-current-row
                style="width: 100%"
                class="cell-main-3 table-station"
              >
                <el-table-column
                  type="index"
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
                <el-table-column label="Email">
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
                :sm="24"
                :md="12"
              >
                <el-form
                  ref="formServiceProviders3"
                  :model="serviceProviders3"
                >
                  <el-form-item
                    :label="t('configUser.supplier')"
                    style="display: inline-block; width: 100%"
                  >
                    <el-select
                      v-model="serviceProviders3.id"
                      @change="
                        value => {
                          setSupplierService(value, 2)
                        }
                      "
                      clearable
                      filterable
                      collapse-tags
                      collapse-tags-tooltip
                      :placeholder="$t('configUser.pleaseSelect')"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in listServiceProvider[2]"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col
                :sm="24"
                :md="12"
                class="py-8"
              >
                <el-row :gutter="20">
                  <el-col :sm="12">
                    <h6 class="font-bold">{{ t('configUser.address') }}:</h6>
                  </el-col>
                  <el-col :sm="12">
                    <h6>{{ serviceProviders3.address }}</h6>
                  </el-col>
                </el-row>
                <el-row
                  :gutter="20"
                  class="mt-4"
                >
                  <el-col :sm="12">
                    <h6 class="font-bold">{{ t('configUser.phoneNumber1') }}:</h6>
                  </el-col>
                  <el-col :sm="12">
                    <h6>{{ serviceProviders3.contactNumber }}</h6>
                  </el-col>
                </el-row>
                <el-row
                  :gutter="20"
                  class="mt-4"
                >
                  <el-col :sm="12">
                    <h6 class="font-bold">{{ t('configUser.servicePeriod') }}:</h6>
                  </el-col>
                  <el-col :sm="12">
                    <h6>
                      {{ serviceProviders3.duration }}
                      {{ serviceProviders3.duration ? t('el.datepicker.year') : '' }}
                    </h6>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div class="mt-2">
              <h5 class="text-black font-semibold text-lg">{{ t('configUser.listMembers') }}</h5>
              <el-table
                v-loading="listLoading"
                :data="serviceProviders3.members"
                fit
                row-key="id"
                highlight-current-row
                style="width: 100%"
                class="cell-main-3 table-station"
              >
                <el-table-column
                  type="index"
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
                <el-table-column label="Email">
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
                :sm="24"
                :md="12"
              >
                <el-form
                  ref="formServiceProviders4"
                  :model="serviceProviders4"
                >
                  <el-form-item
                    :label="t('configUser.supplier')"
                    style="display: inline-block; width: 100%"
                  >
                    <el-select
                      v-model="serviceProviders4.id"
                      @change="
                        value => {
                          setSupplierService(value, 3)
                        }
                      "
                      clearable
                      filterable
                      collapse-tags
                      collapse-tags-tooltip
                      :placeholder="$t('configUser.pleaseSelect')"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in listServiceProvider[3]"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col
                :sm="24"
                :md="12"
                class="py-8"
              >
                <el-row :gutter="20">
                  <el-col :sm="12">
                    <h6 class="font-bold">{{ t('configUser.address') }}:</h6>
                  </el-col>
                  <el-col :sm="12">
                    <h6>{{ serviceProviders4.address }}</h6>
                  </el-col>
                </el-row>
                <el-row
                  :gutter="20"
                  class="mt-4"
                >
                  <el-col :sm="12">
                    <h6 class="font-bold">{{ t('configUser.phoneNumber1') }}:</h6>
                  </el-col>
                  <el-col :sm="12">
                    <h6>{{ serviceProviders4.contactNumber }}</h6>
                  </el-col>
                </el-row>
                <el-row
                  :gutter="20"
                  class="mt-4"
                >
                  <el-col :sm="12">
                    <h6 class="font-bold">{{ t('configUser.servicePeriod') }}:</h6>
                  </el-col>
                  <el-col :sm="12">
                    <h6>
                      {{ serviceProviders4.duration }}
                      {{ serviceProviders4.duration ? t('el.datepicker.year') : '' }}
                    </h6>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div class="mt-2">
              <h5 class="text-black font-semibold text-lg">{{ t('configUser.listMembers') }}</h5>
              <el-table
                v-loading="listLoading"
                :data="serviceProviders4.members"
                fit
                row-key="id"
                highlight-current-row
                style="width: 100%"
                class="cell-main-3 table-station"
              >
                <el-table-column
                  type="index"
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
                <el-table-column label="Email">
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
.custom {
  color: #525b73;
  font-weight: 600 !important;

  .el-form-item__label {
    color: #525b73;
    font-weight: 600 !important;
  }
}

.table-custom {
  .height-32 {
    height: 34px !important;
  }
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

.table-station {
  .delete-row {
    display: none;
  }
}
</style>
