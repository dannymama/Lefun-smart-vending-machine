import axios from '@/utils/interceptor'

export function sendSMS (phoneNum) {
  return axios({
    url: '/sms',
    method: 'post',
    data: {
      phone_number: phoneNum
    }
  })
}

export function verifySMS (smsToken, verifycode) {
  return axios({
    url: '/sms',
    method: 'put',
    data: {
      sms_token: smsToken,
      verify_code: verifycode
    }
  })
}
