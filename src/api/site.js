import http from '@/utils/request'

export function getSites(data) {
  return http.request({
    method: 'get',
    url: '/systemconfig/site',
    data,
  })
}

export function getSitesCam(data) {
  return http.request({
    method: 'get',
    url: '/systemconfig/site/contain-cam',
    data,
  })
}
export function getAllSite(data) {
  return http.request({
    method: 'get',
    url: '/asset/site',
    data,
  })
}

export function getSitesCamByRole(data) {
  return http.request({
    method: 'get',
    url: '/vds/by-function-and-role',
    data,
  })
}
