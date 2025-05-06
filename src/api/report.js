import http from '@/utils/request'

export function apiExportReport(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/statistical-report/export',
    data,
  })
}
