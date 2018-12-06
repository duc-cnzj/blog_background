<template>
  <div>
    <Card :bordered="false">
      <p slot="title">根据相应规则转换</p>
      <Row>
        <Col :span="12">
        <Form :label-width="30">
          <FormItem>
            <Input
              type="textarea"
              v-model="form.text"
              :autosize="{minRows: 12}"
              placeholder="Enter something..."
            ></Input>
          </FormItem>

          <FormItem>
            <Button
              type="primary"
              @click="handleSubmit"
            >测试</Button>
          </FormItem>
        </Form>
        </Col>
        <Col :span="12">
        <Form :label-width="30">
          <FormItem>
            <Input
              disabled
              class="duc-text"
              :value="body"
              type="textarea"
              :autosize="{minRows: 12}"
            ></Input>
          </FormItem>
        </Form>
        </Col>
      </Row>

      <Row>

        <Col>
        <Form
          :label-width="80"
          inline
        >
          <FormItem label="规则">
            <Input
              v-model="post.express"
              :autosize="{minRows: 2,maxRows: 5}"
            ></Input>
          </FormItem>
          <FormItem label="替换为">
            <Input
              v-model="post.replace"
              :autosize="{minRows: 2,maxRows: 5}"
            ></Input>
          </FormItem>
          <FormItem label="Switch">
            <i-switch
              v-model="post.status"
              size="large"
            >
              <span slot="open">On</span>
              <span slot="close">Off</span>
            </i-switch>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              @click="store"
            >添加</Button>
          </FormItem>
        </Form>
        </Col>
        <Col>
        <Table
          v-if="rules!==null"
          :columns="columns"
          :data="rules.data"
        ></Table>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { test, index, store, changeStatus, destroy } from '@/api/rule'

export default {
  data () {
    return {
      columns: [
        {
          title: 'id',
          key: 'id'
        },
        {
          title: '规则',
          key: 'express',
          render: (h, p) => {
            return h('div', {}, p.row.rule.express)
          }
        },
        {
          title: '替换为',
          key: 'replace',
          render: (h, p) => {
            return h('div', {}, p.row.rule.replace)
          }
        },
        {
          title: '状态',
          key: 'status',
          render: (h, p) => {
            console.log(p.row.status)

            return h('i-switch', {
              attrs: {
                value: p.row.status,
                size: 'large'
              },
              on: {
                'on-change': () => {
                  this.changeStatus(p.row.id, p.index)
                }
              }
            })
          }
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
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delete(params.row.id)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      post: {
        express: '',
        replace: '',
        status: true
      },
      form: {
        text: null
      },
      body: '',
      rule: {
        body: null,
        status: true
      },
      rules: null
    }
  },

  created () {
    this.fetch()
  },

  methods: {
    changeStatus (id, index) {
      console.log(id, index)
      changeStatus(id).then(res => {
        this.$Message.success('状态更新成功')
        this.fetch()
      })
    },

    fetch () {
      index().then(res => {
        this.rules = res
      })
    },

    store () {
      store(this.post).then(res => {
        this.rules.data.push(res.data)
        this.$Message.success('添加成功')
        this.post.express = ''
        this.post.replace = ''
      })
    },

    delete (id) {
      this.$Modal.confirm({
        title: `删除`,
        content: '确认要删除该规则吗？',
        loading: true,
        onOk: () => {
          destroy(id).then(() => {
            this.$Message.success('删除成功')
            this.$Modal.remove()
            this.fetch()
          })
        }
      })
    },

    handleSubmit () {
      test(this.form.text).then(res => {
        console.log(res.data)
        this.body = res.data.body
      })
    }
  }
}
</script>

<style lang="scss">
.duc-text {
  textarea {
    color: black !important;
    background-color: #bfa !important;
  }
}
</style>
