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
export function apiCreateBanner(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/banners',
    data,
  })
}
export function apiUpdateBanner(id_banner, data) {
  return http.request({
    method: 'put',
    url: `/wine-service/api/v1.0/managements/banners/${id_banner}`,
    data,
  })
}
export function apiDeleteBanner(id_banner) {
  return http.request({
    method: 'delete',
    url: `/wine-service/api/v1.0/managements/banners/${id_banner}`,
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

