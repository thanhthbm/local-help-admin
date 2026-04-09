import { usersApi, type AdminUserItem } from '#/apis/usersApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

function UsersPage() {
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  const {
    data: usersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin-users-list', currentPage, pageSize],
    queryFn: () => usersApi.getAdminUsers({ current: currentPage, pageSize }),
    staleTime: 60_000,
  })

  const users = usersData?.items ?? []
  const meta = usersData?.meta
  const totalPages = Math.max(meta?.pages ?? 1, 1)

  const paginationItems = useMemo<(number | string)[]>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const items: Array<number | string> = [1]
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    if (start > 2) {
      items.push('...')
    }

    for (let page = start; page <= end; page += 1) {
      items.push(page)
    }

    if (end < totalPages - 1) {
      items.push('...')
    }

    items.push(totalPages)
    return items
  }, [currentPage, totalPages])

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'ACTIVE' | 'LOCKED' }) =>
      usersApi.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] })
    },
  })

  const handleToggleLock = (user: AdminUserItem) => {
    const nextStatus = user.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED'
    updateStatusMutation.mutate({ id: user.id, status: nextStatus })
  }

  const formatDate = (value?: string) => {
    if (!value) {
      return 'N/A'
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return 'N/A'
    }

    return date.toLocaleDateString('vi-VN')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quan ly nguoi dung</h1>
        <span className="text-sm text-gray-500">
          Tong nguoi dung: {(meta?.total ?? users.length).toLocaleString('vi-VN')}
        </span>
      </div>

      <div className="island-shell rounded-2xl overflow-hidden bg-white border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Ho ten</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Vai tro</th>
              <th className="px-6 py-4">Trang thai</th>
              <th className="px-6 py-4">Ngay tao</th>
              <th className="px-6 py-4 text-right">Thao tac</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-sm text-gray-500">
                  Dang tai danh sach nguoi dung...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-sm text-red-600">
                  Khong tai duoc danh sach nguoi dung.
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-sm text-gray-500">
                  Chua co nguoi dung nao.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-700">#{user.id}</td>
                  <td className="px-6 py-4 text-gray-700">{user.fullName || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600">{user.role || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600">{user.status || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggleLock(user)}
                      disabled={updateStatusMutation.isPending}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        user.status === 'LOCKED'
                          ? 'text-green-700 bg-green-50 hover:bg-green-100'
                          : 'text-red-700 bg-red-50 hover:bg-red-100'
                      } disabled:opacity-50`}
                    >
                      {user.status === 'LOCKED' ? 'Mo khoa' : 'Khoa'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage <= 1 || isLoading}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50"
          >
            Trang truoc
          </button>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {paginationItems.map((item, index) =>
              typeof item === 'number' ? (
                <button
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  disabled={isLoading}
                  className={`min-w-9 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    item === currentPage
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  {item}
                </button>
              ) : (
                <span key={`ellipsis-${index}`} className="px-1 text-sm text-gray-400">
                  {item}
                </span>
              ),
            )}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
            disabled={isLoading || currentPage >= totalPages}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  )
}