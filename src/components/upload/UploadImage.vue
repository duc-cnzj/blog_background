<template>
  <div>
    <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <div v-show="showUpload">
      <Upload ref="upload"
        :headers='headers'
        :show-upload-list="false"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :default-file-list="defaultList"
        name='image'
        type="drag"
        :action="imageUplodpath"
        style="display: inline-block;width:58px;"
        >
        <div style="width: 58px;height:58px;line-height: 58px;">
          <Icon type="ios-camera" size="20"></Icon>
        </div>
      </Upload>
    </div>
    <Modal title="查看大图" v-model="visible">
      <img :src="uploadList[0].url" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import { getToken } from '@/libs/util'
export default {
  props: ['src'],

  data () {
    return {
      headers: {
        Authorization: getToken()
      },
      imageUplodpath: process.env.VUE_APP_URL + '/admin/images',
      imgName: '',
      visible: false,
      uploadList: [],
      defaultList: []
    }
  },

  computed: {
    showUpload () {
      return !this.uploadList.length > 0
    }
  },

  created () {
    if (this.src) {
      this.defaultList = [
        {
          name: 'd',
          url: this.src
        }
      ]
    }
  },

  mounted () {
    this.uploadList = this.$refs.upload.fileList
  },

  methods: {
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      this.$emit('remove-path')
    },
    handleSuccess (res, file) {
      const { data } = res

      file.url = data.url
      file.name = data.name

      this.$emit('add-path', {
        path: data.url
      })
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不对',
        desc: '文件格式不正确.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片太大了',
        desc: '最大不能超过2M.'
      })
    }
  }
}
</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
