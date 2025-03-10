<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useI18n } from '@/locale'
import lang from '@/locale/getMessage'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store'
import ListUnitDepartment from '@/views/administration/category/administrative-department/components/listUnitDepartment.vue'
import Dialog from '@/components/Dialog/index.vue'
import AdministrativeDepartmentDetail from '@/views/administration/category/administrative-department/components/unitDepartmentDetail.vue'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-unified'
import { apiGenCategoryCode } from '@/api/category'

defineOptions({
  name: 'category-administrative-department',
})
const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()
const locale = computed(() => lang[appStore.lang])

const listUnitDepartment = ref([])

const showDialogUnit = ref(false)
const showDialogDepartment = ref(false)

// 1 la chi tiet don vi, 2 la chi tiet phong ban
const typeDetail = ref(1)

const idUnitDetail = ref('')
const idDepartmentDetail = ref('')

const typeAction = ref('')
const updateActiveUnit = ref(0)
const updateActiveDepartment = ref(0)

const ruleFormUnit = ref()
const unitRules = reactive({
  unitName: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  code: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
  administrativeUnitTypeId: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
})
const formAddUnit = ref({
  id: null,
  unitName: '',
  code: '',
  administrativeUnitTypeId: '',
  unit_address: '',
})

const ruleFormDepartment = ref()
const departmentRules = reactive({
  departmentName: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
})
const formAddDepartment = ref({
  id: null,
  departmentName: '',
  description: '',
  administrativeUnitId: '',
})

const listTypeUnit = ref([])

const idCreateDepartment = ref(null)

onMounted(() => {
  init()
  getUnitsType()
})

const init = () => {
  getListAdminDepartment()
  typeAction.value = 'init'
}

const getListAdminDepartment = async () => {
  await administrativeDepartmentStore
    .apiGetUnitDepartments()
    .then(res => {
      listUnitDepartment.value = res
      idUnitDetail.value = listUnitDepartment.value[updateActiveUnit.value].id
      // if (listUnitDepartment.value[updateActiveUnit.value].departmentUnit.length > 0) {
      //   idDepartmentDetail.value = listUnitDepartment.value[updateActiveUnit.value].departmentUnit[0].id
      // }
      // console.log('idDepartmentDetail.value: ', idDepartmentDetail.value)
    })
    .catch(err => {
      console.log(err)
    })
}

const getUnitsType = async () => {
  await administrativeDepartmentStore
    .apiGetUnitsType()
    .then(res => {
      listTypeUnit.value = res
    })
    .catch(err => {
      console.log(err)
    })
}

const getCode = type => {
  if (type == 'unit') {
    apiGenCategoryCode(5)
      .then(res => {
        formAddUnit.value.code = res.data
      })
      .catch(_ => {
        ElMessage({
          type: 'error',
          message: 'Gen code error',
        })
      })
  } else {
    apiGenCategoryCode(6)
      .then(res => {
        formAddDepartment.value.code = res.data
      })
      .catch(_ => {
        ElMessage({
          type: 'error',
          message: 'Gen code error',
        })
      })
  }
}

