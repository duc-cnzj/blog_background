import axios from '@/libs/api.request'
import Filter from '@/filters/Filter'
import { historyEnum, prefix } from '@/filters/history'

export const index = (params) => {
  let queryData = (new Filter(params, historyEnum, prefix)).filterParams()

  return axios.request({
    url: 'admin/histories',
    params: queryData
  })
}

export const show = (id) => {
  return axios.request({
    url: `admin/histories/${id}`
  })
}
