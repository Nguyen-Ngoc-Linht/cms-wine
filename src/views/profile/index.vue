<template>
  <div
    class="profile-editor-container"
    v-loading="loading"
  >
    <div class="content">
      <el-form
        ref="editForm"
        :model="userInfo"
        :rules="rulesEdit"
        label-position="top"
        label-width="200px"
      >
        <div class="content-block">
          <div class="info">
            <div class="action">
              <h2 class="title-block">{{ t('configUser.personalInfo') }}</h2>
              <div
                v-if="isDiableInput"
                class="button-act"
                @click="handleEdit()"
              >
                <svg-icon icon-class="edit-administrative" />
                {{ t('configUser.edit') }}
              </div>
              <div
                v-else
                class="flex group-btn"
              >
                <div
                  class="cancel"
                  @click="handleCancel()"
                >
                  {{ t('configUser.cancel') }}
                </div>
                <div
                  class="update"
                  @click="handleUpdate()"
                  :loading="processing"
                >
                  {{ t('omsSetting.update') }}
                </div>
              </div>
            </div>
            <div class="group">
              <el-form-item
                :label="t('configUser.fullName')"
                prop="fullName"
                class="marginX-0"
              >
                <el-input
                  v-model="userInfo.fullName"
                  :placeholder="t('configUser.pleaseEnter')"
                  :disabled="isDiableInput"
                />
              </el-form-item>
            </div>
            <div class="group">
              <el-form-item :label="t('configUser.phoneNumber1')">
                <el-input
                  v-model="userInfo.mobile"
                  :placeholder="t('configUser.pleaseEnter')"
                  :disabled="isDiableInput"
                />
              </el-form-item>
              <el-form-item label="Email">
                <el-input
                  v-model="userInfo.email"
                  :placeholder="t('configUser.pleaseEnter')"
                  :disabled="isDiableInput"
                />
              </el-form-item>
            </div>
          </div>
          <div class="accout">
            <div class="action">
              <h2 class="title-block">{{ t('configUser.account') }}</h2>
              <div
                class="button-act change-pass"
                @click="handleUpdatePassword()"
              >
                <svg-icon icon-class="icon-changePass" />
                {{ t('configUser.userManagement.changePassword') }}
              </div>
            </div>
            <div class="group">
              <el-form-item
                :label="t('configUser.userManagement.username')"
                prop="userName"
                class="marginX-0"
              >
                <el-input
                  v-model="userInfo.userName"
                  disabled
                />
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div
      class="update-password"
      v-if="updateRule"
    >
      <el-dialog
        :title="t('configUser.userManagement.changePassword')"
        v-model="dialogUpdate"
        width="440px"
        :close-on-click-modal="false"
        @close="closeDialog"
      >
        <el-form
          ref="formChangePass"
          :model="userPass"
          :rules="rulePass"
          label-position="top"
          label-width="100%"
        >
          <div class="block-item">
            <el-form-item
              :label="t('configUser.userManagement.currentPass')"
              prop="curentPassword"
            >
              <el-input
                v-model="userPass.curentPassword"
                type="password"
              />
            </el-form-item>

            <el-form-item
              :label="t('configUser.userManagement.newPass')"
              prop="newPassword"
              required
            >
              <el-input
                v-model="userPass.newPassword"
                type="password"
              />
            </el-form-item>

            <el-form-item
              :label="t('configUser.retypePassword')"
              prop="rePassword"
            >
              <el-input
                v-model="userPass.rePassword"
                type="password"
              />
            </el-form-item>
          </div>
        </el-form>
        <div class="d-flex justify-content-end">
          <el-button @click="dialogUpdate = false">{{ t('configUser.cancel') }}</el-button>
          <el-button
            type="primary"
            :loading="processing"
            @click="updatePassword()"
            >{{ t('omsSetting.confirm') }}</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, reactive } from 'vue'
import { useUserStore } from '@/store'
import moment from 'moment'
import { useI18n } from '@/locale'
import { getPasswordRulePolicy, updatePass } from '@/api/user'
import { trimData } from '@/utils'
import { validEmail, validPhone } from '@/utils/validate'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const { t } = useI18n()

const isDiableInput = ref(true)
const loading = ref(true)
const processing = ref(false)
const handleEdit = () => {
  isDiableInput.value = false
}

const handleCancel = () => {
  isDiableInput.value = true
  getUser()
}
const disabledDate = date => {
  return date > moment().valueOf()
}

