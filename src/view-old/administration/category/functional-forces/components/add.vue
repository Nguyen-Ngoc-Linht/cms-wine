<template>
  <div class="bg-white">
    <div class="">
      <el-form
        ref="addForces"
        :model="infoForces"
        :rules="ruleEdit"
        label-position="top"
        label-width="100%"
        class="custom-form"
      >
        <div class="item-mid">
          <el-form-item
            class="custom mb-5"
            :label="$t('configUser.forceName')"
            prop="functionalForceName"
            style="display: inline-block; width: 100%"
          >
            <el-input
              :disabled="isAbled"
              v-model="infoForces.functionalForceName"
              maxlength="250"
              :placeholder="$t('configUser.pleaseEnter')"
            />
          </el-form-item>
        </div>
        <div class="flex justify-between gap-4">
          <div style="width: 50%">
            <el-form-item
              class="custom mb-5"
              :label="$t('configUser.gland')"
              prop="route.id"
              style="display: inline-block; width: 100%"
            >
              <el-select
                v-model="infoForces.route.id"
                clearable
                filterable
                collapse-tags
                style="width: 100%"
                :placeholder="$t('configUser.pleaseSelect')"
                :disabled="isAbled || typeDialog === 'edit'"
              >
                <el-option
                  v-for="item in route"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item
              class="custom mb-5"
              :label="$t('configUser.forceCode')"
              prop="code"
              style="display: inline-block; width: 100%"
              required
            >
              <el-input
                disabled
                v-model="infoForces.code"
                maxlength="250"
                :placeholder="$t('configUser.pleaseEnter')"
              >
                <template #suffix>
                  <svg-icon
                    icon-class="plus"
                    class="cursor-pointer width-20 height-20"
                    @click="getCode"
                    v-if="!infoForces.code"
                  />
                </template>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <div class="item-mid">
          <el-form-item
            class="custom mb-5"
            :label="$t('configUser.descriptionOfBusinessFunctions')"
            style="font-weight: 600 !important; width: 100%; display: inline-block"
          >
            <el-input
              :disabled="isAbled"
              v-model="infoForces.functionalForceDescription"
              maxlength="1000"
              type="textarea"
              show-word-limit
              :autosize="{ minRows: 5, maxRows: 10 }"
              :placeholder="$t('configUser.pleaseEnter')"
            />
          </el-form-item>
        </div>
        <div class="flex justify-between gap-4">
          <div style="width: 50%">
            <el-form-item
              prop="hotlineNumber"
              class="custom"
              :label="$t('configUser.nbHotlineForce')"
              style="display: inline-block; width: 100%"
            >
              <el-input
                v-model="infoForces.hotlineNumber"
                :disabled="isAbled"
                maxlength="11"
                :placeholder="$t('configUser.pleaseEnter')"
              />
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item
              class="custom"
              :label="$t('configUser.nameOfficerForce')"
              style="display: inline-block; width: 100%"
            >
              <el-input
                v-model="infoForces.contactPersonName"
                :disabled="isAbled"
                maxlength="200"
                :placeholder="$t('configUser.pleaseEnter')"
              />
            </el-form-item>
          </div>
        </div>
        <div class="flex justify-between gap-4">
          <div style="width: 50%">
            <el-form-item
              prop="contactPersonPhone"
              class="custom"
              :label="$t('configUser.nbPhoneForce')"
              style="display: inline-block; width: 100%"
            >
              <el-input
                v-model="infoForces.contactPersonPhone"
                type="number"
                :placeholder="t('configUser.pleaseEnter')"
                :disabled="isAbled"
              ></el-input>
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item
              prop="contactPersonEmail"
              class="custom"
              :label="$t('configUser.emailOfFunctionalForce')"
              style="display: inline-block; width: 100%"
            >
              <el-input
                v-model="infoForces.contactPersonEmail"
                :disabled="isAbled"
                maxlength="100"
                :placeholder="$t('configUser.pleaseEnter')"
              />
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
            >{{ $t('configUser.cancel') }}
          </el-button>
          <el-button
            v-if="typeDialog === 'add' && roleData.canCreate"
            @click="handleAddForces"
            type="primary"
            class="bg--dark-purple"
            style="border: transparent"
            >{{ $t('configUser.addNew') }}
          </el-button>
          <el-button
            v-if="typeDialog === 'edit' && roleData.canUpdate"
            @click="handleEditForces"
            type="primary"
            class="bg--dark-purple"
            style="border: transparent"
            >{{ $t('omsSetting.update') }}
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
import { addFunctionalForces, updateForces } from '@/api/functional-forces'
import { getListRoute } from '@/api/expressway'
import InputInteger from '@/components/InputInteger/index.vue'
import { usePermissionStore } from '@/store'
import { apiGenCategoryCode } from '@/api/category'

