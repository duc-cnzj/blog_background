<template>
  <div>

    <Row :gutter="32">
      <i-col
        :span="12"
        style="margin-bottom: 20px;"
      >
        <Input
          v-model="search"
          icon="ios-search-outline"
          @on-enter="searchArticle"
          placeholder="搜索文章 elasticsearch..."
        />
      </i-col>
     <i-col :span="6">
        <Button
          type="dashed"
          @click="createArticle"
        >
          <Icon type="ios-add-circle-outline" />
          发布文章</Button>

      </i-col>

    </Row>
    <Row :gutter="20">
      <i-col>
        <Table
          border
          ref="selection"
          :columns="columns"
          @on-selection-change="onSelectionChange"
          :data="dataSet.data"
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
            v-if="dataSet.meta !== undefined"
          >
            <Page
              :total="dataSet.meta.total"
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
import _ from 'lodash'
import { index, deleteArticle, adminElasticSearchArticle } from '@/api/article'

export default {
  props: ['all'],
  data () {
    return {
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
                innerHTML: this.getHighlightRow(params, 'category')
              }
            })
          }
        },
        {
          title: '标签',
          key: 'tags',
          render: (h, params) => {
            return h('span', {
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
                      this.edit(params.row.id)
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
    this.fetchArticles()
  },

  methods: {
    getHighlightRow (params, rowName, array = false) {
      if (array) {
        return params.row.highlight !== undefined &&
          params.row.highlight[rowName] !== null
          ? params.row.highlight[rowName]
          : _.map(params.row[rowName], 'name').join(',')
      }

      return params.row.highlight !== undefined &&
        params.row.highlight[rowName] !== null
        ? params.row.highlight[rowName]
        : params.row[rowName] instanceof Object
          ? params.row[rowName].name
          : params.row[rowName]
    },

    delete ({ id, index }) {
      let title = this.dataSet.data[index].title

      this.$Modal.confirm({
        title: `删除${title}`,
        content: '确认要删除这篇文章吗？',
        loading: true,
        onOk: () => {
          deleteArticle(id).then(res => {
            this.$Modal.remove()
            this.$Message.success('删除成功')
            this.dataSet.data = _.reject(this.dataSet.data, { id: id })
          })
        }
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
      const data = await adminElasticSearchArticle({ query: this.search, all: this.all ? 1 : 0 })
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
      const data = await index({
        all: this.all ? 1 : 0,
        page: this.page,
        pageSize: this.pageSize,
        query: this.search
      })
      console.log(data)

      this.dataSet = data
    },

    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
