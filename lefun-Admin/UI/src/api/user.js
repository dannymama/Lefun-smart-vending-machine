import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/backend_user/' + query.limit + '/' + (query.page - 1) * query.limit,
    method: 'get'
  })
}

export function create(account, password, type) {
  return request({
    url: '/backend_user',
    method: 'post',
    data: { account: account, password: password, type: type }
  })
}

export function deleteBackendUser(id) {
  return request({
    url: '/backend_user',
    method: 'delete',
    data: { id }
  })
}

export function updateBackendUser(obj) {
  return request({
    url: '/backend_user',
    method: 'put',
    data: obj
  })
}

export function login(data) {
  return request({
    url: '/backend_user/login',
    method: 'post',
    data
  })
}
