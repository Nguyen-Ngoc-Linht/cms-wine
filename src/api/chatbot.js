import http from '@/utils/request'

export function apiGetAllDataChatbot() {
  return http.request({
    method: 'get',
    url: '/chatbot-service/api/v1.0/data-his/find-all',
  })
}
