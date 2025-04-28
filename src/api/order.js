import http from '@/utils/request'

export function apiGetAllOrder(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/orders/find-all',
    data,
  })
}

export function apiChangeStatusOrder(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/orders/change-status',
    data,
  })
}
