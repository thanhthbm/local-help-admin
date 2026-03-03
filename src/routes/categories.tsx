import { useCategory } from '#/hooks/useCategory'
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from '@tanstack/react-router'
import { Edit2, Loader2, Trash2 } from 'lucide-react'
export const Route = createFileRoute('/categories')({
  component: CategoriesPage,
})

function CategoriesPage() {
  const location = useLocation()
  const { categories, isLoading, deleteCategory } = useCategory()

  const isRootCategories = location.pathname === '/categories'

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      deleteCategory(id)
    }
  }

  return (
    <div className="space-y-6">
      {isRootCategories ? (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Quản lý Danh mục
            </h1>
            <Link
              to="/categories/create"
              className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-100"
            >
              + Thêm danh mục
            </Link>
          </div>

          <div className="island-shell rounded-2xl overflow-hidden bg-white border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase text-gray-400">
                <tr>
                  <th className="px-6 py-4">Icon</th>
                  <th className="px-6 py-4">Tên danh mục</th>
                  <th className="px-6 py-4">Màu sắc</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center">
                      <Loader2 className="animate-spin inline-block text-orange-500" />
                    </td>
                  </tr>
                ) : (
                  categories?.map((cat: CategoryResponse) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={cat.iconUrl}
                          alt={cat.name}
                          className="w-8 h-8 object-contain"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {cat.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: cat.colorCode }}
                          />
                          <span className="text-sm font-mono">
                            {cat.colorCode}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  )
}
