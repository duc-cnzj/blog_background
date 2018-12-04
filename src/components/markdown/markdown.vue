<template>
  <div class="markdown-wrapper">
    <textarea ref="editor"></textarea>
  </div>
</template>

<script>
import Simplemde from 'simplemde'
import '@/plugins/inline-attachment'
import '@/plugins/codemirror.inline-attachment'
import { getToken } from '@/libs/util'
import hljs from 'highlight.js'

window.hljs = hljs

export default {
  name: 'MarkdownEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    localCache: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      editor: null
    }
  },
  methods: {
    init () {
      inlineAttachment.editors.codemirror4.attach(this.editor.codemirror, {
        uploadUrl: process.env.VUE_APP_URL + '/admin/images',
        uploadFieldName: 'image',
        extraHeaders: {
          Authorization: getToken()
        },
        progressText: '![图片上传中...]()',
        urlText: (filename, name) => {
          return `![${name}](${filename})`
        },
        onFileUploadResponse: function (xhr) {
          let result = JSON.parse(xhr.responseText)

          let filename = result.data.url
          let name = result.data.name

          if (result && filename) {
            let newValue
            if (typeof this.settings.urlText === 'function') {
              newValue = this.settings.urlText.call(this, filename, name)
            } else {
              newValue = this.settings.urlText.replace(this.filenameTag, filename)
            }
            let text = this.editor.getValue().replace(this.lastValue, newValue)
            this.editor.setValue(text)
            this.settings.onFileUploaded.call(this, filename)
          }
          return false
        }
      })
    },
    addEvents () {
      this.editor.codemirror.on('change', () => {
        let value = this.editor.value()
        if (this.localCache) localStorage.markdownContent = value

        this.$emit('input', value)
      })
    }
  },
  mounted () {
    this.editor = new Simplemde(Object.assign(this.options, {
      element: this.$refs.editor
    }))

    this.addEvents()

    this.$nextTick(() => {
      /**
       * 事件列表为Codemirror编辑器的事件，更多事件类型，请参考：
       * https://codemirror.net/doc/manual.html#events
       */
      this.init()
      if (this.value) {
        this.editor.value(this.value)
      } else {
        let content = localStorage.markdownContent

        if (content) this.editor.value(content)
      }
    })
  }
}
</script>

<style scoped>
/* @import "~highlight.js/styles/xcode.css"; */
/* @import '~highlight.js/styles/atom-one-dark.css'; */
</style>
