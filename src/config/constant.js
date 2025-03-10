import AVATAR_IMG from '@/assets/imgs/avatar.png'

export const WX_APPID = 'appid'
export const COOKIE_PREFIX = 'wine_'
export const TOKEN = `${COOKIE_PREFIX}token`
export const AVATAR = AVATAR_IMG
export const TOKEN2AF = 'vrf'

export const GLOBAL_DATA = {
  env: 'fat',
  // dev : {
  //   baseUrl : '/api'
  // },
  fat: {
    baseUrl: '/api',
  },
  uat: {
    baseUrl: '/api',
  },
  pro: {
    baseUrl: '/api',
  },
}

export const WHITE_CODE_LIST = [
  {
    code: 0,
    msg: '',
  },
  {
    code: 200,
    msg: '',
  },
  {
    code: 201,
    msg: '',
  },
  {
    code: 5006,
    msg: 'The verification code is wrong or expired',
  },
]

export const LOGIN_ERROR_CODE = [
  {
    code: 5004,
    msg: 'Invalid token',
  },
]
