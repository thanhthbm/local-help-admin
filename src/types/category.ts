interface CategoryResponse {
  id: number
  name: string
  iconUrl: string
  colorCode: string
}

interface CategoryRequest {
  name: string
  iconUrl: string
  description?: string
  colorCode: string
}
