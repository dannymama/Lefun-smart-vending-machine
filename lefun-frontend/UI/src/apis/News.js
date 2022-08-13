import axios from '@/utils/interceptor'

export function getNews (limit, offset) {
  return axios({
    url: '/news/' + limit + '/' + offset,
    method: 'get'
  })
}

export function getNewsContent (id) {
  return axios({
    url: '/news/content/' + id,
    method: 'get'
  })
}
