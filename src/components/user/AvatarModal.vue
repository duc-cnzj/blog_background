<template>
  <Modal
    v-model="visible"
    title="修改头像"
    :maskClosable="true"
    :loading="loading"
    :width="800"
  >

    <Row>
      <Col
        :span="12"
        style="height: '350px'"
      >
      <div class="cut">
        <vue-cropper
          ref="cropper"
          :img="oSrc"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
      </div>
      </Col>
      <Col
        :span="12"
        :style="{height: '350px'}"
      >
      <div class="avatar-upload-preview">
        <img
          :src="previews.url"
          :style="previews.img"
        />
      </div>
      </Col>
    </Row>

    <div slot="footer">
      <Button type="default" @click="cancelHandel">取消</Button>
      <Button type="primary" @click="onUpload">上传</Button>
      <Button type="dashed" @click="okHandel">保存</Button>
      <input
        ref="uploadBtn"
        type="file"
        id="uploads"
        style="position:absolute; clip:rect(0 0 0 0);"
        accept="image/png, image/jpeg, image/gif, image/jpg"
        @change="uploadImg($event, 1)"
      />
    </div>
  </Modal>
</template>
<script>
import { VueCropper } from 'vue-cropper'

export default {
  components: {
    VueCropper
  },
  props: {
    avatarSrc: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      modelSrc: null,
      oSrc: '',
      crap: false,
      visible: false,
      loading: false,

      options: {
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      previews: {}
    }
  },

  created () {
    this.oSrc = this.avatarSrc
  },

  methods: {
    onUpload () {
      this.$refs.uploadBtn.click()
    },

    uploadImg (e, num) {
      // 上传图片
      // this.option.img
      var file = e.target.files[0]
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
        return false
      }
      var reader = new FileReader()
      reader.onload = e => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }

        this.$refs.cropper.refresh()
        this.oSrc = data
      }

      // 转化为base64
      reader.readAsDataURL(file)
      // 转化为blob
      // reader.readAsArrayBuffer(file);
    },

    edit () {
      this.oSrc = this.avatarSrc
      this.$refs.cropper.refresh()
      this.visible = true
    },

    close () {
      this.visible = false
      // this.$refs.cropper.refresh()
      this.$emit('avatar-oncancel')
    },

    cancelHandel () {
      this.close()
    },

    okHandel () {
      this.$refs.cropper.getCropBlob(data => {
        this.$emit('avatar-onsave', data)
      })

      this.hiddenModal()
    },

    hiddenModal () {
      this.visible = false
    },

    realTime (data) {
      this.previews = data
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
.cut {
  width: 300px;
  height: 300px;
  margin: 30px auto;
}
</style>
