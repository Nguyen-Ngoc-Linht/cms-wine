<template>
  <div class="bg-white">
    <div class="">
      <el-form
        ref="sendDataEvent"
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
            prop="unit.id"
            style="display: inline-block; width: 100%"
          >
            <el-select
              v-model="infoSend.unit.id"
              @change="
                value => {
                  setListDepartment(value)
                }
              "
              clearable
              filterable
              collapse-tags
              style="width: 100%"
              :placeholder="$t('configUser.pleaseSelect')"
            >
              <el-option
                v-for="item in listUnits"
                :key="item.id"
                :label="item.unitName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="flex justify-between gap-4">
          <div style="width: 50%">
            <el-form-item
              prop="department"
              class="custom"
              style="display: inline-block; width: 100%"
              :label="$t('administration.category.administrativeDepartment.department')"
            >
              <el-select
                v-model="infoSend.department"
                clearable
                filterable
                multiple
                collapse-tags
                @change="
                  value => {
                    setListUserDepartment(value)
                  }
                "
                style="width: 100%"
                :placeholder="$t('configUser.pleaseSelect')"
              >
                <el-option
                  v-for="item in listDepartment"
                  :key="item.id"
                  :label="item.departmentName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item
              prop="personnel"
              style="display: inline-block; width: 100%"
              class="custom"
              :label="$t('administration.category.administrativeDepartment.personnel')"
            >
              <el-select
                v-model="infoSend.personnel"
                clearable
                filterable
                collapse-tags
                multiple
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
        </div>
      </el-form>
      <hr
        v-if="!isAbled"
        class="margin-bottom-24 mt-3"
      />
      <div
        v-if="!isAbled"
        class="action"
      >
        <div class="flex justify-end">
          <el-button
            type="default"
            @click="closeDialog"
            class="bg-outline-secondary"
            >{{ $t('configUser.cancel') }}</el-button
          >
          <el-button
            @click="handleSendEvent"
            :loading="processing"
            type="primary"
            class="bg--dark-purple"
            style="border: transparent"
            >{{ $t('monitoring.errorHandling.sendEvent') }}
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
  apiGetUnits,
  apiGetUserDepartment,
  apiGetUserListDepartment,
  apiGetUserUnit,
} from '@/api/administrativeDepartment'
import { apiSendEvent } from '@/api/errorHandling'
const { t } = useI18n()

const props = defineProps({
  typeDialog: {
    type: String,
    required: false,
  },
  eventInfo: {
    type: Object,
    required: false,
  },
})
const ruleEdit = ref({
  unit: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  // department: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },],
  personnel: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
})
const listUnits = ref([])
const listDepartment = ref([])
const listLeader = ref([])
const isAbled = ref(false)
const infoSend = ref({
  unit: {
    id: '',
  },
})
const sendDataEvent = ref(null)
const processing = ref(false)
const emit = defineEmits(['closeUpdate'])

const closeDialog = () => {
  console.log('close')
  emit('closeUpdate')
}

onMounted(async () => {
  await setDataDefault()
  await initData()
})

const handleSendEvent = async () => {
  try {
    await Promise.all([validFormData()])
    processing.value = true
    const event_id = props.eventInfo.id
    const listUser = []
    for (const item of infoSend.value.personnel) {
      listUser.push({
        id: item,
      })
    }
    const params = {
      recipients: listUser,
    }
    if (event_id) {
      const rs = await apiSendEvent(event_id, params)
      if (rs.status === 200) {
        ElMessage({
          message: t('configUser.message.updateSuccess'),
          type: 'success',
          duration: 3 * 1000,
        })
        emit('closeUpdate')
      }
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    sendDataEvent.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}
const setDataDefault = async () => {
  const rs = await apiGetUnits()
  if (rs.status === 200) {
    listUnits.value = rs.data
  }
}
const initData = async () => {}
const setListDepartment = async id_unit => {
  listDepartment.value = []
  infoSend.value.department = []
  if (id_unit !== undefined) {
    const rs = await apiGetDepartments(id_unit)
    if (rs.status === 200) {
      listDepartment.value = rs.data
    }
    const params = {
      id: id_unit,
      type: 1,
      routeId: props.eventInfo.route.id,
    }
    listLeader.value = []
    const rsUnit = await apiGetUserUnit(params)
    if (rsUnit.status === 200) {
      listLeader.value = rsUnit.data
    }
  }
}
const setListUserDepartment = async listData => {
  listLeader.value = []
  infoSend.value.personnel = ''
  if (listData.length === 0) {
    if (infoSend.value.unit.id) {
      const params = {
        id: infoSend.value.unit.id,
        type: 1,
        routeId: props.eventInfo.route.id,
      }
      const rsUnit = await apiGetUserUnit(params)
      if (rsUnit.status === 200) {
        listLeader.value = rsUnit.data
      }
    }
    return
  }
  const params = {
    departments: listData,
    type: 1,
    routeId: props.eventInfo.route.id,
  }
  const rs = await apiGetUserListDepartment(params)
  if (rs.status === 200) {
    listLeader.value = rs.data
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
