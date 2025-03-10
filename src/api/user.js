import http from '@/utils/request'
import httpBff from '@/utils/requestBff'

export function getInfo(token = '') {
  return http.request({
    url: '/user',
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
}

export function getRoleUser(id) {
  return http.request({
    url: '/abac/role',
    method: 'get',
  })
}

export function getRoleMenuUser() {
  return http.request({
    url: '/menu-management/menu/role-menu',
    method: 'get',
  })
}

export function logout(token, data) {
  return http.request({
    url: '/user/logout',
    method: 'post',
    data,
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
}

export function login() {
  return http.request({
    url: 'user/login/log',
    method: 'get',
  })
}

export function apiAddUser(data) {
  return httpBff.request({
    url: '/system/user',
    method: 'post',
    data,
  })
}

export function apiEditUser(id, data) {
  return httpBff.request({
    url: '/system/user/' + id,
    method: 'put',
    data,
  })
}

export function apiDeleteUser(id) {
  return httpBff.request({
    url: '/system/user/' + id,
    method: 'delete',
  })
}

export function getUserList(data) {
  return httpBff.request({
    url: '/system/user',
    method: 'get',
    data,
  })
}

export function getUserDetail(id) {
  return httpBff.request({
    url: '/system/user/' + id,
    method: 'get',
  })
}

export function getUserUnit() {
  return http.request({
    url: '/user/police-unit/unit-of-user',
    method: 'get',
  })
}

export function getPasswordTimePolicy() {
  return http.request({
    url: '/user/realm-config-password',
    method: 'get',
  })
}

export function setPasswordTimePolicy(data) {
  return http.request({
    url: '/user/realm-config-password',
    method: 'post',
    data,
  })
}

export function getPasswordRulePolicy() {
  return http.request({
    url: '/user/realm-config',
    method: 'get',
  })
}

export function setPasswordRulePolicy(data) {
  return http.request({
    url: '/user/realm-config',
    method: 'post',
    data,
  })
}

export function getPasswordAttrPolicy() {
  return http.request({
    url: '/user/realm-attribute',
    method: 'get',
  })
}

export function setPasswordAttrPolicy(data) {
  return http.request({
    url: '/user/realm-attribute',
    method: 'post',
    data,
  })
}

export function getListPosition() {
  return http.request({
    url: '/user/position',
    method: 'get',
  })
}

export function blockUser(data) {
  return http.request({
    url: '/user/block',
    method: 'post',
    data,
  })
}

export function updatePass(data) {
  return http.request({
    url: '/user/password',
    method: 'put',
    data,
  })
}
export function checkAccountChangePass(data) {
  return http.request({
    url: '/user/check-password-reminder',
    method: 'post',
    data,
  })
}

export function apiVerifyOTP(data) {
  return http.request({
    url: '/user/verify-2fa',
    method: 'post',
    data,
  })
}

export function apiRetrieveOTP() {
  return http.request({
    url: '/user/verify-mail',
    method: 'post',
  })
}
