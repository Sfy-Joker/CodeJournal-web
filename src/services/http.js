import axios from 'axios'

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://code-journal--safonyu.replit.app/api'
    : '/api')

const http = axios.create({ baseURL })

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default http
