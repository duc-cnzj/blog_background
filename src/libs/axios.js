import axios from 'axios'
import { getToken, setToken } from '@/libs/util'
import router from '../router'
import { Message } from 'iview'

// import { Spin } from 'iview'
class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        Authorization: getToken() || ''
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
        }
        this.queue[url] = true
        return config
      },
      error => {
        console.log(error)

        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        this.destroy(url)
        const { data, status } = res
        return { data, status }
      },
      error => {
        this.destroy(url)
        if (error.response) {
          if (error.response.status === 401) {
            if (router.currentRoute.name !== 'login') {
              if (getToken() !== '' || getToken() !== undefined) {
                Message.error('登陆过期请重新登陆！')
              }
              setToken('')
              router.push({
                name: 'login'
              })
            }
          }
        } else {
          if (error.message === 'Network Error') {
            Message.error('请检查网络是否通畅')
          }
        }

        return Promise.reject(error)
      }
    )
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
