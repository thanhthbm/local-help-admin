import axiosClient from '#/utils/axiosClient'

export const CategoriesApi = {
  getAllCategories: () =>
    axiosClient
      .get<CategoryResponse[]>('/api/categories')
      .then((res) => res.data),

  getCategoryById: (id: number) =>
    axiosClient
      .get<CategoryResponse>(`/api/categories/${id}`)
      .then((res) => res.data),

  createCategory: (category: CategoryRequest) =>
    axiosClient
      .post<CategoryResponse>('/api/categories', category)
      .then((res) => res.data),

  updateCategory: (id: number, category: CategoryRequest) =>
    axiosClient
      .put<CategoryResponse>(`/api/categories/${id}`, category)
      .then((res) => res.data),

  deleteCategory: (id: number) => axiosClient.delete(`/api/categories/${id}`),
}
