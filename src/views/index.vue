<template>
  <div class="home">
    <h2 v-html="t('configUser.welcome')"></h2>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, reactive } from 'vue'
import { useUserStore } from '@/store'
import { useI18n } from '@/locale'

const userStore = useUserStore()
const { t } = useI18n()
defineOptions({
  name: 'Home',
})
</script>

<style scoped lang="scss">
.home {
  height: calc(100vh - 48px);
  width: 100%;
  background: url('@/assets/imgs/banner-home.jpg') center no-repeat;
  background-size: cover;

  h2 {
    position: absolute;
    top: 40%;
    width: 100%;
    transform: translateY(-50%);
    color: #fff;
    text-align: center;
    font-weight: 700;
    font-size: 80px;
    line-height: 100px;
  }
}
</style>
