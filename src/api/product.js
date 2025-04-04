import http from '@/utils/request'
import {ref} from 'vue'
import {getConfig} from '@/config'
import {getToken} from '@/utils/auth'
import axios from 'axios'

export function apiGetProduct(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/products/find-all',
    data,
  })
}

export function apiGetDetailProduct(id_product) {
  return http.request({
    method: 'get',
    url: `/wine-service/api/v1.0/managements/products/${id_product}`,
  })
}

export function apiCreateProduct(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/products',
    data,
  })
}

export function apiUpdateProduct(id_product, data) {
  return http.request({
    method: 'put',
    url: `/wine-service/api/v1.0/managements/products/${id_product}`,
    data,
  })
}

export function apiDeleteProduct(product_id) {
  return http.request({
    method: 'delete',
    url: `/wine-service/api/v1.0/managements/products/${product_id}`,
  })
}

export function apiGetCategory(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/categories/find-all',
    data,
  })
}

export function apiCreateCategory(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/categories',
    data,
  })
}

export function apiUpdateCategory(category_id, data) {
  return http.request({
    method: 'put',
    url: `/wine-service/api/v1.0/managements/categories/${category_id}`,
    data,
  })
}

export function apiDeleteCategory(category_id) {
  return http.request({
    method: 'delete',
    url: `/wine-service/api/v1.0/managements/categories/${category_id}`,
  })
}

export function apiGetAttribute(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/attributes/find-all',
    data,
  })
}

export function apiCreateAttribute(data) {
  return http.request({
    method: 'post',
    url: '/wine-service/api/v1.0/managements/attributes',
    data,
  })
}

export function apiUpdateAttribute(attributes_id, data) {
  return http.request({
    method: 'put',
    url: `/wine-service/api/v1.0/managements/attributes/${attributes_id}`,
    data,
  })
}

export function apiDeleteAttribute(attributes_id) {
  return http.request({
    method: 'delete',
    url: `/wine-service/api/v1.0/managements/attributes/${attributes_id}`,
  })
}

const baseUrl = ref(getConfig('VITE_PROXY_DOMAIN'))
export async function uploadFile(params) {
  const token = getToken()
  const rs = await axios.post(`${baseUrl.value}media-service/api/v1.0/uploads`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
  if (rs.status === 200) {
    return rs.data
  } else {
    return {
      code: 400,
    }
  }
}
