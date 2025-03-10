import http from '@/utils/request'

export function apiLogin(data) {
  return http.request({
    method: 'post',
    url: '/auth/sign-in',
    data,
  })
}
