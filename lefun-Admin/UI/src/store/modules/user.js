import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import * as jwt from 'jsonwebtoken'
const state = {
  token: getToken(),
  type: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_TYPE: (state, type) => {
    state.type = type
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // commit('SET_TOKEN', 'admin-token')
      // setToken('admin-token')
      // resolve()
      login({ account: username.trim(), password: password }).then(response => {
        const { resultCode, resultData, resultDes } = response
        if (resultCode === 1) {
          commit('SET_TOKEN', resultData.login_token)
          setToken(resultData.login_token)
          resolve()
        } else {
          reject(resultDes)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const type = jwt.decode(getToken()).type
      const calendarTypeOptions = [
        { key: 0, display_name: 'admin' },
        { key: 1, display_name: 'normal' }
      ]
      // arr to obj, such as { CN : "China", US : "USA" }
      const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.display_name
        return acc
      }, {})
      const types = []
      types.push(calendarTypeKeyValue[type])
      commit('SET_TYPE', types)
      resolve(types)
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log('logoutttt')
      commit('SET_TOKEN', '')
      commit('SET_TYPE', [])
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

