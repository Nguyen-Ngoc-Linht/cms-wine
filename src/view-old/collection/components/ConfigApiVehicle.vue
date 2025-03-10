<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiUpdateConfigFE, apiGetConfigFE } from '@/api/collect'
import InputInteger from '@/components/InputInteger/index.vue'
import { usePermissionStore } from '@/store'
import { cloneDeep } from 'lodash-unified'

const { t } = useI18n()
const props = defineProps({
  dataType: {
    type: Number,
    required: true,
  },
})

const validateNonNegative = (rule, value, callback) => {
  if (value < 0) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}
const { roleData } = usePermissionStore()
const processing = ref(false)
const ruleEdit = ref({})
const infoParameterConfig = ref([])
const parameterConfig = ref({})
const formParameterConfig = ref(null)
const isFile = ref(false)

onMounted(async () => {
  await initData()
})

const initData = async () => {
  const params = {
    type: props.dataType,
  }
  const rs = await apiGetConfigFE(params)
  if (rs.status === 200) {
    const listParameter = rs.data
    const index = listParameter.findIndex(item => item.name === 'Định kỳ xóa file')
    if (index !== -1) {
      // Loại bỏ phần tử đó khỏi mảng
      const [item] = listParameter.splice(index, 1)
      isFile.value = true

      // Thêm phần tử đó vào đầu mảng
      listParameter.unshift(item)
    }
    infoParameterConfig.value = listParameter
    await setDataConfig(infoParameterConfig.value)
  }
}
const setDataConfig = async listRoute => {
  const length = listRoute.length
  // const index = listRoute.findIndex(item => item.name === 'Định kỳ xóa file')
  // const startIndex = index !== -1 ? 1 : 0
  for (let i = 0; i < length; i++) {
    if (isFile.value) {
      if (i === 0) {
        ruleEdit.value[`configRoute${i}.unitOfTime`] = [
          { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
          { validator: validateNonNegative, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
        ]
      } else {
        ruleEdit.value[`configRoute${i}.user`] = [
          { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
          { validator: validateNonNegative, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
        ]
        ruleEdit.value[`configRoute${i}.linkApi`] = [
          { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
          { validator: validateNonNegative, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
        ]
        ruleEdit.value[`configRoute${i}.password`] = [
          { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
          { validator: validateNonNegative, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
        ]
        ruleEdit.value[`configRoute${i}.unitOfTime`] = [
          { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
          { validator: validateNonNegative, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
        ]
      }
    } else {
      ruleEdit.value[`configRoute${i}.user`] = [
        { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
        { validator: validateNonNegative, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
      ]
      ruleEdit.value[`configRoute${i}.filePath`] = [
        { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
        { validator: validateNonNegative, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
      ]
      ruleEdit.value[`configRoute${i}.password`] = [
        { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
        { validator: validateNonNegative, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
      ]
      ruleEdit.value[`configRoute${i}.unitOfTime`] = [
        { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
        { validator: validateNonNegative, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
      ]
      ruleEdit.value[`configRoute${i}.ipAddress`] = [
        { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
        { validator: validateNonNegative, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
      ]
    }
    parameterConfig.value[`configRoute${i}`] = {
      ...listRoute[i],
      showPass: false,
    }
  }
  console.log('parameterConfig: ', parameterConfig.value)
}
const handleSaveParameterConfig = async () => {
  try {
    processing.value = true
    await Promise.all([validFormData()])
    updateDataSendAPI()
    const params = {
      data: infoParameterConfig.value,
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
const updateDataSendAPI = () => {
  const length = infoParameterConfig.value.length
  for (let i = 0; i < length; i++) {
    if (isFile.value) {
      infoParameterConfig.value[i].unitOfTime = parameterConfig.value[`configRoute${i}`].unitOfTime
      infoParameterConfig.value[i].user = parameterConfig.value[`configRoute${i}`].user
      infoParameterConfig.value[i].password = parameterConfig.value[`configRoute${i}`].password
      infoParameterConfig.value[i].linkApi = parameterConfig.value[`configRoute${i}`].linkApi
    } else {
      infoParameterConfig.value[i].unitOfTime = parameterConfig.value[`configRoute${i}`].unitOfTime
      infoParameterConfig.value[i].user = parameterConfig.value[`configRoute${i}`].user
      infoParameterConfig.value[i].password = parameterConfig.value[`configRoute${i}`].password
      infoParameterConfig.value[i].ipAddress = parameterConfig.value[`configRoute${i}`].ipAddress
      infoParameterConfig.value[i].filePath = parameterConfig.value[`configRoute${i}`].filePath
    }
  }
  // console.log('du lieu', infoParameterConfig.value)
}
const validFormData = async () => {
  return new Promise((resolve, reject) => {
    formParameterConfig.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}
const handleSaveConfigFreeVehicle = async index => {
  try {
    if (processing.value) {
      return
    }
    formParameterConfig.value.validate(async valid => {
      if (valid) {
        const data = {
          data: [parameterConfig.value[`configRoute${index}`]],
        }
        const rs = await apiUpdateConfigFE(data)
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
        console.log('handleSaveConfigFreeVehicle: ', data)
      }
    })
  } catch (e) {
    console.log(e)
    processing.value = false
  }
}
const handleShowPass = idx => {
  const showPass = !!parameterConfig.value[`configRoute${idx}`].showPass
  parameterConfig.value[`configRoute${idx}`].showPass = !showPass
  console.log(parameterConfig.value[`configRoute${idx}`])
}
</script>

<template>
  <div class="paddingX-24 py-4">
    <el-form
      ref="formParameterConfig"
      class="box-parameter-config"
      :rules="ruleEdit"
      :model="parameterConfig"
      v-if="infoParameterConfig.length > 0"
    >
      <el-row
        gutter="20"
        class="mb-4 bg-white p-4"
        style="margin-left: 0 !important; margin-right: -0px !important"
        v-if="isFile"
      >
        <el-col
          class=""
          :lg="12"
          :sm="24"
        >
          <el-form-item
            :label="infoParameterConfig[0].name"
            :prop="`configRoute${0}.unitOfTime`"
            class="custom mb-2"
            style="display: inline-block; width: 100%"
          >
            <InputInteger
              v-model="parameterConfig[`configRoute${0}`].unitOfTime"
              :append="true"
              :max-length="3"
              :disabled="!roleData.canUpdate"
            >
              <template #append>{{ t('el.datepicker.day')?.toLowerCase() }}</template>
            </InputInteger>
          </el-form-item>
        </el-col>
        <el-col
          :lg="12"
          :sm="24"
        ></el-col>
      </el-row>
      <div class="bg-white p-4">
        <div
          class="mb-2"
          v-if="isFile"
        >
          <span class="fs-16 font-[600] text-[#525B73]">Định kỳ lấy file</span>
        </div>
        <el-row gutter="16">
          <el-col
            v-for="(route, index) in isFile ? infoParameterConfig.slice(1) : infoParameterConfig"
            :key="route.id"
            :lg="12"
            :sm="24"
            :class="{ 'border-group': index % 2 !== 0 }"
          >
            <div class="group-route mb-2">
              <div class="fs-16 font-[600] text-[#525B73]">{{ route.name }}</div>
              <el-row gutter="10">
                <el-col
                  :lg="12"
                  :sm="24"
                >
                  <el-form-item
                    :label="t('configUser.account')"
                    :prop="`configRoute${isFile ? index + 1 : index}.user`"
                    class="custom mb-2 inline-block w-full"
                  >
                    <el-input
                      maxlength="20"
                      show-word-limit
                      type="text"
                      v-model="parameterConfig[`configRoute${isFile ? index + 1 : index}`].user"
                      :disabled="!roleData.canUpdate"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col
                  :lg="12"
                  :sm="24"
                  v-if="!isFile"
                >
                  <el-form-item
                    :label="t('collection.path')"
                    :prop="`configRoute${isFile ? index + 1 : index}.filePath`"
                    class="custom mb-2 inline-block w-full"
                  >
                    <el-input
                      v-model="parameterConfig[`configRoute${isFile ? index + 1 : index}`].filePath"
                      :append="true"
                      :max-length="300"
                      show-word-limit
                      :disabled="!roleData.canUpdate"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col
                  :lg="12"
                  :sm="24"
                  v-if="isFile"
                >
                  <el-form-item
                    :label="t('collection.linkApi')"
                    :prop="`configRoute${isFile ? index + 1 : index}.linkApi`"
                    class="custom mb-2 inline-block w-full"
                  >
                    <el-input
                      maxlength="2000"
                      show-word-limit
                      type="text"
                      v-model="parameterConfig[`configRoute${isFile ? index + 1 : index}`].linkApi"
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
                    :prop="`configRoute${isFile ? index + 1 : index}.password`"
                    class="custom mb-2 inline-block w-full"
                  >
                    <el-input
                      v-model="parameterConfig[`configRoute${isFile ? index + 1 : index}`].password"
                      :type="
                        parameterConfig[`configRoute${isFile ? index + 1 : index}`].showPass
                          ? 'text'
                          : 'password'
                      "
                      autocomplete="new-password"
                      maxlength="20"
                      show-word-limit
                      :disabled="!roleData.canUpdate"
                    >
                      <template #suffix>
                        <svg-icon
                          icon-class="eyeClose"
                          class="width-18 height-18 pointer"
                          @click="handleShowPass(isFile ? index + 1 : index)"
                          v-if="
                            parameterConfig[`configRoute${isFile ? index + 1 : index}`].showPass
                          "
                        />
                        <svg-icon
                          icon-class="eye"
                          class="width-18 height-18 pointer"
                          @click="handleShowPass(isFile ? index + 1 : index)"
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
                    :label="isFile ? t('collection.apiCallPeriod') : t('collection.getFile')"
                    :prop="`configRoute${isFile ? index + 1 : index}.unitOfTime`"
                    class="custom mb-2 inline-block w-full"
                  >
                    <InputInteger
                      v-model="
                        parameterConfig[`configRoute${isFile ? index + 1 : index}`].unitOfTime
                      "
                      :append="true"
                      :max-length="3"
                      :disabled="!roleData.canUpdate"
                    >
                      <template #append>{{ t('el.datepicker.minute')?.toLowerCase() }}</template>
                    </InputInteger>
                  </el-form-item>
                </el-col>
                <el-col
                  :lg="12"
                  :sm="24"
                  v-if="!isFile"
                >
                  <el-form-item
                    :label="t('omsSetting.address')"
                    :prop="`configRoute${isFile ? index + 1 : index}.ipAddress`"
                    class="custom mb-2 inline-block w-full"
                  >
                    <el-input
                      maxlength="20"
                      show-word-limit
                      type="text"
                      v-model="
                        parameterConfig[`configRoute${isFile ? index + 1 : index}`].ipAddress
                      "
                      :disabled="!roleData.canUpdate"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="flex justify-end">
                <el-button
                  v-if="!isFile && roleData.canUpdate"
                  @click="handleSaveConfigFreeVehicle(index)"
                  :loading="processing"
                  type="primary"
                  class="el-button--main"
                  style="min-width: 100px"
                  >{{ $t('omsSetting.save') }}
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="flex justify-end pt-5 pb-3">
      <el-button
        v-if="roleData.canUpdate && isFile"
        @click="handleSaveParameterConfig"
        :loading="processing"
        type="primary"
        class="el-button--main"
        style="min-width: 100px"
        >{{ $t('omsSetting.save') }}
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
.border-group {
  border-right: 1px solid #ebebec;
}
</style>
