import axios from '@/utils/interceptor';

export function verifyTrans (id, useCoupom, checksum, deviceid, devicename) {
  return axios({
    url: '/lefunTrans/verify',
    method: 'post',
    data: {
      lefun_transaction_id: id,
      usePoint: useCoupom,
      checksum: checksum,
      device_id: deviceid,
      device_name: devicename
    }
  })
}

export function perchaseResult (
  title,
  devicename,
  productlist,
  transactionID,
  checksum,
  verifytoken
) {
  return axios({
    url: '/perchase',
    method: 'post',
    data: {
      device_id: title,
      device_name: devicename,
      product_list: productlist,
      lefun_transaction_id: transactionID,
      checksum: checksum,
      verify_token: verifytoken
    }
  })
}

export function qrcode () {
  return axios({
    url: '/lefuntrans/qrcode',
    method: 'get'
  })
}
