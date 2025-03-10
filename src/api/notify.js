import http from '@/utils/request'

export function getNotifyList(data) {
  return http.request({
    method: 'post',
    url: '/notify/app',
    data,
  })
}
export function readNotify(data) {
  return http.request({
    method: 'post',
    url: '/notify/read-notify',
    data,
  })
}
export function readAllNotify(data) {
  return http.request({
    method: 'post',
    url: '/notify/read-all-notify',
    data,
  })
}
export function countNotify(data) {
  return http.request({
    method: 'get',
    url: 'notify/number-notify',
    data,
  })
}

export function getReceiveNotify(data) {
  return http.request({
    method: 'get',
    url: '/oms/receive-notify-status',
    data,
  })
}
export function changeReceiveNotify(data) {
  return http.request({
    method: 'post',
    url: '/oms/change-receive-notify-status',
    data,
  })
}
export function apiGetNotifyByUser(data, id) {
  return http.request({
    method: 'get',
    url: '/category/notify/' + id,
    data,
  })
}
export function apiUpdateNotifyByUser(id) {
  return http.request({
    method: 'put',
    url: '/category/notify/' + id,
  })
}
