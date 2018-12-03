<template>
  <div>
    <Card :bordered="false">
      <p slot="title">博客作者列表</p>
      <author-list
        :users="users"
        @page-change="changePage"
        @page-size-change="pageSizeChange"
        @delete-user="deleteUser"
      ></author-list>
    </Card>
  </div>
</template>

<script>
import Index from '_c/author/Index'
import { index as userIndex, destory as deleteUser } from '@/api/author'

export default {
  components: {
    AuthorList: Index
  },
  data () {
    return {
      users: null
    }
  },
  created () {
    this.fetchUser()
  },
  methods: {
    changePage (page) {
      this.fetchUser({ page })
    },

    pageSizeChange (pageSize) {
      this.fetchUser({ pageSize })
    },
    deleteUser ({ id, index }) {
      console.log('id', id)
      console.log('index', index)
      deleteUser(id).then(() => {
        this.$Modal.remove()
        this.$Message.success('删除成功')
        this.users.data = _.reject(this.users.data, { id: id })
        this.users.meta.total = this.users.meta.total - 1
      }).catch(e => {
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
