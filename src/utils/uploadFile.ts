import axios from 'axios'

export const uploadToCloudinary = async (file: File): Promise<string> => {
  // API ngoài: upload icon danh mục trực tiếp lên Cloudinary bằng unsigned upload preset.
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET)

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
    formData,
  )

  return response.data.secure_url
}
