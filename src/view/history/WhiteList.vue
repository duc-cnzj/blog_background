<template>
  <div>
    <Card>
      <p slot="title">白名单</p>
      <Form :label-width="60" inline>
        <Form-item label="添加地址">
          <Input v-model="item" placeholder="请输入地址"></Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="submit">提交</Button>
        </Form-item>
      </Form>
      <Table :columns="columns" :data="data" style="margin-top:20px"></Table>
    </Card>
  </div>
</template>

<script>
import { index, store, destroy } from '@/api/whitelist.js'
export default {
  data () {
    return {
      data: [],
      item: '',
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
      ]
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    async fetch () {
      const data = await index()
      Object.values(data.data).forEach((element, index) => {
        this.data.push({ key: element })
      })
    },
    submit () {
      store(this.item).then(() => {
        this.data.push({ key: this.item })
        this.item = ''
        this.$Message.success('添加成功!')
      })
    },
    delete (key, index) {
      console.log(key, index)
      destroy(key).then(() => {
        this.data.splice(index, 1)
        this.$Message.success('删除成功!')
      })
    }
  }
}
</script>
