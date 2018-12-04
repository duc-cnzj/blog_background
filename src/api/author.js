import axios from '@/libs/api.request'

export const index = ({ page, pageSize, query = '' }) => {
  console.log('da')
  console.log(pageSize)

  return axios.request({
    method: 'get',
    url: '/admin/users',
    params: {
      page: page,
      page_size: pageSize,
      query: query
    }
  })
}

export const show = (id) => {
  return axios.request({
    method: 'get',
    url: `/admin/users/${id}`
  })
}

export const update = ({ id, bio, name, email, avatar }) => {
  return axios.request({
    method: 'put',
    url: `/admin/users/${id}`,
    data: {
      id, bio, name, email, avatar
    }
  })
}

export const destory = (id) => {
  return axios.request({
    method: 'delete',
    url: `/admin/users/${id}`
  })
}
