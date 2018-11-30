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
        <p slot="title">No border title</p>
        <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
      </Card>
      </Col>
    </Row>
  </div>
</template>

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
