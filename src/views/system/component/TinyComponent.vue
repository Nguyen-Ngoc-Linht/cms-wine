<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container editor-container">
    <editor :tinymceScriptSrc="'/tinymce/tinymce.min.js'" :init="tinymceInit" :disabled="disabled" v-model="valueEditor"></editor>
  </div>
</template>

<script>
import editor from '@tinymce/tinymce-vue'

export default {
  name: 'Tinymce',
  components: {
    editor
  },
  props: {
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
    menubar: {
      type: String,
      default: 'file edit insert view format table',
    },
    height: {
      type: Number,
      required: false,
      default: 800,
    },
    action: {
      type: String,
      default: 'https://httpbin.org/post',
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      tinymceInit: {},
      content: '',
      plugins: [
        'advlist', 'anchor', 'autolink', 'autosave', 'code', 'codesample',
        'directionality', 'emoticons', 'fullscreen', 'image',
        'insertdatetime', 'link', 'lists', 'media', 'nonbreaking',
        'pagebreak', 'preview', 'save', 'searchreplace', 'table',
        'visualblocks', 'visualchars', 'wordcount'
      ],
      toolbar: ['searchreplace bold italic underline formatselect strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample', 'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'],
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      initValue: this.value,
      languageTypeList: {
        'en': 'en',
      },
    }
  },
  computed: {
    valueEditor: {
      get: function () {
        return this.value
      },
      set: function (val) {
        this.$emit('update:modelValue', val)
      },
    }
  },
  watch: {
    value (newValue) {
      // Update editor content when the value prop changes
      if (this.hasInit) {
        // eslint-disable-next-line no-undef
        tinymce.activeEditor.setContent(newValue || '')
      } else {
        this.initialValue = newValue
      }
    },
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      const _this = this
      this.tinymceInit = {
        base_url: '/tinymce',
        suffix: '.min',
        language: 'en',
        height: this.height,
        // toolbar: toolbar,
        // menubar: this.menubar,
        // plugins: plugins,
        fontsize_formats: '8px 10px 12px 14px 16px 18px 24px 36px 48px',
        font_formats: 'Andale Roboto=Roboto, sans-serif; Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true,
        onboarding: false,
        init_instance_callback: editor => {
          if (_this.initialValue) {
            editor.setContent(_this.initialValue)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('update:modelValue', editor.getContent())
          })
        },
        toolbar: this.toolbar + ' image',
        plugins: [...this.plugins, 'image'],
        menubar: this.menubar,
        automatic_uploads: true,
        images_upload_handler: async function (blobInfo, success, failure) {
          const formData = new FormData()
          formData.append('file', blobInfo.blob())

          try {
            const response = await fetch('https://api.sing4u.asia/api/media/upload', {
              method: 'POST',
              body: formData,
            })
            const result = await response.json()
            if (!result.fileDownloadUri) {
              console.error('fileDownloadUri missing in response:', result)
              return failure('Upload failed: No fileDownloadUri')
            }

            const imageUrl = 'https://cdn.sing4u.asia/mykaraoke' + result.fileDownloadUri
            console.log(imageUrl, 'ssssssssss')
            success({
              location: imageUrl
            })
          } catch (err) {
            console.error('Image upload failed:', err)
            failure('Image upload failed')
          }
        },
        file_picker_types: 'image',
        file_picker_callback: function (callback, value, meta) {
          if (meta.filetype === 'image') {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')

            input.onchange = async function () {
              const file = input.files[0]
              const formData = new FormData()
              formData.append('file', file)

              try {
                const response = await fetch('https://api.sing4u.asia/api/media/upload', {
                  method: 'POST',
                  body: formData,
                })
                const result = await response.json()

                if (!result.fileDownloadUri) {
                  return console.error('Upload failed: No fileDownloadUri', result)
                }

                const imageUrl = 'https://cdn.sing4u.asia/mykaraoke' + result.fileDownloadUri
                callback(imageUrl)
              } catch (err) {
                console.error('Manual upload failed', err)
              }
            }
            input.click()
          }
        },
        setup(editor) {
          editor.ui.registry.addButton('customImageButton', {
            icon: 'image',
            tooltip: 'Insert Image',
            onAction: () => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = 'image/*'
              input.onchange = async () => {
                const file = input.files[0]
                const formData = new FormData()
                formData.append('file', file)

                try {
                  const response = await fetch('https://api.sing4u.asia/api/media/upload', {
                    method: 'POST',
                    body: formData,
                  })
                  const result = await response.json()

                  if (!result.fileDownloadUri) {
                    return console.error('Upload failed', result)
                  }

                  const imageUrl = 'https://cdn.sing4u.asia/mykaraoke' + result.fileDownloadUri

                  editor.insertContent(`<img src="${imageUrl}" style="max-width: 100%;" />`)
                } catch (err) {
                  console.error('Manual upload failed', err)
                }
              }
              input.click()
            }
          })

          editor.on('drop', (e) => {
            const files = e.dataTransfer?.files
            if (!files?.length) return

            e.preventDefault()
            const file = files[0]

            if (!file.type.startsWith('image/')) return

            const formData = new FormData()
            formData.append('file', file)

            fetch('https://api.sing4u.asia/api/media/upload', {
              method: 'POST',
              body: formData,
            })
              .then(res => res.json())
              .then(result => {
                if (!result.fileDownloadUri) {
                  return console.error('Upload failed (drop):', result)
                }

                const imageUrl = 'https://cdn.sing4u.asia/mykaraoke' + result.fileDownloadUri
                editor.insertContent(`<img src="${imageUrl}" style="max-width: 100%;" />`)
              })
              .catch(err => {
                console.error('Drag-drop image upload failed', err)
              })
          })
        },
      }
    },
    setContent (value) {
      if (this.hasInit) {
        let tinymce
        tinymce.activeEditor.setContent(value)
      } else {
        this.initialValue = value
      }
    },
    getContent () {
      if (this.hasInit) {
        let tinymce
        return tinymce.activeEditor.getContent()
      }
      return ''
    },
  },
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  text-align: right;
}

.fullscreen .editor-custom-btn-container {
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
  margin-left: 5px;
}
</style>
