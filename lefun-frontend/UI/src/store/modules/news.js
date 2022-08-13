import {
  getNews
} from '@/apis/News'

const news = {
  state: {
    newsData: {
      _newsList: 0,
      _isFinished: false,
      scrollTop: 0
    }

  },
  mutations: {
    SET_NEWS: (state, newsList) => {
      state.newsData._newsList = newsList
    },
    SET_IS_Finished: (state, isFinished) => {
      state.newsData._isFinished = isFinished
    },
    SET_SCROLL_TOP: (state, scrolltop) => {
      state.newsData.scrollTop = scrolltop
    }
  },

  actions: {
    // 获取用户信息
    RefreshNews ({
      commit
    }) {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await getNews(10, 0)
          commit('SET_NEWS', res.resultData.news)
          commit('SET_IS_Finished', false)
          if (this.state.news.newsData._newsList.length >= res.resultData.count) {
            commit('SET_IS_FINISHED', true)
          }
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    },
    GetMoreNews ({
      commit
    }) {
      return new Promise(async (resolve, reject) => {
        try {
          if (this.state.news.newsData._isFinished) {
            return
          }
          let res = await getNews(10, this.state.news.newsData._newsList.length)
          commit('SET_NEWS', this.state.news.newsData._newsList.concat(res.resultData.news))

          if (this.state.news.newsData._newsList.length >= res.resultData.count) {
            commit('SET_IS_Finished', true)
          }
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    },
    SetScrollTop ({
      commit
    }, scrolltop) {
      commit('SET_SCROLL_TOP', scrolltop)
    }
  }
}

export default news
