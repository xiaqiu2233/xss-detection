import axios from 'axios'
import { Message } from 'iview'

// axios配置
const service = axios.create({
  timeout: 5000
})

// axios interceptors 拦截器
service.interceptors.request.use(
  response => {
    return response
  },
  err => {
    Message.error({
      content: err.message,
      duration: 1000,
      closable: true
    })
    return Promise.reject(err)
  }
)
service.interceptors.response.use(
  response => {
    handlerResponse(response.data)
    return response.data
  },
  err => {
    Message.error({
      content: err.message,
      duration: 1000,
      closable: true
    })
    return Promise.reject(err)
  }
)

const handlerResponse = function (response) {
  let flag = false
  switch (response.code) {
    case 200:
      Message.success({
        content: '请求成功',
        duration: 1000,
        closable: true
      })
      flag = true
      break
    case 400:
      Message.error({
        content: response.error,
        duration: 1000,
        closable: true
      })
      flag = false
      break
    default:
      break
  }
  return flag
}

export default service
