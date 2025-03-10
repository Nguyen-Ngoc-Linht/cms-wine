import moment from 'moment'

export const formatDate = dateString => {
  const date = moment(dateString)
  return date.isValid() ? moment(dateString).format('DD/MM/YYYY') : ''
}

export const formatDateTime = dateString => {
  const date = moment(dateString)
  return date.isValid() ? moment(dateString).format('DD/MM/YYYY HH:mm:ss') : ''
}

export const formatDateTimeMinute = dateString => {
  const date = moment(dateString)
  return date.isValid() ? moment(dateString).format('DD/MM/YYYY HH:mm') : ''
}
