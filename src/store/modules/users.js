import {
  getInfo,
  getRoleMenuUser,
  getRoleUser,
  getUserUnit,
  login,
  logout,
  apiRetrieveOTP,
} from '@/api/user'
import { AVATAR, TOKEN, TOKEN2AF } from '@/config/constant'
import { resetRouter } from '@/router'
import cookies from '@/utils/cookies'
import { getToken } from '@/utils/auth'
import { defineStore } from 'pinia'
import { getConfig } from '@/config'

const useUserStore = defineStore({
  id: 'users',
  state: () => {
    return {
      token: '',
      uuid: null,
      user: null,
      userName: null,
      name: '',
      avatar: AVATAR,
      roles: [],
      isAdmin: 0,
      permissions: [],
      roleMenuButtonList: [],
      listStages: [],
      listUser: [],
      userUnit: {},
      positionUnitId: null,
      positionUnit: null,
      isVerify: false,
    }
  },
  actions: {
    SET_TOKEN(token = '') {
      token ? cookies.set(TOKEN, token) : cookies.remove(TOKEN)
      this.token = token
    },
    async GET_USER_INFO() {
      try {
        const { status, data } = await getInfo(this.token)
        if (status === 200) {
          const { fullName, avatar, roles, uuid, unit, userName, positionUnitId, positionUnit } =
            data
          this.uuid = uuid || '8080'
          this.name = fullName || ''
          this.userName = userName || ''
          this.avatar = avatar || AVATAR
          this.positionUnitId = positionUnitId || null
          this.positionUnit = positionUnit || null
          // this.listStages = unit.lisOfStage.split(',') || []
          return {
            ...data,
            id: this.id,
          }
        }
      } catch (error) {
        return error
      }
    },
    async GET_USER_UNIT() {
      try {
        const { status, data } = await getUserUnit()
        if (status === 200) {
          this.userUnit = data
        }
      } catch (error) {
        return error
      }
    },
    async GET_USER_ROLE() {
      try {
        const { status, data } = await getRoleUser(this.uuid)
        if (status === 200) {
          this.isAdmin = 1
          this.roles = data.reduce((arr, item) => {
            arr.push(item.roleCode)
            return arr
          }, [])

          return {
            roles: this.roles,
            isAdmin: 1,
          }
        }
      } catch (error) {
        return error
      }
    },
    async GET_USER_ROLE_MENU() {
      try {
        const { status, data } = await getRoleMenuUser()

        if (status === 200) {
          this.roleMenuButtonList = data.map(val => {
            return {
              ...val,
              url: val.menuId.url,
            }
          })

          const permissions = data.map(val => val.menuId.url)

          return {
            permissions,
          }
        }
      } catch (error) {
        return error
      }
    },
    async LOGIN_OUT() {
      this.token = ''
      this.uuid = null
      this.user = null
      this.name = ''
      this.avatar = ''
      this.roles = []
      this.isAdmin = 0
      this.permissions = []
      this.roleMenuButtonList = []
      this.listStages = []
      this.listUser = []
      this.isVerify = 0
      await this.RESET_INFO()
      try {
        await logout(this.token, { username: this.userName })
      } catch (error) {
        console.log('  ~ LOGIN_OUT ~ error:', error)
      }
      setTimeout(() => {
        window.location.href =
          getConfig('VITE_APP_KEY_CLOAK_BASE') +
          '?token_hint=' +
          getToken() +
          '&post_logout_redirect_uri=' +
          encodeURIComponent(window.location.href)
      }, 100)
    },
    async LOGIN() {
      try {
        await login()
      } catch (error) {
        console.log('  ~ LOGIN ~ error:', error)
      }
    },
    SET_VERIFY() {
      cookies.set(TOKEN2AF, 1)
      this.isVerify = 1
    },
    CLEAR_VERIFY() {
      cookies.remove('redirect')
      cookies.remove(TOKEN2AF)
    },
    async SEND_OTP() {
      try {
        await apiRetrieveOTP()
      } catch (e) {}
    },
    RESET_INFO() {
      return new Promise(resolve => {
        cookies.clearAll()
        resetRouter()
        resolve()
      })
    },
  },
})
export default useUserStore
