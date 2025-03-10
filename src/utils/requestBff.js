/**
 * @Description: axios package
 * @Author: elc-team
 * @Email: elc@elcom.com.vn
 * @Date: 2023-10-24
 */
'use strict'
import { useUserStore } from '@/store'
import cookies from '@/utils/cookies'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getLanguage } from '@/locale/index'
import { LOGIN_ERROR_CODE, TOKEN, WHITE_CODE_LIST } from '@/config/constant'
import { getConfig } from '@/config'

// import qs from 'qs'
class HttpRequest {
  // #baseUrl
  constructor() {
    this.baseUrl = null
    this.withCredentials = false
    this.timeout = 60 * 60 * 24 * 1000
  }

  async getBaseUrl() {
    // const { envStr } = getEnvs()
    const baseUrlStr = getConfig('VITE_PROXY_DOMAIN_BFF')
    return baseUrlStr
  }

  getRequestConfig() {
    const config = {
      baseURL: getConfig('VITE_PROXY_DOMAIN_BFF'),
      timeout: this.timeout,
      withCredentials: this.withCredentials,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept-Language': getLanguage(),
      },
    }
    return config
  }

  getParams(payload) {
    const { method, data } = payload
    if (['post', 'put', 'patch', 'delete'].indexOf(method) >= 0) {
      payload.data = data
    } else {
      payload.params = data
      delete payload.data
    }
    return payload
  }

  checkStatus(status) {
    let errMessage = ''
    switch (status) {
      case 400:
        errMessage = 'Bad request'
        break
      case 401:
        errMessage = 'Unauthorized, please log in again'
        break
      case 403:
        errMessage = 'access denied'
        break
      case 404:
        errMessage = 'Request error, the resource was not found'
        break
      case 405:
        errMessage = 'Request method not allowed'
        break
      case 408:
        errMessage = 'Request timed out'
        break
      case 500:
        errMessage = 'Server side error'
        break
      case 501:
        errMessage = 'Network is not implemented'
        break
      case 502:
        errMessage = 'Network Error'
        break
      case 503:
        errMessage = 'service is not available'
        break
      case 504:
        errMessage = 'network timeout'
        break
      case 505:
        errMessage = 'The http version does not support this request'
        break
      default:
        errMessage = 'connection error'
    }
    return errMessage
  }

  // interception and handling
  setInterceptors(instance) {
    const that = this

    // request interception
    instance.interceptors.request.use(
      config => {
        if (!navigator.onLine) {
          ElMessage({
            message: 'Có lỗi xảy ra.',
            type: 'error',
            duration: 3 * 1000,
          })
          return Promise.reject(new Error('Có lỗi xảy ra.'))
        }
        const token = cookies.get(TOKEN)
        if (token) {
          config.headers.Authorization = 'Bearer ' + token
        }
        // config.data = qs.stringify( config.data )

        return config
      },
      error => {
        return Promise.reject(new Error(error))
      }
    )

    // response interception
    instance.interceptors.response.use(
      res => {
        const result = res.data
        const type = Object.prototype.toString.call(result)

        // const $config = res.config

        if (type === '[object Blob]' || type === '[object ArrayBuffer]') {
          return result
        } else {
          const { status, message } = result
          const isErrorToken = LOGIN_ERROR_CODE.find(item => item.code == status)
          const isWhiteCode = WHITE_CODE_LIST.find(item => item.code == status)

          const userStore = useUserStore()

          if (isErrorToken) {
            userStore.LOGIN_OUT()
            window.location.reload()
          } else if (!isWhiteCode) {
            ElMessage({
              message: message || 'Error',
              type: 'error',
              duration: 3 * 1000,
            })
            return Promise.reject(new Error(message || 'Error'))
          } else {
            return result
          }
        }

        return result
      },
      error => {
        if (error && error.response) {
          error.message = that.checkStatus(error.response.status)
        }
        const isTimeout = error.message.includes('timeout')
        ElMessage({
          message: isTimeout
            ? 'Network request timeout'
            : error.message || 'Failed to connect to server',
          type: 'error',
          duration: 2 * 1000,
        })
        return Promise.reject(new Error(error.message))
      }
    )
  }

  request(options) {
    const instance = axios.create()
    const baseOpt = this.getRequestConfig()
    const params = Object.assign({}, baseOpt, this.getParams(options))
    this.setInterceptors(instance)
    return instance(params)
  }
}

const http = new HttpRequest()
export default http
