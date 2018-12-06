import axios from '@/libs/api.request'

export const index = () => {
  return axios.request({
    url: '/admin/dashboard'
  })
}
