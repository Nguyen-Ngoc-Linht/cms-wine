import { validEmail, validMaxLength, validatePhone } from './validate'

export function validateTextEditor(rule, value, callback) {
  const { params } = rule
  if (!value.trim() && params.required) {
    callback(new Error(`${params.label} bắt buộc nhập`))
  } else if (value && !validMaxLength(value, params.maxLength)) {
    callback(new Error(`Tối đa được nhập ${params.maxLength} ký tự`))
  } else {
    callback()
  }
}

export function validatePhoneNumber(rule, value, callback) {
  const { params } = rule
  const strLength = value.trim().length

  if (strLength <= 0 && params.required) {
    callback(new Error(`${params.label} bắt buộc nhập`))
  } else if (strLength > 0 && !validMaxLength(value, params.maxLength)) {
    callback(new Error(`${params.label} tối đa ${params.maxLength} ký tự`))
  } else if (strLength > 0 && !validatePhone(value)) {
    callback(new Error(`${params.label} không đúng định dạng`))
  } else {
    callback()
  }
}
export function validateEmail(rule, value, callback) {
  const { params } = rule
  const strLength = value.trim().length
  if (!value.trim() && params.required) {
    callback(new Error(`${params.label}  bắt buộc nhập`))
  } else if (strLength > 0 && !validMaxLength(value, params.maxLength)) {
    callback(new Error(`${params.label} tối đa ${params.maxLength} ký tự`))
  } else if (strLength > 0 && !validEmail(value)) {
    callback(new Error(`${params.label} không đúng định dạng`))
  } else {
    callback()
  }
}
