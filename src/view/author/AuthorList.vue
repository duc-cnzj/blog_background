<template>
  <div>
    <Card :bordered="false">
      <p slot="title">博客作者列表</p>
      <author-list
        :users="users"
        @page-change="changePage"
        @page-size-change="pageSizeChange"
        @delete-user="deleteUser"
        @edit-user="editUser"
      ></author-list>

      <Modal
        v-model="modalVisable"
        title="修改用户"
        @on-ok="doEdit"
      >
        <Form
          :model="userEdit"
          label-position="right"
          v-if="userEdit!==null"
          :label-width="80"
        >
          <FormItem
            label="昵称"
            prop="name"
          >
            <Input
              v-model="userEdit.name"
              placeholder="your name.."
            ></Input>
          </FormItem>

          <FormItem
            label="Bio"
            prop="bio"
          >
            <Input
              v-model="userEdit.bio"
              type="textarea"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="you are not alone."
            ></Input>
          </FormItem>

          <FormItem
            label="邮箱地址📮"
            prop="email"
          >
            <Input
              v-model="userEdit.email"
              placeholder="example@xxx.com"
            ></Input>
          </FormItem>

        </Form>
      </Modal>
    </Card>
  </div>
</template>

<script>
import Index from '_c/author/Index'
import { index as userIndex, destory as deleteUser, show, update } from '@/api/author'

export default {
  components: {
    AuthorList: Index
  },
  data () {
    return {
      modalVisable: false,
      users: null,
      userEdit: null
    }
  },

  created () {
    this.fetchUser()
  },

  methods: {
    doEdit () {
      console.log(this.userEdit)
      update(this.userEdit).then(() => {
        this.$Message.success('用户信息更新成功！')
        this.fetchUser()
      }).catch(e => {
        this.$Message.error(e.data.error.message)
      })
    },
    editUser (id) {
      show(id).then(res => {
        console.log(res)

        this.modalVisable = true
        this.userEdit = res.data
      })
    },

    changePage (page) {
      this.fetchUser({ page })
    },

    pageSizeChange (pageSize) {
      this.fetchUser({ pageSize })
    },
    deleteUser ({ id, index }) {
      console.log('id', id)
      console.log('index', index)
      deleteUser(id)
        .then(() => {
          this.$Modal.remove()
          this.$Message.success('删除成功')
          this.users.data = _.reject(this.users.data, { id: id })
          this.users.meta.total = this.users.meta.total - 1
        })
        .catch(e => {
          console.log('deleteuser', e)

          this.$Modal.remove()
          this.$Message.error(e.data.error.message)
        })
    },

    fetchUser ({ pageSize = 10, page = 1, query } = {}) {
      userIndex({
        pageSize,
        page,
        query
      }).then(res => {
        this.users = res
        console.log(this.users)
      })
    }
  }
}
</script>
