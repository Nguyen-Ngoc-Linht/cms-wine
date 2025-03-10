const longpress = {
  beforeMount: function (el, binding, vNode) {
    if (typeof binding.value !== 'function') {
      throw 'callback must be a function'
    }
    // define variables
    let pressTimer = null
    // Create a timer (execute function after 2 seconds ）
    const start = e => {
      if (e.type === 'click' && e.button !== 0) {
        return
      }
      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          handler()
        }, 1000)
      }
    }
    // Cancel timer
    const cancel = e => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
    }
    // run function
    const handler = e => {
      binding.value(e)
    }
    // Add event listener
    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)
    // Cancel timer
    el.addEventListener('click', cancel)
    el.addEventListener('mouseout', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)
  },
  // Triggered when the passed in value is updated
  updated(el, { value }) {
    el.$value = value
  },
  // When the command is unbound from the element, remove the event binding
  unmounted(el) {
    el.removeEventListener('click', el.handler)
  },
}

export default longpress
