import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 1000000,
  withCredentials: true
})

export default request
