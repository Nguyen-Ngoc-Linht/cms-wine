import http from '@/utils/request'

export function apiGetAllPost(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/posts/find-all',
    data,
  })
}

export function apiGetById(postId) {
  return http.request({
    method: 'get',
    url: `/wine-service/api/v1.0/posts/${postId}`,
  })
}

export function apiCreatePost(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/posts',
    data,
  })
}

export function apiUpdatePost(data, postId) {
  return http.request({
    method: 'put',
    url: `/wine-service/api/v1.0/managements/posts/${postId}`,
    data,
  })
}

export function apiDeleteById(postId) {
  return http.request({
    method: 'delete',
    url: `/wine-service/api/v1.0/managements/posts/${postId}`,
  })
}
