<template>
  <LangSelect class="hover-effect"/>
  <div
    class="info-about"
  >
    <!--    <img-->
    <!--      v-if="list.imageUrl && list.imageUrl !== ''"-->
    <!--      :src="list.imageUrl"-->
    <!--      class="elcom-logo"-->
    <!--      width="94"-->
    <!--    />-->
    <img
      :src="logoVec"
      class="elcom-logo"
      width="94"
    />
    <p class="margin-bottom-16">
      <strong>{{ t('aboutUs.company') }}</strong>
    </p>
    <p class="margin-bottom-16">{{ t('aboutUs.address') }}</p>
    <div class="flex gap-[12px] justify-center margin-bottom-16">
      <span>Tel: {{ formatPhoneNumber('0436373971') }}</span>
      <span>-</span>
      <span>Fax: {{ formatPhoneNumber('0436373970') }}</span>
    </div>
    <p class="margin-bottom-16">Email: contact@vecc.com.vn</p>
    <p>Website: www.vecc.com.vn</p>
    <div class="block-about-bottom">
      <div class="block-about-bottom-left">
        <img
          v-if="logoExpand"
          :src="logoExpand"
          class="Expand-logo"
        />
      </div>
      <div class="block-about-bottom-right">
        <div class="margin-bottom-15">
          <span>{{ t('aboutUs.version') }}:</span>
          <span><b>v</b><strong>1.0</strong></span>
        </div>
        <div class="margin-bottom-15">
          <span>{{ t('aboutUs.updateTime') }}:</span>
          <span><strong>26/12/2025</strong></span>
        </div>
        <div>
          <span>{{ t('aboutUs.license') }}:</span>
          <span><strong>VECC2015</strong></span>
        </div>
      </div>
    </div>
  </div>
  <!--  <div v-else>-->
  <!--    <div-->
  <!--      v-loading="loading"-->
  <!--      class="height-360"-->
  <!--    ></div>-->
  <!--  </div>-->
</template>

<script setup>
import {ref} from 'vue'
import {getAbout} from '@/api/about'
import logoExpand from '@/assets/imgs/logo_gstp.png'
import logoVec from '@/assets/imgs/logo_vec.png'
import LangSelect from '@/layout/components/navbar/components/LangSelect'
import {useI18n} from '@/locale'

const {t} = useI18n()
const list = ref({})
const loading = ref(true)
// const getList = async () => {
//   const params = {
//     page: 1,
//     size: 10,
//     key: 'DV00070',
//   }
//
//   const {data} = await getAbout(params)
//   list.value = data[0]
//   loading.value = false
// }
// getList()

const formatPhoneNumber = phoneNumber => {
  if (!phoneNumber) return ''
  const numericOnly = phoneNumber.replace(/\D/g, '')
  const isValidLength = numericOnly.length === 10 || numericOnly.length === 11

  if (!isValidLength) {
    return 'Số điện thoại không hợp lệ'
  }

  if (numericOnly.length === 10) {
    return numericOnly.replace(/(\d{2})(\d{2})(\d{3})(\d{3})/, '$1 $2 $3 $4')
  } else if (numericOnly.length === 11) {
    return numericOnly.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
  } else {
    return numericOnly
  }
}
</script>
<style scoped lang="scss">
@import '@/styles/variables.module.scss';
.info-about {
  text-align: center;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  color: $menuText;

  strong {
    text-transform: uppercase;
    font-weight: 500;
  }

  b {
    font-weight: 500;
  }

  .elcom-logo {
    margin: auto;
    margin-bottom: 24px;
  }
}

.block-about-bottom {
  background: #badffb;
  border-radius: 5px;
  max-width: 470px;
  margin: 24px auto 0px;
  display: grid;
  grid-template-columns: 92px 1fr;
  padding: 16px;
  width: 341px;

  img.Expand-logo {
    width: 92px;
  }
}

.block-about-bottom-right {
  border-left: 1px solid #fff;
  padding-left: 16px;
  margin-left: 16px;

  div {
    display: flex;
    justify-content: space-between;
    text-align: left;
  }
}

.hover-effect {
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}

.p8 {
  padding: 8px;
}
</style>
