import axios from '@/utils/interceptor'

export function me () {
  return axios({
    url: '/user/me',
    method: 'get'
  })
}

export function updateUsername (username) {
  return axios({
    url: '/user/username',
    method: 'put',
    data: {
      user_name: username
    }
  })
}

export function updateVerifyCode (recoverObj) {
  return axios({
    url: '/user/verifycode',
    method: 'put',
    data: recoverObj
  })
}

export function checkRecoverCode (recoverCode) {
  return axios({
    url: '/user/recover?recover_code=' + recoverCode,
    method: 'get'
  })
}

export function updateUserPayment (prime) {
  return axios({
    url: '/user/payment',
    method: 'put',
    data: {
      prime: prime
    }
  })
}

export function updateUserInvoiceDevice (mobileDevice) {
  return axios({
    url: '/user/invoice/device',
    method: 'put',
    data: {
      mobile_device: mobileDevice
    }
  })
}

export function updateUserInvoiceDoate () {
  return axios({
    url: '/user/invoice/donate',
    method: 'put'
  })
}

export function updateUserInvoiceEmail (email) {
  return axios({
    url: '/user/invoice/email',
    method: 'put',
    data: {
      email: email
    }
  })
}

export function registerBySMS (registerObj) {
  return axios({
    url: '/user/sms',
    method: 'post',
    data: registerObj
  })
}

export function registerByFacebook (registerObj) {
  return axios({
    url: '/user/facebook',
    method: 'post',
    data: registerObj
  })
}

export function registerByGoogle (registerObj) {
  return axios({
    url: '/user/google',
    method: 'post',
    data: registerObj
  })
}
