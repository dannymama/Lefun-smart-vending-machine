import axios from '@/utils/interceptor'

export function createTransaction (verifyCode) {
  return axios({
    url: '/lefunTrans',
    method: 'post',
    data: { verifyCode: verifyCode }
  })
}

export function checkTransaction (lefunTransID) {
  return axios({
    url: '/lefunTrans?lefun_transaction_id=' + lefunTransID,
    method: 'get'
  })
}

export function getperchase (lefunTransID) {
  return axios({
    url: '/perchase/' + lefunTransID,
    method: 'get'
  })
}

export function getperchaseLogs (limit, offset) {
  return axios({
    url: '/perchase/' + limit + '/' + offset,
    method: 'get'
  })
}

export function getInvoiceDetail (lefunTransID) {
  return axios({
    url: '/lefunTrans/invoice_detail/' + lefunTransID,
    method: 'get'
  })
}
