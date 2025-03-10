import http from '@/utils/request'

export function fetchReportVehicleStation(data) {
  return http.request({
    method: 'post',
    url: '/oms/report-vehicle-weight-station',
    data,
  })
}

export function fetchReportVehicleLane(data) {
  return http.request({
    method: 'post',
    url: '/oms/report-vehicle-lane-weight-station',
    data,
  })
}

export function fetchReportViolationStation(data) {
  return http.request({
    method: 'post',
    url: '/oms/report-general-weight-station',
    data,
  })
}

export function fetchReportStatisticStation(data) {
  return http.request({
    method: 'post',
    url: '/oms/report-statistic-weight-station',
    data,
  })
}

export function exportReportViolationStation(data) {
  return http.request({
    method: 'post',
    url: '/oms/report-general-weight-station-pdf',
    data,
  })
}

export function exportReportStatisticStation(data) {
  return http.request({
    method: 'post',
    url: '/oms/report-statistic-weight-station-pdf',
    data,
  })
}

export function exportReportVehicleStation(data) {
  return http.request({
    method: 'post',
    url: '/oms/report-vehicle-weight-station-pdf',
    data,
  })
}

export function exportReportVehicleLane(data) {
  return http.request({
    method: 'post',
    url: '/oms/report-vehicle-lane-weight-station-pdf',
    data,
  })
}
