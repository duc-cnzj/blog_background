import axios from '@/libs/api.request'

export const urlIndex = () => {
  return axios.request({
    url: 'admin/url_white_lists'
  })
}

export const urlStore = (item) => {
  return axios.request({
    url: `admin/url_white_lists`,
    method: 'POST',
    data: {
      items: [item]
    }
  })
}

export const urlDestroy = (item) => {
  return axios.request({
    url: `admin/url_white_lists`,
    method: 'DELETE',
    data: {
      item
    }
  })
}

export const ipIndex = () => {
  return axios.request({
    url: 'admin/ip_white_lists'
  })
}

export const ipStore = (item) => {
  return axios.request({
    url: `admin/ip_white_lists`,
    method: 'POST',
    data: {
      item: item
    }
  })
}

export const ipDestroy = (item) => {
  return axios.request({
    url: `admin/ip_white_lists`,
    method: 'DELETE',
    data: {
      item
    }
  })
}
