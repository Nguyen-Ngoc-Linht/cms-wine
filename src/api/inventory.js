import http from '@/utils/request'
import {ref} from 'vue'
import {getConfig} from '@/config'
import {getToken} from '@/utils/auth'
import axios from 'axios'

export function apiGetVariants(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/variants/find-all',
    data,
  })
}

export function apiGetAllVariants(data) {
  return http.request({
    method: 'get',
    url: '/wine-service/api/v1.0/managements/variants/get-all',
    data,
  })
}

export function apiImportGoods(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/variants/import-goods',
    data,
  })
}

export function apiUpdateVariant(data, variant_id) {
  return http.request({
    method: 'put',
    url: `/wine-service/api/v1.0/managements/variants/${variant_id}`,
    data,
  })
}

export function apiInventoryLogs(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/inventory-logs/find-all',
    data,
  })
}

export function apiUpdateImportGoods(data, inventory_log_id) {
  return http.request({
    method: 'put',
    url: `/wine-service/api/v1.0/managements/variants/update-import-goods/inventory-log/${inventory_log_id}`,
    data,
  })
}

const baseUrl = ref(getConfig('VITE_PROXY_DOMAIN'))
export async function uploadFile(params) {
  const token = getToken()
  const rs = await axios.post(`${baseUrl.value}media-service/api/v1.0/uploads`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
  if (rs.status === 200) {
    return rs.data
  } else {
    return {
      code: 400,
    }
  }
}
