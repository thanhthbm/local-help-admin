import { useCategory } from '#/hooks/useCategory'
import { uploadToCloudinary } from '#/utils/uploadFile'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/categories/create')({
  component: CreateCategoryPage,
})

function CreateCategoryPage() {
  const navigate = useNavigate()
  const { createCategory, isCreating } = useCategory()
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    console.log('Form data:', {
      name: formData.get('name'),
      colorCode: formData.get('colorCode'),
      description: formData.get('description'),
      file,
    })

    try {
      let iconUrl = ''
      if (file) {
        // Upload lên Cloudinary trước
        iconUrl = await uploadToCloudinary(file)
      }

      createCategory(
        {
          name: formData.get('name') as string,
          colorCode: formData.get('colorCode') as string,
          description: formData.get('description') as string,
          iconUrl: iconUrl,
        },
        {
          onSuccess: () => navigate({ to: '/categories' }), // Thành công thì về danh sách
        },
      )
    } catch (error) {
      console.error('Lỗi upload', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate({ to: '/categories' })}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Thêm danh mục mới</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6"
      >
        {/* Input Tên */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Tên danh mục
          </label>
          <input
            name="name"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="Ví dụ: Điện nước, Sửa máy tính..."
          />
        </div>

        {/* Chọn màu */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Màu đặc trưng
          </label>
          <input
            type="color"
            name="colorCode"
            defaultValue="#f97316"
            className="h-12 w-24 rounded-lg cursor-pointer"
          />
        </div>

        {/* Upload Icon SVG */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Icon (SVG)
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-orange-500 transition-colors">
            <input
              type="file"
              accept=".svg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="icon-upload"
            />
            <label
              htmlFor="icon-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="text-gray-400" />
              <span className="text-sm text-gray-500">
                {file ? file.name : 'Nhấn để chọn file SVG'}
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 disabled:opacity-50"
        >
          <Save size={20} />
          {isCreating ? 'Đang xử lý...' : 'Lưu danh mục'}
        </button>
      </form>
    </div>
  )
}
