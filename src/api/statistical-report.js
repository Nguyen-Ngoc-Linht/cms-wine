import http from '@/utils/request'

export function apiGetListReport(data) {
  return http.request({
    method: 'post',
    url: '/category/vecm-report/find-all',
    data,
  })
}
export function apiGetDetailReport(id) {
  return http.request({
    method: 'get',
    url: `/category/vecm-report/${id}`,
  })
}
export function apiImportReport(data) {
  return http.request({
    method: 'post',
    url: `/category/vecm-report`,
    data,
  })
}
export function apiEditReport(data, id) {
  return http.request({
    method: 'put',
    url: `/category/vecm-report/${id}`,
    data,
  })
}
export function apiRemoveReport(id) {
  return http.request({
    method: 'delete',
    url: `/category/vecm-report/${id}`,
  })
}

// Sai khác
export function apiGetReportDiscrepancy(data) {
  const list = [
    {
      date: '2024-12-03',
      station: {
        id: 'string',
        name: 'Hà Nội',
      },
      lane: 1,
      chargeType: 'ETC',
      type1: 100,
      type2: 200,
      type3: 300,
      type4: 400,
      type5: 500,
      otc: 50,
      free: 10,
      total: 1050,
    },
    {
      date: '2024-12-03',
      station: {
        id: 'string',
        name: 'Hà Nội',
      },
      lane: 2,
      chargeType: 'MTC',
      type1: 100,
      type2: 200,
      type3: 300,
      type4: 400,
      type5: 500,
      otc: 50,
      free: 10,
      total: 1050,
    },
    {
      date: '2024-12-04',
      station: {
        id: 'string',
        name: 'Hồ Chí Minh',
      },
      lane: 1,
      chargeType: 'ETC',
      type1: 170,
      type2: 270,
      type3: 370,
      type4: 470,
      type5: 570,
      otc: 65,
      free: 18,
      total: 1380,
    },
    {
      date: '2024-12-04',
      station: {
        id: 'string',
        name: 'Hồ Chí Minh',
      },
      lane: 2,
      chargeType: 'MTC',
      type1: 160,
      type2: 260,
      type3: 360,
      type4: 460,
      type5: 560,
      otc: 60,
      free: 16,
      total: 1316,
    },
    {
      date: '2024-12-04',
      station: {
        id: 'string',
        name: 'Cần Thơ',
      },
      lane: 1,
      chargeType: 'ETC',
      type1: 110,
      type2: 210,
      type3: 310,
      type4: 410,
      type5: 510,
      otc: 40,
      free: 5,
      total: 1095,
    },
    {
      date: '2024-12-03',
      station: {
        id: 'string',
        name: 'Hải Phòng',
      },
      lane: 1,
      chargeType: 'ETC',
      type1: 150,
      type2: 250,
      type3: 350,
      type4: 450,
      type5: 550,
      otc: 60,
      free: 15,
      total: 1230,
    },
    {
      date: '2024-12-03',
      station: {
        id: 'string',
        name: 'Hải Phòng',
      },
      lane: 2,
      chargeType: 'MTC',
      type1: 140,
      type2: 240,
      type3: 340,
      type4: 440,
      type5: 540,
      otc: 55,
      free: 12,
      total: 1170,
    },
    {
      date: '2024-12-04',
      station: {
        id: 'string',
        name: 'Đà Nẵng',
      },
      lane: 3,
      chargeType: 'ETC',
      type1: 120,
      type2: 220,
      type3: 320,
      type4: 420,
      type5: 520,
      otc: 45,
      free: 8,
      total: 1053,
    },
    {
      date: '2024-12-04',
      station: {
        id: 'string',
        name: 'Đà Nẵng',
      },
      lane: 4,
      chargeType: 'MTC',
      type1: 130,
      type2: 230,
      type3: 330,
      type4: 430,
      type5: 530,
      otc: 50,
      free: 10,
      total: 1160,
    },
    {
      date: '2024-12-04',
      station: {
        id: 'string',
        name: 'Cần Thơ',
      },
      lane: 2,
      chargeType: 'MTC',
      type1: 120,
      type2: 220,
      type3: 320,
      type4: 420,
      type5: 520,
      otc: 50,
      free: 8,
      total: 1180,
    },
    {
      date: '2024-12-04',
      station: {
        id: 'string',
        name: 'Nha Trang',
      },
      lane: 3,
      chargeType: 'ETC',
      type1: 140,
      type2: 240,
      type3: 340,
      type4: 440,
      type5: 540,
      otc: 55,
      free: 12,
      total: 1271,
    },
    {
      date: '2024-12-04',
      station: {
        id: 'string',
        name: 'Nha Trang',
      },
      lane: 4,
      chargeType: 'MTC',
      type1: 150,
      type2: 250,
      type3: 350,
      type4: 450,
      type5: 550,
      otc: 60,
      free: 15,
      total: 1375,
    },
  ]
  return http.request({
    method: 'post',
    url: `/supervision/discrepancy-report/traffic-and-revenue`,
    data,
  })
}
export function apiGetReportInKPI(data) {
  return http.request({
    url: `/supervision/discrepancy-report/in-kpi`,
    method: 'post',
    data,
  })
}
export function apiGetReportOutKPI(data) {
  return http.request({
    url: `/supervision/discrepancy-report/out-kpi`,
    method: 'post',
    data,
  })
}
// Báo cáo thống kê
export function apiGetReportKPIDetail(data) {
  return http.request({
    method: 'post',
    url: `/supervision/kpi-statistics-report`,
    data,
  })
}
// Lưu lượng doanh thu
export function apiSupervisionTrafficRevenueReport(data) {
  return http.request({
    method: 'post',
    url: `supervision/traffic-and-revenue-report`,
    data,
  })
}
// Quản lý lưu lượng doanh thu
export function apiSupervisionManageReport(data) {
  return http.request({
    method: 'post',
    url: `/supervision/traffic-and-revenue-management-report`,
    data,
  })
}
