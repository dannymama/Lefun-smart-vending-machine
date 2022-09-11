const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  isLogin: state => state.user.isLogin,
  newsData: state => state.news.newsData,
  perchaseData: state => state.perchases.perchaseData
}
export default getters
