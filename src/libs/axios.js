import Vue from 'vue'

// axios
import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_URL;
// axios.defaults.baseURL = '/api'


axios.interceptors.request.use(function(config) {
  const AUTH_TOKEN = $cookies.get(process.env.VUE_APP_NAME + '_AUTH_TOKEN')
  // alert(AUTH_TOKEN)
  if (AUTH_TOKEN) {
      config.headers.common['Authorization'] = AUTH_TOKEN
  }
  // config.headers.common['Access-Control-Allow-Origin'] = '*'
  
  return config
}, function(error) {
  // Do something with request error
  return Promise.reject(error)
})

const axiosIns = axios.create({ 
  // headers: {
  //   'Content-Type': 'application/json',
  //   'Access-Control-Allow-Origin': '*', // Adjust this as needed
  // }
  // You can add your headers here
  // ================================
  // baseURL: 'https://some-domain.com/api/',
  // timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
})

Vue.prototype.$http = axiosIns

export default axiosIns
