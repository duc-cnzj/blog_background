<template>
  <div>

    <Card>
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>
        文章
      </p>
      <a href="#" slot="extra" @click.prevent="createArticle">
        <!-- <Icon type="ios-loop-strong"></Icon> -->
        <Icon type="ios-add-circle-outline" />
        发布文章
      </a>

      <Row>
          <i-col :span="searchSpan" style="margin-bottom: 20px;" class="duc-col">
            <Input v-model="search" icon="ios-search-outline" @on-focus="searchSpan = 12" @on-blur="searchSpan = 6" @on-enter="searchArticle" placeholder="搜索文章 elasticsearch..." />
          </i-col>
      </Row>
      <Row :gutter="20">
        <i-col>
          <Table border ref="selection" :columns="columns" @on-selection-change="onSelectionChange" :data="dataSet.data"></Table>
        </i-col>

        <i-col>
          <Row :gutter="3" style="margin-top: 20px;">
            <i-col span="6">
              <Button type="dashed" @click="handleSelectAll(true)" style="margin-right: 5px;">全选</Button>
              <Button type="dashed" @click="handleSelectAll(false)">取消全选</Button>
            </i-col>
            <i-col span="16" offset="2" v-if="dataSet.meta !== undefined">
              <Page :total="dataSet.meta.total" @on-change="pageOnChange" @on-page-size-change="onPageSizeChange" show-sizer />
            </i-col>

          </Row>
        </i-col>
      </Row>

    </Card>

  </div>
</template>
<script>
import _ from 'lodash'
import { index, deleteArticle, elasticSearchArticle } from '@/api/article'

export default {
  data () {
    return {
      searchSpan: 6,
      selectedRows: [],
      search: '',
      dataSet: [],
      page: 1,
      pageSize: 10,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '标题',
          key: 'title',
          render: (h, params) => {
            return h('div', {
              domProps: {
                innerHTML: this.getHighlightRow(params, 'title')
              }
            })
          }
        },
        {
          title: '分类',
          key: 'category',
          render: (h, params) => {
            return h('div', {
              domProps: {
                innerHTML: this.getHighlightRow(params, 'category', true)
              }
            })
          }
        },
        {
          title: '标签',
          key: 'tags',
          render: (h, params) => {
            return h('span',
              {
                domProps: {
                  innerHTML: this.getHighlightRow(params, 'tags', true)
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
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.edit(params.row.id)
                  }
                }
              }, '编辑'),
              h('Button', {
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
              }, '删除')
            ])
          }
        }
      ]
    }
  },

  created () {
    this.fetchArticles()
  },

  methods: {
    getHighlightRow (params, rowName, array = false) {
      if (array) {
        return params.row.highlight !== undefined && params.row.highlight[rowName] !== null ? params.row.highlight[rowName] : _.map(params.row[rowName], 'name').join(',')
      }

      return params.row.highlight !== undefined && params.row.highlight[rowName] !== null ? params.row.highlight[rowName] : params.row[rowName]
    },

    delete ({ id, index }) {
      deleteArticle(id).then(res => {
        this.$Message.success('删除成功')
        this.dataSet.data = _.reject(this.dataSet.data, { id: id })
      })
    },

    edit (id) {
      this.$router.push({
        name: 'article_create_edit',
        params: {
          id: id
        }
      })
    },

    searchArticle () {
      if (!this.search) {
        this.fetchArticles()
      } else {
        this.elasticSearchArticle()
      }
    },

    async elasticSearchArticle () {
      const { data } = await elasticSearchArticle({ query: this.search })
      this.dataSet = data
    },

    createArticle () {
      this.$router.push({ name: 'article_create_edit' })
    },

    onPageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.fetchArticles()
    },

    pageOnChange (page) {
      this.page = page
      this.fetchArticles()
    },

    onSelectionChange (s) {
      this.selectedRows = s
    },

    async fetchArticles () {
      const { data } = await index({
        page: this.page,
        pageSize: this.pageSize,
        query: this.search
      })
      this.dataSet = data
    },

    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    }
  }
}
</script>

<style lang="scss" scoped>
.duc-col {
  transition: all 2s ease-out;
}
</style>
