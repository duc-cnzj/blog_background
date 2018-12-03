<template>
  <div>
    <Row :gutter="32">

      <i-col
        :span="6"
        style="margin-bottom: 20px;"
      >
        <Button
          type="dashed"
          @click="addUser"
        >
          <Icon type="ios-add-circle-outline" />
          添加用户</Button>

      </i-col>

    </Row>
    <Row :gutter="20" v-if="users!==null">
      <i-col>
        <Table
          border
          ref="selection"
          :columns="columns"
          @on-selection-change="onSelectionChange"
          :data="users.data"
        ></Table>
      </i-col>

      <i-col>
        <Row
          :gutter="3"
          style="margin-top: 20px;"
        >
          <i-col span="6">
            <Button
              type="dashed"
              @click="handleSelectAll(true)"
              style="margin-right: 5px;"
            >全选</Button>
            <Button
              type="dashed"
              @click="handleSelectAll(false)"
            >取消全选</Button>
          </i-col>
          <i-col
            span="16"
            offset="2"
            v-if="users.meta !== undefined"
          >
            <Page
              :total="users.meta.total"
              @on-change="pageOnChange"
              @on-page-size-change="onPageSizeChange"
              show-sizer
            />
          </i-col>

        </Row>
      </i-col>
    </Row>

  </div>
</template>
<script>

export default {
  props: ['users'],
  data () {
    return {
      selectedRows: [],
      dataSet: null,
      page: 1,
      pageSize: 10,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              attrs: {
                // lineHeight: '20px'
              }
            }, [

              h('img', {
                style: {
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  marginTop: '5px'
                },
                attrs: {
                  src: params.row.avatar
                }
              }),

              h('p', {
                style: {
                  fontSize: '16px'
                }
              }, params.row.name)
            ])
          }
        },
        {
          title: 'bio',
          key: 'bio'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '手机号',
          key: 'mobile'
        },
        {
          title: '创建时间',
          key: 'created_at'
        },

        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      // this.edit(params.row.id)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.delete({
                        id: params.row.id,
                        index: params.index
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ]
    }
  },

  created () {
    this.dataSet = this.users
  },

  methods: {
    addUser () {
      this.$router.push({ name: 'author_create_edit' })
    },

    onPageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.$emit('page-size-change', pageSize)
    },

    pageOnChange (page) {
      this.page = page
      this.$emit('page-change', page)
    },

    onSelectionChange (s) {
      this.selectedRows = s
    },

    delete ({ id, index }) {
      let name = this.users.data[index].name

      this.$Modal.confirm({
        title: `删除 ${name}`,
        content: '确认要删除这个用户吗？',
        loading: true,
        onOk: () => {
          console.log(id, index)
          this.$emit('delete-user', { id, index })
        }
      })
    },

    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
