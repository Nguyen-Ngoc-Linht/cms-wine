import http from '@/utils/request'
import {ref} from 'vue'
import {getConfig} from '@/config'
import {getToken} from '@/utils/auth'
import axios from 'axios'

export function apiGetAllDataChatbot() {
  return http.request({
    method: 'get',
    url: '/chatbot-service/api/v1.0/data-his/find-all',
  })
}

const baseUrl = ref(getConfig('VITE_PROXY_DOMAIN'))
export async function uploadData(params) {
  const token = getToken()
  const rs = await axios.post(`${baseUrl.value}chatbot-service/api/v1.0/data/upload/qdrant`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
  if (rs.status === 202) {
    return rs.data
  } else {
    return {
      code: 400,
    }
  }
}

export function apiSetDefaultData(data_id) {
  return http.request({
    method: 'get',
    url: `/chatbot-service/api/v1.0/data-his/set-default/${data_id}`,
  })
}

export function apiDownloadFile(filePath) {
  return http.request({
    method: 'get',
    url: `/chatbot-service/api/v1.0/data-his/download/${filePath}`,
    responseType: 'blob'
  })
}
