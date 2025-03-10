import http from '@/utils/request'
import axios from 'axios'
import { ref } from 'vue'
import { getToken } from '@/utils/auth'
import { getConfig } from '@/config'

export function getListRating(params) {
  return http.request({
    url: `/monitor/scoring-info/find-all`,
    method: 'post',
    data: params,
  })
}

export function apiAddRating(params) {
  return http.request({
    url: `/monitor/scoring-info`,
    method: 'post',
    data: params,
  })
}

export function apiUpdateRating(rating_id, params) {
  return http.request({
    url: `/monitor/scoring-info/${rating_id}`,
    method: 'put',
    data: params,
  })
}

export function apiGetDetailRating(rating_id) {
  return http.request({
    url: `/monitor/scoring-info/${rating_id}`,
    method: 'get',
  })
}

export function apiGetTitleRating(params) {
  return http.request({
    url: `/monitor/scoring-kpi/find-by-type`,
    method: 'post',
    data: params,
  })
}

export function apiGetListWeek() {
  return http.request({
    url: '/monitor/scoring-week',
    method: 'get',
  })
}

const baseUrl = ref(getConfig('VITE_APP_UPLOAD_URL'))
export function uploadFile(params) {
  const token = getToken()
  return axios.post(`${baseUrl.value}/upload`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
}

// Scoring - log
export function getListScoringLog(params) {
  return http.request({
    url: `/monitor/scoring-log/find-all`,
    method: 'post',
    data: params,
  })
}

export function apiCreateScoringLog(params) {
  return http.request({
    url: `/monitor/scoring-log`,
    method: 'post',
    data: params,
  })
}

export function apiUpdateScoringLog(scoringLog_id, params) {
  return http.request({
    url: `/monitor/scoring-log/${scoringLog_id}`,
    method: 'put',
    data: params,
  })
}

export function apiDeleteScoringLog(data) {
  return http.request({
    url: `/monitor/scoring-log/${data.id}`,
    method: 'delete',
  })
}

export function apiExportFileExcelScoringLog(params) {
  return http.request({
    url: `/monitor/scoring-log/export-excel`,
    method: 'get',
    data: params,
  })
}

export function apiExportFilePdfScoringLog(params) {
  return http.request({
    url: `/monitor/scoring-log/export-pdf`,
    method: 'get',
    data: params,
  })
}

export function apiGetListScoringWork() {
  return http.request({
    url: `/monitor/scoring-work`,
    method: 'get',
  })
}