const rulesEdit = reactive({
  rule: null,
})
const updateRule = ref(false)
const getPasswordRule = () => {
  getPasswordRulePolicy().then(res => {
    const specChar = []
    const rule = [
      { min: res.data.minLength, max: res.data.maxLength, message: '', trigger: 'blur' },
    ]
    if (res.data.specialCharacters) {
      specChar.push(t('configUser.passwordPolicy.specialChar').toLowerCase())
      rule.push({ validator: validSpecialChar, message: '', trigger: 'blur' })
    }
    if (res.data.digits) {
      specChar.push(t('configUser.passwordPolicy.number').toLowerCase())
      rule.push({ validator: validDigit, message: '', trigger: 'blur' })
    }
    if (res.data.uppercase) {
      specChar.push(t('configUser.passwordPolicy.upperCase').toLowerCase())
      rule.push({ validator: validUpperChar, message: '', trigger: 'blur' })
    }
    if (res.data.lowercase) {
      specChar.push(t('configUser.passwordPolicy.lowerCase').toLowerCase())
      rule.push({ validator: validLowerChar, message: '', trigger: 'blur' })
    }
    const message = t('configUser.validateMessage.passwordFormat', [
      res.data.minLength,
      res.data.maxLength,
      specChar.join(', '),
    ])
    rule.forEach(i => {
      i.message = message
    })

    rulePass.newPassword = [
      { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
      ...rule,
    ]
    updateRule.value = true
  })
}

const validateEmail = (rule, value, callback) => {
  const strLength = value.trim().length
  if (strLength > 0 && !validEmail(value)) {
    callback(new Error(t('configUser.validateMessage.invalid', { data: 'Email' })))
  } else {
    callback()
  }
}
const validatePhone = (rule, value, callback) => {
  const strLength = value.trim().length
  if (strLength > 0 && !validPhone(value)) {
    callback(
      new Error(t('configUser.validateMessage.invalid', { data: t('configUser.phoneNumber') }))
    )
  } else {
    callback()
  }
}
const userInfo = ref({})

const getUser = async () => {
  userInfo.value = await userStore.GET_USER_INFO()
  loading.value = false
}

const dialogUpdate = ref(false)

const userPass = reactive({
  curentPassword: null,
  newPassword: null,
  rePassword: null,
})

const validSpecialChar = (rule, value, callback) => {
  const regex = /[!@#$%^&*(),.?":{}|<>`\[\]\\\/\-=_+~;']/
  if (!value || regex.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}
const validUpperChar = (rule, value, callback) => {
  const regex = /[A-Z]/
  if (!value || regex.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}
const validLowerChar = (rule, value, callback) => {
  const regex = /[a-z]/
  if (!value || regex.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}
const validDigit = (rule, value, callback) => {
  const regex = /\d/
  if (!value || regex.test(value)) {
    callback()
  } else {
    callback(new Error(rule.message))
  }
}
const validConfirmPass = (rule, value, callback) => {
  if (value !== userPass.newPassword) {
    callback(new Error(t('configUser.validateMessage.passwordMismatch')))
  } else {
    callback()
  }
}

const rulePass = reactive({
  curentPassword: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
  newPassword: [],
  rePassword: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
    { validator: validConfirmPass, trigger: 'blur' },
  ],
})

const handleUpdatePassword = () => {
  resetDialog()
  dialogUpdate.value = true
}
const resetDialog = () => {
  Object.assign(userPass, {
    curentPassword: null,
    newPassword: null,
    rePassword: null,
  })
}
const formChangePass = ref()
const closeDialog = () => {
  const formEl = formChangePass
  formEl.value.clearValidate()
  formEl.value.resetFields()
}
const updatePassword = () => {
  const formEl = formChangePass
  const data = trimData(userPass)
  if (processing.value) {
    return
  }
  formEl.value.validate(valid => {
    if (valid) {
      processing.value = true
      updatePass(data)
        .then(res => {
          dialogUpdate.value = false
          resetDialog()
          ElMessage({
            type: 'success',
            message: t('configUser.message.updateSuccess'),
          })
        })
        .catch(err => {
          console.log(err)
        })
        .finally(_ => {
          processing.value = false
        })
    }
  })
}

onBeforeMount(() => {
  getUser()
  getPasswordRule()
})

defineOptions({ name: 'Profile' })
</script>

<style scoped lang="scss">
.update-password .el-dialog__body {
  padding: 16px;
}

.update-password .el-dialog__body button {
  height: 32px;
  width: 110px;
}

.update-password .el-dialog__body button:last-child {
  width: 140px;
}

.profile-editor-container {
  width: 956px;
  border-radius: 2px;
  background: #fff;
  margin: 12px auto;
  padding: 15px;
  min-height: calc(100vh - 80px);

  .content {
    .title-block {
      color: #212633;
      font-size: 18px;
    }

    .avatar {
      margin-bottom: 64px;
      text-align: center;

      h2 {
        color: #212633;
        font-size: 18px;
        margin: 20px;
      }

      img {
        width: 128px;
        height: 128px;
        margin: auto;
        border-radius: 100%;
      }

      .avatar-uploader {
        cursor: pointer;
        color: #0078d4;
        font-size: 14px;
        text-decoration: underline;
      }
    }

    // .body {
    //   text-align: center;
    // }
    .group {
      display: flex;

      & > div {
        flex: 1;
      }

      & > div:first-child {
        margin-right: 5px;
      }

      & > div:last-child {
        margin-left: 5px;
      }
    }

    .info {
      border-bottom: 1px solid #ebebec;
      padding-bottom: 10px;

      .action {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        margin-top: 20px;
        color: #76809b;

        div {
          div:hover {
            color: #0078d4;
            text-decoration: underline;
          }
        }

        .title-block {
          margin-bottom: 0;
        }

        .group-btn {
          margin-left: 10px;

          > div {
            margin-left: 8px;
            font-size: 16px;
            cursor: pointer;
          }

          .update {
            color: #0078d4;
          }

          .cancel:hover {
            color: #76809b;
          }
        }

        .button-act:hover {
          color: #0078d4;
          text-decoration: underline;
        }

        .button-act {
          margin-left: 18px;
          font-size: 16px;
          cursor: pointer;

          svg {
            width: 20px;
            height: 20px;
          }
        }
      }
    }

    .accout {
      margin-top: 20px;

      .action {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        margin-top: 20px;
        color: #76809b;

        div {
          div:hover {
            color: #0078d4;
            text-decoration: underline;
          }
        }

        .title-block {
          margin-bottom: 0;
        }

        .group-btn {
          margin-left: 10px;

          > div {
            margin-left: 8px;
            font-size: 16px;
            cursor: pointer;
          }
        }

        .button-act:hover {
          color: #0078d4;
          text-decoration: underline;
        }

        .button-act {
          margin-left: 18px;
          font-size: 16px;
          cursor: pointer;

          svg {
            width: 20px;
            height: 20px;
          }
        }

        .change-pass {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
