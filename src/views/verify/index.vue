<template>
  <div class="main">
    <div class="card-cf">
      <div class="title">{{ t('verify.enterCode') }}</div>
      <p class="note">{{ t('verify.note') }}</p>
      <el-form
        ref="formRef"
        :model="formInfo"
        :rules="rules"
      >
        <el-form-item
          prop="verificationCode"
          required
        >
          <el-input
            v-model="formInfo.verificationCode"
            maxlength="20"
            :placeholder="t('verify.enterCode')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="flex justify-center margin-top-30 margin-bottom-20">
        <el-button
          type="primary"
          class="width-170"
          @click="retrieve"
          :loading="processRetrieve"
          :disabled="retrieving || processing"
          >{{ t('verify.refreshCode') }}{{ retrieving ? `(${timeLeft})` : '' }}</el-button
        >
        <el-button
          class="el-button--main width-170"
          type="primary"
          @click="verify"
          :loading="processing"
          :disabled="processRetrieve"
          >{{ t('verify.verify') }}</el-button
        >
      </div>
      <p
        class="underline pointer"
        @click="logout()"
      >
        Chuyển đổi tài khoản
      </p>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useI18n } from '@/locale'
import { ElMessage } from 'element-plus'
import { apiVerifyOTP, apiRetrieveOTP } from '@/api/user'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import cookies from '@/utils/cookies'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const formInfo = reactive({
  verificationCode: null,
})
const rules = reactive({
  verificationCode: [
    { required: true, message: t('configUser.validateMessage.required'), trigger: 'blur' },
  ],
})

const formRef = ref()
const processing = ref(false)
const verify = () => {
  // userStore.SET_VERIFY()
  // const redirect = cookies.get('redirect')
  // router.push(redirect || '/')
  const formEl = formRef
  formEl.value.validate(valid => {
    if (valid) {
      const { verificationCode } = formInfo
      processing.value = true
      apiVerifyOTP({ verificationCode })
        .then(res => {
          userStore.SET_TOKEN(res.data.split(' ')[1])
          userStore.SET_VERIFY()
          const redirect = cookies.get('redirect')
          router.push(redirect || '/')
        })
        .finally(_ => {
          processing.value = false
        })
    }
  })
}
const processRetrieve = ref(false)
const retrieve = () => {
  if (processRetrieve.value || retrieving.value) {
    return
  }

  processRetrieve.value = true
  apiRetrieveOTP()
    .then(res => {
      startCountdown()
    })
    .finally(_ => {
      processRetrieve.value = false
    })
}
const logout = () => {
  userStore.LOGIN_OUT()
}

const timeLeft = ref(10)
const retrieving = ref(false)
let timer = null
const startCountdown = () => {
  if (retrieving.value) return

  retrieving.value = true
  timeLeft.value = 10

  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
      retrieving.value = false
    }
  }, 1000)
}
onBeforeMount(() => {})
</script>

<style scoped lang="scss">
* {
  font-family: OpenSans, Helvetica, Arial, sans-serif;
}

.main {
  width: 100vw;
  height: 100vh;
  background: url('@/assets/imgs/bg-verify.jpg') center no-repeat;
  background-size: cover;
  padding: 100px;
}

.card-cf {
  margin: 0 auto;
  box-shadow: 0 0.1875rem 0.4375rem 0.1875rem rgba(3, 3, 3, 0.13),
    0 0.6875rem 1.5rem 1rem rgba(3, 3, 3, 0.12);
  max-width: 500px;
  border-top: 4px solid;
  border-color: #06c;
  background: #fff;
  padding: 20px 40px 30px 40px;
  min-height: 350px;
  text-align: center;
}

.title {
  text-align: center;
  font-size: 30px;
  line-height: 36px;
  font-weight: 300;
  margin-bottom: 40px;
  color: #059efb;
}

.note {
  padding: 0 20px;
  margin-bottom: 30px;

  &::before {
    content: '*';
    color: red;
  }
}

:deep(.el-input__wrapper) {
  height: 36px;
  text-overflow: ellipsis;
  font-size: 0.875rem;
  border-width: 1px;
  border-color: #ededed #ededed #8a8d90 #ededed;
  padding: 0.5rem;
  border-radius: 0 !important;
}

:deep(.el-input__wrapper.is-focus) {
  outline: #161616 auto 1px;
}
</style>
