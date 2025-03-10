import http from '@/utils/request'

export function getListRequestProcessingVEC(data) {
  return http.request({
    url: '/monitor/request-monitor/find-all',
    method: 'post',
    data,
  })
}

export function apiCreateRequestProcessingVEC(data) {
  return http.request({
    url: `/monitor/request-monitor`,
    method: 'post',
    data,
  })
}

export function apiUpdateRequestProcessingVEC(request_id, data) {
  return http.request({
    url: `/monitor/request-monitor/${request_id}`,
    method: 'put',
    data,
  })
}

export function apiGetDetailRequestProcessingVEC(request_id) {
  return http.request({
    url: `/monitor/request-monitor/${request_id}`,
    method: 'get',
  })
}

export function apiDeleteRequestProcessingVEC(request_id) {
  return http.request({
    url: `/monitor/request-monitor/${request_id}`,
    method: 'delete',
  })
}

export function apiChangeStatusRequestProcessingVEC(request_id, data) {
  return http.request({
    url: `/monitor/request-monitor/change-status/${request_id}?status=${data.status}`,
    method: 'put',
  })
}

export function apiCloseRequestProcessingVEC(request_id) {
  return http.request({
    url: `/monitor/request-monitor/close/${request_id}`,
    method: 'put',
  })
}

export function apiUpdateSenderRequestProcessingVEC(request_id, data) {
  return http.request({
    url: `/monitor/request-monitor/send/${request_id}`,
    method: 'post',
    data,
  })
}

export function apiUpdateSenderRequestNewContentProcessingVEC(request_id, data) {
  return http.request({
    url: `/monitor/request-monitor/update-sender/${request_id}`,
    method: 'put',
    data,
  })
}
