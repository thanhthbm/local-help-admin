import type { LoginResponse, UserResponse } from '#/types/auth'
import axiosClient from '#/utils/axiosClient'
import axios from 'axios'

export const authApi = {
  login: (credentials: any): Promise<LoginResponse> =>
    axiosClient.post('/auth/login', credentials),

  getMe: (): Promise<UserResponse> => axiosClient.get('/auth/me'),
}
