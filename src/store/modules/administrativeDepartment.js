import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import {
  apiGetUnits,
  apiCreateUnit,
  apiUpdateUnit,
  apiDeleteUnit,
  apiGetUnitDepartments,
  apiGetDetailUnit,
  apiGetDepartments,
  apiGetDetailDepartment,
  apiUpdateDepartment,
  apiDeleteDepartment,
  apiCreateDepartment,
  apiGetUnitsType,
  apiGetUserDepartment,
  apiGetUserUnit,
} from '@/api/administrativeDepartment'

const useAdministrativeDepartmentStore = defineStore({
  id: 'administrativeDepartmentStore',
  state: () => {
    return {}
  },
  getters: {},
  actions: {
    async apiGetUnitsType() {
      try {
        const { status, data } = await apiGetUnitsType()
        if (status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiGetUnits() {
      try {
        const { status, data } = await apiGetUnits()
        if (status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiGetDetailUnit(id) {
      try {
        const { status, data } = await apiGetDetailUnit(id)
        if (status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiCreateUnit(obj) {
      try {
        const data = await apiCreateUnit(obj)
        if (data.status === 201) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiUpdateUnit(obj, id) {
      try {
        const res = await apiUpdateUnit(obj, id)
        if (res.status === 200) {
          return res
        }
      } catch (error) {
        return error
      }
    },
    async apiDeleteUnit(id) {
      try {
        const res = await apiDeleteUnit(id)
        if (res.status === 200) {
          return res
        }
      } catch (error) {
        return error
      }
    },
    async apiGetDepartments(idUnit) {
      try {
        const { status, data } = await apiGetDepartments(idUnit)
        if (status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiGetDetailDepartment(id) {
      try {
        const { status, data } = await apiGetDetailDepartment(id)
        if (status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiGetUnitDepartments() {
      try {
        const { status, data } = await apiGetUnitDepartments()
        if (status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiCreateDepartment(obj) {
      try {
        const res = await apiCreateDepartment(obj)
        if (res.status === 201) {
          return res
        } else {
        }
      } catch (error) {
        return error
      }
    },
    async apiUpdateDepartment(obj, id) {
      try {
        const res = await apiUpdateDepartment(obj, id)
        if (res.status === 200) {
          ElMessage({
            message: 'Sửa phòng ban thành công',
            type: 'success',
          })
          return res.data
        } else {
          ElMessage({
            message: res.message,
            type: 'error',
          })
        }
      } catch (error) {
        return error
      }
    },
    async apiDeleteDepartment(id) {
      try {
        const res = await apiDeleteDepartment(id)
        if (res.status === 200) {
          return res
        }
      } catch (error) {
        return error
      }
    },
    async apiGetUserDepartment(id) {
      try {
        const res = await apiGetUserDepartment(id)
        if (res.status === 200) {
          return res.data
        }
      } catch (error) {
        return error
      }
    },
    async apiGetUserUnit(params) {
      try {
        const res = await apiGetUserUnit(params)
        if (res.status === 200) {
          return res
        }
      } catch (error) {
        return error
      }
    },
  },
})
export default useAdministrativeDepartmentStore
