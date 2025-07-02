import http from '@/utils/request'

export function apiGetOrderStatistic(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/dashboard/get-order-statistics',
    data,
  })
}

export function apiGetRevenueStatistic(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/dashboard/get-revenue-statistics',
    data,
  })
}

export function apiGetTopProductRevenue(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/dashboard/get-products-sales',
    data,
  })
}

export function apiGetRecentOrders() {
  return http.request({
    method: 'get',
    url: '/wine-service/api/v1.0/managements/dashboard/get-recent-orders',
  })
}
