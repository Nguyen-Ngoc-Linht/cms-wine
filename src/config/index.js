// src/utils/configLoader.js
import { getCurrentInstance } from 'vue'
let runtimeConfig = null

export function useConfig() {
  const { proxy } = getCurrentInstance()
  return proxy.$config
}

export async function loadRuntimeConfig() {
  if (runtimeConfig) {
    return runtimeConfig
  }

  try {
    const response = await fetch(`/runtime-config.json?version=${new Date().getTime()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch runtime configuration')
    }
    runtimeConfig = await response.json()
  } catch (error) {
    console.error('Error loading runtime configuration:', error)
    runtimeConfig = {} // Fallback to an empty config
  }
  return runtimeConfig
}

export function getConfig(key) {
  if (!runtimeConfig) {
    loadRuntimeConfig().then(() => {
      return key ? runtimeConfig[key] : runtimeConfig
    })
  } else {
    return key ? runtimeConfig[key] : runtimeConfig
  }
}
