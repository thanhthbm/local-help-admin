import { useAuth } from '#/hooks/useAuth'
import LoginPage from '#/pages/LoginPage'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  /**
   * Nếu đã có token thì không cho quay lại trang login.
   */
  beforeLoad: () => {
    if (localStorage.getItem('token')) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})
