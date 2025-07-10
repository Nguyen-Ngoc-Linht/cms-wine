import http from '@/utils/request'

export function apiSessionConfig(data) {
  return http.request({
    method: 'post',
    url: '/sysd/session/idle-timeout',
    data,
  })
}

export function apiGetAllBanner(data) {
  return http.request({
    method: 'get',
    url: '/wine-service/api/v1.0/managements/banners/find-all',
    data,
  })
}

export function apiGetSystemConfig(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/system-params/get-by-code',
    data,
  })
}

export function apiUpdateSystemConfig(data) {
  return http.request({
    method: 'put',
    url: '/wine-service/api/v1.0/managements/system-params',
    data,
  })
}

