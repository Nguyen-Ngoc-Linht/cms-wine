import http from '@/utils/request'

export function apiGetListEvent(data) {
  return http.request({
    url: '/monitor/event/find-all',
    method: 'post',
    data,
  })
}

export function apiGetDetailEvent(event_id) {
  return http.request({
    url: `/monitor/event/${event_id}`,
    method: 'get',
  })
}

export function apiCreateEvent(data) {
  return http.request({
    url: '/monitor/event',
    method: 'post',
    data,
  })
}

export function apiUpdateEvent(event_id, data) {
  return http.request({
    url: `/monitor/event/${event_id}`,
    method: 'put',
    data,
  })
}

export function apiDeleteEvent(event_id) {
  return http.request({
    url: `/monitor/event/${event_id}`,
    method: 'delete',
  })
}

export function apiSendEvent(event_id, data) {
  return http.request({
    url: `/monitor/event/recipients/${event_id}`,
    method: 'put',
    data,
  })
}

export function apiUpdateProcessResult(event_id, data) {
  return http.request({
    url: `/monitor/event/process-result/${event_id}`,
    method: 'put',
    data,
  })
}

export function apiCloseEvent(event_id) {
  return http.request({
    url: `/monitor/event/close-event/${event_id}`,
    method: 'put',
  })
}
