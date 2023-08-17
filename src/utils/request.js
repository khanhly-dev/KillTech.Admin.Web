/* eslint-disable no-unused-vars */
import axios from 'axios'
import { message } from 'ant-design-vue'

function errorResponseHandler(error) {
  // if has response show the error
  let _message = ''
  if (error.response) {
    if (error.response.data.message) {
      _message = error.response.data.message
    } else if (error.response.data.error) {
      _message = error.response.data.error
    }
    if (error.response.config.headers['ThrottleType']) {
      var throttleType = error.response.config.headers['ThrottleType'];

      throttledRequests[throttleType] = false;
    }
  }
  if (_message) message.error(_message)

  if (!_message && error.response && error.response.status === 401) {
    const msg = `Phiên đăng nhập hết hạn, mời bạn thoát ra đăng nhập lại.`
    message.error(msg, 10)
  }
  return Promise.reject(error)
}

var throttledRequests = {}

export default function getInstanceAxios(baseAPI) {
  // create an axios instance
  const service = axios.create({
    baseURL: baseAPI, // url = base url + request url
    timeout: 60000 // request timeout
  })

  // request interceptor
  service.interceptors.request.use(
    async config => {
      if (config.headers['ThrottleType']) {
        var throttleType = config.headers['ThrottleType'];

        if (throttledRequests[throttleType]) {
          return Promise.reject('Hệ thống đang xử lý, vui lòng không click nhiều lần!');
        }
        throttledRequests[throttleType] = true;
      }
      return config
    },
    error => {
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )

  // response interceptor
  service.interceptors.response.use(response => {
    if (response.config.headers['ThrottleType']) {
      var throttleType = response.config.headers['ThrottleType'];

      throttledRequests[throttleType] = false;
    }
    const res = response.data
    return res
  }, errorResponseHandler)

  return service
}
