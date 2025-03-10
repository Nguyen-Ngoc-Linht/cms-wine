<template>
  <div class="bg-white">
    <el-form
      ref="viewExpressway"
      :model="infoExpressway"
      :rules="ruleEdit"
      label-position="top"
      label-width="100%"
      class="custom-form"
    >
      <div class="item-mid">
        <el-form-item
          class="custom"
          :label="$t('configUser.routeName')"
          prop="name"
          style="display: inline-block; width: 100%"
        >
          <el-input
            :disabled="isAbled"
            maxlength="250"
            v-model="infoExpressway.name"
            :placeholder="$t('configUser.pleaseEnter')"
          />
        </el-form-item>
      </div>
      <div class="item-mid">
        <el-form-item
          class="custom"
          :label="$t('configUser.routeCode')"
          prop="code"
          style="display: inline-block; width: 100%"
          required
        >
          <el-input
            maxlength="250"
            v-model="infoExpressway.code"
            :placeholder="$t('configUser.pleaseEnter')"
            disabled
          >
            <template #suffix>
              <svg-icon
                icon-class="plus"
                class="cursor-pointer width-20 height-20"
                @click="getCode"
                v-if="!infoExpressway.code"
              />
            </template>
          </el-input>
        </el-form-item>
      </div>
      <div class="item-mid">
        <el-form-item
          class="custom"
          prop="description"
          :label="$t('configUser.routeDescription')"
          style="display: inline-block; width: 100%"
        >
          <el-input
            :disabled="isAbled"
            maxlength="1000"
            type="textarea"
            show-word-limit
            :autosize="{ minRows: 5, maxRows: 10 }"
            v-model="infoExpressway.description"
            :placeholder="$t('configUser.pleaseEnter')"
          />
        </el-form-item>
      </div>
      <div class="item-mid">
        <el-form-item
          class="custom"
          :label="$t('configUser.timePutsIntoOperation')"
          style="display: inline-block; width: 100%"
        >
          <el-date-picker
            v-model="infoExpressway.inaugurationDay"
            :disabled="isAbled"
            type="date"
            :placeholder="$t('configUser.pleaseSelect')"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
      </div>
    </el-form>
    <hr
      v-if="!isAbled"
      class="margin-bottom-24"
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
          >Hủy bỏ
        </el-button>
        <el-button
          v-if="typeDialog === 'add'"
          @click="addExpressway"
          type="primary"
          class="bg--dark-purple"
          style="border: transparent"
          >{{ $t('configUser.addNew') }}
        </el-button>
        <el-button
          v-if="typeDialog === 'edit'"
          @click="editExpressway"
          type="primary"
          class="bg--dark-purple"
          style="border: transparent"
          >{{ $t('omsSetting.update') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useI18n } from '@/locale'
import { apiAddRoute, apiUpdateRoute } from '@/api/expressway'
import { apiGenCategoryCode } from '@/api/category'

const { t } = useI18n()

const props = defineProps({
  typeDialog: {
    type: String,
    required: true,
  },
  expresswayInfo: {
    type: Object,
    required: false,
  },
})
const viewExpressway = ref(null)
const ruleEdit = ref({
  name: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 250, message: t('omsSetting.ruleMaxLengthText'), trigger: 'blur' },
  ],
  code: [
    { required: true, message: t('omsSetting.ruleEnter'), trigger: 'blur' },
    { max: 250, message: t('omsSetting.ruleMaxLengthText'), trigger: 'blur' },
  ],
  description: [{ max: 1000, message: t('omsSetting.ruleMaxLengthText1000'), trigger: 'blur' }],
})
const isAbled = ref(false)
const infoExpressway = ref({})

const emit = defineEmits(['closeUpdate'])

const closeDialog = () => {
  console.log('close')
  emit('closeUpdate')
}

const getCode = () => {
  apiGenCategoryCode(1)
    .then(res => {
      infoExpressway.value.code = res.data
    })
    .catch(_ => {
      ElMessage({
        type: 'error',
        message: 'Gen code error',
      })
    })
}

onMounted(() => {
  initData()
})

const initData = () => {
  infoExpressway.value = props.expresswayInfo
  if (props.typeDialog === 'view') {
    isAbled.value = true
  } else if (props.typeDialog === 'add') {
    getCode()
  }
}

const addExpressway = async () => {
  if (viewExpressway.value) {
    viewExpressway.value.validate(async valid => {
      if (valid) {
        const rs = await apiAddRoute(infoExpressway.value)
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
const editExpressway = async () => {
  if (viewExpressway.value) {
    viewExpressway.value.validate(async valid => {
      if (valid) {
        const rs = await apiUpdateRoute(infoExpressway.value.id, infoExpressway.value)
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
