import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Dashboard })

function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="island-shell p-6 rounded-2xl">
          <p className="island-kicker">Người dùng</p>
          <h2 className="text-3xl font-bold mt-2 text-[var(--sea-ink)]">
            1,234
          </h2>
        </div>
        <div className="island-shell p-6 rounded-2xl">
          <p className="island-kicker">Công việc mới</p>
          <h2 className="text-3xl font-bold mt-2 text-[var(--sea-ink)]">56</h2>
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
