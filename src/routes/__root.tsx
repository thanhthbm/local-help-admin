import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import '../styles.css'
import { useAuth } from '#/hooks/useAuth'
import { TanStackRouterDevtools } from 'node_modules/@tanstack/react-router-devtools/dist/esm/TanStackRouterDevtools'
import { Sidebar } from 'lucide-react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const {user, isLoading} = useAuth()
  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar chỉ hiện khi đã đăng nhập */}
      {user && <Sidebar />}

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
