import { historyData } from '@/api/dashboard'
import { SET_HISTORY_COLUMNS, SET_HISTORY_DATA } from '../mutation-types'

export default {
  namespaced: true,
  state: {
    data: [],
    columns: []
  },
  mutations: {
    [SET_HISTORY_DATA] (state, data) {
      state.data = data
    },

    [SET_HISTORY_COLUMNS] (state, columns) {
      state.columns = columns
    }

  },
  actions: {
    // 获取用户相关信息
    getHistoryData ({ commit }, obj) {
      return new Promise((resolve, reject) => {
        try {
          historyData(obj)
            .then(({ data }) => {
              console.log('data', data)
              commit(SET_HISTORY_COLUMNS, data.times)
              commit(SET_HISTORY_DATA, data)

              resolve(data)
            })
            .catch(err => {
              reject(err)
            })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
