import { useCommonStore } from '@/store'

const env = import.meta.env
class MilestoneConnect {
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
    const url = env.VITE_APP_MILESTONE_SERVER_URL
    XPMobileSDKSettings.MobileServerURL = url
    const username = env.VITE_APP_MILESTONE_USERNAME
    const password = env.VITE_APP_MILESTONE_PASSWORD
    const lastObserver = {
      connectionDidConnect: async () => {
        await XPMobileSDK.login(username, password, 'ActiveDirectory', {
          NumChallenges: 100,
        })
      },
      connectionDidLogIn: () => {
        commonStore.SET_LOGIN_MILESTONE(true)
        self.methodsCallback.forEach(element => {
          element()
        })
        self.setMethodCallBack([])
      },
    }
    if (commonStore.lastObserver) {
      XPMobileSDK.removeObserver(commonStore.lastObserver)
      commonStore.SET_LAST_OBSERVER(null)
    }
    commonStore.SET_LAST_OBSERVER(lastObserver)
    XPMobileSDK.addObserver(lastObserver)
    const result = XPMobileSDK.connect(url)
    setTimeout(() => {
      commonStore.SET_CONNECTION_ID(result?.response?.outputParameters?.ConnectionId)
    }, 100)
    commonStore.SET_CHECK_CONNECT_MILESTONE(true)
  }

  disconnectToServer() {
    const commonStore = useCommonStore()
    if (commonStore.lastObserver) {
      XPMobileSDK.removeObserver(commonStore.lastObserver)
      commonStore.SET_LAST_OBSERVER(null)
    }
    XPMobileSDK.disconnect()
    commonStore.SET_LOGIN_MILESTONE(false)
  }
}

export default MilestoneConnect
