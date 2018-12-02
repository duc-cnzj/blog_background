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
  let { name, bio, email, avatar = null } = payload
  let formData = new FormData()
  if (avatar !== null) {
    console.log(avatar)

    formData.append('avatar', avatar, 'avatar.jpg')
  } else {
    formData.append('name', name)
    formData.append('bio', bio)
    formData.append('email', email)
  }
  console.log('storeUser')

  return axios.request({
    url: '/admin/update_info',
    method: 'post',
    data: formData
  })
}

export function storeUser (payload) {
  let { name, bio, email, mobile, password, avatar } = payload
  let formData = new FormData()
  if (avatar !== null) {
    formData.append('avatar', avatar, 'avatar.jpg')
  }
  formData.append('name', name)
  formData.append('bio', bio)
  formData.append('mobile', mobile)
  formData.append('email', email)
  formData.append('password', password)
  console.log('storeUser')

  return axios.request({
    url: '/admin/users',
    method: 'post',
    data: formData
  })
}
