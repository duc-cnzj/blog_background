<template>
  <div>
    <Card :bordered="false">
      <p slot="title">专栏作者添加</p>
      <Row>
        <Col span="16">
        <Form
        ref="formValidate"  :rules="ruleValidate"
          :model="author"
          :label-width="180"
          style="width: 80%"
        >
          <FormItem label="昵称" prop="name">
            <Input
              v-model="author.name"
              placeholder="your name.."
            ></Input>
          </FormItem>

          <FormItem label="Bio" prop="bio">
            <Input
              v-model="author.bio"
              type="textarea"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="you are not alone."
            ></Input>
          </FormItem>

          <FormItem label="邮箱地址📮" prop="email">
            <Input
              v-model="author.email"
              placeholder="example@xxx.com"
            ></Input>
          </FormItem>
          <FormItem label="手机号码📱" prop="mobile">
            <Input
              v-model="author.mobile"
              placeholder="18888xxxx88"
            ></Input>
          </FormItem>

          <FormItem label="登陆密码" prop="password">
            <Input
              type="password"
              v-model="author.password"
              placeholder="请输入密码，不能少于6位。"
            ></Input>
          </FormItem>

          <FormItem>
            <Button
              type="primary"
              @click="onSubmit"
            >保存</Button>
            <Button
              style="margin-left: 8px"
              @click="reset"
            >重置</Button>
          </FormItem>
        </Form>
        </Col>

        <Col span="8">
        <div
          class="ant-upload-preview"
          @click="$refs.modal.edit(1)"
        >
          <Icon
            type="ios-cloud-upload-outline"
            class="upload-icon"
          />

          <div class="mask">
            <Icon type="md-add" />
          </div>
          <img :src="imgSrc" />
        </div>
        </Col>

        <avatar-modal
          ref="modal"
          :avatarSrc="''"
          @avatar-onsave="avatarSave"
          @avatar-oncancel="avatarCancel"
        >
        </avatar-modal>
      </Row>
    </Card>
  </div>
</template>
<script>
import { storeUser } from '@/api/user'
import AvatarModal from '_c/user/AvatarModal'
import UploadImage from '@/components/upload/UploadImage'
export default {
  components: {
    UploadImage,
    AvatarModal
  },

  data () {
    return {
      author: {
        name: '',
        bio: '',
        email: '',
        mobile: '',
        password: '',
        avatar: null
      },
      imgSrc: '',
      ruleValidate: {
        name: [
          { required: true, message: '用户名称必填！', trigger: 'blur' }
        ],
        bio: [
          { required: true, message: '用户bio必填！', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码必填！', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '用户邮箱必填！', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '用户手机号必填', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    avatarCancel () {
      this.imgSrc = ''
      this.author.avatar = null
    },
    avatarSave (data) {
      this.author.avatar = data
      this.imgSrc = URL.createObjectURL(data)
    },
    onSubmit () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          storeUser(this.author).then(() => {
            this.$Message.success('用户添加成功!')
            this.$router.push({ name: 'author_center' })
          }).catch(e => {
            console.log(e)
          })
        } else {
          this.$Message.error('请输入完整信息!')
        }
      })
    },

    reset () {
      this.author = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  height: 180px;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img,
  .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
