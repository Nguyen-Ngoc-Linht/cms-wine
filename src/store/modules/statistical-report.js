import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import {
  apiGetListReport,
  apiGetDetailReport,
  apiImportReport,
  apiEditReport,
  apiRemoveReport,
} from '@/api/statistical-report'
import { getListRoute, getListStation } from '@/api/expressway'

const useStatisticalReportStore = defineStore({
  id: 'statistical-report',
  state: () => {
    return {}
  },
  getters: {},
  actions: {
    async getListRoute() {
      try {
        const res = await getListRoute()
        if (res.status === 200) {
          return res
        }
      } catch (error) {
        return error
      }
    },
    async getListStationReport(obj) {
      try {
        const res = await getListStation(obj)
        if (res.status === 200) {
          return res
        }
      } catch (error) {
        return error
      }
    },
    async apiGetListReport(obj) {
      try {
        const data = await apiGetListReport(obj)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiGetDetailReport(id) {
      try {
        const res = await apiGetDetailReport(id)
        if (res.status === 200) {
          return res
        }
      } catch (error) {
        return error
      }
    },
    async apiImportReport(obj) {
      try {
        const data = await apiImportReport(obj)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiEditReport(obj, id) {
      try {
        const data = await apiEditReport(obj, id)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiRemoveReport(id) {
      try {
        const data = await apiRemoveReport(id)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
  },
})
export default useStatisticalReportStore
