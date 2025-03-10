import http from '@/utils/request'

export function apiGetUnitsType() {
  return http.request({
    method: 'get',
    url: '/category/units-type',
  })
}

export function apiCreateUnit(data) {
  return http.request({
    method: 'post',
    url: '/category/units',
    data,
  })
}

export function apiUpdateUnit(data, id) {
  return http.request({
    method: 'put',
    url: `/category/units/${id}`,
    data,
  })
}

export function apiDeleteUnit(id) {
  return http.request({
    method: 'delete',
    url: `/category/units/${id}`,
  })
}

export function apiGetUnits() {
  return http.request({
    method: 'get',
    url: `/category/units`,
  })
}

export function apiGetDetailUnit(id) {
  return http.request({
    method: 'get',
    url: `/category/units/${id}`,
  })
}

export function apiGetUnitDepartments() {
  return http.request({
    method: 'get',
    url: `/category/units-departments`,
  })
}

export function apiCreateDepartment(data) {
  return http.request({
    method: 'post',
    url: '/category/departments',
    data,
  })
}

export function apiUpdateDepartment(data, id) {
  return http.request({
    method: 'put',
    url: `/category/departments/${id}`,
    data,
  })
}

export function apiDeleteDepartment(id) {
  return http.request({
    method: 'delete',
    url: `/category/departments/${id}`,
  })
}

export function apiGetDepartments(idUnit) {
  return http.request({
    method: 'get',
    url: `/category/departments-unit/${idUnit}`,
  })
}

export function apiGetDetailDepartment(id) {
  return http.request({
    method: 'get',
    url: `/category/departments/${id}`,
  })
}
export function apiGetUserDepartment(data) {
  return http.request({
    method: 'post',
    url: `/user/department`,
    data,
  })
}
export function apiGetUserUnit(data) {
  return http.request({
    method: 'post',
    url: `/user/administrative`,
    data,
  })
}

export function apiGetUserListDepartment(data) {
  return http.request({
    url: `/user/list-department`,
    method: 'post',
    data,
  })
}
