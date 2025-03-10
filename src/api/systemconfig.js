import http from '@/utils/request'

export function fetchListCamera(data) {
  return http.request({
    method: 'get',
    url: '/systemconfig/camera',
    data,
  })
}

export function fetchCategoryList(data) {
  return http.request({
    method: 'get',
    url: '/systemconfig/category',
    data,
  })
}

export function apiBackupConfig(data) {
  return http.request({
    method: 'post',
    url: '/sysd/database-backup/backup-interval',
    data,
  })
}
export function apiBackupHistory(data) {
  return http.request({
    method: 'post',
    url: '/sysd/database-backup',
    data,
  })
}

export function apiLogConfig(data) {
  return http.request({
    method: 'post',
    url: '/sysd/log-file',
    data,
  })
}
export function apiSessionConfig(data) {
  return http.request({
    method: 'post',
    url: '/sysd/session/idle-timeout',
    data,
  })
}
export function apiIpConfig(data) {
  return http.request({
    method: 'post',
    url: '/sysd/permitted-ip-address',
    data,
  })
}

export function apiGetListService(data) {
  return http.request({
    method: 'post',
    url: '/sysd/service',
    data,
  })
}

export function apiUserAction(data) {
  return http.request({
    method: 'post',
    url: '/sysd/user-action',
    data,
  })
}

export function apiUserActionLog(data) {
  return http.request({
    method: 'post',
    url: '/sysd/user-action/log',
    data,
  })
}

export function apiGetConfigCaptcha() {
  return http.request({
    method: 'get',
    url: '/category/captcha-config',
  })
}

export function apiUpdateConfigCaptcha(data) {
  return http.request({
    method: 'put',
    url: '/category/captcha-update',
    data,
  })
}
