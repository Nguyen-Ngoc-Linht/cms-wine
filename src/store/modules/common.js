import { defineStore } from 'pinia'

const useCommonStore = defineStore({
  id: 'common',
  state: () => {
    return {
      lastObserver: null,
      lastObserverTunnel: null,
      connectId: null,
      connectIdTunnel: null,
      loginMilestone: false,
      loginMilestoneTunnel: false,
      checkConnectMilestone: false,
      checkConnectMilestoneTunnel: false,
      userDetail: null,
    }
  },
  actions: {
    SET_LAST_OBSERVER(lastObserver) {
      this.lastObserver = lastObserver
    },
    SET_LAST_OBSERVER_TUNNEL(lastObserverTunnel) {
      this.lastObserverTunnel = lastObserverTunnel
    },
    SET_LOGIN_MILESTONE(loginMilestone) {
      this.loginMilestone = loginMilestone
    },
    SET_LOGIN_MILESTONE_TUNNEL(loginMilestoneTunnel) {
      this.loginMilestoneTunnel = loginMilestoneTunnel
    },
    SET_CONNECTION_ID(connectId) {
      this.connectId = connectId
    },
    SET_CONNECTION_ID_TUNNEL(connectIdTunnel) {
      this.connectIdTunnel = connectIdTunnel
    },
    SET_CHECK_CONNECT_MILESTONE(checkConnectMilestone) {
      this.checkConnectMilestone = checkConnectMilestone
    },
    SET_CHECK_CONNECT_MILESTONE_TUNNEL(checkConnectMilestoneTunnel) {
      this.checkConnectMilestoneTunnel = checkConnectMilestoneTunnel
    },
    SET_USER_DETAIL: userDetail => {
      this.userDetail = userDetail
    },
  },
})

export default useCommonStore
