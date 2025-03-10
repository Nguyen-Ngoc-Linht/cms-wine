import { defineStore } from 'pinia'
import {
  apiCreateExplanation,
  apiRemoveExplanation,
  apiUpdateExplanation,
  apiSendNotifyExplanation,
  apiGetListExplanation,
  apiGetDetailExplanation,
  apiGetListStatusExplanation,
  apiGetListTypeExplanation,
  apiCreateQuickExplanation,
  apiUpdateQuickExplanation,
  apiUpdateStatusExplanation,
  apiImportFileExplanation,
  apiDeleteFileExplanation,
  apiExportExplanation,
  apiExplanationQuickDetail,
  apiExplanationUpdateDetail,
} from '@/api/explanation-support'

const useExplanationSupportStore = defineStore({
  id: 'explanation-support',
  state: () => {
    return {}
  },
  getters: {},
  actions: {
    async apiGetListExplanation(obj) {
      try {
        const data = await apiGetListExplanation(obj)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiGetDetailExplanation(id) {
      try {
        const data = await apiGetDetailExplanation(id)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiCreateExplanation(obj) {
      try {
        const data = await apiCreateExplanation(obj)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiSendNotifyExplanation(obj) {
      try {
        const data = await apiSendNotifyExplanation(obj)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiUpdateExplanation(obj) {
      try {
        const data = await apiUpdateExplanation(obj)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiRemoveExplanation(id) {
      try {
        const data = await apiRemoveExplanation(id)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiGetListStatusExplanation() {
      try {
        const data = await apiGetListStatusExplanation()
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiGetListTypeExplanation() {
      try {
        const data = await apiGetListTypeExplanation()
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiCreateQuickExplanation(params) {
      try {
        const data = await apiCreateQuickExplanation(params)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiUpdateQuickExplanation(params) {
      try {
        const data = await apiUpdateQuickExplanation(params)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiImportFileExplanation(params) {
      try {
        const data = await apiImportFileExplanation(params)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiDeleteFileExplanation(params) {
      try {
        const data = await apiDeleteFileExplanation(params)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiUpdateStatusExplanation(params) {
      try {
        const data = await apiUpdateStatusExplanation(params)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiExportExplanation(params) {
      try {
        const data = await apiExportExplanation(params)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiExplanationQuickDetail(params) {
      try {
        const data = await apiExplanationQuickDetail(params)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
    async apiExplanationUpdateDetail(params) {
      try {
        const data = await apiExplanationUpdateDetail(params)
        if (data.status === 200) {
          return data
        }
      } catch (error) {
        return error
      }
    },
  },
})
export default useExplanationSupportStore
