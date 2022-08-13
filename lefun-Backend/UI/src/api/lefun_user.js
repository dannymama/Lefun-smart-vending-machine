import request from '@/utils/request'

export function getUserInfoByPhoneNum(phoneNum) {
  return request({
    url: '/lefun_user/' + phoneNum,
    method: 'get'
  })
}

export function getRegisterInPeriod(startTime, endTime) {
  return request({
    url:
      '/lefun_user/registers/' + startTime + '/' + endTime,
    method: 'get'
  })
}

export function getBehaviorLog(phoneNum, query, startTime, endTime) {
  return request({
    url:
      '/lefun_user/behavior_log/' +
      phoneNum +
      '/' +
      query.limit +
      '/' +
      (query.page - 1) * query.limit + '/' + startTime + '/' + endTime,
    method: 'get'
  })
}

export function getPerchaseLog(phoneNum, query, startTime, endTime) {
  return request({
    url:
      '/lefun_user/perchase_log/' +
      phoneNum +
      '/' +
      query.limit +
      '/' +
      (query.page - 1) * query.limit + '/' + startTime + '/' + endTime,
    method: 'get'
  })
}

export function getTransactionInvoiceData(lefun_transaction_id) {
  return request({
    url:
      '/lefuntrans/invoice_detail?lefun_transaction_id=' + lefun_transaction_id,
    method: 'get'
  })
}
