import http from '@/utils/request'

export function getListTollKPI(data) {
  return http.request({
    url: '/monitor/kpi',
    method: 'post',
    data,
  })
}
//
export function apiGetListAbnormal(data) {
  let url = `/monitor/transaction/list`
  if (data && typeof data === 'object') {
    const queryString = Object.entries(data)
      .filter(([key, value]) => value != null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')

    if (queryString) {
      url += `?${queryString}`
    }
  }
  console.log(url)
  return http.request({
    url,
    method: 'get',
  })
}

export function apiGetAlertConfig() {
  return http.request({
    url: '/alert/alert-config',
    method: 'get',
  })
}

export function apiGetRevenueAlertConfig() {
  return http.request({
    url: '/alert/revenue-alert-config',
    method: 'get',
  })
}

export function apiUpdateAlertListConfig(data) {
  return http.request({
    url: `/alert/revenue-alert-config/update-list`,
    method: 'put',
    data,
  })
}

export function apiUpdateAlertConfig(id, data) {
  return http.request({
    url: '/alert/alert-config/' + id,
    method: 'put',
    data,
  })
}

export function apiGetAlertType(type) {
  return http.request({
    url: '/alert/alert-type/find-by-type/' + type,
    method: 'get',
  })
}

export function apiGetAlertInfo(data) {
  return http.request({
    url: '/alert/alert-info/find-all',
    method: 'post',
    data,
  })
}

export function apiUpdateWarningStatus(data) {
  return http.request({
    url: `/alert/alert-info/change-ignore`,
    method: 'post',
    data,
  })
}

export function apiUpdateAlertStatus(id) {
  return http.request({
    url: '/alert/alert-info/change-viewed/' + id,
    method: 'get',
  })
}

export function apiGetAbnormalTypeAll() {
  return http.request({
    url: '/monitor/transaction/abnormal-type-all',
    method: 'get',
  })
}

// Free Car
export function apiGetListFreeCarTransaction(data) {
  return http.request({
    url: '/monitor/free-car-transaction/list',
    method: 'get',
    data,
  })
}

export function apiGetFreeTypeAll() {
  return http.request({
    url: '/monitor/transaction/free-type-all',
    method: 'get',
  })
}

// Vehicle Type 4 , 5
export function apiGetListCar45Transaction(data) {
  return http.request({
    url: '/monitor/car-45-transaction/list',
    method: 'get',
    data,
  })
}

export function apiGetTypeVehicleAll() {
  return http.request({
    url: '/monitor/transaction/vehicle-type-all',
    method: 'get',
  })
}

export function apiDeleteTransaction(data) {
  return http.request({
    url: `/monitor/transaction/delete`,
    method: 'post',
    data,
  })
}

export function apiUpdateTransaction(data) {
  return http.request({
    url: `/monitor/transaction/update`,
    method: 'post',
    data,
  })
}

export function apiMarkDoubtTransaction(data) {
  return http.request({
    url: `/monitor/transaction/mark-doubt`,
    method: 'post',
    data,
  })
}

export function apiGetFormulaLibraly(data) {
  return http.request({
    url: `/monitor/formula-configuration/library`,
    method: 'get',
    data,
  })
}

// input 1, output 0
export function apiGetFormulaLibrary(data) {
  return http.request({
    url: `/monitor/formula-configuration/library`,
    method: 'get',
    data,
  })
}

export function apiGetAllFormula() {
  return http.request({
    url: `/monitor/formula-configuration/all`,
    method: 'get',
  })
}
export function apiGetFormula(id) {
  return http.request({
    url: `/monitor/formula-configuration/${id}`,
    method: 'get',
  })
}

export function apiUpdateFormula(data) {
  return http.request({
    url: `/monitor/formula-configuration`,
    method: 'put',
    data,
  })
}
export function apiGetTransactionListAll(data) {
  return http.request({
    url: `/monitor/transaction/list-all`,
    method: 'get',
    data,
  })
}
