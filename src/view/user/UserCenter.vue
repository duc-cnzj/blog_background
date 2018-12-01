<template>
  <div>
    <Row :gutter="16">
      <Col span="7">
      <Card :bordered="false">
        <div class="account-center-avatarHolder">
          <div class="avatar">
            <img :src="$store.state.user.avatorImgPath" />
          </div>
          <div class="username">{{$store.state.user.name}}</div>
          <div class="bio">{{$store.state.user.bio}}</div>
        </div>
      </Card>
      </Col>

      <Col span="17">
      <Card :bordered="false">
        <Tabs value="name1">
          <TabPane
            label="文章"
            name="name1"
          >
          <my-articles></my-articles>
          </TabPane>
          <TabPane
            label="标签二"
            name="name2"
          >标签二的内容</TabPane>
          <TabPane
            label="标签三"
            name="name3"
          >标签三的内容</TabPane>
        </Tabs>
      </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import MyArticles from './sub/MyArticles'

export default {
  components: { MyArticles }
}
</script>

<style lang="scss" scoped>
.account-center-avatarHolder {
  text-align: center;
  margin-bottom: 24px;

  & > .avatar {
    margin: 0 auto;
    width: 104px;
    height: 104px;
    margin-bottom: 20px;
    border-radius: 50%;
    overflow: hidden;
    img {
      height: 100%;
      width: 100%;
    }
  }

  .username {
    color: rgba(0, 0, 0, 0.85);
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 4px;
  }
}
</style>
