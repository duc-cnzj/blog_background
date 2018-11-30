<template>
  <div>
    <Card :bordered="false">
      <Tabs>
        <TabPane
          label="基本设置"
          icon="ios-hammer-outline"
        >
          <Row>
            <Col span="16">
            <Form
              :model="formItem"
              :label-width="180"
              style="width: 80%"
            >
              <FormItem label="昵称">
                <Input
                  v-model="formItem.name"
                  placeholder="your name.."
                ></Input>
              </FormItem>

              <FormItem label="Bio">
                <Input
                  v-model="formItem.bio"
                  type="textarea"
                  :autosize="{minRows: 2,maxRows: 5}"
                  placeholder="you are not alone."
                ></Input>
              </FormItem>

              <FormItem label="邮箱地址📮">
                <Input
                  v-model="formItem.email"
                  placeholder="example@xxx.com"
                ></Input>
              </FormItem>

              <FormItem>
                <Button type="primary" @click="onSubmit">保存</Button>
                <Button style="margin-left: 8px" @click="reset">重置</Button>
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
              <img :src="$store.state.user.avatorImgPath" />
            </div>
            </Col>

            <avatar-modal
              ref="modal"
              :avatarSrc="$store.state.user.avatorImgPath"
            >
            </avatar-modal>
          </Row>

        </TabPane>
        <TabPane
          label="todo1"
          icon="logo-windows"
        >待定1</TabPane>
        <TabPane
          label="todo2"
          icon="logo-tux"
        >待定2</TabPane>
      </Tabs>
    </Card>
  </div>
</template>
<script>
import UploadImage from '@/components/upload/UploadImage'
import AvatarModal from './AvatarModal'

export default {
  name: 'userCenter',
  components: { UploadImage, AvatarModal },
  data () {
    return {
      formItem: {
        name: '',
        bio: '',
        email: ''

      }
    }
  },

  created () {
    this.formItem = Object.assign({}, this.$store.state.user)
  },

  methods: {

    reset () {
      this.setUser()
    },

    onSubmit () {
      this.$store.dispatch('UpdateInfo', this.formItem).then(() => {
        this.$Message.success('用户信息更新成功！')
      }).catch((e) => {
        console.log(e)

        this.$Message.error('用户信息更新失败！')
      })
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
