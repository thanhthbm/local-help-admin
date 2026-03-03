import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/categories')({
  component: CategoriesPage,
})

function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h1>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-100">
          + Thêm danh mục
        </button>
      </div>

      {/* Nơi đây sẽ là Table hiển thị danh sách lấy từ Backend Java */}
      <div className="island-shell rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-[var(--line)] text-xs font-bold uppercase text-[var(--sea-ink-soft)]">
            <tr>
              <th className="px-6 py-4">Icon</th>
              <th className="px-6 py-4">Tên danh mục</th>
              <th className="px-6 py-4">Màu sắc</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {/* Dữ liệu từ TanStack Query sẽ map ở đây */}
          </tbody>
        </table>
      </div>
    </div>
  )
}
