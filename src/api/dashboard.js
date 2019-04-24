import axios from '@/libs/api.request'

export const index = () => {
  return axios.request({
    url: '/admin/dashboard'
  })
}

export const historyData = (obj) => {
  // console.log(obj)
  return axios.request({
    url: '/admin/history_data',
    params: obj
  })
}
