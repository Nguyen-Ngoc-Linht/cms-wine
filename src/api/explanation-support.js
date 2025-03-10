import http from '@/utils/request'

export function apiGetListExplanation(params) {
  return http.request({
    method: 'get',
    url: `/explanation/list`,
    data: params,
  })
}
export function apiGetDetailExplanation(id) {
  return http.request({
    method: 'get',
    url: `/explanation/${id}`,
  })
}
export function apiCreateExplanation(data) {
  return http.request({
    method: 'post',
    url: `/explanation/create`,
    data,
  })
}
export function apiSendNotifyExplanation(data) {
  return http.request({
    method: 'post',
    url: `/explanation/notify`,
    data,
  })
}
export function apiUpdateExplanation(data) {
  return http.request({
    method: 'post',
    url: `/explanation/update`,
    data,
  })
}
export function apiRemoveExplanation(id) {
  return http.request({
    method: 'delete',
    url: `/explanation/delete/${id}`,
  })
}
export function apiGetListStatusExplanation() {
  return http.request({
    method: 'get',
    url: `/explanation/status/list`,
  })
}
export function apiGetListTypeExplanation() {
  return http.request({
    method: 'get',
    url: `/explanation/type/list`,
  })
}
export function apiCreateQuickExplanation(data) {
  return http.request({
    method: 'post',
    url: `/explanation/quick-explanation/create`,
    data,
  })
}
export function apiUpdateQuickExplanation(data) {
  return http.request({
    method: 'post',
    url: `/explanation/quick-explanation/update`,
    data,
  })
}
export function apiImportFileExplanation(data) {
  return http.request({
    method: 'post',
    url: `/explanation/report/create`,
    data,
  })
}
export function apiDeleteFileExplanation(data) {
  return http.request({
    method: 'post',
    url: `/explanation/report/delete`,
    data,
  })
}
export function apiUpdateStatusExplanation(data) {
  return http.request({
    method: 'post',
    url: `/explanation/update-status`,
    data,
  })
}
export function apiExportExplanation(params) {
  return http.request({
    method: 'get',
    url: `/explanation/export`,
    data: params,
  })
}
export function apiExplanationQuickDetail(params) {
  return http.request({
    method: 'post',
    url: `/explanation/detail/quick-explanation`,
    data: params,
  })
}
export function apiExplanationUpdateDetail(params) {
  return http.request({
    method: 'post',
    url: `/explanation/detail/update`,
    data: params,
  })
}
