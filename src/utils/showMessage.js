import { ElMessage } from 'element-plus'

export const showMessage = ({ message, type = 'info' }) => {
  ElMessage({
    message,
    type,
    showClose: true,
  })
}
