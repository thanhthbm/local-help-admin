import { CategoriesApi } from '#/apis/categoriesApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export const useCategory = () => {
  const queryClient = useQueryClient()

  const categoryQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoriesApi.getAllCategories(),
    staleTime: 1000 * 60 * 5,
  })

  const createCategoryMutation = useMutation({
    mutationFn: (newCategory: CategoryRequest) =>
      CategoriesApi.createCategory(newCategory),
    onSuccess: () => {
      // Invalidate và refetch query khi tạo category thành công
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Tạo danh mục thành công!')
    },
    onError: () => {
      toast.error('Tạo danh mục thất bại. Vui lòng thử lại.')
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => CategoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Xóa danh mục thành công!')
    },
    onError: () => {
      toast.error('Xóa danh mục thất bại. Vui lòng thử lại.')
    },
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryRequest }) =>
      CategoriesApi.updateCategory(id, data),
    onSuccess: () => {
      // Làm mới danh sách để hiển thị dữ liệu mới nhất
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Cập nhật danh mục thành công!')
    },
    onError: (error: any) => {
      console.error('Update failed:', error)
      toast.error('Cập nhật thất bại. Vui lòng kiểm tra lại!')
    },
  })

  return {
    categories: categoryQuery.data,
    isLoading: categoryQuery.isLoading,
    isError: categoryQuery.isError,
    createCategory: createCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    deleteCategory: deleteCategoryMutation.mutate,
    isDeleting: deleteCategoryMutation.isPending,
    updateCategory: updateCategoryMutation.mutate,
    isUpdating: updateCategoryMutation.isPending,
  }
}
