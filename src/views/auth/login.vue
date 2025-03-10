<template>
  <div style="height: calc(100vh)" class="w-full">
    <div class="flex items-center justify-center w-full h-full">
      <div class="box-login">
        <h4>Đăng nhập</h4>

        <el-form class="w-full">
          <el-form-item label="Tài khoản/Số điện thoại">
            <el-input v-model="infoLogin.username"></el-input>
          </el-form-item>
          <el-form-item label="Mật khẩu">
            <el-input v-model="infoLogin.password" type="password"></el-input>
          </el-form-item>
        </el-form>

        <button @click="handleLogin" class="btn bg-gradient-success">Đăng nhập</button>
      </div>
    </div>
  </div>
  <!--  </div>-->
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import {apiLogin} from '@/api/auth'
import {ElMessage} from 'element-plus'
import cookies from '@/utils/cookies'
import {useUserStore} from '@/store'

const userStore = useUserStore()

const infoLogin = ref({
  username: '',
  password: '',
})

const handleLogin = async () => {
  const params = {
    email: infoLogin.value.username,
    password: infoLogin.value.password
  }
  const rs = await apiLogin(params)
  console.log(rs)
  if (rs.code === 200) {
    userStore.SET_TOKEN(rs.data.token)
    ElMessage.success('Đăng nhập thành công')
  }
  console.log(rs, 'data')
}
</script>
<style scoped lang="scss">
.box-login {
  width: 24%;
  min-width: 400px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  min-height: 400px;
  border-radius: 10px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
