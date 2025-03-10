export function getObjectValueNotNull(obj) {
  if (obj) {
    const result = {}
    Object.keys(obj).forEach(function (key) {
      const value = obj[key]
      if (value) {
        result[key] = value
      }
    })
    return result
  }
  return obj
}

export function replaceQueryParamsWithObject(obj) {
  const objParams = getObjectValueNotNull(obj)
  const url = new URL(window.location.href)
  const params = new URLSearchParams()

  Object.entries(objParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(val => {
        params.append(key, val)
      })
    } else {
      params.append(key, value?.toString())
    }
  })

  url.search = params.toString()

  // Replace the current URL with the updated one
  window.history.replaceState({}, '', url.toString())
}
