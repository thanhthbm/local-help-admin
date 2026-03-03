import type { LoginResponse, UserResponse } from '#/types/auth'
import axiosClient from '#/utils/axiosClient'
import axios from 'axios'

export const authApi = {
  login: (): Promise<UserResponse> => axiosClient.post('api/auth/login'),

  getMe: (): Promise<UserResponse> => axiosClient.get('api/users/me'),
}