const { t } = useI18n()

const { roleData } = usePermissionStore()
const props = defineProps({
  typeDialog: {
    type: String,
    required: true,
  },
  forcesInfo: {
    type: Object,
    required: false,
  },
})
const ruleEdit = ref({
  functionalForceName: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 250, message: t('omsSetting.ruleMaxLengthText'), trigger: 'blur' },
  ],
  route: {
    id: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  },
  code: [{ required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' }],
  hotlineNumber: [
    {
      pattern: /^[0-9]{4,11}$/,
      message: t('configUser.validateMessage.phoneFormat'),
      trigger: 'blur',
    },
  ],
  contactPersonPhone: [
    {
      pattern: /^[0-9]{10}$/,
      message: t('configUser.validateMessage.phoneFormat'),
      trigger: 'blur',
    },
  ],
  contactPersonEmail: [
    // { type: 'email', message: t('configUser.validateMessage.emailFormat'), trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)$/,
      message: t('configUser.validateMessage.emailFormat'),
      trigger: 'blur',
    },
  ],
})
const isAbled = ref(false)
const infoForces = ref({
  route: {
    id: '',
  },
})
const route = ref([])
const addForces = ref(null)
const emit = defineEmits(['closeUpdate'])

const closeDialog = () => {
  emit('closeUpdate')
}

onMounted(async () => {
  await initData()
  infoForces.value = { ...props.forcesInfo }
  if (props.typeDialog === 'view') {
    isAbled.value = true
  } else if (props.typeDialog === 'add') {
    getCode()
  }
})

const initData = async () => {
  const rs = await getListRoute()
  if (rs.status === 200) {
    route.value = rs.data.dataRows
  }
}
const getCode = () => {
  apiGenCategoryCode(4)
    .then(res => {
      infoForces.value.code = res.data
    })
    .catch(_ => {
      ElMessage({
        type: 'error',
        message: 'Gen code error',
      })
    })
}

const handleAddForces = async () => {
  if (addForces.value) {
    addForces.value.validate(async valid => {
      if (valid) {
        const rs = await addFunctionalForces(infoForces.value)
        if (rs.status === 200) {
          ElMessage({
            message: t('configUser.message.addSuccess'),
            type: 'success',
            duration: 3 * 1000,
          })
          emit('closeUpdate')
        } else {
          ElMessage({
            message: t('el.image.error'),
            type: 'error',
            duration: 3 * 1000,
          })
        }
      } else {
        console.log('Lỗi validate form')
        return false
      }
    })
  } else {
    console.log('Form chưa được gán hoặc không tồn tại')
  }
}

const handleEditForces = async () => {
  if (addForces.value) {
    addForces.value.validate(async valid => {
      if (valid) {
        infoForces.value.route = {
          id: infoForces.value.route.id,
        }
        const rs = await updateForces(infoForces.value.id, infoForces.value)
        console.log(infoForces.value)
        if (rs.status === 200) {
          ElMessage({
            message: t('configUser.message.updateSuccess'),
            type: 'success',
            duration: 3 * 1000,
          })
          emit('closeUpdate')
        } else {
          ElMessage({
            message: t('el.image.error'),
            type: 'error',
            duration: 3 * 1000,
          })
        }
      } else {
        console.log('Lỗi validate form')
        return false
      }
    })
  } else {
    console.log('Form chưa được gán hoặc không tồn tại')
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
