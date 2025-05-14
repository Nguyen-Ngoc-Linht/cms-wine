<template>
  <div style="height: calc(100vh)" class="w-full bg-login">
    <div class="flex items-center justify-center w-full h-full">
      <div class="box-login">
        <h4 class="text-[#FAFAFA] text-5xl font-bold mt-10 mb-6">Đăng nhập</h4>

        <el-form ref="formLogin" :rules="ruleEdit" :model="infoLogin" class="w-full py-8">
          <el-form-item label="Tài khoản" prop="username">
            <el-input v-model="infoLogin.username" placeholder="Nhập tên tài khoản"></el-input>
          </el-form-item>
          <el-form-item label="Mật khẩu" prop="password">
            <el-input v-model="infoLogin.password" type="password" placeholder="Nhập mật khẩu"></el-input>
          </el-form-item>
        </el-form>

        <el-button
          @click="handleLogin"
          :loading="processing"
          class="border--none bg--purple text-white"
          style="border: none"
        >
          Đăng nhập
        </el-button>
      </div>
    </div>
  </div>
  <!--  </div>-->
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import {apiLogin} from '@/api/auth'
import {ElMessage} from 'element-plus'
import {useUserStore} from '@/store'
import {useRouter} from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const ruleEdit = ref({
  username: [{ required: true, message: 'Vui lòng nhập tên tài khoản', trigger: 'blur' },],
  password: [{ required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' }],
})
const formLogin = ref(null)
const processing = ref(false)

const infoLogin = ref({
  username: '',
  password: '',
})

const handleLogin = async () => {
  try {
    await Promise.all([
      validFormData()
    ])
    const params = {
      email: infoLogin.value.username,
      password: infoLogin.value.password
    }
    processing.value = true
    const rs = await apiLogin(params)
    if (rs.code === 200) {
      userStore.SET_TOKEN(rs.data.token)
      localStorage.setItem('userInfo', JSON.stringify(rs.data))
      ElMessage.success('Đăng nhập thành công')
      await router.push('/')
      window.location.reload()
    }
    processing.value = false
  } catch (e) {
    processing.value = false
    console.log(e)
  }
}

const validFormData = async () => {
  return new Promise((resolve, reject) => {
    formLogin.value.validate(valid => {
      if (valid) {
        resolve(true)
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Lỗi validate form chính')
      }
    })
  })
}
</script>
<style scoped lang="scss">
.box-login {
  width: 24%;
  min-width: 400px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  min-height: 60%;
  border-radius: 10px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(19, 19, 22, 0.8);
}

.bg-login {
  background: url('@/assets/imgs/loginbg.jpg') center center no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
}

:deep(.el-form-item__label) {
  color: #D1D1D6;
}

:deep(.el-input__wrapper) {
  background-color: transparent;
}

:deep(.el-input__inner) {
  color: #D1D1D6;
}
</style>
