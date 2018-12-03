<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },

  // mounted () {
  //   if (this.$route.params.state === 'token expired') {
  //     this.$Message.error('登陆过期请重新登陆！')
  //   }
  // },

  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password, remember }) {
      this.handleLogin({ userName, password, remember }).then(res => {
        this.getUserInfo(res).then(res => {
          this.$router.push({
            name: 'home'
          })
        })
      }).catch(err => {
        if (err.response && err.response.status === 401) {
          this.$Message.error('手机号或者密码错误')
        }
      })
    }
  }
}
</script>

<style>

</style>
