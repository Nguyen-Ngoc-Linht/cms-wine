import { getListCategory } from '@/api/search'
import { defineStore } from 'pinia'

const useViolationStore = defineStore({
  id: 'search',
  state: () => {
    return {
      listVehicle: [],
      listAxle: [],
      listTypeViolation: [],
      listLevelViolation: [],
      listAuditStatus: [],
    }
  },
  getters: {
    getVehicleType(state) {
      return codeVehicleType => {
        const item = this.listVehicle.find(o => o.code === codeVehicleType)
        return item ? item.name : ''
      }
    },
  },
  actions: {
    async SET_LIST_CATEGORY() {
      try {
        const { status, data } = await getListCategory({
          catType: 'VEHICAL_TYPE_WEIGH_STATION',
          page: 0,
          size: 200,
        })

        if (status === 200) {
          this.listVehicle = data || []
          return data
        }
      } catch (error) {
        return error
      }
    },
    async SET_LIST_AXLE() {
      try {
        const { status, data } = await getListCategory({
          catType: 'AXLE_NUMBER',
          page: 0,
          size: 200,
        })

        if (status === 200) {
          const list = data.sort((a, b) => {
            return a.code.localeCompare(b.code)
          })
          this.listAxle = list || []
          return data
        }
      } catch (error) {
        return error
      }
    },
    async SET_LIST_TYPE_VIOLATION() {
      try {
        const { status, data } = await getListCategory({
          catType: 'TYPE_OF_VIOLATION_WEIGH_STATION',
          page: 0,
          size: 200,
        })

        if (status === 200) {
          const codeOrderMap = {
            overloadtt46: 1,
            overload_axles: 2,
            overload_dk: 3,
            overload_to_towel_dk: 4,
          }
          const list = data.sort((a, b) => {
            const orderA = codeOrderMap[a.code]
            const orderB = codeOrderMap[b.code]

            return orderA - orderB
          })

          this.listTypeViolation = list || []
          return data
        }
      } catch (error) {
        return error
      }
    },
    async SET_LIST_LEVEL_VIOLATION() {
      try {
        const { status, data } = await getListCategory({
          catType: 'LEVEL_OF_VIOLATION_WEIGH_STATION',
          page: 0,
          size: 200,
        })

        if (status === 200) {
          this.listLevelViolation = data || []
          return data
        }
      } catch (error) {
        return error
      }
    },
    async SET_LIST_AUDIT_STATUS() {
      try {
        const { status, data } = await getListCategory({
          catType: 'AUDIT_STATUS_WEIGH_STATION',
          page: 0,
          size: 200,
        })

        if (status === 200) {
          this.listAuditStatus = data || []
          return data
        }
      } catch (error) {
        return error
      }
    },
  },
})
export default useViolationStore
