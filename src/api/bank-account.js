import http from '@/utils/request'

export function apiGetAllBankAccount(data) {
  return http.request({
    method: 'get',
    url: '/bank-payment/api/v1.0/bank-accounts/find-all',
    data,
  })
}

export function apiSetDefaultBankAccount(account_id) {
  return http.request({
    method: 'put',
    url: `/bank-payment/api/v1.0/bank-accounts/${account_id}/set-default`,
  })
}

export function apiCreateBankAccount(data) {
  return http.request({
    method: 'post',
    url: '/bank-payment/api/v1.0/bank-accounts',
    data,
  })
}

export function apiUpdateBankAccount(account_id, data) {
  return http.request({
    method: 'put',
    url: `/bank-payment/api/v1.0/bank-accounts/${account_id}`,
    data,
  })
}

export function apiDeleteBankAccount(account_id) {
  return http.request({
    method: 'delete',
    url: `/bank-payment/api/v1.0/bank-accounts/${account_id}`,
  })
}
