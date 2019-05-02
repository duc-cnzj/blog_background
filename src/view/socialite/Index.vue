<template>
  <div>
    <Row>
      <Col span="6">
        <Card>
          <Form ref="query" :model="query" :label-width="40">
            <Form-item label="id">
              <Input v-model.number="query.id" placeholder="请输入查询的 id"></Input>
            </Form-item>
            <Form-item label="昵称">
              <Input v-model="query.name" placeholder="请输入查询的昵称"></Input>
            </Form-item>

            <Form-item>
              <Button type="primary" @click="handleSubmit">搜索</Button>
              <Button type="dashed" @click="handleReset" style="margin-left: 8px">重置</Button>
            </Form-item>
          </Form>
        </Card>
      </Col>
      <Col span="16" offset="1">
        <Card>
          <p slot="title">第三方用户</p>

          <Table border :data="dataSet" :columns="columns" style="margin-top:20px"></Table>

          <Page
            v-if="Object.keys(data).length"
            :total="data.meta.total"
            :page-size="Number(data.meta.per_page)"
            style="margin-top:20px"
            @on-change="onChange"
            @on-page-size-change="onPageSizeChange"
            show-sizer
          ></Page>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { index } from '@/api/socialite_user'
export default {
  data () {
    return {
      query: {
        page: 1,
        page_size: 10,
        name: null,
        id: null
      },
      dataSet: [],
      columns: [
        {
          title: 'id',
          key: 'id',
          width: 80
        },
        {
          title: '姓名',
          key: 'name',
          width: 250,
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
          title: '登录类型',
          key: 'identity_type',
          width: 100
        },
        {
          title: '最后登录时间',
          key: 'last_login_at'
        },
        {
          title: '创建时间',
          key: 'created_at'
        }
      ],
      data: {}
    }
  },

  created () {
    this.fetch()
  },

  methods: {
    onPageSizeChange (size) {
      this.query.page_size = size
      this.fetch()
    },

    onChange (page) {
      this.query.page = page
      this.fetch()
    },

    async fetch () {
      const data = await index(this.query)
      console.log(data)
      this.dataSet = data.data
      this.data = data
    },

    handleSubmit () {
      this.fetch()
    },

    handleReset () {
      this.query.name = null
      this.query.id = null
      this.fetch()
    }
  }
}
</script>
