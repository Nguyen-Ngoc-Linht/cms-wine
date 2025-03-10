import http from '@/utils/request'

export function apiGetListReportHandlingErrorRequest(data) {
  return http.request({
    url: '/supervision/periodic-report',
    method: 'post',
    data,
  })
}

export function apiExportFileExcelReportHandlingError(data) {
  return http.request({})
}

export function apiExportPdfReportHandlingError(data) {
  return http.request({})
}

// Periodic
export function apiGetListPeriodicMonitoring(data) {
  return http.request({
    url: `/supervision/periodic-report`,
    method: 'post',
    data,
  })
}

export function apiGetPeriodicMonitoring(data) {
  return http.request({
    url: `/supervision/periodic-report`,
    method: 'post',
    data,
  })
}

export function apiCreatePeriodicMonitoring(data) {
  return http.request({
    url: `/supervision/periodic-report`,
    method: 'post',
    data,
  })
}

export function apiUpdatePeriodicMonitoring(data) {
  return http.request({
    url: `/supervision/periodic-report`,
    method: 'post',
    data,
  })
}

export function apiDeletePeriodicMonitoring(data) {
  return http.request({})
}

export function apiPreviewReportPeriodic(data) {
  return http.request({
    url: `/supervision/periodic-report`,
    method: 'post',
    data,
  })
}

export function apiExportFileReport(data) {
  return http.request({
    url: `/supervision/periodic-report`,
    method: 'post',
    data,
  })
}

// Supervision Report
export function apiGetListSupervision(data) {
  return http.request({
    url: `/supervision/vec-issue-report`,
    method: 'post',
    data,
  })
}

export function apiExportFileSupervision(data) {
  return http.request({
    url: `/supervision/vec-issue-report`,
    method: 'post',
    data,
  })
}
