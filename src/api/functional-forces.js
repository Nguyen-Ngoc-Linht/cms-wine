import http from '@/utils/request'

export function getListForces(data) {
  return http.request({
    url: '/category/functional-forces/find-all',
    method: 'post',
    data,
  })
}

export function addFunctionalForces(data) {
  return http.request({
    url: '/category/functional-forces',
    method: 'post',
    data,
  })
}

export function updateForces(forces_id, data) {
  return http.request({
    url: `/category/functional-forces/${forces_id}`,
    method: 'put',
    data,
  })
}

export function deleteForces(forces_id) {
  return http.request({
    url: `/category/functional-forces/${forces_id}`,
    method: 'delete',
  })
}
