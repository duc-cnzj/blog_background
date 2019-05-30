<template>
  <div>
    <Card :bordered="false">
      <p slot="title">添加文章</p>
      <Row>
        <Col span="20">
        <Form
          ref="formData"
          :model="formData"
          :rules="ruleValidate"
          label-position="right"
          :label-width="100"
        >
          <FormItem
            label="文章标题"
            prop="title"
          >
            <Input v-model="formData.title"></Input>
          </FormItem>

          <FormItem
            label="文章描述"
            prop="desc"
          >
            <Input v-model="formData.desc"></Input>
          </FormItem>

          <FormItem
            label="文章首页图"
            v-if="showUploadImage"
            prop="headImage"
          >
            <upload-image
              @remove-path="removePath"
              @add-path="addPath"
              :src="formData.headImage"
              v-model="formData.headImage"
            />
          </FormItem>

          <FormItem
            label="选择分类"
            prop="category"
          >
            <v-select
              key="category"
              placeholder="搜索🔍"
              @search="searchCategory"
              v-model="formData.category"
              :options="categories"
              taggable
            >
              <template slot="no-options">没有搜索到匹配的分类名称</template>
            </v-select>
          </FormItem>

          <FormItem
            label="选择标签"
            prop="tags"
          >
            <v-select
              key="tag"
              placeholder="请输入标签名称搜索🔍"
              @search="searchTag"
              multiple
              v-model="formData.tags"
              :options="tags"
              taggable
            >
              <template slot="no-options">没有搜索到匹配的标签名称</template>
            </v-select>
          </FormItem>

          <FormItem
            label="文章内容"
            v-if="showUploadImage"
          >
            <markdown
              :options="mdoptions"
              v-model="formData.content"
            />
          </FormItem>

          <FormItem label="显示或者隐藏">
            <i-switch
              size="large"
              v-model="formData.display"
            >
              <span slot="open">显示</span>
              <span slot="close">隐藏</span>
            </i-switch>
          </FormItem>

          <FormItem>
            <Button
              type="primary"
              @click="handleSubmit('formData')"
            >{{ edit ? '更新' : '提交' }}</Button>
            <Button
              @click="handleReset('formData')"
              style="margin-left: 8px"
            >重置</Button>
          </FormItem>
        </Form>
        </Col>

      </Row>
    </Card>
  </div>
</template>

<script>
import Markdown from '_c/markdown'
import _ from 'lodash'
import UploadImage from '@/components/upload/UploadImage'
import {
  store,
  categories as searchCategories,
  tags as searchTag,
  show as getArticleBy,
  update
} from '@/api/article'

export default {
  components: { UploadImage, Markdown },
  data () {
    return {
      edit: false,
      loading: false,
      fetehed: false,
      list: [],
      categories: [],
      tags: [],
      mdoptions: {
        renderingConfig: {
          codeSyntaxHighlighting: true
        }
      },
      formData: {
        display: true,
        category: null,
        content: '',
        title: '',
        desc: '',
        tags: [],
        headImage: ''
      },
      ruleValidate: {
        title: [{ required: true, message: '文章标题必填', trigger: 'blur' }],
        category: [
          { required: true, message: '文章分类必填', trigger: 'blur' }
        ],
        tags: [
          {
            required: true,
            type: 'array',
            message: '文章标签必选',
            trigger: 'blur'
          }
        ],
        headImage: [
          {
            required: true,
            type: 'string',
            message: '文章封面必有',
            trigger: 'blur'
          }
        ],
        desc: [
          { required: true, message: '输入文章的描述信息', trigger: 'blur' },
          {
            type: 'string',
            max: 50,
            message: '最多不能超过50个字！',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  computed: {
    showUploadImage () {
      if (!this.edit) {
        return true
      }

      if (this.fetehed) {
        return true
      }

      return false
    }
  },

  created () {
    let id = this.$route.params.id
    if (id) {
      this.edit = true
      this.fetchArticleBy(id)
    }
  },

  methods: {
    async fetchArticleBy (id) {
      const { data } = await getArticleBy({ id })
      console.log(data)

      this.fetehed = true
      this.formData.content = data.content_md
      this.formData.title = data.title
      this.formData.desc = data.desc
      this.formData.display = data.display
      this.formData.headImage = data.headImage
      this.formData.tags = _.map(data.tags, 'name')
      this.formData.category = data.category.name

      this.categories = [data.category.name]
      this.tags = _.map(data.tags, 'name')
    },

    searchTag (search, loading) {
      loading(true)
      this.search(loading, search, this)
    },

    search: _.debounce((loading, search, vm) => {
      searchTag({
        query: search
      }).then(({ data }) => {
        const tags = _.map(data, 'name')
        vm.tags = tags

        loading(false)
      })
    }, 350),

    searchCategory (search, loading) {
      loading(true)
      this.searchC(loading, search, this)
    },

    searchC: _.debounce((loading, search, vm) => {
      searchCategories({
        query: search
      }).then(({ data }) => {
        const categories = _.map(data, 'name')
        vm.categories = categories
        loading(false)
      })
    }, 350),

    onBlur (value) {
      this.formData.content = value
    },
    onChange (value) {
      this.formData.content = value
    },
    handleSubmit (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.edit) {
            Object.assign(this.formData, {
              id: this.$route.params.id
            })
            update(this.formData)
              .then(() => {
                localStorage.markdownContent = ''

                this.$router.push({ name: 'article_list' })
                this.$Message.success('文章更新成功!')
              })
          } else {
            store(this.formData)
              .then(() => {
                localStorage.markdownContent = ''
                this.$router.push({ name: 'article_list' })
                this.$Message.success('文章添加成功!')
              })
          }
        } else {
          this.$Message.error('请检查提交数据是否完整！')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      this.formData.content = ''
    },
    removePath () {
      this.formData.headImage = ''
    },

    addPath (data) {
      this.formData.headImage = data.path
    }
  }
}
</script>

<style lang="less" scoped>
@import "~simplemde/dist/simplemde.min.css";
</style>
