<template>
  <div @click.prevent="switchValue">
    <input
      ref="input"
      :id="id"
      :name="name"
      type="checkbox"
      class="switch elc-switch"
      :disabled="disabled"
      :value="checked"
      @change="handleChange"
      @keydown.enter="switchValue"
    />
    <label :for="id">{{ activeText }}</label>
  </div>
</template>
<script>
export default {
  name: 'ElcSwitch',
  props: {
    value: {
      type: [Boolean, String, Number],
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    activeIconClass: {
      type: String,
      default: '',
    },
    inactiveIconClass: {
      type: String,
      default: '',
    },
    activeText: String,
    inactiveText: String,
    activeColor: {
      type: String,
      default: '',
    },
    inactiveColor: {
      type: String,
      default: '',
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true,
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    validateEvent: {
      type: Boolean,
      default: true,
    },
    id: {
      type: String,
      default: 'elc-switch-sw',
    },
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // checked: false,
    }
  },
  created() {},
  mounted() {
    this.$refs.input.checked = this.checked
  },
  computed: {
    switchDisabled() {
      return this.disabled
    },
    checked() {
      return this.value
    },
  },
  watch: {
    checked() {
      this.$refs.input.checked = this.checked
    },
  },
  methods: {
    handleChange() {
      const val = this.checked ? this.inactiveValue : this.activeValue
      this.$emit('input', val)
      this.$emit('change', val)
      this.$nextTick(() => {
        if (this.$refs.input) {
          this.$refs.input.checked = this.checked
        }
      })
    },
    switchValue() {
      !this.switchDisabled && this.handleChange()
    },
  },
}
</script>

<style lang="scss" scoped>
.elc-switch {
  --active: #409eff;
  --active-inner: #fff;
  --focus: 2px rgba(39, 94, 254, 0.3);
  --border: #dcdfe6;
  --border-hover: #409eff;
  --background: #fff;
  --disabled: #f6f8ff;
  --disabled-inner: #82c0ff;
  -webkit-appearance: none;
  -moz-appearance: none;
  height: 21px;
  outline: none;
  display: inline-block;
  vertical-align: top;
  position: relative;
  margin: 0;
  cursor: pointer;
  border: 1px solid var(--bc, var(--border));
  background: var(--b, var(--background));
  transition: background 0.3s, border-color 0.3s, box-shadow 0.2s;
  &:after {
    content: '';
    display: block;
    left: 0;
    top: 0;
    position: absolute;
    transition: transform var(--d-t, 0.3s) var(--d-t-e, ease), opacity var(--d-o, 0.2s);
  }
  &:checked {
    --b: var(--active);
    --bc: var(--active);
    --d-o: 0.3s;
    --d-t: 0.6s;
    --d-t-e: cubic-bezier(0.2, 0.85, 0.32, 1.2);
  }
  &:disabled {
    --b: var(--disabled);
    cursor: not-allowed;
    opacity: 0.9;
    &:checked {
      --b: var(--disabled-inner);
      --bc: var(--border);
    }
    & + label {
      cursor: not-allowed;
    }
  }
  &:not(.switch) {
    width: 21px;
    &:after {
      opacity: var(--o, 0);
    }
    &:checked {
      --o: 1;
    }
  }
  & + label {
    font-size: 14px;
    line-height: 21px;
    display: inline-block;
    vertical-align: top;
    cursor: pointer;
    margin-left: 4px;
  }
}
.elc-switch {
  &:not(.switch) {
    border-radius: 7px;

    &:after {
      width: 5px;
      height: 9px;
      border: 2px solid var(--active-inner);
      border-top: 0;
      border-left: 0;
      left: 7px;
      top: 4px;
      transform: rotate(var(--r, 20deg));
    }
    &:checked {
      --r: 43deg;
    }
  }
  &.switch {
    width: 38px;
    border-radius: 11px;
    background: var(--b, var(--border));
    &:after {
      left: 2px;
      top: 2px;
      border-radius: 50%;
      width: 15px;
      height: 15px;
      background: var(--ab, var(--background));
      transform: translateX(var(--x, 0));
    }
    &:checked {
      --ab: var(--active-inner);
      --x: 17px;
    }
    &:disabled {
      &:not(:checked) {
        &:after {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
