import http from '@/utils/request'

export function getWeightStationInAsset(data) {
  return http.request({
    method: 'get',
    url: '/oms/weight-station-in-asset',
    data,
  })
}
export function getInfrastructure(data) {
  return http.request({
    method: 'get',
    url: '/asset/infrastructure',
    data,
  })
}
export function getListOMS(data) {
  return http.request({
    method: 'get',
    url: '/oms/weight-station-search',
    data,
  })
}
export function getOMSById(id) {
  return http.request({
    method: 'get',
    url: `/oms/get-by-id/${id}`,
  })
}
export function getVideoConfig(id) {
  return http.request({
    method: 'get',
    url: `/oms/video-config/${id}`,
  })
}
export function getLane(id) {
  return http.request({
    method: 'get',
    url: `/oms/list-lane/${id}`,
  })
}
export function getCamVms(id) {
  return http.request({
    method: 'get',
    url: `/oms/get-camera-vms/${id}`,
  })
}
export function getRabitConfig(id) {
  return http.request({
    method: 'get',
    url: `/oms/rabbit-config/${id}`,
  })
}
export function updateRabitConfig(id, data) {
  return http.request({
    method: 'put',
    url: `/oms/rabbit-config/${id}`,
    data,
  })
}
export function checkConnectRabitMQ(data) {
  return http.request({
    method: 'post',
    url: '/oms/check-rabbit-config',
    data,
  })
}
export function checkVideoConfig(data) {
  return http.request({
    method: 'post',
    url: '/oms/check-video-config',
    data,
  })
}
export function getVehicleRegister(id) {
  return http.request({
    method: 'get',
    url: `/oms/vehreg-config/${id}`,
  })
}
export function updateVehicleRegister(id, data) {
  return http.request({
    method: 'put',
    url: `/oms/vehreg-config/${id}`,
    data,
  })
}
export function checkConnectVehicleRegister(data) {
  return http.request({
    method: 'post',
    url: '/oms/check-vehreg-config',
    data,
  })
}
export function omsSyncFromAsset(data) {
  return http.request({
    method: 'post',
    url: '/oms/sync-from-asset',
    data,
  })
}
export function deleteOMS(data) {
  return http.request({
    method: 'delete',
    url: '/oms/multi-delete',
    data,
  })
}
export function updateOMS(id, data) {
  return http.request({
    method: 'put',
    url: `/oms/update-oms/${id}`,
    data,
  })
}
export function updateVideoConfig(id, data) {
  return http.request({
    method: 'put',
    url: `/oms/video-config/${id}`,
    data,
  })
}
export function updateCameraConfig(id, data) {
  return http.request({
    method: 'put',
    url: `/oms/camera-config/${id}`,
    data,
  })
}
