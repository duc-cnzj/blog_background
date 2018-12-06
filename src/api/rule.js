import axios from '@/libs/api.request'

export const index = () => {
  return axios.request({
    method: 'get',
    url: '/admin/article_regulars'
  })
}

export const store = ({ express, replace, status }) => {
  return axios.request({
    method: 'post',
    url: '/admin/article_regulars',
    data: {
      rule: { express, replace },
      status
    }
  })
}

export const destroy = (id) => {
  return axios.request({
    method: 'delete',
    url: `/admin/article_regulars/${id}`
  })
}

export const test = (body) => {
  return axios.request({
    method: 'post',
    url: '/admin/article_regulars/test',
    data: {
      body
    }
  })
}

export const changeStatus = (id) => {
  return axios.request({
    method: 'post',
    url: '/admin/article_regulars/change_status',
    data: {
      id
    }
  })
}