const createUnit = async () => {
  await administrativeDepartmentStore
    .apiCreateUnit(formAddUnit.value)
    .then(res => {
      if (res.status === 201) {
        ElMessage({
          message: t('configUser.addNewConfig', [
            t('administration.category.administrativeDepartment.unit'),
          ]),
          type: 'success',
        })
        init()
        showDialogUnit.value = false
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const updateDepartment = async () => {
  await administrativeDepartmentStore
    .apiUpdateDepartment(formAddDepartment.value, formAddDepartment.value.id)
    .then(res => {
      idDepartmentDetail.value = formAddDepartment.value.id
      idUnitDetail.value = formAddDepartment.value.id
      showDialogDepartment.value = false
      const findIndexUnit = listUnitDepartment.value.findIndex(
        item => item.id === formAddDepartment.value.administrativeUnitId
      )
      updateActiveUnit.value = findIndexUnit
      updateActiveDepartment.value = listUnitDepartment.value[
        findIndexUnit
      ].departmentUnit.findIndex(item => item.id === formAddDepartment.value.id)
      typeDetail.value = 2
      init()
    })
    .catch(err => {
      console.log(err)
    })
}
const updateUnit = async () => {
  await administrativeDepartmentStore
    .apiUpdateUnit(formAddUnit.value, formAddUnit.value.id)
    .then(res => {
      if (res.status === 200) {
        ElMessage({
          message: t('explanationSupport.textActionSuccess', [
            t('administration.category.administrativeDepartment.editUnit'),
          ]),
          type: 'success',
        })
        idUnitDetail.value = formAddUnit.value.id
        updateActiveUnit.value = listUnitDepartment.value.findIndex(
          item => item.id === formAddUnit.value.id
        )
        typeDetail.value = 1
        showDialogUnit.value = false
        init()
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const updateData = data => {
  typeAction.value = 'update'
  if (data.type === 1) {
    formAddUnit.value = cloneDeep(data.objDetail)
    showDialogUnit.value = true
  } else {
    formAddDepartment.value = cloneDeep(data.objDetail)
    showDialogDepartment.value = true
  }
}

const handleGetDetailUnitChange = objChange => {
  if (objChange.indexUnit && objChange.indexUnit > -1) {
    idUnitDetail.value = listUnitDepartment.value[objChange.indexUnit].id
  }
  typeDetail.value = objChange.type
}
const handleGetDetailDepartmentChange = objChange => {
  if (objChange.idDepartment !== '') {
    idDepartmentDetail.value = objChange.idDepartment
    idUnitDetail.value = listUnitDepartment.value[objChange.indexUnit].id
  }
  typeDetail.value = objChange.type
}

const handleCloseDialogUnit = () => {
  if (typeAction.value === 'init') {
    refreshUnit()
  }
  showDialogUnit.value = false
}
const handleCloseDialogDepartment = () => {
  if (typeAction.value === 'init') {
    refreshDepartment()
  }
  showDialogDepartment.value = false
}

const refreshUnit = () => {
  showDialogUnit.value = false
  formAddUnit.value.unitName = ''
  formAddUnit.value.administrativeUnitTypeId = listTypeUnit.value[0].id
  formAddUnit.value.unit_address = ''
}
const refreshDepartment = () => {
  showDialogDepartment.value = false
  formAddDepartment.value.departmentName = ''
  formAddDepartment.value.administrativeUnitId = ''
  formAddDepartment.value.description = ''
}
const handleCreateUnit = () => {
  refreshUnit()
  showDialogUnit.value = true
  getCode('unit')
}
const createDepartment = async () => {
  showDialogDepartment.value = true
  formAddDepartment.value.administrativeUnitId = idCreateDepartment.value
  await administrativeDepartmentStore
    .apiCreateDepartment(formAddDepartment.value)
    .then(res => {
      if (res.status === 201) {
        ElMessage({
          message: t('configUser.addNewConfig', [
            t('administration.category.administrativeDepartment.department'),
          ]),
          type: 'success',
        })
        showDialogDepartment.value = false
        init()
      } else {
      }
    })
    .catch(err => {
      console.log(err)
    })
}
const openDialogDepartment = idUnit => {
  refreshDepartment()
  showDialogDepartment.value = true
  idCreateDepartment.value = idUnit
  getCode()
}
const handleAddAdministrative = () => {
  ruleFormUnit.value.validate(valid => {
    if (valid) {
      if (typeAction.value === 'init') {
        createUnit()
      } else {
        updateUnit()
      }
    }
  })
}
const handleAddDepartment = () => {
  ruleFormDepartment.value.validate(valid => {
    if (valid) {
      if (typeAction.value === 'init') {
        createDepartment()
      } else {
        updateDepartment()
      }
    }
  })
  // showDialog.value = false
}
const handleRemoveLoadData = type => {
  getListAdminDepartment()
  if (type === 2) {
    typeDetail.value = 1
  }
}
</script>

<template>
  <div class="form-detail padding-24">
    <el-row :gutter="20">
      <el-col :span="6">
        <ListUnitDepartment
          :data-unit="listUnitDepartment"
          :new-active="updateActiveUnit"
          :new-active-department="updateActiveDepartment"
          @create-unit="handleCreateUnit"
          @create-department="openDialogDepartment"
          @get-detail-unit="handleGetDetailUnitChange"
          @get-detail-department="handleGetDetailDepartmentChange"
        />
      </el-col>
      <el-col :span="18">
        <AdministrativeDepartmentDetail
          v-if="listUnitDepartment.length > 0"
          :type-detail="typeDetail"
          :id-detail="idUnitDetail"
          :list-type-unit="listTypeUnit"
          :id-detail-department="idDepartmentDetail"
          :list-unit="listUnitDepartment"
          @initData="init"
          @updateData="updateData"
          @removeLoadData="handleRemoveLoadData"
        />
      </el-col>
    </el-row>
    <Dialog
      :show="showDialogUnit"
      :appendToBody="true"
      width="600"
      :title="
        typeAction === 'init'
          ? $t('administration.category.administrativeDepartment.createUnit')
          : $t('administration.category.administrativeDepartment.editUnit')
      "
      @closeDialog="handleCloseDialogUnit"
    >
      <template v-slot:content>
        <el-form
          :model="formAddUnit"
          :rules="unitRules"
          ref="ruleFormUnit"
          label-position="top"
          class="form-custom"
        >
          <el-row :gutter="8">
            <el-col :span="24">
              <el-form-item
                :label="$t('administration.category.administrativeDepartment.unitName')"
                prop="unitName"
                required
              >
                <el-input
                  type="text"
                  :placeholder="t('configUser.pleaseEnter')"
                  v-model="formAddUnit.unitName"
                  maxlength="250"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                :label="$t('administration.category.administrativeDepartment.unitCode')"
                prop="code"
                required
              >
                <el-input
                  type="text"
                  :placeholder="t('configUser.pleaseEnter')"
                  v-model="formAddUnit.code"
                  maxlength="250"
                  disabled
                >
                  <template #suffix>
                    <svg-icon
                      icon-class="plus"
                      class="cursor-pointer width-20 height-20"
                      @click="getCode('unit')"
                      v-if="!formAddUnit.code"
                    />
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                :label="$t('administration.category.administrativeDepartment.unitType')"
                prop="administrativeUnitTypeId"
                required
              >
                <el-select
                  v-model="formAddUnit.administrativeUnitTypeId"
                  class="w-full short height-32"
                  filterable
                  collapse-tags
                  clearable
                  :placeholder="t('configUser.pleaseEnter')"
                >
                  <el-option
                    v-for="item in listTypeUnit"
                    :key="item.id"
                    :label="item.unitTypeName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                :label="$t('administration.category.administrativeDepartment.unitAddress')"
              >
                <el-input
                  type="text"
                  :placeholder="t('configUser.pleaseEnter')"
                  v-model="formAddUnit.unit_address"
                  maxlength="1000"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="foot flex justify-end">
            <el-button
              style="background-color: #fff; border-color: #7c7e81; color: #7c7e81"
              class="border-1 paddingX-10"
              @click="handleCloseDialogUnit"
              type="info"
              >{{ $t('configUser.cancel') }}
            </el-button>
            <el-button
              style="background-color: #059efb; border: none"
              class="border-1 paddingX-30"
              @click="handleAddAdministrative()"
              type="success"
              >{{ typeAction === 'init' ? $t('omsSetting.add') : $t('configUser.updateUser') }}
            </el-button>
          </div>
        </el-form>
      </template>
    </Dialog>
    <Dialog
      :show="showDialogDepartment"
      :appendToBody="true"
      width="600"
      :title="
        typeAction === 'init'
          ? $t('administration.category.administrativeDepartment.createDepartment')
          : $t('administration.category.administrativeDepartment.editDepartment')
      "
      @closeDialog="handleCloseDialogDepartment"
    >
      <template v-slot:content>
        <el-form
          :model="formAddDepartment"
          :rules="departmentRules"
          ref="ruleFormDepartment"
          label-position="top"
          class="form-custom"
        >
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item
                :label="$t('administration.category.administrativeDepartment.departmentName')"
                prop="departmentName"
                required
              >
                <el-input
                  type="text"
                  :placeholder="t('configUser.pleaseEnter')"
                  v-model="formAddDepartment.departmentName"
                  maxlength="250"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item
                :label="$t('administration.category.administrativeDepartment.departmentCode')"
                prop="code"
                required
              >
                <el-input
                  type="text"
                  :placeholder="t('configUser.pleaseEnter')"
                  v-model="formAddDepartment.code"
                  maxlength="250"
                  disabled
                >
                  <template #suffix>
                    <svg-icon
                      icon-class="plus"
                      class="cursor-pointer width-20 height-20"
                      @click="getCode()"
                      v-if="!formAddDepartment.code"
                    />
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item
                :label="
                  $t('administration.category.administrativeDepartment.departmentDescription')
                "
              >
                <el-input
                  type="text"
                  :placeholder="t('configUser.pleaseEnter')"
                  v-model="formAddDepartment.description"
                  maxlength="1000"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="foot flex justify-end">
            <el-button
              style="background-color: #fff; border-color: #7c7e81; color: #7c7e81"
              class="border-1 paddingX-10"
              @click="handleCloseDialogDepartment"
              type="info"
              >{{ $t('configUser.cancel') }}
            </el-button>
            <el-button
              style="background-color: #059efb; border: none"
              class="border-1 paddingX-30"
              @click="handleAddDepartment"
              type="success"
              >{{ typeAction === 'init' ? $t('omsSetting.add') : $t('configUser.updateUser') }}
            </el-button>
          </div>
        </el-form>
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.form-detail {
  .text-header {
    height: 46px;

    .text-unit {
      font-size: 20px;
    }

    svg.svg-icon {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
