<template>
  <div />
</template>

<script setup>
import { unref } from 'vue'
import { useRouter } from 'vue-router'

const { currentRoute, push } = useRouter()

const { params, query } = unref(currentRoute)
const { path } = params
const _path = Array.isArray(path) ? path.join('/') : path

push({
  path: '/' + _path,
  query,
})

defineOptions({
  name: 'Redirect',
})
</script>
