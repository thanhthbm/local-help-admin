import axiosClient from '#/utils/axiosClient'

export const CategoriesApi = {
  getAllCategories: () =>
    axiosClient.get<CategoryResponse[]>('/api/categories'),

  getCategoryById: (id: number) =>
    axiosClient.get<CategoryResponse>(`/api/categories/${id}`),

  createCategory: (category: CategoryRequest) =>
    axiosClient.post<CategoryResponse>('/api/categories', category),

  updateCategory: (id: number, category: CategoryRequest) =>
    axiosClient.put<CategoryResponse>(`/api/categories/${id}`, category),
  
  deleteCategory: (id: number) => axiosClient.delete(`/api/categories/${id}`),
}
