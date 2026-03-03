import { authApi } from '#/apis/authApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { use } from 'react'
import { auth } from '#/config/firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import type { LoginForm } from '#/validations/authSchema'
import { Navigate, useNavigate } from '@tanstack/react-router'

export const useAuth = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: authApi.getMe,
    enabled: !!localStorage.getItem('token'),
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      // Bước 1: Login Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      )
      const idToken = await userCredential.user.getIdToken()

      // Bước 2: Tạm thời lưu token để axios client có thể đính kèm vào header
      // Nếu axiosClient lấy token trực tiếp từ localStorage, ta cần set nó ở đây
      localStorage.setItem('token', idToken)

      try {
        // Bước 3: Gọi Backend Sync
        const userResponse = await authApi.login()
        return userResponse
      } catch (error) {
        // Nếu Backend lỗi, xóa token ngay để tránh "lách" qua được route guard
        localStorage.removeItem('token')
        throw error
      }
    },

    onSuccess: (userResponse) => {
      console.log('Sync with backend success:', userResponse)
      queryClient.setQueryData(['auth-user'], userResponse)
      navigate({ to: '/' })
    },

    onError: (error) => {
      console.error('Login/Sync failed:', error)
      localStorage.removeItem('token')
      alert('Đăng nhập thất bại: Không thể đồng bộ với hệ thống backend.')
    },
  })

  const logout = () => {
    localStorage.removeItem('token')
    queryClient.setQueryData(['auth-user'], null)
    queryClient.invalidateQueries({ queryKey: ['auth-user'] })
    window.location.href = '/login'
  }

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout,
  }
}
