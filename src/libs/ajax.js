import axios from 'axios'
import router from '../router'
import store from '../store/index'
import { Message } from 'iview'
import _ from 'lodash'
import { setToken, getToken, getRefreshToken, getRemember } from '@/libs/util'

async function doRequest (error) {
  const data = await store.dispatch('refreshToken')
  let { token_type: tokenType, access_token: accessToken } = data

  let token = tokenType + accessToken
  let config = error.response.config
  config.headers.Authorization = token

  const res = await axios.request(config)

  return res.data
}

function handle401 (error) {
  if (router.currentRoute.name !== 'login') {
    if (getRemember() && getRefreshToken()) {
      return doRequest(error)
    } else {
      Message.error('登陆过期请重新登陆！')
      setToken('')
      router.push({
        name: 'login'
      })
    }
  } else {
    return Promise.reject(error)
  }
}

// 创建实例时设置配置的默认值
var instance = axios.create({
  baseURL: process.env.VUE_APP_URL
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    if (!config.headers['Authorization']) {
      config.headers['Authorization'] = getToken() || ''
    }
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response.data
  },
  function (error) {
    if (error.response) {
      if (error.response.status === 401) {
        return handle401(error)
      } else if (error.response.status === 422) {
        let err = error.response.data.error.errors

        let m = _.map(err, 'message')
        m.map(i => {
          Message.error(i)
        })
      } else {
        // Message.error('da')
      }
    } else {
      if (error.message === 'Network Error') {
        Message.error('请检查网络是否通畅')

        return Promise.reject(error)
      }
    }

    // 对响应错误做点什么
    return Promise.reject(error.response)
  }
)

export default instance
