import http from '@/utils/request'

export function getListFareTable(data) {
  return http.request({
    url: 'category/fee-rates/find-all',
    method: 'post',
    data,
  })
}

export function apiAddFareTable(data) {
  return http.request({
    url: '/category/fee-rates',
    method: 'post',
    data,
  })
}

export function apiUpdateFareTable(fare_id, data) {
  return http.request({
    url: `category/fee-rates/${fare_id}`,
    method: 'put',
    data,
  })
}

export function apiGetDetailsFareTable(fare_id) {
  return http.request({
    url: `/category/fee-rates/${fare_id}`,
    method: 'get',
  })
}

export function apiDeleteFareTable(fare_id) {
  return http.request({
    url: `/category/fee-rates/${fare_id}`,
    method: 'delete',
  })
}

export function apiStatusFareTable(data) {
  return http.request({
    url: `/category/fee-rates/change-status`,
    method: 'post',
    data,
  })
}
