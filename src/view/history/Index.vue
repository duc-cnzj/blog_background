<template>
  <div>
    <Row>
      <Card style="margin-top: 20px">
        <p slot="title">访问历史</p>
        <Collapse accordion>
          <Panel name="1">
            过滤器
            <div slot="content">
              <Row>
                <Form ref="query" :model="query" :label-width="120">
                  <Col span="12">
                    <Form-item label="日期范围">
                      <Date-picker
                        v-model='query.date'
                        type="daterange"
                        placement="right-start"
                        placeholder="选择日期"
                        style="width: 200px"
                        @on-change="dateChange"
                      ></Date-picker>
                    </Form-item>

                    <Form-item label="请求方法">
                      <Select v-model="query.method" placeholder="请选择" :clearable="true">
                        <Option value="GET">GET</Option>
                        <Option value="POST">POST</Option>
                        <Option value="PUT">PUT</Option>
                        <Option value="PATCH">PATCH</Option>
                        <Option value="DELETE">DELETE</Option>
                      </Select>
                    </Form-item>
                    <Form-item label="ip">
                      <Input v-model="query.ip" placeholder="请输入查询的 ip"></Input>
                    </Form-item>
                    <Form-item label="url">
                      <Input v-model="query.url" placeholder="请输入查询的 url"></Input>
                    </Form-item>
                    <Form-item label="status_code">
                      <Input v-model="query.status_code" placeholder="请输入查询的 status_code"></Input>
                    </Form-item>
                  </Col>
                  <Col span="12">
                    <Form-item label="address">
                      <Input v-model="query.address" placeholder="请输入查询的 address"></Input>
                    </Form-item>

                    <Form-item label="user_id">
                      <Input v-model="query.user_id" placeholder="请输入查询的 user_id"></Input>
                    </Form-item>
                    <Form-item label="过滤有用户的请求">
                      <Select v-model="query.user_type" placeholder="请选择" :clearable="true">
                        <Option value="admin">后台用户请求</Option>
                        <Option value="frontend">博客前端用户请求</Option>
                      </Select>
                    </Form-item>
                    <Form-item label="过滤请求">
                      <Select v-model="query.only_see" placeholder="请选择" :clearable="true">
                        <Option value="admin">后台请求</Option>
                        <Option value="frontend">博客前端请求</Option>
                      </Select>
                    </Form-item>
                    <Form-item>
                      <Button type="primary" @click="handleSubmit">搜索</Button>
                      <Button type="dashed" @click="handleReset" style="margin-left: 8px">重置</Button>
                    </Form-item>
                  </Col>
                </Form>
              </Row>
            </div>
          </Panel>
        </Collapse>
        <Table border :data="dataSet" :columns="columns" style="margin-top:20px"></Table>
        <Modal v-model="showModal" width="900" :expand-depth=50 title="response">
          <json-viewer :value="response" copyable boxed sort></json-viewer>
        </Modal>
        <Page
          v-if="Object.keys(data).length"
          :total="data.meta.total"
          style="margin-top:20px"
          @on-change="onChange"
          @on-page-size-change="onPageSizeChange"
          show-sizer
        ></Page>
      </Card>
    </Row>
  </div>
</template>

<script>
import { index, show } from '@/api/history'

export default {
  data () {
    return {
      data: {},
      dataSet: [],
      response: '',
      showModal: false,
      columns: [
        {
          title: 'id',
          key: 'id',
          fixed: 'left',
          width: 60
        },
        {
          title: 'ip',
          key: 'ip',
          width: 140
        },
        {
          title: 'method',
          key: 'method',
          width: 120
        },
        {
          title: 'url',
          key: 'url',
          width: 300
        },
        {
          title: '访问时间',
          key: 'visited_at',
          width: 200
        },
        {
          title: '状态码',
          key: 'status_code',
          width: 100
        },
        {
          title: '地址',
          key: 'address',
          width: 120
        },
        {
          title: '访客名称',
          key: 'username',
          width: 120,
          render: (h, params) => {
            return h('div', {}, params.row.user.name)
          }
        },
        {
          title: 'user-agent',
          key: 'user_agent',
          width: 400
        },
        {
          title: '内容',
          key: 'content',
          width: 300
        },
        {
          title: '查看响应',
          key: 'action',
          fixed: 'right',
          width: 120,
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'dashed'
              },
              attrs: {
                shape: 'circle',
                icon: 'ios-eye-outline'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.previewResponse(params.row.id)
                }
              }
            })
          }
        }
      ],
      query: {
        date: [],
        ip: null,
        method: null,
        status_code: null,
        address: null,
        url: null,
        response: null,
        visit_time_after: null,
        visit_time_before: null,
        user_id: null,
        user_type: null,
        only_see: null,
        page: 1,
        page_size: 10
      }
    }
  },

  created () {
    this.fetch()
  },

  methods: {
    async fetch () {
      const data = await index(this.query)
      this.data = data
      this.dataSet = data.data
    },

    onPageSizeChange (size) {
      this.query.page_size = size
      this.fetch()
    },

    onChange (page) {
      this.query.page = page
      this.fetch()
    },

    dateChange (payload) {
      this.query.visit_time_after = payload[0]
      this.query.visit_time_before = payload[1]
    },

    async previewResponse (id) {
      const showData = await show(id)
      this.response = JSON.parse(showData.data.response)
      this.showModal = true
    },

    handleSubmit () {
      this.fetch()
    },

    handleReset () {
      this.query = {
        ip: null,
        method: null,
        status_code: null,
        address: null,
        url: null,
        response: null,
        visit_time_after: null,
        visit_time_before: null,
        user_id: null,
        user_type: null,
        only_see: null,
        page: 1,
        page_size: 10
      }
    }
  }
}
</script>
