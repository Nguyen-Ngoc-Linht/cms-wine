<template>
  <el-dialog
    :title="isEdit ? t('administration.ip.edit') : t('administration.ip.addNew')"
    v-model="isShow"
    modal-class="add-ip"
    width="500"
    :before-close="handleClose"
    :destroy-on-close="true"
  >
    <el-form
      ref="formRef"
      class="d-flex"
      :model="formData"
      :rules="rules"
      label-position="top"
      label-width="100%"
    >
      <el-form-item
        :label="t('omsSetting.address')"
        prop="ip"
        required
      >
        <el-input
          v-model="formData.ip"
          maxlength="250"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          class="el-button--main"
          type="primary"
          @click="handleSubmit"
          :loading="processing"
        >
          {{ t('omsSetting.save') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { validIp } from '@/utils/validate'
import { computed, reactive, ref, watch } from 'vue'
import { useAppStore } from '@/store'

import lang from '@/locale/getMessage.js'
import { useI18n } from '@/locale'
import { apiIpConfig } from '@/api/systemconfig'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  selectValue: {
    type: String || null,
    default: '',
  },
})
const emit = defineEmits(['handleClose', 'handleAddSuccess'])

const { t } = useI18n()

const appStore = useAppStore()
const locale = computed(() => lang[appStore.lang])
const isEdit = ref(false)
const validateIP = (rule, value, callback) => {
  if (!validIp(value)) {
    callback(new Error(t('configUser.validateMessage.invalid', { data: t('omsSetting.address') })))
  } else {
    callback()
  }
}

watch(
  () => props.selectValue,
  value => {
    if (value) {
      formData.ip = value
      oldIp.value = value
      isEdit.value = true
    } else {
      formData.ip = null
      oldIp.value = null
      isEdit.value = false
    }
  }
)
const oldIp = ref(null)
const formData = reactive({
  ip: '',
})

const rules = reactive({
  ip: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    { validator: validateIP, trigger: 'blur' },
  ],
})

const isShow = computed(() => props.dialogVisible)

const handleClose = () => {
  emit('handleClose', false)
  resetForm()
}

const processing = ref(false)
const formRef = ref()

const handleSubmit = () => {
  const formEl = formRef

  if (processing.value) {
    return
  }

  formEl.value.validate(valid => {
    if (valid) {
      if (isEdit.value) {
        handleEdit()
      } else {
        handleAdd()
      }
    }
  })
}
const handleAdd = () => {
  const data = {
    method: 'ADD',
    arguments: {
      ipAddresses: [formData.ip],
    },
  }
  apiIpConfig(data)
    .then(res => {
      if (res?.data && res.data.length > 0) {
        ElMessage({
          type: 'error',
          message: res.data[0].error,
        })
      } else {
        emit('handleAddSuccess')
        resetForm()
        ElMessage({
          type: 'success',
          message: t('administration.ip.addSuccess'),
        })
      }
    })
    .catch(_ => {
      ElMessage({
        type: 'error',
        message: t('omsSetting.failAdd'),
      })
    })
    .finally(_ => {
      processing.value = false
    })
}

const handleEdit = () => {
  const data = {
    method: 'UPDATE',
    arguments: {
      newIp: formData.ip,
      oldIp: oldIp.value,
    },
  }
  apiIpConfig(data)
    .then(res => {
      if (res?.data && res.data.length > 0) {
        ElMessage({
          type: 'error',
          message: res.data[0].error,
        })
      } else {
        emit('handleAddSuccess')
        resetForm()
        ElMessage({
          type: 'success',
          message: t('administration.ip.editSuccess'),
        })
      }
    })
    .catch(_ => {
      ElMessage({
        type: 'error',
        message: t('omsSetting.failUpdate'),
      })
    })
    .finally(_ => {
      processing.value = false
    })
}
const resetForm = () => {
  const formEl = formRef
  formEl.value.resetFields()
}

defineOptions({
  name: 'IPManager',
})
</script>

<style lang="scss">
.add-ip {
  .el-dialog__body {
    padding-bottom: 0;
  }
}
</style>
