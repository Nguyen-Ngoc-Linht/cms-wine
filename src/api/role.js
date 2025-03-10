import http from '@/utils/request'

export function getRoleByUser(data) {
  return http.request({
    url: '/abac/role-by-user',
    method: 'get',
    data,
  })
}

export function getRoleList(data) {
  return http.request({
    url: '/abac/role/search',
    method: 'get',
    data,
  })
}

export function apiGetAbacResource() {
  return http.request({
    url: '/abac/resource/all',
    method: 'get',
  })
}

export function apiCheckRoleRelation(data) {
  return http.request({
    url: '/abac/resource/relation',
    method: 'get',
    data,
  })
}

export function apiAddRole(data) {
  return http.request({
    url: '/abac/role',
    method: 'post',
    data,
  })
}

export function apiUpdateRole(data) {
  return http.request({
    url: '/abac/role',
    method: 'put',
    data,
  })
}

export function apiDestroyRole(id) {
  return http.request({
    url: '/abac/role/' + id,
    method: 'delete',
  })
}

export function apiGetRoleDetail(id) {
  return http.request({
    url: '/abac/role/' + id,
    method: 'get',
  })
}
