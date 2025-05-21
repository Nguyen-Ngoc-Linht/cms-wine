import { defineStore } from 'pinia'
import {apiGetNotifyByUser, apiUpdateNotifyByUser, countNotifyByUser} from '@/api/notify'

const useNotifyStore = defineStore({
  id: 'notify',
  state: () => {
    return {
      numberNotify: 0,
      isReceiveNotify: false,
    }
  },
  getters: {},
  actions: {
    SET_NUMBER_NOTIFY(number) {
      this.numberNotify = number
    },
    SET_IS_RECEIVE_NOTIFY(data) {
      this.isReceiveNotify = data
    },
    async apiGetNotifyByUser(id, params) {
      try {
        const res = await apiGetNotifyByUser(id, params)
        if (res.code === 200) {
          return res
        }
      } catch (error) {
        return error
      }
    },
    async apiUpdateNotifyByUser(id, params) {
      try {
        const res = await apiUpdateNotifyByUser(id, params)
        if (res.code === 200) {
          return res
        }
      } catch (error) {
        return error
      }
    },
    async apiCountNotifyByUser(id) {
      try {
        const res = await countNotifyByUser(id)
        if (res.code === 200) {
          return res
        }
      } catch (error) {
        return error
      }
    },
  },
})
export default useNotifyStore
