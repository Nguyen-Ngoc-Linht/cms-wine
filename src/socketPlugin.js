import io from 'socket.io-client'
const socketPlugin = {
  install: (app, options) => {
    const { serverUrl, ...optionsOther } = options
    const socket = io(serverUrl, { ...optionsOther })

    socket.on('connect', () => {
      console.log('Socket connected!')
    })

    // Thêm socket vào prototype của Vue để có thể sử dụng ở mọi component
    app.config.globalProperties.$socket = socket
    app.provide('$socket', socket)

    // Bắt sự kiện khi có dữ liệu từ server
    socket.on('receiveNotification', data => {
      // Xử lý dữ liệu nhận được ở đây
    })
  },
}

export default socketPlugin
