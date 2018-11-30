import { login, logout, getUserInfo, updateInfo } from '@/api/user'
import { setToken, getToken } from '@/libs/util'

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
    setToken (state, token) {
      state.token = token
      setToken(token)
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
    handleLogin ({ commit }, { userName, password }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        })
          .then(res => {
            const data = res.data
            // console.log(data)

            commit('setToken', `${data.token_type} ${data.access_token}`)
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
            commit('setBio', data.data.bio)
            commit('setEmail', data.data.email)
            commit('setUserName', data.data.name)
            resolve()
          })
          .catch(e => reject(e))
      })
    },

    setAvatar ({ commit }, avatar) {
      return new Promise((resolve, reject) => {
        updateInfo(avatar)
          .then(({ data }) => {
            console.log('res.data')
            console.log(data)
            console.log(data.data.avatar)

            commit('setAvator', data.data.avatar)
            resolve(data.data.avatar)
          })
          .catch(e => reject(e))
      })
    },

    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token)
            .then(res => {
              const data = res.data.data

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
