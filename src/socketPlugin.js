import { over } from 'stompjs'

let stompClient = null

/**
 * Kết nối WebSocket
 * @param {Object} options
 * @param {string} options.serverUrl - URL server (không bao gồm path)
 * @param {string} options.path - Path WebSocket (ví dụ: /ws)
 * @param {string[]} options.topics - Danh sách các topic để subscribe
 * @param {function} options.onMessage - Hàm callback xử lý khi nhận message
 */
export const connectWebSocket = options => {
  const fullUrl = `wss://${options.serverUrl}${options.path}`
  const socket = new WebSocket(fullUrl)

  console.log('fullUrl', fullUrl)
  stompClient = over(socket)

  stompClient.connect(
    {},
    frame => {
      console.log('WebSocket connected:', frame)

      options.topics.forEach(topic => {
        stompClient.subscribe(topic, message => {
          try {
            const data = JSON.parse(message.body)
            options.onMessage(topic, data, message)
          } catch (err) {
            console.error(`Error parsing message from ${topic}:`, err)
          }
        })
      })
    },
    error => {
      console.error('WebSocket connection error:', error)
    }
  )
}

export const disconnectWebSocket = () => {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect(() => {
      console.log('WebSocket disconnected')
    })
  }
}
