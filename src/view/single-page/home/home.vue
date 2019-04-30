<template>
  <div>
    <Row :gutter="20">
      <i-col
        span="6"
        v-for="(infor, i) in inforCardData"
        :key="`infor-${i}`"
        style="height: 120px;"
      >
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>

    <Row style="margin-top: 30px">
      <Col>
        <Card>
          <div class="chart-select">
            <RadioGroup v-model="query.unit" @on-change='queryChange'>
              <Radio label="week">按周统计</Radio>
              <Radio label="day">按天统计</Radio>
            </RadioGroup>

            <Select v-show="query.unit == 'week'" v-model="query.sub_week" style="width:200px" @on-change="queryChange">
                <Option value="0">本周</Option>
                <Option value="1">上一周</Option>
                <Option value="2">上上周</Option>
                <Option value="3">上三周</Option>
            </Select>

            <Select v-show="query.unit == 'day'" v-model="query.section" style="width:200px" @on-change="queryChange">
                <Option value="3">分3个区间</Option>
                <Option value="4">分4个区间</Option>
                <Option value="6">分6个区间</Option>
                <Option value="8">分8个区间</Option>
                <Option value="12">分12个区间</Option>
            </Select>
          </div>
          <history-line/>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col style="padding-top: 30px" span="10">
        <Card>
          <history-pie/>
        </Card>
      </Col>
      <Col style="padding-top: 30px" span="12" offset="1">
        <Card>
          <Table border :columns="tableColumns" :data="chartData"></Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import HistoryLine from './HistoryLine.vue'
import HistoryPie from './HistoryPie.vue'
import { index } from '@/api/dashboard'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    HistoryLine,
    HistoryPie
  },
  data () {
    return {
      query: {
        unit: 'day',
        sub_week: '1',
        section: '12'
      },
      tableColumns: [
        {
          title: 'ip',
          key: 'ip',
          width: 130
        },
        {
          title: '地址',
          key: 'address',
          width: 120
        },
        {
          title: '数量',
          key: 'count'
        },
        {
          title: 'url',
          key: 'url',
          width: 200
        }
      ],
      inforCardData: {
        articleCount: { title: '文章总数', icon: 'ios-list-box-outline', count: 0, color: '#2d8cf0' },
        cacheRate: { title: '文章缓存率%', icon: 'md-locate', count: 0, color: '#19be6b' },
        commentCount: { title: '总评论数', icon: 'md-help-circle', count: 0, color: '#ff9900' },
        authorCount: { title: '总作者数', icon: 'md-person-add', count: 0, color: '#ed3f14' }
      }
    }
  },

  computed: {
    ...mapState('history', {
      chartData: state => state.data.total_visits
    })
  },

  created () {
    this.getHistoryData(this.query)
    index().then(({ data }) => {
      this.inforCardData.articleCount.count = data.article_count
      this.inforCardData.cacheRate.count = data.cache_rate
      this.inforCardData.commentCount.count = data.comment_count
      this.inforCardData.authorCount.count = data.author_count
    })
  },
  methods: {
    queryChange () {
      this.getHistoryData(this.query)
    },

    ...mapActions('history', {
      getHistoryData: 'getHistoryData'
    })
  }
}
</script>

<style lang="less">
.chart-select {
  // Button {
  //   margin-left: 6px;
  // }
}
.count-style {
  font-size: 50px;
}
</style>
