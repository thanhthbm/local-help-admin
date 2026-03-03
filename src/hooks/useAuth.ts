import { authApi } from '#/apis/authApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { use } from 'react'
import { auth } from '#/config/firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import type { LoginForm } from '#/validations/authSchema'
import { Navigate, useNavigate } from '@tanstack/react-router'
import { toast } from 'react-toastify'

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

        console.log('User info from backend:', userResponse)
        if (userResponse.role !== 'ADMIN') {
          throw new Error('Không có quyền truy cập')
        }

        return userResponse
      } catch (error) {
        localStorage.removeItem('token')
        throw error
      }
    },

    onSuccess: (userResponse) => {
      queryClient.setQueryData(['auth-user'], userResponse)
      navigate({ to: '/' })
    },

    onError: (error) => {
      localStorage.removeItem('token')
      toast.error(
        'Error: ' +
          (error instanceof Error ? error.message : 'Đăng nhập thất bại'),
      )
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
