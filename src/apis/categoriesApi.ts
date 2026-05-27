import axiosClient from '#/utils/axiosClient'

export const CategoriesApi = {
  /**
   * Lấy toàn bộ danh mục công việc từ backend để hiển thị ở trang quản trị.
   */
  getAllCategories: () =>
    axiosClient
      .get<CategoryResponse[]>('/api/categories')
      .then((res) => res.data),

  /**
   * Lấy chi tiết một danh mục theo id.
   */
  getCategoryById: (id: number) =>
    axiosClient
      .get<CategoryResponse>(`/api/categories/${id}`)
      .then((res) => res.data),

  /**
   * Tạo danh mục mới.
   *
   * iconUrl thường được tạo trước bằng uploadToCloudinary rồi truyền vào request này.
   */
  createCategory: (category: CategoryRequest) =>
    axiosClient
      .post<CategoryResponse>('/api/categories', category)
      .then((res) => res.data),

  /**
   * Cập nhật danh mục đã tồn tại.
   */
  updateCategory: (id: number, category: CategoryRequest) =>
    axiosClient
      .put<CategoryResponse>(`/api/categories/${id}`, category)
      .then((res) => res.data),

  /**
   * Xóa danh mục theo id.
   */
  deleteCategory: (id: number) => axiosClient.delete(`/api/categories/${id}`),
}
