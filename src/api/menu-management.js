import http from '@/utils/request'

export function apiGetListMenu() {
  return http.request({
    url: '/menu-management/menu',
    method: 'get',
  })
}
export function apiGetMenuByRole(data) {
  return http.request({
    url: '/menu-management/menu/role-menu-by-role',
    method: 'get',
    data,
  })
}
export function apiGetAppByRole(data) {
  return http.request({
    url: '/menu-management/application-by-role',
    method: 'get',
    data,
  })
}
