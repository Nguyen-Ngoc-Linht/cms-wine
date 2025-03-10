<template>
  <div class="bg-white">
    <div class="">
      <el-form
        ref="sendDataRequest"
        :model="infoSend"
        :rules="ruleEdit"
        label-position="top"
        label-width="100%"
        class="custom-form"
      >
        <div class="item-mid">
          <el-form-item
            class="custom mb-5"
            :label="$t('administration.category.administrativeDepartment.unit')"
            prop="department"
            style="display: inline-block; width: 100%"
          >
            <el-tree-select
              v-model="infoSend.department"
              class="w-full"
              required
              :placeholder="t('configUser.pleaseSelect')"
              :data="departmentList"
              default-expand-all
              check-strictly
              @change="setListLeader"
            >
            </el-tree-select>
          </el-form-item>
        </div>
        <div class="item-mid">
          <el-form-item
            class="custom mb-5"
            :label="$t('administration.category.administrativeDepartment.supplierLeader')"
            prop="supplierLeader"
            style="display: inline-block; width: 100%"
          >
            <el-select
              v-model="infoSend.supplierLeader"
              clearable
              filterable
              collapse-tags
              style="width: 100%"
              :placeholder="$t('configUser.pleaseSelect')"
            >
              <el-option
                v-for="item in listLeader"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <hr class="margin-bottom-24 mt-3" />
      <div class="action">
        <div class="flex justify-end">
          <el-button
            type="default"
            @click="closeDialog"
            class="bg-outline-secondary"
            >{{ $t('configUser.cancel') }}</el-button
          >
          <el-button
            @click="handleSendRequest"
            :loading="processing"
            type="primary"
            class="bg--dark-purple"
            style="border: transparent"
            >{{ $t('monitoring.requestProcessingETC.sendRequest') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage } from 'element-plus'
import {
  apiGetDepartments,
  apiGetUnitDepartments,
  apiGetUnits,
  apiGetUserDepartment,
  apiGetUserUnit,
} from '@/api/administrativeDepartment'
import { apiUpdateSenderRequestProcessingVEC } from '@/api/requestProcessingETC'
const { t } = useI18n()

const props = defineProps({
  typeDialog: {
    type: String,
    required: false,
  },
  requestInfo: {
    type: Object,
    required: false,
  },
})
const ruleEdit = ref({
  department: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  supplierLeader: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})
const processing = ref(false)
const departmentList = ref([])
const listLeader = ref([])
const infoSend = ref({
  unit: {
    id: '',
  },
})
const sendDataRequest = ref(null)
const emit = defineEmits(['closeUpdate'])

const closeDialog = () => {
  console.log('close')
  emit('closeUpdate')
}

onMounted(async () => {
  await setDataDefault()
  await initData()
})

const setDataDefault = async () => {
  apiGetUnitDepartments().then(res => {
    let data = res?.data || []
    data = data.map(i => ({
      label: i.unitName,
      value: i.id,
      // disabled: i.departmentUnit && i.departmentUnit.length > 0,
      children: i.departmentUnit.map(d => ({
        value: d.id,
        label: d.departmentName,
      })),
    }))
    departmentList.value = data
  })
}
const initData = async () => {}
const handleSendRequest = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const request_id = props.requestInfo.id
    const params = {
      leaderId: infoSend.value.supplierLeader,
      type: 1,
    }
    const rs = await apiUpdateSenderRequestProcessingVEC(request_id, params)
    if (rs.status === 200) {
      ElMessage({
        message: t('configUser.message.sendSuccess'),
        type: 'success',
        duration: 3 * 1000,
      })
      closeDialog()
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    sendDataRequest.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}
const isParent = ref(false)
const setListLeader = async selected => {
  isParent.value = false
  listLeader.value = []
  infoSend.value.supplierLeader = ''
  for (const parent of departmentList.value) {
    if (parent.value === selected) {
      infoSend.value.idUnitSelect = selected
      isParent.value = true
      break
    }

    if (parent.children.some(i => i.value === selected)) {
      infoSend.value.idUnitSelect = selected
      break
    }
  }
  const params = {
    id: infoSend.value.idUnitSelect,
    type: 2,
    routeId: props.requestInfo.route.id,
  }
  if (infoSend.value.idUnitSelect !== '' && infoSend.value.idUnitSelect !== undefined) {
    if (isParent.value) {
      const rsUnit = await apiGetUserUnit(params)
      if (rsUnit.status === 200) {
        listLeader.value = rsUnit.data
      }
    } else {
      const rs = await apiGetUserDepartment(params)
      if (rs.status === 200) {
        listLeader.value = rs.data
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-form-item__label {
  color: #525b73;
  font-weight: 600 !important;
}
</style>

<style lang="scss">
.custom {
  .el-form-item__label {
    color: #525b73;
    font-weight: 600 !important;
  }
}
.custom-form {
  .el-form-item {
    //display: flex;
    --font-size: 14px;
    margin-bottom: 8px;
    margin-top: 8px;
  }
  .el-form-item--default {
    --font-size: 14px;
    --el-form-label-font-size: var(--font-size);
    margin-bottom: 8px;
    margin-top: 8px;
  }
}
</style>
