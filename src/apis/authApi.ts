import type { LoginResponse, UserResponse } from '#/types/auth'
import axiosClient from '#/utils/axiosClient'
import axios from 'axios'

export const authApi = {
  /**
   * Đồng bộ đăng nhập admin với backend sau khi Firebase login thành công.
   *
   * Token đã được lưu vào localStorage nên axiosClient sẽ tự gắn Authorization header.
   */
  login: (): Promise<UserResponse> =>
    axiosClient.post('api/auth/login').then((res) => res.data),

  /**
   * Lấy thông tin user hiện tại để khôi phục session khi reload trang admin.
   */
  getMe: (): Promise<UserResponse> =>
    axiosClient.get('api/users/me').then((res) => res.data),
}
