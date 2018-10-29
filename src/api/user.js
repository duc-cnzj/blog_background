import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    mobile: userName,
    password
  }
  return axios.request({
    url: 'auth/login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'auth/me',
    method: 'post'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'auth/logout',
    method: 'post'
  })
}
