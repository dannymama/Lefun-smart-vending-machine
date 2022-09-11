import {
  getperchaseLogs
} from '@/apis/LefunTrans'

const perchases = {
  state: {
    perchaseData: {
      _perchaseList: [],
      _isFinished: false
    }

  },
  mutations: {
    SET_DATAS: (state, perchaseList) => {
      state.perchaseData._perchaseList = perchaseList
    },
    SET_IS_FINISHED: (state, isFinished) => {
      state.perchaseData._isFinished = isFinished
    }
  },

  actions: {
    // 获取用户信息
    RefreshPerchaseLogs ({
      commit
    }) {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await getperchaseLogs(10, 0)
          commit('SET_DATAS', res.resultData.perchaselogs)
          commit('SET_IS_FINISHED', false)
          if (this.state.perchases.perchaseData._perchaseList.length >= res.resultData.number) {
            commit('SET_IS_FINISHED', true)
          }
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    },
    GetMorePerchaseLogs ({
      commit
    }) {
      return new Promise(async (resolve, reject) => {
        try {
          if (this.state.perchases.perchaseData._isFinished) {
            return
          }
          let res = await getperchaseLogs(10, this.state.perchases.perchaseData._perchaseList.length)
          commit('SET_DATAS', this.state.perchases.perchaseData._perchaseList.concat(res.resultData.perchaselogs))

          if (this.state.perchases.perchaseData._perchaseList.length >= res.resultData.number) {
            commit('SET_IS_FINISHED', true)
          }
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    }
  }
}

export default perchases
