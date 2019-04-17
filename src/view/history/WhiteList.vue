<template>
  <div>
    <Row>
      <Col span="11">
        <Card>
          <p slot="title">url白名单</p>
          <Form :label-width="100" inline>
            <Form-item label="添加url地址">
              <Input v-model="item" placeholder="请输入url地址"></Input>
            </Form-item>
            <Form-item>
              <Button type="primary" @click="submit">提交</Button>
            </Form-item>
          </Form>
          <Table :columns="columns" :data="data" style="margin-top:20px"></Table>
        </Card>
      </Col>
      <Col span="11" offset="1">
        <Card>
          <p slot="title">ip白名单</p>
          <Form :label-width="100" inline>
            <Form-item label="添加ip地址">
              <Input v-model="ipItem" placeholder="请输入ip地址"></Input>
            </Form-item>
            <Form-item>
              <Button type="primary" @click="ipSubmit">提交</Button>
            </Form-item>
          </Form>
          <Table :columns="ipColumns" :data="ip" style="margin-top:20px"></Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { urlIndex, urlStore, urlDestroy, ipIndex, ipStore, ipDestroy } from '@/api/whitelist.js'
export default {
  data () {
    return {
      data: [],
      ip: [],
      item: '',
      ipItem: '',
      columns: [
        {
          title: '地址',
          key: 'key'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'error'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.delete(params.row.key, params.index)
                }
              }
            }, '删除')
          }
        }
      ],
      ipColumns: [
        {
          title: '地址',
          key: 'key'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'error'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.deleteIp(params.row.key, params.index)
                }
              }
            }, '删除')
          }
        }
      ]
    }
  },
  created () {
    this.fetchUrl()
    this.fetchIp()
  },
  methods: {
    async fetchUrl () {
      const data = await urlIndex()
      Object.values(data.data).forEach((element, index) => {
        this.data.push({ key: element })
      })
    },
    submit () {
      urlStore(this.item).then(() => {
        this.data.push({ key: this.item })
        this.item = ''
        this.$Message.success('添加成功!')
      })
    },
    delete (key, index) {
      console.log(key, index)
      urlDestroy(key).then(() => {
        this.data.splice(index, 1)
        this.$Message.success('删除成功!')
      })
    },

    async fetchIp () {
      const data = await ipIndex()
      Object.values(data.data).forEach((element, index) => {
        this.ip.push({ key: element })
      })
    },
    ipSubmit () {
      ipStore(this.ipItem).then(() => {
        this.ip.push({ key: this.ipItem })
        this.ipItem = ''
        this.$Message.success('添加成功!')
      })
    },
    deleteIp (key, index) {
      console.log(key, index)
      ipDestroy(key).then(() => {
        this.ip.splice(index, 1)
        this.$Message.success('删除成功!')
      })
    }
  }
}
</script>
