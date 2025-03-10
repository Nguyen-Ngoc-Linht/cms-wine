<template>
  <el-input
    v-bind="$attrs"
    v-model="inputValue"
    :placeholder="placeholder"
    :type="typeInput"
    @keydown="handleKeyPress"
    @input="onInput"
    @change="onChange"
    @blur="onBlur"
    @focus="onFocus"
  >
    <template
      v-if="prepend"
      #prepend
    >
      <slot name="prepend"></slot>
    </template>
    <template
      v-if="append"
      #append
    >
      <slot name="append"></slot>
    </template>
  </el-input>
</template>

<script setup>
import { ref, watch, useAttrs, defineProps, defineEmits } from 'vue'

const $attrs = useAttrs()
const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus', 'input'])
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  prepend: {
    type: Boolean,
    default: false,
  },
  append: {
    type: Boolean,
    default: false,
  },
  maxLength: {
    type: [String, Number],
    default: null,
  },
  typeInput: {
    type: String,
    default: 'text',
  },
})

const inputValue = ref(props.modelValue)
watch(
  () => props.modelValue,
  newVal => {
    let val = newVal
      ? newVal
        .toString()
        .replace(/[^0-9]/g, '')
        .replace(/^0+/, '')
      : null
    if (props.maxLength && val) {
      val = val.substring(0, props.maxLength)
    }
    val = val ? parseInt(val) : null

    inputValue.value = val
    if (val != newVal) {
      emit('update:modelValue', val)
    }
  }
)

// Emit the updated value back to the parent
const onInput = value => {
  value = value?.replace(/[^0-9]/g, '').replace(/^0+/, '')
  if (props.maxLength && value) {
    value = value.substring(0, props.maxLength)
  }
  value = value ? parseInt(value) : null
  inputValue.value = value
  emit('update:modelValue', value)
  emit('input', value)
}

const handleKeyPress = event => {
  const allowedKeys = ['Backspace', 'Delete', 'Enter', 'ArrowLeft', 'ArrowRight']

  const isCtrlKey = event.ctrlKey && (event.key === 'v' || event.key === 'c')

  if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key) && !isCtrlKey) {
    event.preventDefault()
  }
}

const onChange = event => {
  emit('change', event)
}

const onBlur = event => {
  emit('blur', event)
}

const onFocus = event => {
  emit('focus', event)
}

defineOptions({
  name: 'ElInputInteger',
})
</script>

<style scoped></style>
