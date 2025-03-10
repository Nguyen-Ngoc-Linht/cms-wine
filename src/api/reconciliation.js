import http from '@/utils/request'

export function apiGetListReconciliationPostInspection(data) {
  return http.request({
    url: '/supervision/report-post-inspection-out',
    method: 'post',
    data,
  })
}

export function apiGetReconciliationPostInspection(data) {
  return http.request({
    url: '/supervision/report-post-inspection-out',
    method: 'post',
    data,
  })
}

export function apiCreateReconciliationPostInspection(data) {
  return http.request({
    url: '/supervision/report-post-inspection-out',
    method: 'post',
    data,
  })
}

export function apiUpdateReconciliationPostInspection(data) {
  return http.request({
    url: '/supervision/report-post-inspection-out',
    method: 'post',
    data,
  })
}

export function apiDeleteReconciliationPostInspection(data) {
  return http.request({
    url: '/supervision/report-post-inspection-out',
    method: 'post',
    data,
  })
}

export function apiPreviewReconciliationPostInspection(data) {
  return http.request({
    url: '/supervision/report-post-inspection-out',
    method: 'post',
    data,
  })
}

export function apiExportFileReconciliationPostInspection(data) {
  return http.request({
    url: '/supervision/report-post-inspection-out',
    method: 'post',
    data,
  })
}

export function apiGetListReconc(data) {
  return http.request({
    url: '/reconciliation/search',
    method: 'post',
    data,
  })
}

export function apiGetReconcDetail(id) {
  return http.request({
    url: '/reconciliation/' + id,
    method: 'get',
  })
}

export function apiGetTollReconcReport(data) {
  return http.request({
    url: '/reconciliation/report/search',
    method: 'post',
    data,
  })
}

export function apiExportTollReconcReport(data) {
  return http.request({
    url: '/reconciliation/report/export',
    method: 'post',
    data,
  })
}

export function apiGetVehicleReconcReport(data) {
  return http.request({
    url: '/reconciliation/report-vehicle/search',
    method: 'post',
    data,
  })
}

export function apiExportVehicleReconcReport(data) {
  return http.request({
    url: '/reconciliation/report-vehicle/export',
    method: 'post',
    data,
  })
}
export function apiCollectPropertySystem(data) {
  return http.request({
    url: '/collect/propertysystem',
    method: 'get',
    data,
  })
}
export function apiUpdateConfigTransaction(data, id) {
  return http.request({
    url: '/collect/propertysystem/' + id,
    method: 'put',
    data,
  })
}
export function apiUpdateConfigFreeVehicle(data, id) {
  return http.request({
    url: '/collect/propertysystem/free/' + id,
    method: 'put',
    data,
  })
}
export function apiUpdateConfigWarning(data, id) {
  return http.request({
    url: '/collect/propertysystem/warning/' + id,
    method: 'put',
    data,
  })
}
export function apiUpdateConfigTimeDelete(data, id) {
  return http.request({
    url: '/collect/propertysystem/logfile/' + id,
    method: 'put',
    data,
  })
}
