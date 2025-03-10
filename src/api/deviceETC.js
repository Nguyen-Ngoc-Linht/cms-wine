import http from '@/utils/request'

export function apiGetListDevice() {
  return http.request({
    url: '/monitor/remote-supervisor/find-all',
    method: 'get',
  })
}

export function apiCreateDevice(data) {
  return http.request({
    url: '/monitor/remote-supervisor',
    method: 'post',
    data,
  })
}

export function apiUpdateDevice(device_id, data) {
  return http.request({
    url: `/monitor/remote-supervisor/${device_id}`,
    method: 'put',
    data,
  })
}

export function apiDeleteDevice(device_id) {
  return http.request({
    url: `/monitor/remote-supervisor/${device_id}`,
    method: 'delete',
  })
}

export function apiGetDetailDevice(device_id) {
  return http.request({
    url: `/monitor/remote-supervisor/${device_id}`,
    method: 'get',
  })
}
