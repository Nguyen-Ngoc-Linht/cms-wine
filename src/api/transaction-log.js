import http from '@/utils/request'

export function apiGetAllTransactionLog(data) {
  return http.request({
    method: 'post',
    url: '/bank-payment/api/v1.0/transaction-logs/find-all',
    data,
  })
}
