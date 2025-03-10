import http from '@/utils/request'

export function apiLogin(data) {
  return http.request({
    method: 'post',
    url: '/auth-server/api/v1.0/auth/sign-in',
    data,
  })
}
