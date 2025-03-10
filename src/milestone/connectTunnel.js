import { useCommonStore } from '@/store'

const env = import.meta.env
class MilestoneConnectTunnel {
  constructor() {
    this.methodsCallback = []
  }

  setMethodCallBack(value) {
    this.methodsCallback = value
  }

  handleAddMethodCallback(methods) {
    if (methods) {
      this.methodsCallback.push(methods)
    }
  }

  connectToServer() {
    const commonStore = useCommonStore()
    const self = this
    // Connect to the desired server (defaults to the current URL)
    const url = env.VITE_APP_MILESTONE_TUNNEL_SERVER_URL
    XPMobileSDKSettingsTunnel.MobileServerURL = url
    const username = env.VITE_APP_MILESTONE_TUNNEL_USERNAME
    const password = env.VITE_APP_MILESTONE_TUNNEL_PASSWORD
    const lastObserver = {
      connectionDidConnect: async () => {
        await XPMobileSDKTunnel.login(username, password, 'ActiveDirectory', {
          NumChallenges: 100,
        })
      },
      connectionDidLogIn: () => {
        commonStore.SET_LOGIN_MILESTONE_TUNNEL(true)
        self.methodsCallback.forEach(element => {
          element()
        })
        self.setMethodCallBack([])
      },
    }
    if (commonStore.lastObserverTunnel) {
      XPMobileSDKTunnel.removeObserver(commonStore.lastObserver)
      commonStore.SET_LAST_OBSERVER_TUNNEL(null)
    }
    commonStore.SET_LAST_OBSERVER_TUNNEL(lastObserver)
    XPMobileSDKTunnel.addObserver(lastObserver)
    const result = XPMobileSDKTunnel.connect(url)
    setTimeout(() => {
      commonStore.SET_CONNECTION_ID_TUNNEL(result?.response?.outputParameters?.ConnectionId)
    }, 100)
    commonStore.SET_CHECK_CONNECT_MILESTONE_TUNNEL(true)
  }

  disconnectToServer() {
    const commonStore = useCommonStore()
    if (commonStore.lastObserverTunnel) {
      XPMobileSDKTunnel.removeObserver(commonStore.lastObserverTunnel)
      commonStore.SET_LAST_OBSERVER_TUNNEL(null)
    }
    XPMobileSDKTunnel.disconnect()
    commonStore.SET_LOGIN_MILESTONE_TUNNEL(false)
  }
}

export default MilestoneConnectTunnel
