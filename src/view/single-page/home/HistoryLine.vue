<template>
  <div>
    <ve-line :data="chartData" :judge-width="true" :settings="chartSettings"></ve-line>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      data: null,
      chartSettings: {
        labelMap: {
          'time': '访问时间',
          'count': '访问数量'
        },
        showLine: ['count'],
        metrics: ['count'],
        dimension: ['time'],
        legendName: {
          'time': '访问时间',
          'count': '访问数量'
        }
      }
    }
  },

  computed: {
    ...mapState('history', {
      chartData: state => {
        return {
          columns: ['time', 'count'],
          rows: state.data.detail
        }
      },
      columns: 'columns'
    })
  }
}
</script>
