import axios from 'axios'
import { Dialog, Toast } from 'mand-mobile'
import { getToken } from '@/utils/auth'
import router from '@/router'

import store from '@/store'

const service = axios.create({
  // baseURL: 'https://m.lefunbox.net:8080/api', // api 的 base_url
  baseURL: 'http://172.20.10.7:8080/api', // api 的 base_url

  timeout: 10000 // 请求超时时间
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
  Dialog.failed({
    title: title,
    content: content,
    confirmText: '確定',
    onConfirm: onConfirm ? onConfirm() : () => {}
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
      tip('帳號已在其他地方登入', '未授權，請重新登入', to('LoginBySMSPage'))
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
    let requestData = getRequestIdentify(config, true)
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
    let requestData = getRequestIdentify(response.config)
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
      Toast.hide()
      Dialog.closeAll()
      errorHandle(response.status, response.data.message)
    }
    return Promise.reject(response)
  }
)

export default service
