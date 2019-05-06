<template>
  <div>
    <Row :gutter="16">
      <Col span="6">
        <Card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar">
              <img :src="$store.state.user.avatorImgPath">
            </div>
            <div class="username">{{$store.state.user.name}}</div>
            <div class="bio">{{$store.state.user.bio}}</div>
          </div>
        </Card>
      </Col>

      <Col span="18">
        <Card :bordered="false">
          <Tabs value="articles" @on-click="onClick">
            <TabPane label="文章" name="articles">
              <my-articles></my-articles>
            </TabPane>
            <TabPane label="文章评论列表" name="comments">
              <comments-list
                :comments="comments"
                @page-change="pageChange"
                @page-size-change="pageSizeChange"
                @preview="commentShow"
                @submit-comment="submitComment"
                @click-cancel="clickCancel"
                @delete-comment="deleteComment"
                :previewArticle="showComment"
                :replies="replies"
              ></comments-list>
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import MyArticles from './sub/MyArticles'
import CommentsList from './sub/CommentsList'
import { index, show, store, destroy } from '@/api/comment'

export default {
  components: { MyArticles, CommentsList },
  data () {
    return {
      comments: null,
      showComment: null,
      page: 1,
      pageSize: 10,
      replies: []
    }
  },
  methods: {
    deleteComment ({ id, content }) {
      this.$Modal.confirm({
        title: `删除`,
        render: (h) => {
          return h('div', {}, ['确定删除这条评论吗？', h('p', {
            domProps: {
              innerHTML: content
            }
          })])
        },
        loading: true,
        onOk: () => {
          destroy(id)
            .then(res => {
              this.$Modal.remove()
              this.$Message.success('删除成功')
              this.commentsClick()
            })
            .catch(e => {
              this.$Modal.remove()
              this.$Message.error(e.data.error.message)
            })
        }
      })
    },

    clickCancel () {
      this.replies = []
    },

    submitComment ({ body, article_id: articleId, comment_id: commentId }) {
      store({ body, articleId, commentId }).then(res => {
        this.replies.push({ id: res.data.id, content: res.data.body })
      })
    },

    commentShow (id) {
      show(id).then(res => {
        this.showComment = res.data
        this.replies = res.data.my_comments
      })
    },

    pageChange (page) {
      this.page = page
      this.commentsClick()
    },

    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.commentsClick()
    },

    onClick (name) {
      console.log(this[name + `Click`])

      this[name + `Click`] && this[name + `Click`]()
    },

    commentsClick () {
      index({ page: this.page, pageSize: this.pageSize }).then(res => {
        this.comments = res
      })
    },

    articlesClick () {
      console.log('articlesClick')
    }
  }
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
