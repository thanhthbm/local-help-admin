import { Outlet, createRootRoute, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'
import { useAuth } from '#/hooks/useAuth'
import { TanStackRouterDevtools } from 'node_modules/@tanstack/react-router-devtools/dist/esm/TanStackRouterDevtools'
import Footer from '#/components/Footer'
import Sidebar from '#/components/Sidebar'

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem('token')

    if (!token && location.pathname !== '/login') {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: RootComponent,
})

function RootComponent() {
  const { user, isLoading } = useAuth()
  const isLoginPage = location.pathname === '/login'

  if (isLoading)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Loading...
      </div>
    )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1. Sidebar nằm ở đây (bên trái) */}
      {!isLoginPage && user && <Sidebar />}

      {/* 2. Phần nội dung chính (bên phải) */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className={`flex-1 ${!isLoginPage ? 'p-6' : ''}`}>
          {/* Outlet là nơi nội dung của các file như index.tsx, categories.tsx sẽ hiện ra */}
          <Outlet />
        </main>
      </div>

      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
