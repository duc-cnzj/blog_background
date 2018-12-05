import axios from '@/libs/api.request'

export const index = ({ page, pageSize }) => {
  return axios.request({
    method: 'get',
    url: '/admin/comments',
    params: {
      page: page,
      page_size: pageSize
    }
  })
}
export const store = ({ body, articleId, commentId }) => {
  console.log('leave comment')

  return axios.request({
    method: 'post',
    url: `/admin/articles/${articleId}/comments`,
    data: {
      content: body,
      comment_id: commentId
    }
  })
}
export const show = id => {
  console.log('show comment')

  return axios.request({
    method: 'get',
    url: `/admin/comments/${id}`
  })
}
