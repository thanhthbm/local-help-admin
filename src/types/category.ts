/**
 * Dữ liệu danh mục backend trả về cho trang admin.
 */
interface CategoryResponse {
  id: number
  name: string
  iconUrl: string
  colorCode: string
}

/**
 * Payload admin gửi lên backend khi tạo/cập nhật danh mục.
 */
interface CategoryRequest {
  name: string
  iconUrl: string
  description?: string
  colorCode: string
}
