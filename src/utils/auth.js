import { TOKEN } from '@/config/constant'
import cookies from '@/utils/cookies'

export function getToken() {
  return cookies.get(TOKEN)
}

export function removeToken() {
  return cookies.remove(TOKEN)
}
