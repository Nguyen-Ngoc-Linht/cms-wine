<template>
  <div>
    <div class="w-full bg-white flex items-center justify-between px-4 py-3">
      <h5 class="flex items-center">
        <div
          class="back pointer"
          @click="backFareTable"
        >
          <img src="@/assets/imgs/weightStation/back.png" />
        </div>
        <div
          v-if="!isEdit"
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('configUser.addNew') }}
        </div>
        <div
          v-if="isEdit && !isView"
          class="ms-2 text-2xl font-bold"
        >
          {{ $t('configUser.editUser') }}
        </div>
        <div
          v-if="isView"
          class="ms-2 text-2xl font-bold"
        >
          {{ infoFareTable.name }}
        </div>
      </h5>
      <el-button
        v-if="!isEdit && roleData.canCreate"
        @click="handleAddFareTable"
        class="el-button--main"
        >{{ $t('omsSetting.save') }}</el-button
      >
      <el-button
        v-if="isEdit && !isView && roleData.canUpdate"
        @click="updateFareTable"
        class="el-button--main"
        >{{ $t('omsSetting.update') }}</el-button
      >
    </div>
    <!--  Content  -->
    <div
      v-if="roleData.canRead"
      class="content-page px-6 mt-4"
    >
      <div class="bg-white px-5 pt-6 pb-4">
        <el-form
          ref="infoDetailFareTable"
          :rules="ruleEdit"
          :model="infoFareTable"
          class="custom-form"
        >
          <h5 class="text-black font-semibold text-lg">{{ $t('configUser.fareTableInfo') }}</h5>
          <div class="flex justify-between gap-5 mt-4">
            <div style="width: 50%">
              <el-form-item
                :label="t('configUser.nameFareTable')"
                prop="name"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoFareTable.name"
                  maxlength="250"
                  :placeholder="$t('configUser.pleaseEnter')"
                  :disabled="isView"
                />
              </el-form-item>
            </div>
            <div style="width: 50%">
              <el-form-item
                :label="t('configUser.gland')"
                prop="route.id"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-select
                  v-model="infoFareTable.route.id"
                  clearable
                  filterable
                  collapse-tags
                  @change="
                    value => {
                      setSelectStation(value)
                    }
                  "
                  style="width: 100%"
                  :placeholder="$t('configUser.pleaseSelect')"
                  :disabled="isEdit"
                >
                  <el-option
                    v-for="item in listRoute"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="flex justify-between gap-5">
            <div style="width: 50%">
              <el-form-item
                :label="t('configUser.regulatoryName')"
                prop="regulation"
                class="custom"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoFareTable.regulation"
                  maxlength="1000"
                  :placeholder="$t('configUser.pleaseEnter')"
                  :disabled="isView"
                />
              </el-form-item>
            </div>
            <div style="width: 50%"></div>
          </div>
          <h5 class="text-black font-semibold text-lg">
            {{ $t('configUser.unusualTransactionsInfo') }}
          </h5>
          <div class="flex justify-between gap-5 mt-2">
            <div style="width: 50%">
              <el-form-item
                :label="t('configUser.unspecifiedInput')"
                prop="inputNotIdentified"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoFareTable.inputNotIdentified"
                  type="number"
                  :placeholder="$t('configUser.pleaseEnter')"
                  :disabled="isView"
                />
              </el-form-item>
            </div>
            <div style="width: 50%">
              <el-form-item
                :label="$t('configUser.furthestAccordings')"
                prop="maxDistanceCharge"
                class="custom mb-2"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoFareTable.maxDistanceCharge"
                  type="number"
                  :placeholder="$t('configUser.pleaseEnter')"
                  :disabled="isView"
                />
              </el-form-item>
            </div>
          </div>
          <div class="flex justify-between gap-5">
            <div style="width: 50%">
              <el-form-item
                :label="t('configUser.vehicleRecovery')"
                prop="uTurnRecovery"
                class="custom"
                style="display: inline-block; width: 100%"
              >
                <el-input
                  v-model="infoFareTable.uTurnRecovery"
                  type="number"
                  :placeholder="$t('configUser.pleaseEnter')"
                  :disabled="isView"
                />
              </el-form-item>
            </div>
            <div style="width: 50%"></div>
          </div>
        </el-form>
      </div>

      <div class="bg-white px-5 pt-6 pb-4 mt-4">
        <h5 class="text-black font-semibold text-lg">
          <span
            style="color: red"
            class="me-1"
            >*</span
          >
          {{ $t('configUser.fareInformation') }}
        </h5>
        <div class="mt-4">
          <el-table
            v-loading="listLoading"
            :data="listInfoFarePrice"
            row-key="id"
            fit
            highlight-current-row
            style="width: 100%"
            class="cell-main-3 table-custom"
          >
            <el-table-column
              class="padding-table"
              label="STT"
              width="60"
            >
              <template #default="{ $index }">
                <span>{{ $index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="t('configUser.nameFare')">
              <template #default="{ row, $index }">
                <el-form
                  :model="row"
                  :rules="ruleFarePrice"
                  :ref="formRefsName[$index]"
                  :key="'form_' + $index"
                >
                  <el-form-item
                    prop="name"
                    :key="'name_' + row.id"
                  >
                    <el-input
                      v-model="row.name"
                      maxlength="250"
                      style="width: 200px"
                      :placeholder="$t('configUser.nameFare')"
                      :disabled="isView"
                    />
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('configUser.entryStation')"
              width="250"
            >
              <template #default="{ row, $index }">
                <el-form
                  :model="row"
                  :rules="ruleFarePrice"
                  :ref="formRefsStationIn[$index]"
                  :key="'form_' + $index"
                >
                  <el-form-item
                    prop="stationIn.id"
                    :key="'stationIn_' + row.id"
                  >
                    <el-select
                      v-model="row.stationIn.id"
                      :placeholder="$t('configUser.entryStation')"
                      clearable
                      filterable
                      collapse-tags
                      collapse-tags-tooltip
                      class="width-200 height-32"
                      :disabled="isEdit && row.isEdit"
                    >
                      <el-option
                        v-for="item in listStationByRouteId"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('configUser.exitStation')"
              width="250"
            >
              <template #default="{ row, $index }">
                <el-form
                  :model="row"
                  :rules="ruleFarePrice"
                  :ref="formRefsStationOut[$index]"
                  :key="'form_' + $index"
                >
                  <el-form-item
                    prop="stationOut.id"
                    :key="'stationOut_' + row.id"
                  >
                    <el-select
                      v-model="row.stationOut.id"
                      :placeholder="t('configUser.exitStation')"
                      clearable
                      filterable
                      collapse-tags
                      collapse-tags-tooltip
                      class="width-200 height-32"
                      :disabled="isEdit && row.isEdit"
                    >
                      <el-option
                        v-for="item in listStationByRouteId"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('configUser.vehicleType')"
              width="250"
            >
              <template #default="{ row, $index }">
                <el-form
                  :model="row"
                  :rules="ruleFarePrice"
                  :ref="formRefsStationVehicle[$index]"
                  :key="'form_' + $index"
                >
                  <el-form-item
                    prop="vehicleType"
                    :key="'vehicleType_' + row.id"
                  >
                    <el-select
                      v-model="row.vehicleType"
                      :placeholder="t('configUser.vehicleType')"
                      clearable
                      filterable
                      collapse-tags
                      collapse-tags-tooltip
                      class="width-200 height-32"
                      :disabled="isEdit && row.isEdit"
                    >
                      <el-option
                        v-for="item in typeVehicle"
                        :key="item.type"
                        :label="item.name"
                        :value="item.type"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('configUser.value')"
              width="250"
            >
              <template #default="{ row, $index }">
                <el-form
                  :model="row"
                  :rules="ruleFarePrice"
                  :ref="formRefsPrice[$index]"
                  :key="'form_' + $index"
                >
                  <el-form-item
                    prop="price"
                    :key="'price_' + row.id"
                  >
                    <InputInteger
                      v-model="row.price"
                      :max-length="6"
                      :placeholder="t('configUser.value')"
                      :disabled="isView"
                      style="width: 200px"
                    >
                    </InputInteger>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column :label="t('configUser.operation')">
              <template #default="{ row, $index }">
                <span
                  v-if="!isView"
                  @click.stop="openDialogDelete(row, $index)"
                  class="delete-member pointer"
                >
                  <svg-icon
                    style="width: 24px; height: 24px"
                    icon-class="remove-administrative"
                  />
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            text
            size="default"
            @click="addFarePrice"
            class="!p-0 my-3 ms-4 px-3"
            v-if="!isView"
          >
            <div
              class="flex items-center text-lg pointer text--success font-bold"
              style="line-height: 20px"
            >
              <span class="text-2xl me-2">+</span>
              {{ $t('configUser.addFare') }}
            </div>
          </el-button>
          <hr
            v-if="!isView"
            class="margin-bottom-12"
          />
        </div>
      </div>
    </div>

    <el-dialog
      v-model="deleteFarePriceDialog"
      :title="$t('configUser.deleteFare')"
      width="500"
      align-center
    >
      <span>{{ $t('omsSetting.confirmDelete') }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="bg-outline-secondary"
            @click="deleteFarePriceDialog = false"
          >
            {{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            class="el-button--main"
            @click="deleteFarePrice"
          >
            {{ $t('el.datepicker.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/locale'
import { getListRoute, getListStation } from '@/api/expressway'
import { apiAddFareTable, apiGetDetailsFareTable, apiUpdateFareTable } from '@/api/fare-table'
import { ElMessage } from 'element-plus'
import InputInteger from '@/components/InputInteger/index.vue'
import { usePermissionStore } from '@/store'
const { t } = useI18n()
const { roleData } = usePermissionStore()
const router = useRouter()
const route = useRoute()
const ruleEdit = ref({
  name: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 250, message: t('omsSetting.ruleMaxLengthText'), trigger: 'blur' },
  ],
  route: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  regulation: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 1000, message: t('omsSetting.ruleMaxLengthText1000'), trigger: 'blur' },
  ],
  inputNotIdentified: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  maxDistanceCharge: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  uTurnRecovery: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})
const listLoading = ref(false)
const listInfoFarePrice = ref([])
const infoFareTable = ref({
  route: {
    id: '',
  },
})
const isEdit = ref(false)
const deleteFarePriceDialog = ref(false)
const indexDeleteFarePrice = ref(null)
const fareTableId = ref('')
const infoDetailFareTable = ref(null) // valid form
const listRoute = ref([])
const listStationByRouteId = ref([])
const typeVehicle = ref([
  {
    type: 'TYPE_1',
    name: 'Loại 1',
  },
  {
    type: 'TYPE_2',
    name: 'Loại 2',
  },
  {
    type: 'TYPE_3',
    name: 'Loại 3',
  },
  {
    type: 'TYPE_4',
    name: 'Loại 4',
  },
  {
    type: 'TYPE_5',
    name: 'Loại 5',
  },
])
const isView = ref(false)

onMounted(() => {
  initData()
})

const initData = async () => {
  fareTableId.value = route.params.id
  const isActive = route.query.action
  if (isActive) {
    isView.value = true
  }
  const rs = await getListRoute()
  if (rs.status === 200) {
    listRoute.value = rs.data.dataRows
  }
  if (fareTableId.value) {
    isEdit.value = true
    const rs = await apiGetDetailsFareTable(fareTableId.value)
    if (rs.status === 200) {
      infoFareTable.value = rs.data
      setSelectStation(rs.data.route.id)
      listInfoFarePrice.value = rs.data.fareDetails ? rs.data.fareDetails : []
      if (listInfoFarePrice.value.length > 0) {
        // eslint-disable-next-line array-callback-return
        listInfoFarePrice.value.map(item => {
          item.isEdit = true
          formRefsPrice.value.push(ref())
          formRefsName.value.push(ref())
          formRefsStationIn.value.push(ref())
          formRefsStationOut.value.push(ref())
          formRefsStationVehicle.value.push(ref())
        })
      }
      console.log('Them gia tri', listInfoFarePrice.value)
    }
    console.log('Giá trị edit', isEdit.value)
  }
}
const handleAddFareTable = async () => {
  try {
    await Promise.all([validateInfoFareTable(), validateFareTableDetail()])

    infoFareTable.value.fareDetails = listInfoFarePrice.value
    const rs = await apiAddFareTable(infoFareTable.value)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.addSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      router.push(`/administration/category/fare-table`)
    }
  } catch (error) {
    console.log(error)
  }
}
const updateFareTable = async () => {
  try {
    await Promise.all([validateInfoFareTable(), validateFareTableDetail()])

    infoFareTable.value.fareDetails = listInfoFarePrice.value
    const rs = await apiUpdateFareTable(infoFareTable.value.id, infoFareTable.value)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.updateSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      router.push(`/administration/category/fare-table`)
    }
  } catch (error) {
    console.log(error)
  }
}
const validateInfoFareTable = () => {
  return new Promise((resolve, reject) => {
    infoDetailFareTable.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}
const setSelectStation = async id => {
  listStationByRouteId.value = []
  const length = listInfoFarePrice.value.length
  for (let i = 0; i < length; i++) {
    listInfoFarePrice.value[i].stationIn = {
      id: '',
    }
    listInfoFarePrice.value[i].stationOut = {
      id: '',
    }
  }
  const route_id = id
  if (route_id) {
    const params = {
      page: 1,
      size: 20,
      keywors: '',
      routeIds: [route_id],
      unitIds: [],
    }
    const rs = await getListStation(params)
    if (rs.status === 200) {
      listStationByRouteId.value = rs.data.dataRows
    } else {
      listStationByRouteId.value = []
    }
  }
}
const ruleFarePrice = ref({
  name: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 250, message: t('omsSetting.ruleMaxLengthText'), trigger: 'blur' },
  ],
  stationIn: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  stationOut: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  vehicleType: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  price: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { pattern: /^[0-9]{0,6}$/, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
  ],
})
const formRefsPrice = ref([])
const formRefsName = ref([])
const formRefsStationIn = ref([])
const formRefsStationOut = ref([])
const formRefsStationVehicle = ref([])
const addFarePrice = async () => {
  listInfoFarePrice.value.push({
    name: '',
    stationIn: {
      id: '',
    },
    stationOut: {
      id: '',
    },
    vehicleType: '',
    price: '',
  })
  formRefsPrice.value.push(ref())
  formRefsName.value.push(ref())
  formRefsStationIn.value.push(ref())
  formRefsStationOut.value.push(ref())
  formRefsStationVehicle.value.push(ref())
}
const validateFareTableDetail = async () => {
  return new Promise((resolve, reject) => {
    let valid = true
    listInfoFarePrice.value.forEach((row, index) => {
      const formRef = formRefsPrice.value[index]
      if (formRef && formRef.value) {
        formRef.value.validate(isValid => {
          if (!isValid) {
            valid = false
          }
        })
      } else {
        console.error(`Form reference for index ${index} is undefined.`)
        valid = false
      }

      const formRefName = formRefsName.value[index]
      if (formRefName && formRefName.value) {
        formRefName.value.validate(isValid => {
          if (!isValid) {
            valid = false
          }
        })
      } else {
        console.error(`Form reference for index ${index} is undefined.`)
        valid = false
      }

      const formRefStationIn = formRefsStationIn.value[index]
      if (formRefStationIn && formRefStationIn.value) {
        formRefStationIn.value.validate(isValid => {
          if (!isValid) {
            valid = false
          }
        })
      } else {
        console.error(`Form reference for index ${index} is undefined.`)
        valid = false
      }

      const formRefStationOut = formRefsStationOut.value[index]
      if (formRefStationOut && formRefStationOut.value) {
        formRefStationOut.value.validate(isValid => {
          if (!isValid) {
            valid = false
          }
        })
      } else {
        console.error(`Form reference for index ${index} is undefined.`)
        valid = false
      }

      const formRefStationVehicle = formRefsStationVehicle.value[index]
      if (formRefStationVehicle && formRefStationVehicle.value) {
        formRefStationVehicle.value.validate(isValid => {
          if (!isValid) {
            valid = false
          }
        })
      } else {
        console.error(`Form reference for index ${index} is undefined.`)
        valid = false
      }
    })

    setTimeout(() => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Có lỗi trong các ô nhập.')
      }
    }, 0)
  })
}
const deleteFarePrice = () => {
  if (indexDeleteFarePrice.value !== null && indexDeleteFarePrice.value >= 0) {
    listInfoFarePrice.value.splice(indexDeleteFarePrice.value, 1)
    indexDeleteFarePrice.value = null
    deleteFarePriceDialog.value = false
  }
}
const openDialogDelete = (data, index) => {
  deleteFarePriceDialog.value = true
  indexDeleteFarePrice.value = index
  console.log(data, index)
}
const backFareTable = () => {
  router.push(`/administration/category/fare-table`)
}
</script>

<style lang="scss">
.custom {
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
</style>
