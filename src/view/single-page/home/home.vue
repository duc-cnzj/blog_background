<template>
  <div>
    <Row :gutter="20">
      <i-col span="6" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 20px;">
      <i-col span="8">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
        </Card>
      </i-col>
      <i-col span="16">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </Card>
      </i-col>
    </Row>
    <Row style="margin-top: 20px;">
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
import { index } from '@/api/dashboard'

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: {
        articleCount: { title: '文章总数', icon: 'ios-list-box-outline', count: 0, color: '#2d8cf0' },
        cacheRate: { title: '文章缓存率%', icon: 'md-locate', count: 0, color: '#19be6b' },
        commentCount: { title: '总评论数', icon: 'md-help-circle', count: 0, color: '#ff9900' },
        authorCount: { title: '总作者数', icon: 'md-person-add', count: 0, color: '#ed3f14' }
      },
      pieData: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  },
  created () {
    index().then(({ data }) => {
      this.inforCardData.articleCount.count = data.article_count
      this.inforCardData.cacheRate.count = data.cache_rate
      this.inforCardData.commentCount.count = data.comment_count
      this.inforCardData.authorCount.count = data.author_count
    })
  },
  mounted () {
    //
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
