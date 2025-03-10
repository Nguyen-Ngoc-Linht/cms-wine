import { validPhone } from './validate'

// Capitalize the first letter of a word
export function toUpperCaseWord(val) {
  if (!val) return ''
  return val.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase())
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        // eslint-disable-next-line prefer-regex-literals
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['Day', 'one', 'two', 'three', 'Four', 'five', 'six'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return 'just'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + 'minutes ago'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + 'An hour ago'
  } else if (diff < 3600 * 24 * 2) {
    return '1 day ago'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      'month' +
      d.getDate() +
      'Day' +
      d.getHours() +
      'hour' +
      d.getMinutes() +
      'point'
    )
  }
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function encryptionPhone(val) {
  const phone = val + ''
  if (!validPhone(phone)) {
    return ''
  }
  const reg = /^(\d{3})\d{4}(\d{4})$/
  return phone.replace(reg, '$1****$2')
}

/**
 * Number formating
 * @param {*} num
 * @param {*} digits
 * @returns
 */
export function numberFormatter(num, digits) {
  if (!num) return '0'
  const si = [
    { value: 1e18, symbol: 'E' },
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'G' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' },
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') +
        si[i].symbol
      )
    }
  }
  return num ? num.toString() : '0'
}

/**
 * format number with separator
 * @param {*} number
 * @param {*} separator
 * @returns
 */

export function formatNumber(number, separator = ',') {
  if (number === 0) return '' + number
  else if (!number) return ''
  return number
    .toString()
    .split('')
    .reverse()
    .map((char, i) => (i > 0 && i % 3 === 0 ? char + separator : char))
    .reverse()
    .join('')
}

/**
 * unique array
 * @param {*} array
 * @returns
 */
export function uniqueArray(array) {
  const uniqueSet = new Set(array)
  const uniqueArray = [...uniqueSet]

  return uniqueArray
}

export function trimData(data) {
  for (const key in data) {
    if (data[key] && typeof data[key] === 'string') {
      data[key] = data[key] ? data[key].trim() : null
    }
  }
  return data
}

export function downloadFileBase64(fileName, data) {
  // Decode base64 data
  const byteCharacters = atob(data)
  const byteNumbers = new Uint8Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const blob = new Blob([byteNumbers])
  const url = URL.createObjectURL(blob)

  // Create a link and trigger the download
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()

  // Clean up
  URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
