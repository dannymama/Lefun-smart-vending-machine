import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

const pending = {}
const CancelToken = axios.CancelToken
const removePending = (key, isRequest = false) => {
  if (pending[key] && isRequest) {
    pending[key]('取消重複請求')
  }
  delete pending[key]
}
const getRequestIdentify = (config, isReuest = false) => {
  let url = config.url
  if (isReuest) {
    url = config.baseURL + config.url.substring(1, config.url.length)
  }
  return config.method === 'get'
    ? encodeURIComponent(url + JSON.stringify(config.params))
    : encodeURIComponent(config.url + JSON.stringify(config.data))
}

const tip = (title, content, onConfirm) => {
  Message({
    message: content,
    type: 'error',
    duration: 5 * 1000
  })
}

const to = name => {
  router.replace({
    name: name
  })
}

const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    case 401:
      store.dispatch('LogFrontendOut')
      tip('帳號已在其他地方登入', '未授權，請重新登入', to('Login'))
      break
    case 404:
      tip('404', '請求錯誤，未找到資源')
      break
    case 500:
      tip('500', '系統錯誤，請聯繫客服')
      break
    default:
      console.log(other)
  }
}

// request拦截器
service.interceptors.request.use(
  async config => {
    const requestData = getRequestIdentify(config, true)
    removePending(requestData, true)
    config.cancelToken = new CancelToken(c => {
      pending[requestData] = c
    })
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  async response => {
    // 把已经完成的请求从 pending 中移除
    const requestData = getRequestIdentify(response.config)
    removePending(requestData)
    if (response.headers['token']) {
      await store.dispatch('Login', response.headers['token'])
    }
    return response.data
  },
  err => {
    const { response } = err
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message)
    }
    return Promise.reject(err)
  }
)

export default service
