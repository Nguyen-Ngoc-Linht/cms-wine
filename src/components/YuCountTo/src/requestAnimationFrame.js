let lastTime = 0
const prefixes = 'webkit moz ms o'.split(' ') // Prefixes for each browser

let requestAnimationFrame
let cancelAnimationFrame

const isServer = typeof window === 'undefined'
if (isServer) {
  requestAnimationFrame = function () {}
  cancelAnimationFrame = function () {}
} else {
  requestAnimationFrame = window.requestAnimationFrame
  cancelAnimationFrame = window.cancelAnimationFrame
  let prefix
  // By traversing each browser prefix, we can get the implementation form of requestAnimationFrame and cancelAnimationFrame in the current browser.
  for (let i = 0; i < prefixes.length; i++) {
    if (requestAnimationFrame && cancelAnimationFrame) {
      break
    }
    prefix = prefixes[i]
    requestAnimationFrame = requestAnimationFrame || window[prefix + 'RequestAnimationFrame']
    cancelAnimationFrame =
      cancelAnimationFrame ||
      window[prefix + 'CancelAnimationFrame'] ||
      window[prefix + 'CancelRequestAnimationFrame']
  }

  // If the current browser does not support requestAnimationFrame and cancelAnimationFrame, it will fall back tosetTimeout
  if (!requestAnimationFrame || !cancelAnimationFrame) {
    requestAnimationFrame = function (callback) {
      const currTime = new Date().getTime()
      // In order to make setTimteout as close as possible to the effect of 60 frames per second
      const timeToCall = Math.max(0, 16 - (currTime - lastTime))
      const id = window.setTimeout(() => {
        // eslint-disable-next-line n/no-callback-literal
        callback(currTime + timeToCall)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }

    cancelAnimationFrame = function (id) {
      window.clearTimeout(id)
    }
  }
}

export { requestAnimationFrame, cancelAnimationFrame }
