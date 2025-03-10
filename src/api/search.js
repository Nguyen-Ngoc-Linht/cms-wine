import http from '@/utils/request'

export function getListTransactions(data) {
  return http.request({
    method: 'post',
    url: '/oms/transactions',
    data,
  })
}

export function getListCategory(data) {
  return http.request({
    method: 'get',
    url: '/systemconfig/category',
    data,
  })
}

export function getLaneByStation(data) {
  return http.request({
    method: 'post',
    url: '/oms/get-unique-lane-ids-by-stations-ids',
    data,
  })
}

export function getTransactionDetailId(data) {
  return http.request({
    method: 'get',
    url: `/oms/transactions/detail`,
    data,
  })
}

export function fetchDashboardCensorshipViolation(data) {
  return http.request({
    method: 'post',
    url: '/gsxp/dashboard-censorship-violation',
    data,
  })
}

export function fetchListCamera(data) {
  return http.request({
    method: 'get',
    url: '/systemconfig/camera',
    data,
  })
}

export function getListViolationType(data) {
  return http.request({
    method: 'get',
    url: '/systemconfig/category',
    data,
  })
}

export function getChartDataDetail(data) {
  return http.request({
    method: 'get',
    url: `/oms/transactions/model-chart-data-detail`,
    data,
  })
}

export function getListTransactionsHistory(data) {
  return http.request({
    method: 'post',
    url: '/oms/transaction-vehical/history-scale',
    data,
  })
}

export function getTransactionsVideo(data) {
  return http.request({
    method: 'get',
    url: '/oms/transactions/video',
    data,
  })
}
