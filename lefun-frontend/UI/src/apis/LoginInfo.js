import axios from '@/utils/interceptor'

export function doLoginBySMS (smsToken) {
  return axios({
    url: '/logininfo/sms',
    method: 'post',
    data: {
      sms_token: smsToken
    }
  })
}

export function doLoginByFacebook (fbAccesstoken) {
  return axios({
    url: '/logininfo/facebook',
    method: 'post',
    data: {
      fb_accesstoken: fbAccesstoken
    }
  })
}

export function doLoginByGoogle (googleAccesstoken) {
  return axios({
    url: '/logininfo/google',
    method: 'post',
    data: {
      google_accesstoken: googleAccesstoken
    }
  })
}

export function doLogOut () {
  return axios({
    url: '/logininfo',
    method: 'delete'
  })
}
