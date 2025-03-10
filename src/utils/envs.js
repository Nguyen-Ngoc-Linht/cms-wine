import { GLOBAL_DATA } from '@/config/constant'

const env = import.meta.env
const { VITE_MODE } = env

export function getEnvs() {
  const origin = window.location.origin
  let envStr = ''
  if (VITE_MODE === 'development') {
    envStr = 'dev'
  } else {
    // if (origin.indexOf('fat') >= 0) {
    //   envStr = 'fat'
    // } else if (origin.indexOf('uat') >= 0) {
    //   envStr = 'uat'
    // } else {
    envStr = 'pro'
    // }
  }
  return {
    envStr,
  }
}

export function initUrl() {
  const { envStr } = getEnvs()
  const baseUrlStr = envStr === 'dev' ? env.VITE_APP_API_BASE_URL : GLOBAL_DATA[envStr].baseUrl
  return {
    baseUrlStr,
  }
}
