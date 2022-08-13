import { me } from '@/apis/User'

import { doLogOut } from '@/apis/LoginInfo'
import { getToken, setToken, removeToken } from '@/utils/auth'

import { Toast } from 'mand-mobile'

const user = {
  state: {
    token: getToken(),
    userInfo: null,
    isLogin: !!getToken()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      state.isLogin = true
    },
    SET_USER: (state, userObj) => {
      state.userInfo = userObj
    },
    CLEAR_USER: state => {
      state.userInfo = null
    }
  },

  actions: {
    // 登录
    Login ({ commit }, token) {
      return new Promise((resolve, reject) => {
        setToken(token)
        commit('SET_TOKEN', token)
        resolve()
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await me()
          commit('SET_USER', res.resultData.userInfo)
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    },

    // 前端 登出
    LogOut ({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await doLogOut()
          if (res.resultCode === 1) {
            Toast.succeed('登出成功')
          }
          commit('SET_TOKEN', '')
          commit('CLEAR_USER')
          removeToken()
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    },

    LogFrontendOut ({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('SET_TOKEN', '')
          commit('CLEAR_USER')
          removeToken()
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    }
  }
}

export default user
