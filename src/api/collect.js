import https from '@/utils/request'

export function apiGetCollect(data) {
  return https.request({
    url: `/collect/logfile`,
    method: 'get',
    data,
  })
}

export function apiDeleteCollect(data) {
  return https.request({
    url: `/collect/logfile`,
    method: 'post',
    data,
  })
}

export function apiGetConfigFE(data) {
  return https.request({
    url: '/collect/config',
    method: 'get',
    data,
  })
}

export function apiUpdateConfigFE(data) {
  return https.request({
    url: '/collect/config/update-all',
    method: 'put',
    data,
  })
}

export function apiSchedulerCollect(data) {
  return https.request({
    url: `/collect/scheduler`,
    method: 'get',
    data,
  })
}
export function apiUploadCollect(data) {
  return https.request({
    url: `/collect/logfile/upload`,
    method: 'post',
    data,
  })
}

export function apiUpdateSchedulerCollect(data) {
  return https.request({
    url: `/collect/scheduler/update-all`,
    method: 'put',
    data,
  })
}
export function apiGetListCollectWarning(data) {
  return https.request({
    url: `/collect/logfilewarning`,
    method: 'get',
    data,
  })
}
export function apiUpdateCollect(data, id) {
  return https.request({
    url: `/collect/logfile/` + id,
    method: 'post',
    data,
  })
}

export function apiGetConfigStandard(data) {
  return https.request({
    url: `/category/standardized-configuration/find`,
    method: 'post',
    data,
  })
}

export function apiUpdateConfigStandard(id, data) {
  return https.request({
    url: `/category/standardized-configuration/${id}`,
    method: 'put',
    data,
  })
}
export function apiGetDataCollectWarning(data) {
  return https.request({
    url: `/collect/propertysystem`,
    method: 'get',
    data,
  })
}
export function apiGetIntermittentCollect() {
  return https.request({
    url: `/alert/intermittent-collection-warning`,
    method: 'get',
  })
}
export function apiGetCollectionAlertsRoute(data) {
  return https.request({
    url: `/collect/collectionalerts/route`,
    method: 'get',
    data
  })
}
export function apiGetAllCollectionAlerts() {
  return https.request({
    url: `/collect/collectionalerts`,
    method: 'get'
  })
}
