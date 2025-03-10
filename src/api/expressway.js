import http from '@/utils/request'

export function getListRoute(data) {
  if (data) {
    return http.request({
      url: `/category/route/find-all`,
      method: 'post',
      data,
    })
  } else {
    return http.request({
      url: `/category/route/find-all`,
      method: 'get',
    })
  }
}

export function apiAddRoute(data) {
  return http.request({
    url: '/category/route',
    method: 'post',
    data,
  })
}

export function apiUpdateRoute(route_id, data) {
  return http.request({
    url: `/category/route/${route_id}`,
    method: 'put',
    data,
  })
}

export function apiDeleteRoute(route_id) {
  return http.request({
    url: `/category/route/${route_id}`,
    method: 'delete',
  })
}

export function apiGetRouteUser(data) {
  return http.request({
    url: `/category/route/all/${data.id}`,
    method: 'get',
  })
}
// Station
export function getListStation(data) {
  return http.request({
    url: '/category/station/find-all',
    method: 'post',
    data,
  })
}

export function getDetailStation(station_id) {
  return http.request({
    url: `/category/station/${station_id}`,
    method: 'get',
  })
}

export function deleteStation(station_id) {
  return http.request({
    url: `/category/station/${station_id}`,
    method: 'delete',
  })
}

export function apiAddStation(data) {
  return http.request({
    url: '/category/station',
    method: 'post',
    data,
  })
}

export function apiUpdateStation(station_id, data) {
  return http.request({
    url: `/category/station/${station_id}`,
    method: 'put',
    data,
  })
}

export function apiListCodeBE() {
  return http.request({
    url: '/category/station/get-code',
    method: 'get',
  })
}
export function apiGetLaneStation(data) {
  return http.request({
    url: '/category/station/get-lanes',
    method: 'post',
    data,
  })
}

export function apiListRouteStation() {
  return http.request({
    url: '/category/route/get-all',
    method: 'get',
  })
}
// Supplier
export function apiGetListSupplier(data) {
  return http.request({
    url: '/category/service-provider/find-all',
    method: 'post',
    data,
  })
}

export function apiGetSupplier(id_supplier) {
  return http.request({
    url: `/category/service-provider/${id_supplier}`,
    method: 'get',
  })
}

export function apiCreateSupplier(data) {
  return http.request({
    url: '/category/service-provider',
    method: 'post',
    data,
  })
}

export function apiUpdateSupplier(data, id_supplier) {
  return http.request({
    url: `/category/service-provider/${id_supplier}`,
    method: 'put',
    data,
  })
}

export function apiDeleteSupplier(id_supplier) {
  return http.request({
    url: `/category/service-provider/${id_supplier}`,
    method: 'delete',
  })
}

export function apiGetSupplierType(type) {
  return http.request({
    url: `/category/service-provider/find-by-type/${type}`,
    method: 'get',
  })
}

export function apiDeleteMember(id_member) {
  return http.request({
    url: `/category/service-provider/member/${id_member}`,
    method: 'delete',
  })
}
