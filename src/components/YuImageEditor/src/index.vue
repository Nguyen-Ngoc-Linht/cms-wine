<template>
  <div
    id="tui-image-editor"
    ref="editorEl"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'tui-image-editor/dist/tui-image-editor.css'
import 'tui-color-picker/dist/tui-color-picker.css'
import ImageEditor from 'tui-image-editor'
import locale_zh from './langZh'
import customTheme from './theme'
import { base64ToFile } from '@/utils/files'

const props = defineProps({
  url: {
    type: String,
    default: 'http://pic.yupoo.com/454539387/b51791f0/2a9ef9f2.jpg',
  },
  fileName: {
    type: String,
    default: 'SampleImage',
  },
  fileSuffix: {
    type: String,
    default: 'png',
  },
  menu: {
    type: Array,
    required: false,
    default() {
      return [
        'crop', // crop
        'flip', // flip
        'rotate', // rotate
        'draw', // add drawing
        'shape', // add shape
        'icon', // add icon
        'text', // add text
        'mask', // add overlay
        'filter', // add filter
      ]
    },
  },
  uiSize: {
    type: Object,
    required: false,
    default() {
      return {
        width: '1000px',
        height: '700px',
      }
    },
  },
  menuBarPosition: {
    type: String,
    default: 'bottom',
  },
  cssMaxWidth: {
    type: Number,
    default: 700,
  },
  cssMaxHeight: {
    type: Number,
    default: 900,
  },
})

const editorEl = ref()
const instance = ref(null)

onMounted(() => {
  const el = editorEl.value
  const options = {
    usageStatistics: false,
    includeUI: {
      loadImage: {
        path: props.url,
        name: props.fileName,
      },
      // Operation menu bar
      menu: props.menu,
      uiSize: props.uiSize,
      menuBarPosition: props.menuBarPosition, // Operation bar position
      locale: locale_zh, // language
      theme: customTheme, // theme style
      initMenu: 'filter',
    },
    cssMaxWidth: props.cssMaxWidth,
    cssMaxHeight: props.cssMaxHeight,
    selectionStyle: {
      cornerSize: 20,
      rotatingPointOffset: 70,
    },
  }
  instance.value = new ImageEditor(el, options)
})

const getFile = (isBase64 = true) => {
  if (!instance.value) {
    return ''
  }
  const base64 = instance.value.toDataURL()
  const name = `${props.fileName}.${props.fileSuffix}`
  return isBase64 ? base64 : base64ToFile(base64, name)
}

const uploadImg = async () => {
  // const fileName = instance.value.getImageName()
  // const base64 = getFile()
  // // base64 file | blob file upload TODO
  // try{
  //   const { code, date } = uploadBase64( {
  //     file : base64,
  // ... // Other parameters such as bucket name, etc.
  //   } )
  // }catch (e) {
  //
  // }
}

defineExpose({ uploadImg, getFile })

defineOptions({
  name: 'ImageEditor',
})
</script>

<style lang="scss" scoped>
.tui-image-editor-submenu-item > li > .tui-image-editor-button > div > .tie-mask-image-file {
  display: block !important;
}
</style>
