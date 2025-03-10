import { head, toArray } from 'lodash-unified'
import mitt from 'mitt'

export const emitter = mitt()

export default {
  install(Vue, options) {
    const _emitter = mitt()

    // Global release
    Vue.config.globalProperties.$pub = (...args) => {
      _emitter.emit(head(args), args.slice(1))
    }

    // global subscription
    Vue.config.globalProperties.$sub = function (event, callback) {
      Reflect.apply(_emitter.on, _emitter, toArray(arguments))
    }

    // unsubscribe
    Vue.config.globalProperties.$unsub = function (event, callback) {
      Reflect.apply(_emitter.off, _emitter, toArray(arguments))
    }
  },
}
