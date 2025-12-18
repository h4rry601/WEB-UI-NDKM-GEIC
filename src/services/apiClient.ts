import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor: Add token to header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Note: Direct redirection here might be abrupt, usually better handled by AuthContext
      // or an event bus, but this is a standard simple implementation.
      // window.location.href = '/login' // Uncomment if you want auto-redirect
    }
    return Promise.reject(error)
  }
)

export default apiClient
