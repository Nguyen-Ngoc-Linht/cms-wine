export const genKey = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: 5 })
    .map(() => characters[Math.floor(Math.random() * characters.length)])
    .join('')
}

export function ensureString(value) {
  if (Array.isArray(value)) {
    return value.join('')
  }
  return String(value)
}
