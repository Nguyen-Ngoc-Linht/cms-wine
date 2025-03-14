<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container"
    :style="{ width: containerWidth }"
  >
    <textarea
      :id="tinymceId"
      class="tinymce-textarea"
    />
    <span class="text--secondary absolute bottom-2 right-1">{{ characterCount }}/{{ limit }}</span>
  </div>
</template>

<script setup>
import { reactive, computed, watch, onMounted, onBeforeUnmount, toRefs, nextTick, ref } from 'vue'
import plugins from './plugins'
import toolbarConfig from './toolbar'
import toolbarCustom from './toolbarCustom'
import loadScript from './dynamicLoadScript'
import { ElMessage } from 'element-plus'

const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'
const props = defineProps({
  id: {
    type: String,
    default: function () {
      return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
    },
  },
  value: {
    type: String,
    default: '',
  },
  toolbar: {
    type: Array,
    required: false,
    default() {
      return []
    },
  },
  menubar: {
    type: String,
    default: 'file edit insert view format table',
  },
  height: {
    type: [Number, String],
    required: false,
    default: 180,
  },
  width: {
    type: [Number, String],
    required: false,
    default: '100%',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Number,
    default: 3000,
  },
})
const state = reactive({
  hasChange: false,
  hasInit: false,
  tinymceId: props.id,
  fullscreen: false,
  languageTypeList: {
    en: 'en',
    zh: 'zh_CN',
    es: 'es_MX',
    ja: 'ja',
    vi: 'vi',
  },
})

const characterCount = ref(0)

const emit = defineEmits(['input'])

const initTinymce = () => {
  window.tinymce.init({
    selector: `#${state.tinymceId}`,
    content_style: 'p {margin: 0px; border:0px ; padding: 4px;}', // Set line spacing
    language: state.languageTypeList.en,
    height: props.height,
    body_class: 'panel-body ',
    object_resizing: false,
    readonly: props.readOnly,
    statusbar: false,
    toolbar: props.readOnly ? false : props.toolbar.length > 0 ? props.toolbar : toolbarCustom,
    // menubar: props.readOnly ? false : props.menubar,
    menubar: false,
    plugins: props.readOnly ? false : plugins,
    end_container_on_empty_block: true,
    powerpaste_word_import: 'clean',
    code_dialog_height: 450,
    code_dialog_width: 1000,
    plugin_preview_width: '500', // This do the trick
    plugin_preview_height: '600',
    advlist_bullet_styles: 'square',
    advlist_number_styles: 'default',
    imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
    default_link_target: '_blank',
    link_title: false,
    nonbreaking_force_tab: true,
    init_instance_callback: editor => {
      if (props.value) {
        editor.setContent(props.value)
      }
      console.log('props.value: ', props.value)
      state.hasInit = true
      editor.on('NodeChange Change KeyUp SetContent', () => {
        state.hasChange = true
        const content = editor.getContent({ format: 'text' })
        characterCount.value = editor.getContent().replace(/<[^>]*>/g, '').length
        if (characterCount.value > props.limit) {
          editor.setContent(content.slice(0, props.limit))
        }
        emit('input', editor.getContent())
      })
    },
    setup(editor) {
      editor.on('FullscreenStateChanged', e => {
        state.fullscreen = e.state
      })
    },
    file_picker_types: 'file image media',
    convert_urls: false,
  })
}
const init = () => {
  loadScript(tinymceCDN, err => {
    if (err) {
      ElMessage.error(err.message)
      return
    }
    initTinymce()
  })
}
const setContent = value => {
  if (window.tinymce?.get(state.tinymceId)) {
    window.tinymce.get(state.tinymceId).setContent(value)
  }
}
const getContent = () => {
  if (window.tinymce?.get(state.tinymceId)) {
    return window.tinymce.get(state.tinymceId).getContent()
  }
}

const destroyTinymce = () => {
  const tinymce = window.tinymce.get(state.tinymceId)
  if (state.fullscreen) {
    tinymce.execCommand('mceFullScreen')
  }
  if (tinymce) {
    tinymce.destroy()
  }
}
const containerWidth = computed(() => {
  const width = '' + props.width
  if (/^[\d]+(\.[\d]+)?$/.test(width)) {
    return `${width}px`
  }
  return width
})
watch(
  () => props.value,
  val => {
    if (!state.hasChange && state.hasInit) {
      nextTick(() => window.tinymce.get(state.tinymceId).setContent(val || ''))
    }
  },
  { immediate: true }
)

onMounted(() => {
  init()
})
onBeforeUnmount(() => {
  destroyTinymce()
})
// 导出给refs使用
defineExpose({ setContent, getContent })
// 导出属性到页面中使用
const { tinymceId, fullscreen } = toRefs(state)
defineOptions({
  name: 'YuTinymce',
})
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
