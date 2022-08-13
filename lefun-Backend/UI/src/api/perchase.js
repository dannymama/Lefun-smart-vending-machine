import request from '@/utils/request'

export function getToInvoiceData(startTime, endTime) {
  return request({
    url:
        '/perchase/to_invoice/?start_time=' + startTime + '&end_time=' + endTime,
    method: 'get'
  })
}
