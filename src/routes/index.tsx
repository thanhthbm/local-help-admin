import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { usersApi } from '#/apis/usersApi'
import { jobsApi } from '#/apis/jobsApi'

export const Route = createFileRoute('/')({ component: Dashboard })

function Dashboard() {
  const {
    data: userCount,
    isLoading: isUserCountLoading,
    isError: isUserCountError,
  } = useQuery({
    queryKey: ['dashboard-user-count'],
    queryFn: usersApi.getCountUsers,
    staleTime: 60_000,
  })

  const userCountDisplay = isUserCountLoading
    ? '...'
    : isUserCountError
      ? 'Loi'
      : (userCount ?? 0).toLocaleString('vi-VN')

  const {
    data: completedJobsCount,
    isLoading: isCompletedJobsLoading,
    isError: isCompletedJobsError,
  } = useQuery({
    queryKey: ['dashboard-completed-jobs-count'],
    queryFn: jobsApi.getCompletedJobsCount,
    staleTime: 60_000,
  })

  const completedJobsDisplay = isCompletedJobsLoading
    ? '...'
    : isCompletedJobsError
      ? 'Loi'
      : (completedJobsCount ?? 0).toLocaleString('vi-VN')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="island-shell p-6 rounded-2xl">
          <p className="island-kicker">Người dùng</p>
          <h2 className="text-3xl font-bold mt-2 text-[var(--sea-ink)]">
            {userCountDisplay}
          </h2>
        </div>
        <div className="island-shell p-6 rounded-2xl">
          <p className="island-kicker">Công việc hoàn thành</p>
          <h2 className="text-3xl font-bold mt-2 text-[var(--sea-ink)]">
            {completedJobsDisplay}
          </h2>
        </div>
        <div className="island-shell p-6 rounded-2xl">
          <p className="island-kicker">Doanh thu tháng</p>
          <h2 className="text-3xl font-bold mt-2 text-[var(--sea-ink)]">
            ₫15M
          </h2>
        </div>
      </div>
    </div>
  )
}
