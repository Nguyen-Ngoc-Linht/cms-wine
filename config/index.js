export const getEnv = envConf => {
  const ret = {
    VITE_PORT: 3600,
    VITE_PUBLIC_PATH: '',
    VITE_PROXY_DOMAIN: 'http://127.0.0.1:2805',
    VITE_PROXY_DOMAIN_REAL: 'http://127.0.0.1:2805',
    VITE_ROUTER_HISTORY: '',
    VITE_LEGACY: false,
  }

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName = realName === 'true' ? true : realName === 'false' ? false : realName

    if (envName === 'VITE_PORT') {
      realName = Number(realName)
    }
    ret[envName] = realName
    if (typeof realName === 'string') {
      process.env[envName] = realName
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName)
    }
  }
  return ret
}

export const regExps = (value, reg) => {
  return value.replace(new RegExp(`^${reg}`, 'g'), '')
}
