import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use((config) => {
  // Gắn Firebase token đã lưu vào mọi request backend cần xác thực admin.
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
})

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Nếu token hết hạn hoặc không hợp lệ, xóa session local và điều hướng về login.
    const status = error.response?.status
    if (status === 401) {
      console.warn('Unauthorized, logging out...')
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default axiosClient
