import http from '@/utils/request'

export function apiTrafficFlow(data) {
  return http.request({
    method: 'post',
    url: '/dashboard/chart/traffic',
    data,
  })
}

export function apiTrafficForecast(data) {
  return http.request({
    method: 'post',
    url: '/dashboard/chart/traffic/forecast',
    data,
  })
}
export function apiRevenue(data) {
  return http.request({
    method: 'post',
    url: '/dashboard/chart/revenue',
    data,
  })
}

export function apiRevenueForecast(data) {
  return http.request({
    method: 'post',
    url: '/dashboard/chart/revenue/forecast',
    data,
  })
}
export function apiGetKPI(data) {
  return http.request({
    method: 'post',
    url: '/supervision/kpi',
    data,
  })
}

export function apiGetExplainNotify(data) {
  return http.request({
    method: 'post',
    url: '/dashboard/reminder',
    data,
  })
}

export function apiIncident(data) {
  return http.request({
    method: 'post',
    url: '/dashboard/incident',
    data,
  })
}

export function apiMapMarker(data) {
  return http.request({
    method: 'post',
    url: '/dashboard/map/route-coordinates',
    data,
  })
}

export function apiGetPosition() {
  return http.request({
    method: 'get',
    url: '/category/dashboard-config',
  })
}

export function apiUpdatePosition(data) {
  return http.request({
    method: 'put',
    url: '/category/dashboard-config/update',
    data,
  })
}
export function apiGetListStatus(data) {
  return http.request({
    method: 'post',
    url: '/dashboard/incident/status',
    data,
  })
}

export function apiGetWarning(data) {
  return http.request({
    method: 'post',
    url: '/dashboard/warning/stats',
    data,
  })
}
