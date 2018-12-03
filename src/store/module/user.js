import { login, logout, getUserInfo, updateInfo, refresh } from '@/api/user'
import {
  setToken,
  getToken,
  setRemember,
  setRefreshToken,
  getRefreshToken
} from '@/libs/util'

export default {
  state: {
    name: '',
    userId: '',
    bio: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    email: '',
    hasGetInfo: false
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setBio (state, bio) {
      state.bio = bio
    },
    setUserName (state, name) {
      state.name = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, { token, expiresIn }) {
      state.token = token
      setToken(token, expiresIn / (60 * 60 * 24))
    },
    setEmail (state, email) {
      state.email = email
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password, remember }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        })
          .then(({ data }) => {
            let {
              token_type: tokenType,
              access_token: accessToken,
              expires_in: expiresIn,
              refresh_ttl: refreshTtl
            } = data
            let token = tokenType + accessToken

            commit('setToken', { token, expiresIn })
            setRemember(remember)
            if (remember) {
              setRefreshToken(token, refreshTtl / (60 * 60 * 24))
            }

            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('setToken', '')
            setToken('')
            setRemember(false)
            setRefreshToken('')
            commit('setAccess', [])
            resolve()
          })
          .catch(err => {
            reject(err)
          })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },

    UpdateInfo ({ commit }, payload) {
      let { name, bio, email } = payload
      console.log(payload)

      return new Promise((resolve, reject) => {
        updateInfo({
          name,
          bio,
          email
        })
          .then(({ data }) => {
            commit('setBio', data.bio)
            commit('setEmail', data.email)
            commit('setUserName', data.name)
            resolve()
          })
          .catch(e => reject(e))
      })
    },

    setAvatar ({ commit }, avatar) {
      return new Promise((resolve, reject) => {
        updateInfo({ avatar })
          .then(({ data }) => {
            console.log(data.avatar)

            commit('setAvator', data.avatar)
            resolve(data.avatar)
          })
          .catch(e => reject(e))
      })
    },

    refreshToken ({ commit }) {
      let token = getRefreshToken()

      return new Promise((resolve, reject) => {
        try {
          refresh(token)
            .then(({ data }) => {
              let {
                token_type: tokenType,
                access_token: accessToken,
                expires_in: expiresIn,
                refresh_ttl: refreshTtl
              } = data
              let token = tokenType + accessToken

              commit('setToken', { token, expiresIn })
              setRefreshToken(token, refreshTtl / (60 * 60 * 24))
              dispatch('getUserInfo')

              resolve(data)
            })
            .catch(err => {
              setToken('')
              setRefreshToken('')
              setRemember(false)
              reject(err)
            })
        } catch (error) {
          reject(error)
        }
      })
    },

    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo()
            .then(({ data }) => {
              commit('setAvator', data.avatar)
              commit('setUserName', data.name)
              commit('setBio', data.bio)
              commit('setUserId', data.id)
              commit('setEmail', data.email)
              commit('setAccess', data.access)
              commit('setHasGetInfo', true)
              resolve(data)
            })
            .catch(err => {
              reject(err)
            })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
