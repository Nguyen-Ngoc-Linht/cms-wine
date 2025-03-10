import https from '@/utils/request'

// 1 - Mã tuyến
// 2 - Mã trạm
// 3 - Mã bảng cước
// 4 - Mã lực lượng chức năng
// 5 - Mã đơn vị
// 6 - Mã đơn phòng ban
// 7 - Mã nhà cung cấp
export function apiGenCategoryCode(id) {
  return https.request({
    url: `/category/code-generator/${id}`,
    method: 'get',
  })
}
