import axios from '@/libs/api.request'

export const index = () => {
  return axios.request({
    url: 'admin/white_lists'
  })
}

export const store = (item) => {
  return axios.request({
    url: `admin/white_lists`,
    method: 'POST',
    data: {
      items: [item]
    }
  })
}

export const destroy = (item) => {
  return axios.request({
    url: `admin/white_lists`,
    method: 'DELETE',
    data: {
      item
    }
  })
}
