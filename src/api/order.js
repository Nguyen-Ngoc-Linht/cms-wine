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

export function apiGetOrderDetail(id) {
  return http.request({
    url: `/wine-service/api/v1.0/managements/orders/${id}`,
    method: 'get'
  })
}

export function apiCancelOrder(id, reason) {
  return http.request({
    url: `/wine-service/api/v1.0/managements/orders/${id}/cancel`,
    method: 'put',
    data: { reason }
  })
}

export function userService(id, reason) {
  return http.request({
    url: `/wine-service/api/v1.0/managements/orders/${id}/cancel`,
    method: 'put',
    data: { reason }
  })
}
