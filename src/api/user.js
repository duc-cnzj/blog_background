import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  console.log('login')

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

export const getUserInfo = token => {
  console.log('getUserInfo')

  return axios.request({
    url: 'auth/me',
    method: 'post'
  })
}

export const logout = token => {
  console.log('logout')

  return axios.request({
    url: 'auth/logout',
    method: 'post'
  })
}

export function updateInfo (payload) {
  console.log('updateInfo')

  return axios.request({
    url: '/admin/update_info',
    method: 'post',
    data: payload
  })
}
