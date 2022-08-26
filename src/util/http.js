import axios from 'axios'
import {store} from '../redux/store'

axios.defaults.baseURL = 'http://localhost:3001'
// axios.defaults.headers.common['Authorization'] = ''

axios.interceptors.request.use(config => {
  // 显示loading
  store.dispatch({
    type: 'change_loading',
    payload: true
  })
  return config
}, error => {
  // 关闭loading
  store.dispatch({
    type: 'change_loading',
    payload: false
  })
  return Promise.reject(error);
})

axios.interceptors.response.use(response => {
  // 关闭loading
  store.dispatch({
    type: 'change_loading',
    payload: false
  })
  return response;
}, error => {
  // 关闭loading
  store.dispatch({
    type: 'change_loading',
    payload: false
  })
  return Promise.reject(error);
})