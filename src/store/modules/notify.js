import { defineStore } from 'pinia'
import { apiGetNotifyByUser, apiUpdateNotifyByUser } from '@/api/notify'

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
    async apiGetNotifyByUser(params, id) {
      try {
        const res = await apiGetNotifyByUser(params, id)
        if (res.status === 200) {
          return res
        }
      } catch (error) {
        return error
      }
    },
    async apiUpdateNotifyByUser(id) {
      try {
        const res = await apiUpdateNotifyByUser(id)
        if (res.status === 200) {
          return res
        }
      } catch (error) {
        return error
      }
    },
  },
})
export default useNotifyStore
