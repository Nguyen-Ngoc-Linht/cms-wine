<template>
  <div class="bg-white">
    <el-form
      ref="sendNotify"
      :model="formSendNotifyExplanation"
      :rules="ruleEdit"
      label-position="top"
      label-width="100%"
    >
      <el-row :gutter="16">
        <el-col :span="24">
          <el-form-item
            prop="administrative_id"
            class="custom"
            :label="$t('explanationSupport.feeCollectionUnit')"
          >
            <el-select
              class="w-full"
              v-model="formSendNotifyExplanation.administrative_id"
              clearable
              filterable
              collapse-tags
              :placeholder="$t('configUser.pleaseSelect')"
              @change="onChangeUnit"
            >
              <el-option
                v-for="item in listUnitDepartment"
                :key="item.id"
                :label="item.unitName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            prop="user_id"
            class="custom"
            :label="$t('explanationSupport.unitOfficers')"
          >
            <el-select
              v-loading="loadingData"
              class="w-full"
              v-model="formSendNotifyExplanation.user_id"
              clearable
              filterable
              collapse-tags
              :placeholder="$t('configUser.pleaseSelect')"
            >
              <el-option
                v-for="item in listUserDetail"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <hr class="margin-bottom-24" />
    <div class="action">
      <div class="flex justify-end">
        <el-button
          type="default"
          @click="closeDialog"
          class="bg-outline-secondary"
          >{{ $t('configUser.cancel') }}</el-button
        >
        <el-button
          @click="handleSendNotifyExplanation()"
          type="primary"
          class="bg--dark-purple"
          style="border: transparent"
          >{{ $t('omsSetting.confirm') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage } from 'element-plus'
import { useExplanationSupportStore, useAdministrativeDepartmentStore } from '@/store'

const { t } = useI18n()
const explanationSupportStore = useExplanationSupportStore()
const administrativeDepartmentStore = useAdministrativeDepartmentStore()

const props = defineProps({
  explanationId: {
    type: String,
    required: true,
  },
  stationId: {
    type: String,
    required: true,
  },
  routeId: {
    type: String,
    required: true,
  },
})
const ruleEdit = ref({
  administrative_id: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  user_id: [{ required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' }],
})
const formSendNotifyExplanation = ref({
  explanation_id: '',
  administrative_id: '',
  user_id: '',
})
const sendNotify = ref(null)
const emit = defineEmits(['closeSendNotify', 'loadData'])
const listUserDetail = ref([])
const closeDialog = () => {
  emit('closeSendNotify')
}
const listUnitDepartment = ref([])
const loadingData = ref(false)

onMounted(() => {
  getListAdminDepartment()
  listUserDetail.value = []
})

const handleSendNotifyExplanation = () => {
  sendNotify.value.validate(valid => {
    if (valid) {
      formSendNotifyExplanation.value.explanation_id = props.explanationId
      explanationSupportStore
        .apiSendNotifyExplanation(formSendNotifyExplanation.value)
        .then(res => {
          if (res.status === 200) {
            ElMessage({
              message: t('configUser.message.updateSuccess'),
              type: 'success',
            })
            emit('closeSendNotify')
            emit('loadData')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  })
}
const getListAdminDepartment = () => {
  administrativeDepartmentStore
    .apiGetUnitDepartments()
    .then(res => {
      listUnitDepartment.value = res
    })
    .catch(err => {
      console.log(err)
    })
}
const onChangeUnit = value => {
  getUserUnit(value)
}
const getUserUnit = id => {
  loadingData.value = true
  const params = {
    id,
    type: 3,
    routeId: props.routeId,
  }
  administrativeDepartmentStore
    .apiGetUserUnit(params)
    .then(res => {
      if (res.status === 200) {
        listUserDetail.value = res.data
        loadingData.value = false
      }
    })
    .catch(err => {
      console.log(err)
    })
}
</script>

<style lang="scss">
.custom {
  .el-form-item__label {
    color: #525b73;
    font-weight: 600 !important;
  }
}
</style>
