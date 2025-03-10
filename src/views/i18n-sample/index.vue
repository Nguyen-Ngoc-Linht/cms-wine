<template>
  <div class="padding-8">
    <LangSelect class="p8 hover-effect" />
    <h1>{{ t('el.select.noMatch') }}</h1>
    <h1>{{ t('el.select.loading') }}</h1>
    <h1>{{ t('el.select.noData') }}</h1>
    <h1>{{ t('el.cascader.noMatch') }}</h1>
    <h1>{{ t('el.cascader.loading') }}</h1>
    <h1>{{ t('el.cascader.placeholder') }}</h1>
    <h1>{{ t('el.cascader.noData') }}</h1>
  </div>
</template>

<script setup>
import LangSelect from '@/layout/components/navbar/components/LangSelect'
import { useI18n } from '@/locale'
const { t } = useI18n()
</script>
