import { authApi } from '#/apis/authApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useAuth = () => {
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: authApi.getMe,
    enabled: !!localStorage.getItem('token'),
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      console.log('Login successful:', data)
      localStorage.setItem('token', data.token)
      queryClient.setQueryData(['auth-user'], data.user)
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
