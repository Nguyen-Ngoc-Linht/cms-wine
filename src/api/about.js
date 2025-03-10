import http from '@/utils/request'

export function getAbout(data) {
  return http.request({
    method: 'get',
    url: '/asset/unit',
    data,
  })
}
