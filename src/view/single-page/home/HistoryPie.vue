<template>
  <div>
    <ve-pie :data="chartData" :judge-width="true" :settings="chartSettings"></ve-pie>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      data: null,
      chartSettings: {
        metrics: ['count'],
        dimension: ['time']
      }
    }
  },

  computed: {
    ...mapState('history', {
      columns: 'columns',
      chartData: state => {
        return {
          columns: ['count', 'times', 'data'],
          rows: state.data.detail
        }
      }
    })
  }
}
</script>
