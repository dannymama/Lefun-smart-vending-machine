import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/news/' + query.limit + '/' + (query.page - 1) * 10,
    method: 'get'
  })
}

export function fetchArticle(id) {
  return request({
    url: '/news/content/' + id,
    method: 'get'
  })
}

export function updateArticle(updateObj) {
  return request({
    url: '/news',
    method: 'put',
    data: updateObj
  })
}

export function createArticle(data) {
  return request({
    url: '/news',
    method: 'post',
    data
  })
}

export function deleteArticle(id) {
  return request({
    url: '/news',
    method: 'delete',
    data: { id: id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

