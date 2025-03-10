import http from '@/utils/request'

export function getListApp() {
  return http.request({
    method: 'get',
    url: '/menu-management/menu/application',
  })
}
